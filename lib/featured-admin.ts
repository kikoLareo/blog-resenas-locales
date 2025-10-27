import { adminSanityClient, adminSanityWriteClient } from './admin-sanity';
import { REVALIDATE_TAGS } from './sanity.client';
import { revalidateTag } from 'next/cache';

// Tipos para los featured items
interface FeaturedItem {
  _id: string;
  _type: 'featuredItem';
  title: string;
  type: 'review' | 'venue' | 'category' | 'collection' | 'guide';
  customTitle?: string;
  customDescription?: string;
  customCTA?: string;
  customUrl?: string;
  isActive: boolean;
  order: number;
  reviewRef?: {
    _id: string;
    title: string;
    venue?: {
      title: string;
      slug: { current: string };
    };
  };
  venueRef?: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  categoryRef?: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  collectionRef?: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  guideRef?: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    priority?: number;
  };
  _createdAt: string;
  _updatedAt: string;
}

interface CreateFeaturedItemData {
  title: string;
  type: 'review' | 'venue' | 'category' | 'collection' | 'guide';
  customTitle?: string;
  customDescription?: string;
  customCTA?: string;
  customUrl?: string;
  isActive: boolean;
  order: number;
  referenceId?: string; // ID del contenido referenciado
}

interface UpdateFeaturedItemData extends CreateFeaturedItemData {
  _id: string;
}

// ===== FUNCIONES DE LECTURA =====

export async function getAllFeaturedItems(): Promise<FeaturedItem[]> {
  try {
    const query = `*[_type == "featuredItem"] | order(order asc) {
      _id,
      _type,
      title,
      type,
      customTitle,
      customDescription,
      customCTA,
      customUrl,
      isActive,
      order,
      "reviewRef": reviewRef->{
        _id,
        title,
        slug,
        summary,
        tldr,
        tags,
        ratings,
        publishedAt,
        author,
        readTime,
        gallery[0] {
          asset->{ url },
          alt
        },
        "venue": venue->{
          title,
          slug,
          address,
          priceRange,
          cuisine,
          "city": city->{
            title,
            slug
          }
        }
      },
      "venueRef": venueRef->{
        _id,
        title,
        slug,
        description,
        address,
        priceRange,
        cuisine,
        images[0] {
          asset->{ url },
          alt
        },
        "city": city->{
          title,
          slug
        },
        categories[]->{
          title,
          slug
        },
        "reviewCount": count(*[_type == "review" && venue._ref == ^._id && published == true]),
        "averageRating": math::avg(*[_type == "review" && venue._ref == ^._id && published == true].ratings.overall)
      },
      "categoryRef": categoryRef->{
        _id,
        title,
        slug
      },
      "collectionRef": collectionRef->{
        _id,
        title,
        slug
      },
      "guideRef": guideRef->{
        _id,
        title,
        slug
      },
      seo,
      _createdAt,
      _updatedAt
    }`;
    
    const items = await adminSanityClient.fetch(query);
    return items || [];
  } catch (error) {
    return [];
  }
}

export async function getFeaturedItemById(id: string): Promise<FeaturedItem | null> {
  try {
    const query = `*[_type == "featuredItem" && _id == $id][0] {
      _id,
      _type,
      title,
      type,
      customTitle,
      customDescription,
      customCTA,
      customUrl,
      isActive,
      order,
      "reviewRef": reviewRef->{
        _id,
        title,
        "venue": venue->{
          title,
          slug
        }
      },
      "venueRef": venueRef->{
        _id,
        title,
        slug
      },
      "categoryRef": categoryRef->{
        _id,
        title,
        slug
      },
      "collectionRef": collectionRef->{
        _id,
        title,
        slug
      },
      "guideRef": guideRef->{
        _id,
        title,
        slug
      },
      seo,
      _createdAt,
      _updatedAt
    }`;
    
    const item = await adminSanityClient.fetch(query, { id });
    return item || null;
  } catch (error) {
    return null;
  }
}

export async function getActiveFeaturedItems(limit?: number): Promise<FeaturedItem[]> {
  try {
    const limitClause = limit ? `[0...${limit}]` : '';
    const query = `*[_type == "featuredItem" && isActive == true] | order(order asc)${limitClause} {
      _id,
      _type,
      title,
      type,
      customTitle,
      customDescription,
      customCTA,
      customUrl,
      isActive,
      order,
      "reviewRef": reviewRef->{
        _id,
        title,
        "venue": venue->{
          title,
          slug
        }
      },
      "venueRef": venueRef->{
        _id,
        title,
        slug
      },
      "categoryRef": categoryRef->{
        _id,
        title,
        slug
      },
      "collectionRef": collectionRef->{
        _id,
        title,
        slug
      },
      "guideRef": guideRef->{
        _id,
        title,
        slug
      },
      seo,
      _createdAt,
      _updatedAt
    }`;
    
    const items = await adminSanityClient.fetch(query);
    return items || [];
  } catch (error) {
    return [];
  }
}

// ===== FUNCIONES DE ESCRITURA =====

