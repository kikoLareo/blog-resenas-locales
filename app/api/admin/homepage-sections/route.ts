import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity.client';
import type { HomepageSection, SaveSectionsRequest } from '@/types/homepage';

/**
 * GET /api/admin/homepage-sections
 * Obtiene todas las secciones de homepage desde Sanity
 */
export async function GET() {
  try {
    console.log('🔍 Fetching homepage sections...');
    
    const query = `*[_type == "homepageSection"] | order(order asc) {
      _id,
      _type,
      title,
      sectionType,
      enabled,
      order,
      config,
      _createdAt,
      _updatedAt
    }`;

    console.log('📋 Query:', query);
    const sections = await client.fetch<HomepageSection[]>(query);
    console.log('✅ Sections found:', sections.length);
    console.log('📊 Sections:', sections);

    return NextResponse.json({
      success: true,
      sections,
    });

  } catch (error) {
    console.error('Error fetching homepage sections:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener las secciones',
        sections: [],
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/homepage-sections
 * Crea una nueva sección de homepage en Sanity
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, sectionType, config } = body;

    if (!title || !sectionType || !config) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: title, sectionType, config' },
        { status: 400 }
      );
    }

    const maxOrderQuery = `*[_type == "homepageSection"] | order(order desc) [0].order`;
    const maxOrder = await client.fetch<number>(maxOrderQuery);
    const nextOrder = (maxOrder || 0) + 1;

    const newSection = {
      _type: 'homepageSection',
      title,
      sectionType,
      enabled: true,
      order: nextOrder,
      config,
    };

    const createdSection = await client.create(newSection);

    return NextResponse.json({
      success: true,
      section: createdSection,
    });

  } catch (error) {
    console.error('Error creating homepage section:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al crear la sección',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/homepage-sections
 * Actualiza múltiples secciones
 */
export async function PUT(request: NextRequest) {
  try {
    const { sections }: SaveSectionsRequest = await request.json();

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Se requiere un array de secciones' },
        { status: 400 }
      );
    }

    const updatePromises = sections.map((section) => {
      return client
        .patch(section._id)
        .set({
          title: section.title,
          sectionType: section.sectionType,
          enabled: section.enabled,
          order: section.order,
          config: section.config,
        })
        .commit();
    });

    const updatedSections = await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      sections: updatedSections,
    });

  } catch (error) {
    console.error('Error updating homepage sections:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al actualizar las secciones',
      },
      { status: 500 }
    );
  }
}
