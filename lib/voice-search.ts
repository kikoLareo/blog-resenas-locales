/**
 * Voice Search & Answer Engine Optimization (AEO) Utilities
 * Optimizes content for voice assistants and featured snippets
 */

import { Venue, Review, Post, FAQ } from './types';

// Common voice search question patterns
export const VOICE_SEARCH_PATTERNS = {
  // Location-based queries
  location: [
    '¿Dónde está {venue}?',
    '¿Cómo llegar a {venue}?',
    '¿Cuál es la dirección de {venue}?',
    'Ubicación de {venue}',
  ],
  
  // Hours and scheduling
  hours: [
    '¿A qué hora abre {venue}?',
    '¿A qué hora cierra {venue}?',
    '¿Cuál es el horario de {venue}?',
    '¿Está abierto {venue} ahora?',
  ],
  
  // Pricing and costs
  pricing: [
    '¿Cuánto cuesta comer en {venue}?',
    '¿Cuál es el precio promedio en {venue}?',
    '¿Es caro {venue}?',
    'Precios de {venue}',
  ],
  
  // Quality and ratings
  quality: [
    '¿Es bueno {venue}?',
    '¿Qué tal está {venue}?',
    '¿Vale la pena {venue}?',
    'Opiniones de {venue}',
  ],
  
  // Menu and food
  food: [
    '¿Qué sirven en {venue}?',
    '¿Cuál es la especialidad de {venue}?',
    '¿Qué tipo de comida hay en {venue}?',
    'Menú de {venue}',
  ],
  
  // Reservations and contact
  contact: [
    '¿Cómo reservar en {venue}?',
    '¿Cuál es el teléfono de {venue}?',
    '¿Acepta reservas {venue}?',
    'Contacto de {venue}',
  ],
} as const;

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
 * Optimize content for featured snippets (position zero)
 */
export function optimizeForFeaturedSnippets(content: string, type: 'paragraph' | 'list' | 'table' = 'paragraph'): string {
  switch (type) {
    case 'paragraph':
      // Keep it under 50 words, start with a direct answer
      const words = content.split(' ');
      if (words.length > 50) {
        return words.slice(0, 50).join(' ') + '...';
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
    const wordCount = content.tldr.split(' ').length;
    if (wordCount < 20 || wordCount > 50) {
      issues.push(`TL;DR fuera del rango óptimo (${wordCount} palabras, recomendado: 20-50)`);
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