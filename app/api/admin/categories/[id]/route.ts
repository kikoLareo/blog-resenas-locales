import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminSanityClient, adminSanityWriteClient } from '@/lib/admin-sanity';
import { revalidateTag } from 'next/cache';

// GET - Fetch single category by ID
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
    
    const category = await adminSanityClient.fetch(`
      *[_type == "category" && _id == $id][0] {
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        description,
        icon,
        color,
        featured,
        "venueCount": count(*[_type == "venue" && references(^._id)])
      }
    `, { id });

    if (!category) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener categoría' }, 
      { status: 500 }
    );
  }
}

// PUT - Update single category
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

    // Check if category exists
    const existingCategory = await adminSanityClient.fetch(
      `*[_type == "category" && _id == $id][0]._id`,
      { id }
    );

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' }, 
        { status: 404 }
      );
    }

    // Check if slug already exists (excluding current category)
    if (data.slug) {
      const slugExists = await adminSanityClient.fetch(
        `*[_type == "category" && slug.current == $slug && _id != $id][0]._id`,
        { slug: data.slug, id }
      );

      if (slugExists) {
        return NextResponse.json(
          { error: 'Ya existe una categoría con este slug' }, 
          { status: 400 }
        );
      }
    }

    // Update category document
    const category = await adminSanityWriteClient
      .patch(id)
      .set({
        title: data.title,
        slug: data.slug ? {
          current: data.slug,
          _type: 'slug'
        } : undefined,
        description: data.description || '',
        icon: data.icon || 'tag',
        color: data.color || '#000000',
        featured: Boolean(data.featured)
      })
      .commit();

    // Revalidate relevant pages
    revalidateTag('categories');
    revalidateTag(`category-${id}`);

    return NextResponse.json({ 
      success: true, 
      category,
      message: 'Categoría actualizada exitosamente' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}

// DELETE - Delete single category
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

    // Check if category exists
    const existingCategory = await adminSanityClient.fetch(
      `*[_type == "category" && _id == $id][0]._id`,
      { id }
    );

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' }, 
        { status: 404 }
      );
    }

    // Check if category has associated venues
    const venuesCount = await adminSanityClient.fetch(
      `count(*[_type == "venue" && references(^._id)])`,
      { id }
    );

    if (venuesCount > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una categoría que tiene locales asociados' }, 
        { status: 400 }
      );
    }

    // Delete category
    await adminSanityWriteClient.delete(id);

    // Revalidate relevant pages
    revalidateTag('categories');
    revalidateTag(`category-${id}`);

    return NextResponse.json({ 
      success: true,
      message: 'Categoría eliminada exitosamente' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
