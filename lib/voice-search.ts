import { Venue, Review, City, Category } from './types';
import { SITE_CONFIG } from './constants';

/**
 * Voice Search and Answer Engine Optimization Utilities
 * Optimizes content for conversational queries and featured snippets
 */

// Natural language patterns for voice search
export const VOICE_SEARCH_PATTERNS = {
  // Question patterns
  questions: [
    'dónde puedo',
    'cuál es el mejor',
    'qué restaurantes',
    'cómo llegar',
    'está abierto',
    'necesito reserva',
    'cuánto cuesta',
    'qué tal está',
    'es bueno',
    'hay cerca',
  ],
  
  // Local search patterns
  local: [
    'cerca de mí',
    'en mi zona',
    'aquí cerca',
    'por aquí',
    'en esta área',
    'alrededor',
  ],
  
  // Intent patterns
  intents: [
    'quiero comer',
    'busco un restaurante',
    'vamos a cenar',
    'dónde comemos',
    'algo para comer',
    'sitio para comer',
  ],
  
  // Time-based patterns
  temporal: [
    'ahora mismo',
    'esta noche',
    'mañana',
    'el fin de semana',
    'para cenar',
    'para almorzar',
  ],
};

/**
 * Generate conversational content for venue descriptions
 */
export function generateConversationalDescription(venue: Venue): string {
  const priceText = getPriceText(venue.priceRange);
  const categoryText = venue.categories.map(c => c.title.toLowerCase()).join(' y ');
  
  return `${venue.title} es un ${categoryText} ${priceText} ubicado en ${venue.address}, ${venue.city.title}. ` +
         `Es perfecto si buscas ${categoryText} en ${venue.city.title} con una excelente relación calidad-precio. ` +
         `${venue.description || ''} ` +
         `Puedes llegar fácilmente en transporte público o en coche.`;
}

/**
 * Generate voice search optimized title for venues
 */
export function generateVoiceSearchTitle(venue: Venue): string {
  const categoryText = venue.categories[0]?.title || 'restaurante';
  return `${venue.title} - ${categoryText} en ${venue.city.title} | Reseña completa`;
}

/**
 * Generate voice search optimized meta description
 */
export function generateVoiceSearchDescription(venue: Venue): string {
  const categoryText = venue.categories.map(c => c.title.toLowerCase()).join(' y ');
  const priceText = getPriceText(venue.priceRange);
  
  return `¿Buscas un buen ${categoryText} en ${venue.city.title}? ` +
         `${venue.title} es ${priceText} y está ubicado en ${venue.address}. ` +
         `Descubre horarios, precios, cómo llegar y reseñas honestas. ` +
         `${venue.phone ? 'Teléfono para reservas incluido.' : ''}`.slice(0, 160);
}

/**
 * Generate conversational review summary
 */
export function generateConversationalReviewSummary(review: Review, venue: Venue): string {
  const avgRating = (
    review.ratings.food + 
    review.ratings.service + 
    review.ratings.ambience + 
    review.ratings.value
  ) / 4;
  
  const ratingText = avgRating >= 8 ? 'excelente' : avgRating >= 6 ? 'muy bueno' : avgRating >= 4 ? 'bueno' : 'regular';
  
  return `En resumen, ${venue.title} está ${ratingText} según nuestra experiencia. ` +
         `La comida merece un ${review.ratings.food}/10, el servicio un ${review.ratings.service}/10, ` +
         `y el ambiente un ${review.ratings.ambience}/10. ` +
         `${review.tldr} ` +
         `${review.avgTicket ? `El ticket medio es de aproximadamente ${review.avgTicket}€ por persona.` : ''}`;
}

/**
 * Generate featured snippet optimized content
 */
