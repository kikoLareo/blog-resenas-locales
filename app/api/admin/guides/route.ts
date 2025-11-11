import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminSanityClient, adminSanityWriteClient } from '@/lib/admin-sanity';
import { revalidateTag } from 'next/cache';

// GET - Obtener todas las guías
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const guides = await adminSanityClient.fetch(`
      *[_type == "guide"] | order(_createdAt desc) {
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
      }
    `);

    return NextResponse.json(guides);
  } catch (error) {
    console.error('Error fetching guides:', error);
    return NextResponse.json(
      { error: 'Error al obtener guías' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva guía
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    // Validaciones
    if (!data.title || !data.type || !data.city) {
      return NextResponse.json(
        { error: 'Título, tipo y ciudad son requeridos' },
        { status: 400 }
      );
    }

    // Generar slug si no existe
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Crear documento
    const guide = await adminSanityWriteClient.create({
      _type: 'guide',
      title: data.title,
      slug: { current: data.slug, _type: 'slug' },
      excerpt: data.excerpt || '',
      type: data.type,
      city: { _type: 'reference', _ref: data.city },
      neighborhood: data.neighborhood,
      theme: data.theme,
      sections: data.sections || [],
      published: data.published || false,
      featured: data.featured || false,
      publishedAt: data.published ? new Date().toISOString() : null,
      lastUpdated: new Date().toISOString(),
      stats: {
        views: 0,
        shares: 0,
        bookmarks: 0
      },
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      keywords: data.keywords
    });

    // Revalidar
    revalidateTag('guides');
    revalidateTag('seo-content');

    return NextResponse.json({
      success: true,
      guide,
      message: 'Guía creada exitosamente'
    });
  } catch (error) {
    console.error('Error creating guide:', error);
    return NextResponse.json(
      { error: 'Error al crear la guía' },
      { status: 500 }
    );
  }
}
