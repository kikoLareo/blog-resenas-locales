import { NextResponse } from 'next/server';
import { 
  getHomepageConfiguration, 
  saveHomepageConfiguration, 
  defaultHomepageConfig,
  type HomepageSectionConfig 
} from '@/lib/homepage-admin';

/**
 * GET /api/admin/homepage-config
 * Obtiene la configuración actual de la homepage desde Sanity
 * Si no existe, devuelve la configuración por defecto
 */
export async function GET() {
  try {
    const config = await getHomepageConfiguration();
    
    if (config && config.sections) {
      return NextResponse.json(config, { status: 200 });
    }
    
    // Si no hay configuración en Sanity, devolver la por defecto
    return NextResponse.json(
      { 
        sections: defaultHomepageConfig,
        title: 'Homepage Principal',
        lastModified: new Date().toISOString()
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching homepage configuration:', error);
    
    // En caso de error, devolver configuración por defecto
    return NextResponse.json(
      { 
        sections: defaultHomepageConfig,
        title: 'Homepage Principal',
        lastModified: new Date().toISOString()
      }, 
      { status: 200 }
    );
  }
}

/**
 * POST /api/admin/homepage-config
 * Guarda la configuración de la homepage en Sanity
 * Body: { sections: HomepageSectionConfig[] }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar que se envió el campo sections
    if (!body.sections || !Array.isArray(body.sections)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El campo "sections" es requerido y debe ser un array' 
        },
        { status: 400 }
      );
    }

    // Validar estructura básica de cada sección
    const sections = body.sections as HomepageSectionConfig[];
    
    for (const section of sections) {
      if (!section.id || !section.type || !section.title) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Cada sección debe tener id, type y title' 
          },
          { status: 400 }
        );
      }

      // Validar tipo de sección
      const validTypes = ['hero', 'featured', 'trending', 'categories', 'newsletter'];
      if (!validTypes.includes(section.type)) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Tipo de sección inválido: ${section.type}` 
          },
          { status: 400 }
        );
      }
    }

    // Guardar en Sanity
    const success = await saveHomepageConfiguration(sections);
    
    if (success) {
      return NextResponse.json(
        { 
          success: true,
          message: 'Configuración guardada exitosamente'
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al guardar la configuración en Sanity' 
      },
      { status: 500 }
    );
    
  } catch (error) {
    console.error('Error saving homepage configuration:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}

