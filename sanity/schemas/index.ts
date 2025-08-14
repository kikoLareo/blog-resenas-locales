// Export all schema types for Sanity Studio
// Blog de Reseñas de Locales - Schema Configuration

// Base content types
import { city } from './city';
import { category } from './category';

// Main content types
import { venue } from './venue';
import { review } from './review';
import { post } from './post';

// Export schema types in logical order
export const schemaTypes = [
  // ===== CONFIGURACIÓN BASE =====
  // Tipos que sirven como base para otros contenidos
  city,        // Ciudades donde se encuentran los locales
  category,    // Categorías de restaurantes y locales
  
  // ===== CONTENIDO PRINCIPAL =====
  // Tipos de contenido principal del blog
  venue,       // Locales/restaurantes
  review,      // Reseñas de locales
  post,        // Crónicas y artículos del blog
];

// Configuración adicional para validaciones y referencias
export const schemaConfig = {
  // Tipos que pueden ser referenciados
  referenceTypes: ['city', 'category', 'venue'],
  
  // Tipos de contenido principal
  contentTypes: ['venue', 'review', 'post'],
  
  // Tipos con slug (para URLs)
  slugTypes: ['city', 'category', 'venue', 'review', 'post'],
  
  // Tipos con imágenes
  imageTypes: ['city', 'category', 'venue', 'review', 'post'],
  
  // Tipos con SEO
  seoTypes: ['city', 'category', 'venue', 'review', 'post'],
  
  // Tipos que pueden ser destacados
  featuredTypes: ['category', 'city', 'post'],
  
  // Tipos con FAQ
  faqTypes: ['review', 'post'],
  
  // Tipos con ratings/valoraciones
  ratedTypes: ['review'],
  
  // Tipos con ubicación geográfica
  geoTypes: ['city', 'venue'],
  
  // Tipos con fechas de publicación
  publishedTypes: ['review', 'post'],
};

// Metadatos de los esquemas para uso en la aplicación
export const schemaMetadata = {
  city: {
    title: 'Ciudad',
    icon: '🏙️',
    color: 'blue',
    description: 'Ciudades donde se encuentran los locales reseñados',
  },
  category: {
    title: 'Categoría',
    icon: '🏷️',
    color: 'green',
    description: 'Categorías de restaurantes y tipos de cocina',
  },
  venue: {
    title: 'Local',
    icon: '🏪',
    color: 'purple',
    description: 'Restaurantes, bares y locales gastronómicos',
  },
  review: {
    title: 'Reseña',
    icon: '⭐',
    color: 'yellow',
    description: 'Reseñas detalladas de locales con puntuaciones',
  },
  post: {
    title: 'Post',
    icon: '📝',
    color: 'indigo',
    description: 'Artículos, crónicas y contenido editorial del blog',
  },
};

// Configuración de campos comunes
export const commonFields = {
  // Campos básicos que comparten todos los tipos
  basic: ['title', 'slug'],
  
  // Campos SEO
  seo: ['seoTitle', 'seoDescription'],
  
  // Campos de medios
  media: ['heroImage', 'gallery'],
  
  // Campos de fechas
  dates: ['publishedAt', 'updatedAt'],
  
  // Campos de autor
  author: ['author', 'authorAvatar'],
  
  // Campos de organización
  organization: ['featured', 'order'],
};
