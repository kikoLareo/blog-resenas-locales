// Funciones para gestionar posts de blog en Sanity
import { adminSanityClient, adminSanityWriteClient } from './admin-sanity';
import { revalidateTag } from 'next/cache';
import { REVALIDATE_TAGS } from './sanity.client';

// Tipos para los posts de blog
export interface BlogPost {
  _id: string;
  _type: 'post';
  title: string;
  slug: { current: string };
  excerpt: string;
  heroImage?: {
    asset: {
      _id: string;
      url: string;
    };
    alt: string;
    caption?: string;
  };
  body: any[]; // Array de bloques de Portable Text
  categories: Array<{ _ref: string; _type: 'reference' }>;
  relatedVenues?: Array<{ _ref: string; _type: 'reference' }>;
  tags?: string[];
  hasFaq?: boolean;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  tldr?: string;
  author: string;
  authorAvatar?: {
    asset: {
      _id: string;
      url: string;
    };
  };
  readingTime?: number;
  featured?: boolean;
  publishedAt: string;
  updatedAt?: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface CreateBlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  heroImage?: string; // Asset ID
  heroImageAlt?: string;
  heroImageCaption?: string;
  body?: any[];
  categories: string[]; // Array de IDs de categorías
  relatedVenues?: string[]; // Array de IDs de venues
  tags?: string[];
  hasFaq?: boolean;
  faq?: Array<{ question: string; answer: string }>;
  tldr?: string;
  author?: string;
  authorAvatar?: string; // Asset ID
  readingTime?: number;
  featured?: boolean;
  publishedAt?: string;
}

// ===== FUNCIONES DE LECTURA =====

/**
 * Obtener todos los posts del blog
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      _type,
      title,
      slug,
      excerpt,
      heroImage {
        asset->{
          _id,
          url
        },
        alt,
        caption
      },
      body,
      categories[]->{
        _id,
        title,
        slug
      },
      relatedVenues[]->{
        _id,
        title,
        slug
      },
      tags,
      hasFaq,
      faq,
      tldr,
      author,
      authorAvatar {
        asset->{
          _id,
          url
        }
      },
      readingTime,
      featured,
      publishedAt,
      updatedAt,
      _createdAt,
      _updatedAt
    }`;
    
    const posts = await adminSanityClient.fetch(query);
    return posts || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Obtener un post específico por ID
 */
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const query = `*[_type == "post" && _id == $id][0] {
      _id,
      _type,
      title,
      slug,
      excerpt,
      heroImage {
        asset->{
          _id,
          url
        },
        alt,
        caption
      },
      body,
      categories[]->{
        _id,
        title,
        slug
      },
      relatedVenues[]->{
        _id,
        title,
        slug
      },
      tags,
      hasFaq,
      faq,
      tldr,
      author,
      authorAvatar {
        asset->{
          _id,
          url
        }
      },
      readingTime,
      featured,
      publishedAt,
      updatedAt,
      _createdAt,
      _updatedAt
    }`;
    
    const post = await adminSanityClient.fetch(query, { id });
    return post || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// ===== FUNCIONES DE ESCRITURA =====

/**
 * Crear un nuevo post de blog
 */
export async function createBlogPost(data: CreateBlogPostData): Promise<BlogPost | null> {
  try {
    const doc: any = {
      _type: 'post',
      title: data.title,
      slug: {
        _type: 'slug',
        current: data.slug
      },
      excerpt: data.excerpt,
      body: data.body || [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Escribe aquí el contenido del post...'
            }
          ]
        }
      ],
      categories: data.categories.map(id => ({
        _type: 'reference',
        _ref: id
      })),
      author: data.author || 'Blog de Reseñas Team',
      publishedAt: data.publishedAt || new Date().toISOString(),
      featured: data.featured || false,
    };

    // Campos opcionales
    if (data.heroImage) {
      doc.heroImage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: data.heroImage
        },
        alt: data.heroImageAlt || data.title,
        caption: data.heroImageCaption
      };
    }

    if (data.relatedVenues && data.relatedVenues.length > 0) {
      doc.relatedVenues = data.relatedVenues.map(id => ({
        _type: 'reference',
        _ref: id
      }));
    }

    if (data.tags && data.tags.length > 0) {
      doc.tags = data.tags;
    }

    if (data.hasFaq && data.faq && data.faq.length > 0) {
      doc.hasFaq = true;
      doc.faq = data.faq;
    }

    if (data.tldr) {
      doc.tldr = data.tldr;
    }

    if (data.authorAvatar) {
      doc.authorAvatar = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: data.authorAvatar
        }
      };
    }

    if (data.readingTime) {
      doc.readingTime = data.readingTime;
    }

    const result = await adminSanityWriteClient.create(doc);
    
    // Revalidar cache
    revalidateTag(REVALIDATE_TAGS.post);
    
    return result as unknown as BlogPost;
  } catch (error) {
    console.error('Error creating blog post:', error);
    return null;
  }
}

