// Funciones para gestionar la configuración de homepage en Sanity
import { adminSanityClient } from './admin-sanity';

// Tipos para la configuración de homepage
export interface HomepageSectionConfig {
  id: string;
  title: string;
  type: 'hero' | 'featured' | 'trending' | 'categories' | 'newsletter';
  enabled: boolean;
  order: number;
  config: {
    title?: string;
    subtitle?: string;
    itemCount?: number;
    showImages?: boolean;
    layout?: 'grid' | 'carousel' | 'list';
  };
}

export interface HomepageConfiguration {
  _id?: string;
  title: string;
  sections: HomepageSectionConfig[];
  lastModified: string;
}

/**
 * Obtener la configuración actual de la homepage
 */
export async function getHomepageConfiguration(): Promise<HomepageConfiguration | null> {
  try {
    const query = `*[_type == "homepageConfig"][0]{
      _id,
      title,
      sections,
      lastModified
    }`;
    
    const result = await adminSanityClient.fetch(query);
    return result;
  } catch (error) {
    console.error('Error fetching homepage configuration:', error);
    return null;
  }
}

/**
 * Guardar la configuración de la homepage
 */
export async function saveHomepageConfiguration(config: HomepageSectionConfig[]): Promise<boolean> {
  try {
    // Buscar si ya existe una configuración
    const existingConfig = await getHomepageConfiguration();
    
    const configData = {
      _type: 'homepageConfig',
      title: 'Homepage Principal',
      sections: config.map(section => ({
        id: section.id,
        type: section.type,
        enabled: section.enabled,
        title: section.title,
        config: section.config
      })),
      lastModified: new Date().toISOString()
    };

    if (existingConfig?._id) {
      // Actualizar configuración existente
      await adminSanityClient.patch(existingConfig._id).set(configData).commit();
    } else {
      // Crear nueva configuración
      await adminSanityClient.create(configData);
    }

    return true;
  } catch (error) {
    console.error('Error saving homepage configuration:', error);
    return false;
  }
}

/**
 * Configuración por defecto para la homepage
 */
export const defaultHomepageConfig: HomepageSectionConfig[] = [
  {
    id: '1',
    title: 'Hero Principal',
    type: 'hero',
    enabled: true,
    order: 1,
    config: {
      title: 'Descubre los mejores sabores',
      subtitle: 'Reseñas auténticas de restaurantes locales',
      itemCount: 3,
      layout: 'carousel'
    }
  },
  {
    id: '2',
    title: 'Destacados',
    type: 'featured',
    enabled: true,
    order: 2,
    config: {
      title: 'Reseñas destacadas',
      subtitle: 'Los lugares que más nos han sorprendido',
      itemCount: 6,
      layout: 'grid'
    }
  },
  {
    id: '3',
    title: 'Tendencias',
    type: 'trending',
    enabled: true,
    order: 3,
    config: {
      title: 'Lo más popular',
      subtitle: 'Reseñas que están en tendencia',
      itemCount: 4,
      layout: 'grid'
    }
  },
  {
    id: '4',
    title: 'Categorías',
    type: 'categories',
    enabled: false,
    order: 4,
    config: {
      title: 'Explora por categorías',
      subtitle: 'Encuentra exactamente lo que buscas',
      itemCount: 8,
      layout: 'grid'
    }
  },
  {
    id: '5',
    title: 'Newsletter',
    type: 'newsletter',
    enabled: true,
    order: 5,
    config: {
      title: 'No te pierdas nada',
      subtitle: 'Recibe las mejores reseñas en tu email'
    }
  }
];

/**
 * Revalidar las páginas que dependen de la configuración de homepage
 */
export async function revalidateHomepage() {
  try {
    // Llamar a la API de revalidación para actualizar la homepage
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tags: ['homepage', 'homepage-config']
      })
    });

    if (!response.ok) {
      throw new Error('Failed to revalidate');
    }

    return true;
  } catch (error) {
    console.error('Error revalidating homepage:', error);
    return false;
  }
}
