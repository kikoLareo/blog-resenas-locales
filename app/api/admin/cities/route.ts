import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminSanityClient, adminSanityWriteClient } from '@/lib/admin-sanity';
import { revalidateTag } from 'next/cache';

// GET - Fetch all cities
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const cities = await adminSanityClient.fetch(`
      *[_type == "city"] | order(title asc) {
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
    `);

    return NextResponse.json(cities);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener ciudades' }, 
      { status: 500 }
    );
  }
}

// POST - Create new city
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
    const existingCity = await adminSanityClient.fetch(
      `*[_type == "city" && slug.current == $slug][0]._id`,
      { slug: data.slug }
    );

    if (existingCity) {
      return NextResponse.json(
        { error: 'Ya existe una ciudad con este slug' }, 
        { status: 400 }
      );
    }

    // Create city document
    const city = await adminSanityWriteClient.create({
      _type: 'city',
      title: data.title,
      slug: {
        current: data.slug,
        _type: 'slug'
      },
      region: data.region || '',
      description: data.description || ''
    });

    // Revalidate relevant pages
    revalidateTag('cities');

    return NextResponse.json({ 
      success: true, 
      city,
      message: 'Ciudad creada exitosamente' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
