import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  saveHomepageConfiguration, 
  getHomepageConfiguration, 
  revalidateHomepage,
  HomepageSectionConfig 
} from '@/lib/homepage-admin';

// GET - Obtener configuración actual
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const config = await getHomepageConfiguration();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching homepage config:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' }, 
      { status: 500 }
    );
  }
}

// POST - Guardar nueva configuración
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { sections }: { sections: HomepageSectionConfig[] } = await request.json();

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Datos de secciones inválidos' }, 
        { status: 400 }
      );
    }

    // Guardar en Sanity
    const success = await saveHomepageConfiguration(sections);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Error al guardar configuración' }, 
        { status: 500 }
      );
    }

    // Revalidar páginas que dependen de esta configuración
    await revalidateHomepage();

    return NextResponse.json({ 
      success: true, 
      message: 'Configuración guardada exitosamente' 
    });
  } catch (error) {
    console.error('Error saving homepage config:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
