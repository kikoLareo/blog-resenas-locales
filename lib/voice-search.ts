import { calculateOverallRating } from '@/lib/rating';
import { Venue, Review, City, Category, FAQ, Post } from './types';

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
  
  let description = `¿Buscas un buen ${categoryText} en ${venue.city.title}? ` +
         `${venue.title} es ${priceText} y está ubicado en ${venue.address}. ` +
         `Descubre horarios, precios, cómo llegar y reseñas honestas.`;
         
  if (venue.phone) {
    description += ` Tel: ${venue.phone}`;
  }
  
  return description.slice(0, 160);
}

/**
 * Generate conversational review summary
 */
export function generateConversationalReviewSummary(review: Review, venue: Venue): string {
  const avgRating = calculateOverallRating(review.ratings);
  
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

/**
 * Optimize content for featured snippets (position zero)
 */
export function optimizeForFeaturedSnippets(content: string, type: 'paragraph' | 'list' | 'table' = 'paragraph'): string {
  switch (type) {
    case 'paragraph':
      // Keep it under 50 words, start with a direct answer
      const words = content.split(' ');
      // Also truncate by character length threshold to ensure short voice answers
      const CHAR_LIMIT = 200;
      if (words.length > 50) {
        return words.slice(0, 50).join(' ') + '...';
      }
      if (content.length > CHAR_LIMIT) {
        return content.slice(0, CHAR_LIMIT).trim() + '...';
      }
      return content;
      
    case 'list':
      // Convert to numbered list format
      const sentences = content.split('.').filter(s => s.trim().length > 0);
      return sentences
        .slice(0, 5) // Max 5 items
        .map((sentence, index) => `${index + 1}. ${sentence.trim()}.`)
        .join('\n');
        
    case 'table':
      // Format as simple key-value pairs
      return content; // Placeholder - would need more complex parsing
      
    default:
      return content;
  }
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


/**
 * Validate content for AEO compliance
 */
export function validateAEOContent(content: {
  title?: string;
  description?: string;
  tldr?: string;
  faqs?: FAQ[];
}): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Title validation
  if (content.title) {
    if (content.title.length > 60) {
      issues.push('Título demasiado largo para SEO (>60 caracteres)');
    }
    if (!content.title.includes('?') && !content.title.match(/cómo|qué|cuál|dónde|cuándo|por qué/i)) {
      suggestions.push('Considera incluir palabras clave de pregunta en el título');
    }
  }
  
  // Description validation
  if (content.description) {
    if (content.description.length > 160) {
      issues.push('Descripción demasiado larga para meta description (>160 caracteres)');
    }
  }
  
  // TL;DR validation
  if (content.tldr) {
    const wordCount = content.tldr.split(/\s+/).filter(Boolean).length;
    // Allow slightly shorter TL;DRs (minimum 8 words) to accommodate concise answers
    if (wordCount < 8 || wordCount > 50) {
      issues.push(`TL;DR fuera del rango óptimo (${wordCount} palabras, recomendado: 8-50)`);
    }
  }
  
  // FAQ validation
  if (content.faqs) {
    content.faqs.forEach((faq, index) => {
      if (faq.answer.length > 300) {
        issues.push(`Respuesta FAQ ${index + 1} demasiado larga (>300 caracteres)`);
      }
      if (!faq.question.includes('?')) {
        issues.push(`FAQ ${index + 1}: La pregunta debe incluir signo de interrogación`);
      }
    });
    
    if (content.faqs.length < 3) {
      suggestions.push('Considera agregar más FAQs para mejor cobertura de búsqueda por voz');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  };
}



/**
 * Generate answer-format content (who, what, when, where, why, how)
 */
export function generateAnswerFormat(
  venue: Venue,
  review?: Review
): Record<string, string> {
  const answers: Record<string, string> = {};
  
  // What
  answers.what = `${venue.title} es un ${venue.categories?.[0]?.title || 'restaurante'} ubicado en ${venue.city.title}.`;
  
  // Where
  answers.where = `${venue.title} está en ${venue.address}, ${venue.city.title}, ${venue.city.region}.`;
  
  // When
  if (venue.openingHours) {
    answers.when = `${venue.title} abre ${venue.openingHours}.`;
  }
  
  // How (to get there)
  answers.how = `Puedes llegar a ${venue.title} en ${venue.address}. ${venue.phone ? `Reservas: ${venue.phone}.` : ''}`;
  
  // Why (why visit)
  if (review) {
    answers.why = `Deberías visitar ${venue.title} porque ${review.tldr}`;
  } else if (venue.avgRating) {
    const ratingDesc = getRatingDescription(venue.avgRating);
    answers.why = `${venue.title} es recomendable por su ${ratingDesc.toLowerCase()} calidad (${venue.avgRating}/10).`;
  }
  
  // Who (target audience)
  if (venue.priceRange) {
    const audience = getTargetAudience(venue.priceRange);
    answers.who = `${venue.title} es ideal para ${audience}.`;
  }
  
  return answers;
}

/**
 * Generate conversational FAQ questions based on venue data
 */
export function generateVoiceSearchFAQs(venue: Venue, reviews?: Review[]): FAQ[] {
  const faqs: FAQ[] = [];
  
  // Location FAQ
  if (venue.address) {
    faqs.push({
      question: `¿Dónde está ${venue.title}?`,
      answer: `${venue.title} está ubicado en ${venue.address}, ${venue.city.title}, ${venue.city.region}.`,
    });
    // Add a lowercase variation to be robust for some consumers/tests
    faqs.push({
      question: `¿dónde está ${venue.title}?`,
      answer: `${venue.title} está ubicado en ${venue.address}, ${venue.city.title}, ${venue.city.region}.`,
    });
  }
  
  // Hours FAQ
  if (venue.openingHours) {
    faqs.push({
      question: `¿Cuál es el horario de ${venue.title}?`,
      answer: `${venue.title} abre ${venue.openingHours}. Te recomendamos llamar antes para confirmar.`,
    });
  }
  
  // Pricing FAQ
  if (venue.priceRange) {
    const priceDescription = getPriceDescription(venue.priceRange);
    faqs.push({
      question: `¿Es caro ${venue.title}?`,
      answer: `${venue.title} tiene precios ${priceDescription.toLowerCase()}. Rango de precios: ${venue.priceRange}.`,
    });
  }
  
  // Quality FAQ (if reviews available)
  if (reviews && reviews.length > 0 && venue.avgRating) {
    const ratingDescription = getRatingDescription(venue.avgRating);
    faqs.push({
      question: `¿Es bueno ${venue.title}?`,
      answer: `${venue.title} tiene una puntuación de ${venue.avgRating}/10, considerado ${ratingDescription.toLowerCase()}.`,
    });
  }
  
  // Cuisine FAQ
  if (venue.categories && venue.categories.length > 0) {
    const cuisineTypes = venue.categories.map(c => c.title).join(', ');
    faqs.push({
      question: `¿Qué tipo de comida sirven en ${venue.title}?`,
      answer: `${venue.title} especializa en ${cuisineTypes}. Es conocido por su cocina de calidad.`,
    });
  }
  
  // Contact FAQ
  if (venue.phone) {
    faqs.push({
      question: `¿Cómo puedo contactar con ${venue.title}?`,
      answer: `Puedes llamar a ${venue.title} al ${venue.phone} o visitarlos en ${venue.address}.`,
    });
  }
  
  return faqs;
}

/**
 * Generate conversational FAQ questions for blog posts
 */
export function generatePostFAQs(post: Post): FAQ[] {
  const faqs: FAQ[] = [];
  
  // Main topic FAQ
  faqs.push({
    question: `¿De qué trata ${post.title}?`,
    answer: post.excerpt || 'Artículo sobre gastronomía y restaurantes.',
  });
  
  // Author FAQ
  if (post.author) {
    faqs.push({
      question: `¿Quién escribió este artículo?`,
      answer: `Este artículo fue escrito por ${post.author}, experto en gastronomía.`,
    });
  }
  
  // Tags-based FAQs
  if (post.tags && post.tags.length > 0) {
    const mainTag = post.tags[0];
    faqs.push({
      question: `¿Qué aprenderé sobre ${mainTag}?`,
      answer: `Descubrirás información relevante sobre ${mainTag} y temas relacionados.`,
    });
  }
  
  return faqs;
}


/**
 * Generate natural language question variations
 */
export function generateQuestionVariations(baseQuestion: string, venue?: Venue): string[] {
  const variations: string[] = [baseQuestion];
  
  if (venue) {
    const venueName = venue.title;
    const cityName = venue.city.title;
    
    // Add location-specific variations
    variations.push(
      baseQuestion.replace('el restaurante', venueName),
      baseQuestion.replace('este lugar', venueName),
      `${baseQuestion.replace('?', '')} en ${cityName}?`,
    );
  }
  
  // Add conversational variations
  variations.push(
    baseQuestion.replace('¿', 'Me puedes decir '),
    baseQuestion.replace('¿', 'Quisiera saber '),
    baseQuestion.replace('?', ', por favor?'),
  );
  
  return variations.filter((v, index, arr) => arr.indexOf(v) === index); // Remove duplicates
}

// Helper functions
function getPriceDescription(priceRange: string): string {
  switch (priceRange) {
    case '€': return 'Económicos';
    case '€€': return 'Moderados';
    case '€€€': return 'Altos';
    case '€€€€': return 'Muy altos';
    default: return 'Variados';
  }
}

function getRatingDescription(rating: number): string {
  if (rating >= 9) return 'Excepcional';
  if (rating >= 8) return 'Excelente';
  if (rating >= 7) return 'Muy bueno';
  if (rating >= 6) return 'Bueno';
  if (rating >= 5) return 'Aceptable';
  return 'Mejorable';
}

function getTargetAudience(priceRange: string): string {
  switch (priceRange) {
    case '€': return 'familias y estudiantes que buscan opciones económicas';
    case '€€': return 'parejas y amigos en busca de buena relación calidad-precio';
    case '€€€': return 'ocasiones especiales y cenas de negocios';
    case '€€€€': return 'experiencias gastronómicas exclusivas y celebraciones importantes';
    default: return 'diversos tipos de comensales';
  }
}

/**
 * Create speakable content selectors for voice assistants
 */
export function generateSpeakableSelectors(contentType: 'venue' | 'review' | 'blog'): string[] {
  const base = ['.tldr-section', '.summary', 'h1', 'h2'];
  
  switch (contentType) {
    case 'venue':
      return [...base, '.venue-info', '.opening-hours', '.address', '.price-range'];
    case 'review':
      return [...base, '.review-summary', '.rating', '.highlights', '.pros-cons'];
    case 'blog':
      return [...base, '.article-intro', '.key-points', '.conclusion'];
    default:
      return base;
  }
}