/**
 * Actualizar un post de blog existente
 */
export async function updateBlogPost(id: string, data: Partial<CreateBlogPostData>): Promise<BlogPost | null> {
  try {
    const updateDoc: any = {
      updatedAt: new Date().toISOString()
    };

    if (data.title) updateDoc.title = data.title;
    if (data.slug) {
      updateDoc.slug = {
        _type: 'slug',
        current: data.slug
      };
    }
    if (data.excerpt) updateDoc.excerpt = data.excerpt;
    if (data.body) updateDoc.body = data.body;
    if (data.author) updateDoc.author = data.author;
    if (data.publishedAt) updateDoc.publishedAt = data.publishedAt;
    if (data.featured !== undefined) updateDoc.featured = data.featured;

    if (data.categories && data.categories.length > 0) {
      updateDoc.categories = data.categories.map(id => ({
        _type: 'reference',
        _ref: id
      }));
    }

    if (data.heroImage) {
      updateDoc.heroImage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: data.heroImage
        },
        alt: data.heroImageAlt || '',
        caption: data.heroImageCaption
      };
    }

    if (data.relatedVenues !== undefined) {
      if (data.relatedVenues.length > 0) {
        updateDoc.relatedVenues = data.relatedVenues.map(id => ({
          _type: 'reference',
          _ref: id
        }));
      } else {
        updateDoc.relatedVenues = [];
      }
    }

    if (data.tags !== undefined) {
      updateDoc.tags = data.tags;
    }

    if (data.hasFaq !== undefined) {
      updateDoc.hasFaq = data.hasFaq;
      if (data.hasFaq && data.faq) {
        updateDoc.faq = data.faq;
      } else if (!data.hasFaq) {
        updateDoc.faq = [];
      }
    }

    if (data.tldr !== undefined) {
      updateDoc.tldr = data.tldr;
    }

    if (data.authorAvatar) {
      updateDoc.authorAvatar = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: data.authorAvatar
        }
      };
    }

    if (data.readingTime !== undefined) {
      updateDoc.readingTime = data.readingTime;
    }

    const result = await adminSanityWriteClient
      .patch(id)
      .set(updateDoc)
      .commit();
    
    // Revalidar cache
    revalidateTag(REVALIDATE_TAGS.post);
    
    return result as unknown as BlogPost;
  } catch (error) {
    console.error('Error updating blog post:', error);
    return null;
  }
}

/**
 * Eliminar un post de blog
 */
export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    await adminSanityWriteClient.delete(id);
    
    // Revalidar cache
    revalidateTag(REVALIDATE_TAGS.post);
    
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}

/**
 * Toggle del estado featured de un post
 */
export async function toggleFeaturedPost(id: string, featured: boolean): Promise<BlogPost | null> {
  try {
    const result = await adminSanityWriteClient
      .patch(id)
      .set({ 
        featured,
        updatedAt: new Date().toISOString()
      })
      .commit();
    
    // Revalidar cache
    revalidateTag(REVALIDATE_TAGS.post);
    
    return result as unknown as BlogPost;
  } catch (error) {
    console.error('Error toggling featured post:', error);
    return null;
  }
}

/**
 * Calcular tiempo de lectura basado en el contenido
 */
export function calculateReadingTime(body: any[]): number {
  if (!body || body.length === 0) return 1;
  
  // Extraer texto de los bloques
  let wordCount = 0;
  
  body.forEach((block: any) => {
    if (block._type === 'block' && block.children) {
      block.children.forEach((child: any) => {
        if (child.text) {
          wordCount += child.text.split(/\s+/).length;
        }
      });
    }
  });
  
  // Promedio de 200 palabras por minuto
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