export function generateFeaturedSnippetContent(venue: Venue): {
  question: string;
  answer: string;
  listItems?: string[];
} {
  const categoryText = venue.categories[0]?.title.toLowerCase() || 'restaurante';
  
  return {
    question: `¿Qué tal está ${venue.title} en ${venue.city.title}?`,
    answer: `${venue.title} es un ${categoryText} ${getPriceText(venue.priceRange)} en ${venue.city.title} ` +
            `${venue.avgRating ? `con una puntuación media de ${venue.avgRating}/10` : ''}. ` +
            `${venue.description || ''} ` +
            `Está ubicado en ${venue.address}${venue.phone ? ` y puedes reservar llamando al ${venue.phone}` : ''}.`,
    listItems: [
      `📍 Dirección: ${venue.address}, ${venue.city.title}`,
      `💰 Precio: ${venue.priceRange}`,
      `🍽️ Tipo: ${venue.categories.map(c => c.title).join(', ')}`,
      ...(venue.phone ? [`📞 Teléfono: ${venue.phone}`] : []),
      ...(venue.avgRating ? [`⭐ Puntuación: ${venue.avgRating}/10`] : []),
    ],
  };
}

/**
 * Generate People Also Ask (PAA) questions
 */
export function generatePAAQuestions(venue: Venue): Array<{question: string; answer: string}> {
  return [
    {
      question: `¿Está abierto ${venue.title} ahora?`,
      answer: `Los horarios de ${venue.title} son ${venue.openingHours?.join(', ') || 'consulta llamando al restaurante'}. Te recomendamos llamar antes de tu visita para confirmar horarios actuales.`,
    },
    {
      question: `¿Necesito reserva para ${venue.title}?`,
      answer: `Es recomendable hacer reserva en ${venue.title}, especialmente los fines de semana. ` +
              `${venue.phone ? `Puedes llamar al ${venue.phone} para reservar.` : 'Consulta su web o llama directamente.'}`,
    },
    {
      question: `¿Cómo llegar a ${venue.title}?`,
      answer: `${venue.title} está ubicado en ${venue.address}, ${venue.city.title}. ` +
              `Puedes llegar en transporte público o en coche. Consulta Google Maps para las mejores rutas desde tu ubicación.`,
    },
    {
      question: `¿Cuánto cuesta comer en ${venue.title}?`,
      answer: `${venue.title} tiene un rango de precios ${venue.priceRange}, lo que significa ${getPriceRangeExplanation(venue.priceRange)}. ` +
              `Los precios pueden variar según el menú y las bebidas que elijas.`,
    },
  ];
}

/**
 * Generate "near me" optimized content for cities
 */
export function generateNearMeContent(city: City, venueCount: number): string {
  return `¿Buscas restaurantes cerca de ti en ${city.title}? ` +
         `Tenemos ${venueCount} restaurantes reseñados en ${city.title} ` +
         `con información completa sobre ubicación, horarios, precios y cómo llegar. ` +
         `Todos incluyen reseñas honestas y puntuaciones detalladas para que puedas elegir el mejor según tus gustos y presupuesto.`;
}

/**
 * Generate local search keywords
 */
