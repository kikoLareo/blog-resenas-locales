import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminSanityClient, adminSanityWriteClient } from '@/lib/admin-sanity';
import { revalidateTag } from 'next/cache';

// GET - Fetch all categories
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const categories = await adminSanityClient.fetch(`
      *[_type == "category"] | order(title asc) {
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
    `);

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener categorías' }, 
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.title) {
      return NextResponse.json(
        { error: 'Título es requerido' }, 
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

    // Check if slug already exists
    const existingCategory = await adminSanityClient.fetch(
      `*[_type == "category" && slug.current == $slug][0]._id`,
      { slug: data.slug }
    );

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con este slug' }, 
        { status: 400 }
      );
    }

    // Create category document
    const category = await adminSanityWriteClient.create({
      _type: 'category',
      title: data.title,
      slug: {
        current: data.slug,
        _type: 'slug'
      },
      description: data.description || '',
      icon: data.icon || 'tag',
      color: data.color || '#000000',
      featured: Boolean(data.featured)
    });

    // Revalidate relevant pages
    revalidateTag('categories');

    return NextResponse.json({ 
      success: true, 
      category,
      message: 'Categoría creada exitosamente' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
