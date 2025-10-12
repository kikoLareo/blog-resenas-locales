import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminSanityClient, adminSanityWriteClient } from '@/lib/admin-sanity';
import { revalidateTag } from 'next/cache';

// GET - Fetch single city by ID
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
    
    const city = await adminSanityClient.fetch(`
      *[_type == "city" && _id == $id][0] {
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        region,
        description,
        "venueCount": count(*[_type == "venue" && references(^._id)]),
        "reviewCount": count(*[_type == "review" && venue->city._ref == ^._id])
      }
    `, { id });

    if (!city) {
      return NextResponse.json(
        { error: 'Ciudad no encontrada' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(city);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener ciudad' }, 
      { status: 500 }
    );
  }
}

// PUT - Update single city
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
    if (!data.title) {
      return NextResponse.json(
        { error: 'Título es requerido' }, 
        { status: 400 }
      );
    }

    // Check if city exists
    const existingCity = await adminSanityClient.fetch(
      `*[_type == "city" && _id == $id][0]._id`,
      { id }
    );

    if (!existingCity) {
      return NextResponse.json(
        { error: 'Ciudad no encontrada' }, 
        { status: 404 }
      );
    }

    // Check if slug already exists (excluding current city)
    if (data.slug) {
      const slugExists = await adminSanityClient.fetch(
        `*[_type == "city" && slug.current == $slug && _id != $id][0]._id`,
        { slug: data.slug, id }
      );

      if (slugExists) {
        return NextResponse.json(
          { error: 'Ya existe una ciudad con este slug' }, 
          { status: 400 }
        );
      }
    }

    // Update city document
    const city = await adminSanityWriteClient
      .patch(id)
      .set({
        title: data.title,
        slug: data.slug ? {
          current: data.slug,
          _type: 'slug'
        } : undefined,
        region: data.region || '',
        description: data.description || ''
      })
      .commit();

    // Revalidate relevant pages
    revalidateTag('cities');
    revalidateTag(`city-${id}`);

    return NextResponse.json({ 
      success: true, 
      city,
      message: 'Ciudad actualizada exitosamente' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}

// DELETE - Delete single city
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

    // Check if city exists
    const existingCity = await adminSanityClient.fetch(
      `*[_type == "city" && _id == $id][0]._id`,
      { id }
    );

    if (!existingCity) {
      return NextResponse.json(
        { error: 'Ciudad no encontrada' }, 
        { status: 404 }
      );
    }

    // Check if city has associated venues
    const venuesCount = await adminSanityClient.fetch(
      `count(*[_type == "venue" && city._ref == $id])`,
      { id }
    );

    if (venuesCount > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una ciudad que tiene locales asociados' }, 
        { status: 400 }
      );
    }

    // Delete city
    await adminSanityWriteClient.delete(id);

    // Revalidate relevant pages
    revalidateTag('cities');
    revalidateTag(`city-${id}`);

    return NextResponse.json({ 
      success: true,
      message: 'Ciudad eliminada exitosamente' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
