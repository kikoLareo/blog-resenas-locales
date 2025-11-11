/**
 * Types for Homepage Sections Management
 * Refactor completo del sistema de secciones
 */

// Tipos de sección (visual/layout)
export type SectionType = 
  | 'hero'           // Hero principal moderno
  | 'hero-v3'        // Hero clásico con carrusel
  | 'poster'         // Card horizontal alargado
  | 'poster-v2'      // Poster menos alto
  | 'banner'         // Formato 16:9
  | 'card-square';   // Formato cuadrado 1:1

// Tipos de contenido que puede mostrar una sección
export type ContentType = 
  | 'venue'          // Restaurantes, cafés, locales
  | 'review'         // Reseñas individuales
  | 'category'       // Categorías de cocina
  | 'city';          // Ciudades

// Layout/distribución de la sección
export type SectionLayout = 
  | 'grid'           // Cuadrícula (2, 3 o 4 columnas)
  | 'list'           // Lista vertical
  | 'carousel';      // Carrusel (solo para hero)

// Columnas para grid
export type GridColumns = 2 | 3 | 4;

/**
 * Item seleccionado en una sección
 * Representa un elemento específico (venue, review, etc) que se mostrará
 */
export interface SelectedItem {
  id: string;                    // ID del documento en Sanity
  type: ContentType;             // Tipo de contenido
  order: number;                 // Orden dentro de la sección (para drag & drop)
  title: string;                 // Título para preview en dashboard
  slug?: string;                 // Slug para construir URL
  imageUrl?: string;             // URL de imagen para preview
  city?: string;                 // Ciudad (solo para venues)
  venue?: string;                // Venue (solo para reviews)
}

/**
 * Configuración de una sección (compatible con Sanity)
 */
export interface SectionConfig {
  displayTitle?: string;         // Título visible en frontend
  subtitle?: string;             // Subtítulo descriptivo
  contentTypes: ContentType[];   // Tipos de contenido seleccionados
  selectedItems: SelectedItem[]; // Items específicos seleccionados
}

/**
 * Sección completa de homepage (compatible con Sanity)
 */
export interface HomepageSection {
  _id: string;                   // ID único de la sección (Sanity)
  _type: 'homepageSection';      // Tipo de documento Sanity
  title: string;                 // Título interno (para dashboard)
  sectionType: SectionType;      // Tipo visual (hero, poster, banner, etc)
  enabled: boolean;              // Si la sección está activa
  order: number;                 // Orden en la página
  config: SectionConfig;         // Configuración completa
  _createdAt?: string;           // Fecha de creación (Sanity)
  _updatedAt?: string;           // Última actualización (Sanity)
}

/**
 * Item disponible para seleccionar (desde Sanity)
 * Versión simplificada para lista de selección
 */
export interface AvailableItem {
  _id: string;                   // ID del documento en Sanity
  title: string;                 // Título
  slug: string;                  // Slug
  imageUrl?: string;             // URL de imagen
  type: ContentType;             // Tipo de contenido
  city?: string;                 // Ciudad (venues)
  venue?: string;                // Venue (reviews)
  category?: string;             // Categoría (venues/reviews)
}

/**
 * Respuesta de API para items disponibles
 */
export interface AvailableItemsResponse {
  items: AvailableItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Request para guardar secciones
 */
export interface SaveSectionsRequest {
  sections: HomepageSection[];
}

/**
 * Response de API para secciones
 */
export interface SectionsResponse {
  sections: HomepageSection[];
  success: boolean;
  message?: string;
}

/**
 * Filtros para búsqueda de items
 */
export interface ItemFilters {
  search?: string;               // Búsqueda por texto
  type: ContentType;             // Tipo de contenido
  page?: number;                 // Página (paginación)
  pageSize?: number;             // Tamaño de página
  city?: string;                 // Filtrar por ciudad
  category?: string;             // Filtrar por categoría
}