export function generateLocalSearchKeywords(venue: Venue): string[] {
  const keywords = [
    // Primary keywords
    venue.title.toLowerCase(),
    `${venue.title} ${venue.city.title}`.toLowerCase(),
    
    // Category + location
    ...venue.categories.map(cat => `${cat.title.toLowerCase()} ${venue.city.title.toLowerCase()}`),
    
    // Voice search patterns
    `restaurantes cerca de ${venue.address.toLowerCase()}`,
    `dónde comer en ${venue.city.title.toLowerCase()}`,
    `${venue.categories[0]?.title.toLowerCase()} cerca de mí`,
    
    // Price-based queries
    `restaurantes ${venue.priceRange} ${venue.city.title.toLowerCase()}`,
    `comer barato ${venue.city.title.toLowerCase()}`,
    
    // Intent-based
    `reservar mesa ${venue.title.toLowerCase()}`,
    `horarios ${venue.title.toLowerCase()}`,
    `teléfono ${venue.title.toLowerCase()}`,
    
    // Local variations
    ...(venue.city.region ? [
      `restaurantes ${venue.city.region.toLowerCase()}`,
      `${venue.categories[0]?.title.toLowerCase()} ${venue.city.region.toLowerCase()}`,
    ] : []),
  ];
  
  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Generate long-tail conversational keywords
 */
export function generateConversationalKeywords(venue: Venue): string[] {
  const categoryText = venue.categories[0]?.title.toLowerCase() || 'restaurante';
  
  return [
    `¿cuál es el mejor ${categoryText} en ${venue.city.title.toLowerCase()}?`,
    `¿dónde puedo comer bien en ${venue.city.title.toLowerCase()}?`,
    `¿qué tal está ${venue.title.toLowerCase()}?`,
    `¿es bueno ${venue.title.toLowerCase()}?`,
    `¿merece la pena ${venue.title.toLowerCase()}?`,
    `¿cómo llegar a ${venue.title.toLowerCase()}?`,
    `¿está abierto ${venue.title.toLowerCase()}?`,
    `¿necesito reserva en ${venue.title.toLowerCase()}?`,
    `¿cuánto cuesta comer en ${venue.title.toLowerCase()}?`,
    `¿qué comer en ${venue.title.toLowerCase()}?`,
  ];
}

/**
 * Optimize content for Google's featured snippets
 */
export function optimizeForFeaturedSnippets(content: string): string {
  return content
    // Add clear question-answer patterns
    .replace(/^(.+\?)/, '<h3>$1</h3>')
    // Structure lists properly
    .replace(/(\d+\.\s)/g, '\n$1')
    // Add semantic HTML for better parsing
    .replace(/\b(horarios?|precio|dirección|teléfono|reserva)\b:?\s*/gi, '<strong>$1:</strong> ')
    // Ensure proper paragraph structure
    .replace(/\n\n+/g, '\n\n');
}

/**
 * Generate mobile-first voice search content
 */
export function generateMobileVoiceContent(venue: Venue): {
  quickAnswer: string;
  actionableInfo: string[];
} {
  return {
    quickAnswer: `${venue.title} es un ${venue.categories[0]?.title.toLowerCase() || 'restaurante'} ` +
                `${getPriceText(venue.priceRange)} en ${venue.city.title}. ` +
                `${venue.avgRating ? `Puntuación: ${venue.avgRating}/10. ` : ''}` +
                `Dirección: ${venue.address}.`,
    actionableInfo: [
      ...(venue.phone ? [`📞 Llamar: ${venue.phone}`] : []),
      `🗺️ Cómo llegar: ${venue.address}, ${venue.city.title}`,
      ...(venue.openingHours ? [`🕒 Horarios: ${venue.openingHours[0]}`] : []),
      `💰 Precios: ${getPriceRangeExplanation(venue.priceRange)}`,
      ...(venue.website ? [`🌐 Web: ${venue.website}`] : []),
    ],
  };
}

/**
 * Helper functions
 */
function getPriceText(priceRange: string): string {
  const priceMap = {
    '€': 'económico',
    '€€': 'de precio moderado',
    '€€€': 'de precio alto',
    '€€€€': 'de alta gama',
  };
  return priceMap[priceRange as keyof typeof priceMap] || 'de precio moderado';
}

function getPriceRangeExplanation(priceRange: string): string {
  const explanations = {
    '€': 'menos de 20€ por persona',
    '€€': 'entre 20-40€ por persona',
    '€€€': 'entre 40-80€ por persona',
    '€€€€': 'más de 80€ por persona',
  };
  return explanations[priceRange as keyof typeof explanations] || 'precio variable';
}

/**
 * Generate structured data for voice assistants
 */
export function generateVoiceAssistantData(venue: Venue) {
  return {
    name: venue.title,
    address: `${venue.address}, ${venue.city.title}`,
    phone: venue.phone,
    description: generateConversationalDescription(venue),
    hours: venue.openingHours,
    priceRange: getPriceRangeExplanation(venue.priceRange),
    cuisine: venue.categories.map(c => c.title).join(', '),
    rating: venue.avgRating,
    quickFacts: generateMobileVoiceContent(venue).actionableInfo,
    voiceQuestions: generatePAAQuestions(venue),
  };
}