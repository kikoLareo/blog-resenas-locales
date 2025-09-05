import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminSanityClient } from '@/lib/admin-sanity';
import { revalidateTag } from 'next/cache';

// GET - Fetch all reviews
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const reviews = await adminSanityClient.fetch(`
      *[_type == "review"] | order(_createdAt desc) {
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        content,
        venue->{_id, title, slug, city->{title, slug}},
        ratings,
        status,
        publishedAt
      }
    `);

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Error al obtener reseñas' }, 
      { status: 500 }
    );
  }
}

// POST - Create new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.venue) {
      return NextResponse.json(
        { error: 'Título y local son requeridos' }, 
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Create review document
    const review = await adminSanityClient.create({
      _type: 'review',
      title: data.title,
      slug: {
        current: data.slug,
        _type: 'slug'
      },
      content: data.content || '',
      venue: data.venue ? { _type: 'reference', _ref: data.venue } : undefined,
      ratings: data.ratings || {
        food: 5,
        service: 5,
        ambience: 5,
        value: 5
      },
      status: data.status || 'draft',
      publishedAt: data.status === 'published' ? new Date().toISOString() : null,
      author: session.user.email || 'admin',
      visitDate: new Date().toISOString()
    });

    // Revalidate relevant pages
    revalidateTag('reviews');
    revalidateTag('venues');

    return NextResponse.json({ 
      success: true, 
      review,
      message: 'Reseña creada exitosamente' 
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}