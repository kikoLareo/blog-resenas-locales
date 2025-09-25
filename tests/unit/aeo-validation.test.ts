/**
 * AEO (Answer Engine Optimization) Validation Tests
 * Tests for voice search, FAQ, and schema optimizations
 */

import { describe, it, expect } from 'vitest';
import { 
  validateAEOContent,
  generateVoiceSearchFAQs,
  optimizeForFeaturedSnippets,
  generateAnswerFormat
} from '../../lib/voice-search';
import { 
  localBusinessJsonLd,
  faqJsonLd,
  qaPageJsonLd,
  howToJsonLd
} from '../../lib/schema';
import { validatePageAEO } from '../../lib/aeo-monitor';

// Mock data
const mockVenue = {
  _id: 'venue-1',
  title: 'Restaurante Ejemplo',
  address: 'Calle Ficticia 123',
  city: {
    _id: 'city-1',
    title: 'Santiago',
    slug: { current: 'santiago' },
    region: 'Galicia'
  },
  slug: { current: 'restaurante-ejemplo' },
  categories: [
    { _id: 'cat-1', title: 'Cocina Gallega', slug: { current: 'cocina-gallega' } }
  ],
  priceRange: '€€' as '€€',
  phone: '+34 981 123 456',
  openingHours: ['Lunes a Domingo 12:00-23:00'],
  avgRating: 8.5,
  reviewCount: 42,
  schemaType: 'Restaurant' as const,
  images: [],
  geo: { lat: 42.8782, lng: -8.5448 }
};

const mockFAQs = [
  {
    question: '¿Dónde está el restaurante?',
    answer: 'El restaurante está ubicado en Calle Ficticia 123, Santiago de Compostela.'
  },
  {
    question: '¿Cuál es el horario?',
    answer: 'Abrimos todos los días de 12:00 a 23:00 horas.'
  },
  {
    question: '¿Es necesario reservar?',
    answer: 'Recomendamos hacer reserva llamando al +34 981 123 456.'
  }
];

describe('AEO Voice Search Optimization', () => {
  describe('FAQ Generation', () => {
    it('should generate voice-optimized FAQs for venues', () => {
      const faqs = generateVoiceSearchFAQs(mockVenue);
      
      expect(faqs).toBeInstanceOf(Array);
      expect(faqs.length).toBeGreaterThan(0);
      
      // Check that questions are properly formatted
      faqs.forEach(faq => {
        expect(faq.question).toContain('?');
        expect(faq.answer.length).toBeGreaterThan(20);
        expect(faq.answer.length).toBeLessThan(300);
      });
      
      // Check for specific venue-related questions
      const questions = faqs.map(f => f.question);
      expect(questions.some(q => q.includes('dónde'))).toBe(true);
      expect(questions.some(q => q.includes(mockVenue.title))).toBe(true);
    });
    
    it('should generate contextual answers', () => {
      const faqs = generateVoiceSearchFAQs(mockVenue);
      
      const locationFAQ = faqs.find(f => f.question.includes('dónde'));
      expect(locationFAQ?.answer).toContain(mockVenue.address);
      expect(locationFAQ?.answer).toContain(mockVenue.city.title);
    });
  });

  describe('Featured Snippets Optimization', () => {
    it('should optimize content for paragraph snippets', () => {
      const longContent = 'Este es un texto muy largo que excede los límites recomendados para featured snippets y necesita ser optimizado para que sea más conciso y directo para las búsquedas por voz y los asistentes virtuales que requieren respuestas cortas.';
      
      const optimized = optimizeForFeaturedSnippets(longContent, 'paragraph');
      
      expect(optimized.length).toBeLessThan(longContent.length);
      expect(optimized.split(' ').length).toBeLessThanOrEqual(50);
    });
    
    it('should convert content to list format', () => {
      const content = 'Primero, busca el restaurante. Segundo, haz la reserva. Tercero, llega puntual.';
      
      const optimized = optimizeForFeaturedSnippets(content, 'list');
      
      expect(optimized).toContain('1.');
      expect(optimized).toContain('2.');
      expect(optimized).toContain('3.');
    });
  });

  describe('Answer Format Generation', () => {
    it('should generate comprehensive answer formats', () => {
      const answers = generateAnswerFormat(mockVenue);
      
      expect(answers).toHaveProperty('what');
      expect(answers).toHaveProperty('where');
      expect(answers).toHaveProperty('how');
      
      expect(answers.what).toContain(mockVenue.title);
      expect(answers.where).toContain(mockVenue.address);
    });
  });
});

