import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminSanityClient, adminSanityWriteClient } from '@/lib/admin-sanity';
import { revalidateTag } from 'next/cache';

// GET - Fetch all venues
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const venues = await adminSanityClient.fetch(`
      *[_type == "venue"] | order(_createdAt desc) {
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        description,
        address,
        phone,
        website,
        priceRange,
        "city": city->{_id, title, slug},
        "categories": categories[]->{_id, title, slug},
        images,
        featured,
        geo
      }
    `);

    return NextResponse.json(venues);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener locales' }, 
      { status: 500 }
    );
  }
}

// POST - Create new venue
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.address) {
      return NextResponse.json(
        { error: 'Título y dirección son requeridos' }, 
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

    // Create venue document
    const venue = await adminSanityWriteClient.create({
      _type: 'venue',
      title: data.title,
      slug: {
        current: data.slug,
        _type: 'slug'
      },
      description: data.description || '',
      address: data.address,
      phone: data.phone || '',
      website: data.website || '',
      priceRange: data.priceRange || '€€',
      city: data.city ? { _type: 'reference', _ref: data.city } : undefined,
      categories: data.categories?.map((cat: string) => ({ 
        _type: 'reference', 
        _ref: cat 
      })) || [],
      featured: data.featured || false,
      geo: data.geo || undefined,
      images: data.images || []
    });

    // Revalidate relevant pages
    revalidateTag('venues');
    revalidateTag('cities');

    return NextResponse.json({ 
      success: true, 
      venue,
      message: 'Local creado exitosamente' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}

// PUT - Update venue
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    
    if (!data._id) {
      return NextResponse.json(
        { error: 'ID del local es requerido' }, 
        { status: 400 }
      );
    }

    // Update venue document
    const venue = await adminSanityWriteClient
      .patch(data._id)
      .set({
        title: data.title,
        slug: data.slug ? {
          current: data.slug,
          _type: 'slug'
        } : undefined,
        description: data.description,
        address: data.address,
        phone: data.phone,
        website: data.website,
        priceRange: data.priceRange,
        city: data.city ? { _type: 'reference', _ref: data.city } : undefined,
        categories: data.categories?.map((cat: string) => ({ 
          _type: 'reference', 
          _ref: cat 
        })) || [],
        featured: data.featured,
        geo: data.geo,
        images: data.images
      })
      .commit();

    // Revalidate relevant pages
    revalidateTag('venues');
    revalidateTag('cities');

    return NextResponse.json({ 
      success: true, 
      venue,
      message: 'Local actualizado exitosamente' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}

// DELETE - Delete venue
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get('id');
    
    if (!venueId) {
      return NextResponse.json(
        { error: 'ID del local es requerido' }, 
        { status: 400 }
      );
    }

    // Check if venue has associated reviews
    const reviewsCount = await adminSanityClient.fetch(
      `count(*[_type == "review" && venue._ref == $venueId])`,
      { venueId }
    );

    if (reviewsCount > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un local que tiene reseñas asociadas' }, 
        { status: 400 }
      );
    }

    // Delete venue
    await adminSanityWriteClient.delete(venueId);

    // Revalidate relevant pages
    revalidateTag('venues');
    revalidateTag('cities');

    return NextResponse.json({ 
      success: true,
      message: 'Local eliminado exitosamente' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}