export async function createFeaturedItem(data: CreateFeaturedItemData): Promise<FeaturedItem | null> {
  try {
    // Construir el documento
    const doc: any = {
      _type: 'featuredItem',
      title: data.title,
      type: data.type,
      customTitle: data.customTitle,
      customDescription: data.customDescription,
      customCTA: data.customCTA,
      customUrl: data.customUrl,
      isActive: data.isActive,
      order: data.order,
    };

    // Agregar referencia según el tipo
    if (data.referenceId) {
      switch (data.type) {
        case 'review':
          doc.reviewRef = { _ref: data.referenceId, _type: 'reference' };
          break;
        case 'venue':
          doc.venueRef = { _ref: data.referenceId, _type: 'reference' };
          break;
        case 'category':
          doc.categoryRef = { _ref: data.referenceId, _type: 'reference' };
          break;
        case 'collection':
          doc.collectionRef = { _ref: data.referenceId, _type: 'reference' };
          break;
        case 'guide':
          doc.guideRef = { _ref: data.referenceId, _type: 'reference' };
          break;
      }
    }

    const result = await adminSanityWriteClient.create(doc);
    
    // Revalidar cache
    revalidateTag(REVALIDATE_TAGS.featuredItem);
    
    return result as unknown as FeaturedItem;
  } catch (error) {
    return null;
  }
}

export async function updateFeaturedItem(data: UpdateFeaturedItemData): Promise<FeaturedItem | null> {
  try {
    const updateDoc: any = {
      title: data.title,
      type: data.type,
      customTitle: data.customTitle,
      customDescription: data.customDescription,
      customCTA: data.customCTA,
      customUrl: data.customUrl,
      isActive: data.isActive,
      order: data.order,
    };

    // Limpiar referencias existentes
    updateDoc.reviewRef = undefined;
    updateDoc.venueRef = undefined;
    updateDoc.categoryRef = undefined;
    updateDoc.collectionRef = undefined;
    updateDoc.guideRef = undefined;

    // Agregar nueva referencia según el tipo
    if (data.referenceId) {
      switch (data.type) {
        case 'review':
          updateDoc.reviewRef = { _ref: data.referenceId, _type: 'reference' };
          break;
        case 'venue':
          updateDoc.venueRef = { _ref: data.referenceId, _type: 'reference' };
          break;
        case 'category':
          updateDoc.categoryRef = { _ref: data.referenceId, _type: 'reference' };
          break;
        case 'collection':
          updateDoc.collectionRef = { _ref: data.referenceId, _type: 'reference' };
          break;
        case 'guide':
          updateDoc.guideRef = { _ref: data.referenceId, _type: 'reference' };
          break;
      }
    }

    const result = await adminSanityWriteClient
      .patch(data._id)
      .set(updateDoc)
      .commit();
    
    // Revalidar cache
    revalidateTag(REVALIDATE_TAGS.featuredItem);
    
    return result as unknown as FeaturedItem;
  } catch (error) {
    return null;
  }
}

export async function deleteFeaturedItem(id: string): Promise<boolean> {
  try {
    await adminSanityWriteClient.delete(id);
    
    // Revalidar cache
    revalidateTag(REVALIDATE_TAGS.featuredItem);
    
    return true;
  } catch (error) {
    return false;
  }
}

export async function updateFeaturedItemOrder(items: { _id: string; order: number }[]): Promise<boolean> {
  try {
    // Actualizar cada item individualmente
    const promises = items.map(item => 
      adminSanityWriteClient
        .patch(item._id)
        .set({ order: item.order })
        .commit()
    );
    
    await Promise.all(promises);
    
    // Revalidar cache
    revalidateTag(REVALIDATE_TAGS.featuredItem);
    
    return true;
  } catch (error) {
    return false;
  }
}

export async function toggleFeaturedItemStatus(id: string, isActive: boolean): Promise<FeaturedItem | null> {
  try {
    const result = await adminSanityWriteClient
      .patch(id)
      .set({ isActive })
      .commit();
    
    // Revalidar cache
    revalidateTag(REVALIDATE_TAGS.featuredItem);
    
    return result as unknown as FeaturedItem;
  } catch (error) {
    return null;
  }
}

// ===== FUNCIONES AUXILIARES =====

export async function getReferencesForSelect(type: 'review' | 'venue' | 'category' | 'collection' | 'guide') {
  try {
    let query = '';
    
    switch (type) {
      case 'review':
        query = `*[_type == "review" && venue->slug.current != null] | order(venue->title asc) {
          _id,
          "title": venue->title + " - " + title,
          venue->{
            title,
            slug
          }
        }`;
        break;
      case 'venue':
        query = `*[_type == "venue" && slug.current != null] | order(title asc) {
          _id,
          title,
          slug
        }`;
        break;
      case 'category':
        query = `*[_type == "category" && slug.current != null] | order(title asc) {
          _id,
          title,
          slug
        }`;
        break;
      case 'guide':
        query = `*[_type == "guide" && slug.current != null] | order(title asc) {
          _id,
          title,
          slug
        }`;
        break;
      case 'collection':
        // Placeholder - implementar cuando tengas schema de collections
        return [];
      default:
        return [];
    }
    
    const items = await adminSanityClient.fetch(query);
    return items || [];
  } catch (error) {
    return [];
  }
}

export async function getFeaturedItemsStats() {
  try {
    const query = `{
      "total": count(*[_type == "featuredItem"]),
      "active": count(*[_type == "featuredItem" && isActive == true]),
      "inactive": count(*[_type == "featuredItem" && isActive == false]),
      "byType": *[_type == "featuredItem"] | {
        "type": type,
        "count": count(*[_type == "featuredItem" && type == ^.type])
      } | group(type) | {
        "type": _key,
        "count": length(value)
      }
    }`;
    
    const stats = await adminSanityClient.fetch(query);
    return stats;
  } catch (error) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      byType: []
    };
  }
}
