import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { HomepageSection, SaveSectionsRequest } from '@/types/homepage';

/**
 * GET /api/admin/homepage-sections
 * Obtiene todas las secciones de homepage configuradas
 */
export async function GET() {
  try {
    // Verificar autenticación (opcional, comentado por ahora)
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const sections = await prisma.homepageSection.findMany({
      orderBy: { order: 'asc' },
    });

    // Mapear datos de BD a formato HomepageSection
    const mappedSections: HomepageSection[] = sections.map((section) => ({
      id: section.id,
      title: section.title,
      sectionType: section.sectionType as any,
      enabled: section.enabled,
      order: section.order,
      config: section.config as any,
      createdAt: section.createdAt,
      updatedAt: section.updatedAt,
    }));

    return NextResponse.json({
      sections: mappedSections,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching homepage sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections', success: false },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/homepage-sections
 * Guarda/actualiza configuración de secciones
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación (opcional, comentado por ahora)
    // const session = await getServerSession(authOptions);
    // if (!session?.user || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body: SaveSectionsRequest = await request.json();
    const { sections } = body;

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Invalid sections data', success: false },
        { status: 400 }
      );
    }

    // Validar cada sección
    for (const section of sections) {
      if (!section.title || !section.sectionType) {
        return NextResponse.json(
          { error: 'Missing required section fields', success: false },
          { status: 400 }
        );
      }
    }

    // Actualizar todas las secciones en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Eliminar secciones que ya no existen
      const sectionIds = sections.map(s => s.id).filter(id => id && !id.startsWith('new-'));
      await tx.homepageSection.deleteMany({
        where: {
          id: {
            notIn: sectionIds.length > 0 ? sectionIds : ['dummy'], // Evitar query vacío
          },
        },
      });

      // Upsert cada sección
      const savedSections = [];
      for (const section of sections) {
        const isNew = !section.id || section.id.startsWith('new-');
        
        if (isNew) {
          // Crear nueva sección
          const created = await tx.homepageSection.create({
            data: {
              title: section.title,
              sectionType: section.sectionType,
              enabled: section.enabled,
              order: section.order,
              config: section.config as any,
            },
          });
          savedSections.push(created);
        } else {
          // Actualizar sección existente
          const updated = await tx.homepageSection.update({
            where: { id: section.id },
            data: {
              title: section.title,
              sectionType: section.sectionType,
              enabled: section.enabled,
              order: section.order,
              config: section.config as any,
            },
          });
          savedSections.push(updated);
        }
      }

      return savedSections;
    });

    // Mapear respuesta
    const mappedSections: HomepageSection[] = result.map((section) => ({
      id: section.id,
      title: section.title,
      sectionType: section.sectionType as any,
      enabled: section.enabled,
      order: section.order,
      config: section.config as any,
      createdAt: section.createdAt,
      updatedAt: section.updatedAt,
    }));

    // Revalidar homepage
    // await revalidatePath('/');

    return NextResponse.json({
      sections: mappedSections,
      success: true,
      message: 'Sections saved successfully',
    });
  } catch (error) {
    console.error('Error saving homepage sections:', error);
    return NextResponse.json(
      { error: 'Failed to save sections', success: false },
      { status: 500 }
    );
  }
}
