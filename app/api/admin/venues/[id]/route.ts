import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminSanityClient } from '@/lib/admin-sanity';
import { revalidateTag } from 'next/cache';

// GET - Fetch single venue by ID
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
    
    const venue = await adminSanityClient.fetch(`
      *[_type == "venue" && _id == $id][0] {
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
        geo,
        "reviewCount": count(*[_type == "review" && venue._ref == ^._id])
      }
    `, { id });

    if (!venue) {
      return NextResponse.json(
        { error: 'Local no encontrado' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(venue);
  } catch (error) {
    console.error('Error fetching venue:', error);
    return NextResponse.json(
      { error: 'Error al obtener local' }, 
      { status: 500 }
    );
  }
}

// PUT - Update single venue
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

    // Validate required fields
    if (!data.title || !data.address) {
      return NextResponse.json(
        { error: 'Título y dirección son requeridos' }, 
        { status: 400 }
      );
    }

    // Check if venue exists
    const existingVenue = await adminSanityClient.fetch(
      `*[_type == "venue" && _id == $id][0]._id`,
      { id }
    );

    if (!existingVenue) {
      return NextResponse.json(
        { error: 'Local no encontrado' }, 
        { status: 404 }
      );
    }

    // Update venue document
    const venue = await adminSanityClient
      .patch(id)
      .set({
        title: data.title,
        slug: data.slug ? {
          current: data.slug,
          _type: 'slug'
        } : undefined,
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
        featured: Boolean(data.featured),
        geo: data.geo || undefined,
        images: data.images || []
      })
      .commit();

    // Revalidate relevant pages
    revalidateTag('venues');
    revalidateTag('cities');
    revalidateTag(`venue-${id}`);

    return NextResponse.json({ 
      success: true, 
      venue,
      message: 'Local actualizado exitosamente' 
    });
  } catch (error) {
    console.error('Error updating venue:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}

// DELETE - Delete single venue
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

    // Check if venue exists
    const existingVenue = await adminSanityClient.fetch(
      `*[_type == "venue" && _id == $id][0]._id`,
      { id }
    );

    if (!existingVenue) {
      return NextResponse.json(
        { error: 'Local no encontrado' }, 
        { status: 404 }
      );
    }

    // Check if venue has associated reviews
    const reviewsCount = await adminSanityClient.fetch(
      `count(*[_type == "review" && venue._ref == $id])`,
      { id }
    );

    if (reviewsCount > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un local que tiene reseñas asociadas' }, 
        { status: 400 }
      );
    }

    // Delete venue
    await adminSanityClient.delete(id);

    // Revalidate relevant pages
    revalidateTag('venues');
    revalidateTag('cities');
    revalidateTag(`venue-${id}`);

    return NextResponse.json({ 
      success: true,
      message: 'Local eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error deleting venue:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}