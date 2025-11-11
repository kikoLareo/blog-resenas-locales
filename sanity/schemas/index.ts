// Export all schema types for Sanity Studio
// Blog de Reseñas de Locales - Schema Configuration

// Base content types
import { city } from './city';
import category from './category';

// Main content types
import venue from './venue';
import review from './review';
import post from './post';
import qrCode from './qr-code';
import qrFeedback from './qr-feedback';
import venueSubmission from './venue-submission';

// New SEO-focused content types
import { guide } from './guide';
import { list } from './list';
import { recipe } from './recipe';
import { dishGuide } from './dish-guide';
import { news } from './news';
import { offer } from './offer';

// Featured content
import featuredItem from './featured-item';
import { homepageSection } from './homepageSection';
import { homepageConfig } from './homepage-config';

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
  qrCode,      // Códigos QR para acceso a locales
  qrFeedback,  // Feedback de códigos QR
  venueSubmission, // Solicitudes de registro de locales
  
  // ===== CONTENIDO SEO ESPECIALIZADO =====
  // Nuevos tipos de contenido para arquitectura SEO
  guide,       // Guías y rutas gastronómicas
  list,        // Listas y rankings
  recipe,      // Recetas tradicionales y modernas
  dishGuide,   // Guías específicas de platos
  news,        // Novedades y tendencias
  offer,       // Ofertas y menús especiales
  
  // ===== CONTENIDO DESTACADO =====
  // Gestión de elementos destacados en homepage
  featuredItem, // Items del carrusel principal
  homepageSection, // Configuración de secciones del homepage
  homepageConfig, // Configuración de homepage
];

// Configuración adicional para validaciones y referencias
export const schemaConfig = {
  // Tipos que pueden ser referenciados
  referenceTypes: ['city', 'category', 'venue', 'guide', 'list', 'recipe', 'dish-guide'],
  
  // Tipos de contenido principal
  contentTypes: ['venue', 'review', 'post', 'guide', 'list', 'recipe', 'dish-guide', 'news', 'offer'],
  
  // Tipos con slug (para URLs)
  slugTypes: ['city', 'category', 'venue', 'review', 'post', 'guide', 'list', 'recipe', 'dish-guide', 'news', 'offer'],
  
  // Tipos con imágenes
  imageTypes: ['city', 'category', 'venue', 'review', 'post', 'guide', 'list', 'recipe', 'dish-guide', 'news', 'offer'],
  
  // Tipos con SEO
  seoTypes: ['city', 'category', 'venue', 'review', 'post', 'guide', 'list', 'recipe', 'dish-guide', 'news', 'offer'],
  
  // Tipos que pueden ser destacados
  featuredTypes: ['category', 'city', 'post', 'guide', 'list', 'recipe', 'news'],
  
  // Tipos con FAQ
  faqTypes: ['review', 'post', 'guide', 'list', 'dish-guide'],
  
  // Tipos con ratings/valoraciones
  ratedTypes: ['review', 'list'],
  
  // Tipos con ubicación geográfica
  geoTypes: ['city', 'venue', 'guide'],
  
  // Tipos con fechas de publicación
  publishedTypes: ['review', 'post', 'guide', 'list', 'recipe', 'dish-guide', 'news', 'offer'],
  
  // Tipos con fechas de expiración
  expiringTypes: ['news', 'offer'],
  
  // Tipos que enlazan a locales
  venueLinkedTypes: ['review', 'guide', 'list', 'dish-guide', 'news', 'offer'],
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
