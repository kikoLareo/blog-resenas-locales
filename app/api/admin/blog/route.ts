import { NextResponse } from 'next/server';
import { 
  getAllBlogPosts, 
  createBlogPost,
  type CreateBlogPostData 
} from '@/lib/blog-admin';

/**
 * GET /api/admin/blog
 * Obtiene todos los posts del blog
 */
export async function GET() {
  try {
    const posts = await getAllBlogPosts();
    
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al obtener los posts del blog',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/blog
 * Crea un nuevo post de blog
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: 'El título es requerido' },
        { status: 400 }
      );
    }

    if (!body.slug || !body.slug.trim()) {
      return NextResponse.json(
        { error: 'El slug es requerido' },
        { status: 400 }
      );
    }

    if (!body.excerpt || !body.excerpt.trim()) {
      return NextResponse.json(
        { error: 'El extracto es requerido' },
        { status: 400 }
      );
    }

    if (!body.categories || !Array.isArray(body.categories) || body.categories.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos una categoría' },
        { status: 400 }
      );
    }

    // Validar longitud del título
    if (body.title.length < 10 || body.title.length > 100) {
      return NextResponse.json(
        { error: 'El título debe tener entre 10 y 100 caracteres' },
        { status: 400 }
      );
    }

    // Validar longitud del extracto
    if (body.excerpt.length < 100 || body.excerpt.length > 200) {
      return NextResponse.json(
        { error: 'El extracto debe tener entre 100 y 200 caracteres' },
        { status: 400 }
      );
    }

    // Validar categorías (máximo 3)
    if (body.categories.length > 3) {
      return NextResponse.json(
        { error: 'Máximo 3 categorías permitidas' },
        { status: 400 }
      );
    }

    // Validar venues relacionados (máximo 5)
    if (body.relatedVenues && body.relatedVenues.length > 5) {
      return NextResponse.json(
        { error: 'Máximo 5 locales relacionados permitidos' },
        { status: 400 }
      );
    }

    // Validar tags (máximo 10)
    if (body.tags && body.tags.length > 10) {
      return NextResponse.json(
        { error: 'Máximo 10 etiquetas permitidas' },
        { status: 400 }
      );
    }

    // Validar FAQ si está activado
    if (body.hasFaq) {
      if (!body.faq || body.faq.length === 0) {
        return NextResponse.json(
          { error: 'Debes agregar al menos una pregunta si tienes FAQ activado' },
          { status: 400 }
        );
      }
      if (body.faq.length > 8) {
        return NextResponse.json(
          { error: 'Máximo 8 preguntas en el FAQ' },
          { status: 400 }
        );
      }
    }

    // Validar tiempo de lectura
    if (body.readingTime && (body.readingTime < 1 || body.readingTime > 30)) {
      return NextResponse.json(
        { error: 'El tiempo de lectura debe estar entre 1 y 30 minutos' },
        { status: 400 }
      );
    }

    // Preparar datos para crear el post
    const postData: CreateBlogPostData = {
      title: body.title.trim(),
      slug: body.slug.trim(),
      excerpt: body.excerpt.trim(),
      categories: body.categories,
      author: body.author || 'Blog de Reseñas Team',
      publishedAt: body.publishedAt || new Date().toISOString(),
      featured: body.featured || false,
    };

    // Agregar campos opcionales
    if (body.heroImage) postData.heroImage = body.heroImage;
    if (body.heroImageAlt) postData.heroImageAlt = body.heroImageAlt;
    if (body.heroImageCaption) postData.heroImageCaption = body.heroImageCaption;
    if (body.body) postData.body = body.body;
    if (body.relatedVenues) postData.relatedVenues = body.relatedVenues;
    if (body.tags) postData.tags = body.tags;
    if (body.hasFaq !== undefined) postData.hasFaq = body.hasFaq;
    if (body.faq) postData.faq = body.faq;
    if (body.tldr) postData.tldr = body.tldr;
    if (body.authorAvatar) postData.authorAvatar = body.authorAvatar;
    if (body.readingTime) postData.readingTime = body.readingTime;

    // Crear el post
    const post = await createBlogPost(postData);
    
    if (post) {
      return NextResponse.json(
        { 
          success: true,
          message: 'Post creado exitosamente',
          post
        },
        { status: 201 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al crear el post en Sanity' },
      { status: 500 }
    );
    
  } catch (error) {
    console.error('Error creating blog post:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al crear el post',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