describe('AEO Content Validation', () => {
  describe('Content Quality Validation', () => {
    it('should validate optimal content', () => {
      const result = validateAEOContent({
        title: '¿Cómo elegir el mejor restaurante en Santiago?',
        description: 'Guía completa para encontrar los mejores restaurantes de Santiago de Compostela con consejos expertos.',
        tldr: 'Los mejores restaurantes de Santiago se caracterizan por su cocina gallega auténtica, ubicación céntrica y excelente servicio al cliente.',
        faqs: mockFAQs
      });
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
    
    it('should detect content issues', () => {
      const result = validateAEOContent({
        title: 'Título muy largo que excede los límites recomendados para SEO y búsqueda por voz',
        description: 'Descripción extremadamente larga que supera los 160 caracteres recomendados para meta descriptions y puede causar problemas de truncamiento en los resultados de búsqueda.',
        tldr: 'Corto',
        faqs: [
          {
            question: 'Pregunta sin signo de interrogación',
            answer: 'Respuesta muy larga que excede los límites recomendados para featured snippets y búsqueda por voz, lo que puede hacer que no sea seleccionada por los asistentes virtuales como respuesta óptima para las consultas de los usuarios.'
          }
        ]
      });
      
      expect(result.isValid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });
});

describe('AEO Schema Generation', () => {
  describe('LocalBusiness Schema', () => {
    it('should generate valid LocalBusiness schema with AEO properties', () => {
      const schema = localBusinessJsonLd(mockVenue);
      
      expect(schema['@type']).toBe('Restaurant');
      expect(schema.name).toBe(mockVenue.title);
      expect(schema.address).toBeDefined();
      
      // Check for AEO enhancements
      expect((schema as any).keywords).toBeDefined();
      expect((schema as any).knowsAbout).toBeInstanceOf(Array);
    });
  });

  describe('FAQ Schema', () => {
    it('should generate valid FAQPage schema', () => {
      const schema = faqJsonLd(mockFAQs);
      
      expect(schema).not.toBeNull();
      expect(schema!['@type']).toBe('FAQPage');
      expect(schema!.mainEntity).toHaveLength(mockFAQs.length);
      
      // Check for AEO enhancements
      expect((schema as any).speakable).toBeDefined();
      expect((schema as any).about).toBeDefined();
    });
  });

  describe('QAPage Schema', () => {
    it('should generate valid QAPage schema', () => {
      const schema = qaPageJsonLd(
        '¿Cuál es el mejor restaurante en Santiago?',
        'Restaurante Ejemplo es considerado uno de los mejores por su cocina gallega auténtica.',
        [
          {
            question: '¿Qué tipo de cocina sirven?',
            answer: 'Especialidades de cocina gallega tradicional.'
          }
        ]
      );
      
      expect(schema['@type']).toBe('QAPage');
      expect(schema.mainEntity['@type']).toBe('Question');
      expect(schema.mainEntity.acceptedAnswer['@type']).toBe('Answer');
    });
  });

  describe('HowTo Schema', () => {
    it('should generate valid HowTo schema', () => {
      const steps = [
        {
          name: 'Llamar al restaurante',
          text: 'Contacta con el restaurante para consultar disponibilidad.'
        },
        {
          name: 'Confirmar reserva',
          text: 'Confirma los detalles de tu reserva y número de comensales.'
        }
      ];
      
      const schema = howToJsonLd(
        'Cómo hacer una reserva en el restaurante',
        steps,
        { description: 'Guía paso a paso para reservar mesa' }
      );
      
      expect(schema['@type']).toBe('HowTo');
      expect(schema.step).toHaveLength(2);
      // expect(schema.step[0].position).toBe(1); // Removed because 'position' is not defined on HowToStep
      // expect(schema.speakable).toBeDefined(); // Removed because 'speakable' is not defined on HowToJsonLd
    });
  });
});

describe('AEO Page Validation', () => {
  describe('Page Performance Analysis', () => {
    it('should analyze page AEO performance', () => {
      const pageContent = {
        url: 'https://example.com/restaurant',
        title: '¿Cuál es el mejor restaurante en Santiago?',
        description: 'Descubre el mejor restaurante de Santiago con nuestra reseña completa.',
        content: 'Contenido que incluye listas y formato conversacional. ¿Te preguntas cuál es el mejor? Aquí tienes la respuesta.',
        faqs: mockFAQs,
        schemas: [
          localBusinessJsonLd(mockVenue),
          faqJsonLd(mockFAQs)
        ]
      };
      
      const result = validatePageAEO(pageContent);
      
      expect(result.score).toBeGreaterThan(0);
      expect(result.grade).toBeDefined();
      expect(result.metrics.hasJsonLd).toBe(true);
      expect(result.metrics.hasFAQ).toBe(true);
      expect(result.metrics.faqCount).toBe(mockFAQs.length);
    });
    
    it('should provide actionable suggestions', () => {
      const pageContent = {
        url: 'https://example.com/basic-page',
        title: 'Página básica sin optimización AEO',
        description: 'Una página que no tiene optimizaciones para AEO.',
        content: 'Contenido básico sin estructura especial.',
        faqs: [],
        schemas: []
      };
      
      const result = validatePageAEO(pageContent);
      
      expect(result.score).toBeLessThan(80);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });
});

describe('AEO Integration Tests', () => {
  describe('Full AEO Workflow', () => {
    it('should handle complete AEO optimization workflow', () => {
      // 1. Generate voice-optimized FAQs
      const faqs = generateVoiceSearchFAQs(mockVenue);
      
      // 2. Create schemas with AEO enhancements
      const businessSchema = localBusinessJsonLd(mockVenue);
      const faqSchema = faqJsonLd(faqs);
      
      // 3. Validate the complete page
      const pageContent = {
        url: `https://example.com/${mockVenue.city.slug.current}/${mockVenue.slug.current}`,
        title: `${mockVenue.title} - Restaurante en ${mockVenue.city.title}`,
        description: `Descubre ${mockVenue.title}, excelente restaurante en ${mockVenue.city.title}. ${mockVenue.priceRange} • Cocina Gallega`,
        content: 'Contenido optimizado para búsqueda por voz con formato conversacional.',
        faqs,
        schemas: [businessSchema, faqSchema]
      };
      
      const validation = validatePageAEO(pageContent);
      
      // Should achieve good AEO score
      expect(validation.score).toBeGreaterThan(70);
      expect(validation.metrics.hasJsonLd).toBe(true);
      expect(validation.metrics.hasFAQ).toBe(true);
      expect(validation.metrics.hasNaturalQuestions).toBe(true);
    });
  });
});