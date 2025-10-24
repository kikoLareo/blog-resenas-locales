import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminSanityClient, adminSanityWriteClient } from '@/lib/admin-sanity';
import { revalidateTag } from 'next/cache';

// GET - Obtener una guía específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const guide = await adminSanityClient.fetch(
      `*[_type == "guide" && _id == $id][0]{
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        excerpt,
        type,
        city->{_id, title, slug},
        neighborhood,
        theme,
        sections,
        published,
        featured,
        publishedAt,
        lastUpdated,
        stats,
        seoTitle,
        seoDescription,
        keywords
      }`,
      { id }
    );

    if (!guide) {
      return NextResponse.json({ error: 'Guía no encontrada' }, { status: 404 });
    }

    return NextResponse.json(guide);
  } catch (error) {
    console.error('Error fetching guide:', error);
    return NextResponse.json(
      { error: 'Error al obtener la guía' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar guía
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Validaciones
    if (!data.title || !data.type || !data.city) {
      return NextResponse.json(
        { error: 'Título, tipo y ciudad son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que la guía existe
    const existingGuide = await adminSanityClient.fetch(
      `*[_type == "guide" && _id == $id][0]._id`,
      { id }
    );

    if (!existingGuide) {
      return NextResponse.json({ error: 'Guía no encontrada' }, { status: 404 });
    }

    // Normalizar slug si es necesario
    const normalizedSlug = typeof data.slug === 'string' 
      ? data.slug 
      : data.slug?.current || '';

    // Actualizar documento
    const updated = await adminSanityWriteClient
      .patch(id)
      .set({
        title: data.title,
        slug: normalizedSlug ? { current: normalizedSlug, _type: 'slug' } : undefined,
        excerpt: data.excerpt,
        type: data.type,
        city: data.city ? { _type: 'reference', _ref: data.city } : undefined,
        neighborhood: data.neighborhood,
        theme: data.theme,
        sections: data.sections,
        published: data.published,
        featured: data.featured,
        publishedAt: data.published && !data.publishedAt
          ? new Date().toISOString()
          : data.publishedAt,
        lastUpdated: new Date().toISOString(),
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        keywords: data.keywords
      })
      .commit();

    revalidateTag('guides');
    revalidateTag('seo-content');
    revalidateTag(`guide-${id}`);

    return NextResponse.json({
      success: true,
      guide: updated,
      message: 'Guía actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error updating guide:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la guía' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar guía
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Verificar que la guía existe
    const existingGuide = await adminSanityClient.fetch(
      `*[_type == "guide" && _id == $id][0]._id`,
      { id }
    );

    if (!existingGuide) {
      return NextResponse.json({ error: 'Guía no encontrada' }, { status: 404 });
    }

    await adminSanityWriteClient.delete(id);

    revalidateTag('guides');
    revalidateTag('seo-content');
    revalidateTag(`guide-${id}`);

    return NextResponse.json({
      success: true,
      message: 'Guía eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error deleting guide:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la guía' },
      { status: 500 }
    );
  }
}
