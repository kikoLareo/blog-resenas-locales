import { NextResponse } from 'next/server';
import { 
  getBlogPostById, 
  updateBlogPost,
  deleteBlogPost,
  type CreateBlogPostData 
} from '@/lib/blog-admin';

/**
 * GET /api/admin/blog/[id]
 * Obtiene un post específico por su ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID del post es requerido' },
        { status: 400 }
      );
    }

    const post = await getBlogPostById(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al obtener el post',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/blog/[id]
 * Actualiza un post existente
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID del post es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el post existe
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Validaciones opcionales (solo si se envían)
    if (body.title && (body.title.length < 10 || body.title.length > 100)) {
      return NextResponse.json(
        { error: 'El título debe tener entre 10 y 100 caracteres' },
        { status: 400 }
      );
    }

    if (body.excerpt && (body.excerpt.length < 100 || body.excerpt.length > 200)) {
      return NextResponse.json(
        { error: 'El extracto debe tener entre 100 y 200 caracteres' },
        { status: 400 }
      );
    }

    if (body.categories && body.categories.length > 3) {
      return NextResponse.json(
        { error: 'Máximo 3 categorías permitidas' },
        { status: 400 }
      );
    }

    if (body.relatedVenues && body.relatedVenues.length > 5) {
      return NextResponse.json(
        { error: 'Máximo 5 locales relacionados permitidos' },
        { status: 400 }
      );
    }

    if (body.tags && body.tags.length > 10) {
      return NextResponse.json(
        { error: 'Máximo 10 etiquetas permitidas' },
        { status: 400 }
      );
    }

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

    if (body.readingTime && (body.readingTime < 1 || body.readingTime > 30)) {
      return NextResponse.json(
        { error: 'El tiempo de lectura debe estar entre 1 y 30 minutos' },
        { status: 400 }
      );
    }

    // Preparar datos para actualizar
    const updateData: Partial<CreateBlogPostData> = {};

    if (body.title) updateData.title = body.title.trim();
    if (body.slug) updateData.slug = body.slug.trim();
    if (body.excerpt) updateData.excerpt = body.excerpt.trim();
    if (body.heroImage !== undefined) updateData.heroImage = body.heroImage;
    if (body.heroImageAlt !== undefined) updateData.heroImageAlt = body.heroImageAlt;
    if (body.heroImageCaption !== undefined) updateData.heroImageCaption = body.heroImageCaption;
    if (body.body !== undefined) updateData.body = body.body;
    if (body.categories !== undefined) updateData.categories = body.categories;
    if (body.relatedVenues !== undefined) updateData.relatedVenues = body.relatedVenues;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.hasFaq !== undefined) updateData.hasFaq = body.hasFaq;
    if (body.faq !== undefined) updateData.faq = body.faq;
    if (body.tldr !== undefined) updateData.tldr = body.tldr;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.authorAvatar !== undefined) updateData.authorAvatar = body.authorAvatar;
    if (body.readingTime !== undefined) updateData.readingTime = body.readingTime;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.publishedAt !== undefined) updateData.publishedAt = body.publishedAt;

    // Actualizar el post
    const updatedPost = await updateBlogPost(id, updateData);
    
    if (updatedPost) {
      return NextResponse.json(
        { 
          success: true,
          message: 'Post actualizado exitosamente',
          post: updatedPost
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al actualizar el post en Sanity' },
      { status: 500 }
    );
    
  } catch (error) {
    console.error('Error updating blog post:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al actualizar el post',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/blog/[id]
 * Elimina un post
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID del post es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el post existe
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el post
    const success = await deleteBlogPost(id);
    
    if (success) {
      return NextResponse.json(
        { 
          success: true,
          message: 'Post eliminado exitosamente'
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al eliminar el post en Sanity' },
      { status: 500 }
    );
    
  } catch (error) {
    console.error('Error deleting blog post:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al eliminar el post',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

