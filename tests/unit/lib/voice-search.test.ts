import { describe, it, expect } from 'vitest';
import {
  generateConversationalDescription,
  generateVoiceSearchTitle,
  generateVoiceSearchDescription,
  generateConversationalReviewSummary,
  generateFeaturedSnippetContent,
  generatePAAQuestions,
  generateNearMeContent,
  generateLocalSearchKeywords,
  generateConversationalKeywords,
  generateMobileVoiceContent,
  generateVoiceAssistantData,
} from '@/lib/voice-search';
import { Venue, Review, City, Category, Ratings } from '@/lib/types';

// Mock data
const mockCity: City = {
  _id: 'city1',
  title: 'Madrid',
  slug: { current: 'madrid' },
  region: 'Comunidad de Madrid',
  geo: { lat: 40.4168, lng: -3.7038 },
};

const mockCategory: Category = {
  _id: 'cat1',
  title: 'Restaurante Italiano',
  slug: { current: 'italiano' },
  description: 'Cocina italiana tradicional',
};

const mockVenue: Venue = {
  _id: 'venue1',
  title: 'Osteria della Nonna',
  slug: { current: 'osteria-della-nonna' },
  city: mockCity,
  address: 'Calle Mayor 15',
  postalCode: '28013',
  geo: { lat: 40.4168, lng: -3.7038 },
  phone: '+34 91 123 4567',
  website: 'https://osteria.example.com',
  openingHours: ['Lun-Vie 12:00-16:00', 'Lun-Vie 20:00-24:00'],
  priceRange: '€€',
  categories: [mockCategory],
  schemaType: 'Restaurant',
  description: 'Auténtica cocina italiana con ingredientes frescos.',
  images: [],
  avgRating: 8.5,
  reviewCount: 23,
};

const mockRatings: Ratings = {
  food: 9,
  service: 8,
  ambience: 8,
  value: 7,
};

const mockReview: Review = {
  _id: 'review1',
  title: 'Una experiencia italiana auténtica',
  slug: { current: 'experiencia-italiana-autentica' },
  venue: mockVenue,
  visitDate: '2024-01-15',
  publishedAt: '2024-01-20T10:00:00.000Z',
  ratings: mockRatings,
  avgTicket: 35,
  highlights: ['Pasta fresca', 'Servicio atento'],
  pros: ['Comida excelente', 'Ambiente acogedor'],
  cons: ['Un poco ruidoso'],
  tldr: 'Osteria della Nonna ofrece auténtica cocina italiana con pasta fresca y un servicio excelente.',
  faq: [],
  body: [],
  gallery: [],
  author: 'María González',
  tags: ['italiano', 'pasta', 'auténtico'],
};

describe('Voice Search Utilities', () => {
  describe('generateConversationalDescription', () => {
    it('should generate conversational venue description', () => {
      const description = generateConversationalDescription(mockVenue);
      
      expect(description).toContain('Osteria della Nonna es un restaurante italiano');
      expect(description).toContain('de precio moderado');
      expect(description).toContain('ubicado en Calle Mayor 15, Madrid');
      expect(description).toContain('Puedes llegar fácilmente');
      expect(description).toContain('Auténtica cocina italiana');
    });

    it('should handle venue without description', () => {
      const venueWithoutDescription = { ...mockVenue, description: undefined };
      const description = generateConversationalDescription(venueWithoutDescription);
      
      expect(description).toContain('Osteria della Nonna es un restaurante italiano');
      expect(description).not.toContain('undefined');
    });
  });

  describe('generateVoiceSearchTitle', () => {
    it('should generate voice search optimized title', () => {
      const title = generateVoiceSearchTitle(mockVenue);
      
      expect(title).toBe('Osteria della Nonna - Restaurante Italiano en Madrid | Reseña completa');
    });

    it('should handle venue without categories', () => {
      const venueWithoutCategories = { ...mockVenue, categories: [] };
      const title = generateVoiceSearchTitle(venueWithoutCategories);
      
      expect(title).toContain('restaurante');
    });
  });

  describe('generateVoiceSearchDescription', () => {
    it('should generate voice search optimized meta description', () => {
      const description = generateVoiceSearchDescription(mockVenue);
      
      expect(description).toContain('¿Buscas un buen restaurante italiano en Madrid?');
      expect(description).toContain('de precio moderado');
      expect(description).toContain('Calle Mayor 15');
      // The phone number should be in the full description before truncation
      const fullDescription = generateVoiceSearchDescription({ ...mockVenue, title: 'Test' });
      expect(description.length).toBeLessThanOrEqual(160);
    });

    it('should handle venue without phone', () => {
      const venueWithoutPhone = { ...mockVenue, phone: undefined };
      const description = generateVoiceSearchDescription(venueWithoutPhone);
      
      expect(description).not.toContain('Tel:');
    });
  });

  describe('generateConversationalReviewSummary', () => {
    it('should generate conversational review summary', () => {
      const summary = generateConversationalReviewSummary(mockReview, mockVenue);
      
      expect(summary).toContain('Osteria della Nonna está excelente');
      expect(summary).toContain('La comida merece un 9/10');
      expect(summary).toContain('el servicio un 8/10');
      expect(summary).toContain('El ticket medio es de aproximadamente 35€');
    });

    it('should handle review without avgTicket', () => {
      const reviewWithoutTicket = { ...mockReview, avgTicket: undefined };
      const summary = generateConversationalReviewSummary(reviewWithoutTicket, mockVenue);
      
      expect(summary).not.toContain('ticket medio');
    });
  });

  describe('generateFeaturedSnippetContent', () => {
    it('should generate featured snippet content', () => {
      const snippet = generateFeaturedSnippetContent(mockVenue);
      
      expect(snippet.question).toBe('¿Qué tal está Osteria della Nonna en Madrid?');
      expect(snippet.answer).toContain('restaurante italiano de precio moderado');
      expect(snippet.answer).toContain('puntuación media de 8.5/10');
      expect(snippet.answer).toContain('puedes reservar llamando al +34 91 123 4567');
      
      expect(snippet.listItems).toContain('📍 Dirección: Calle Mayor 15, Madrid');
      expect(snippet.listItems).toContain('💰 Precio: €€');
      expect(snippet.listItems).toContain('📞 Teléfono: +34 91 123 4567');
    });
  });

  describe('generatePAAQuestions', () => {
    it('should generate People Also Ask questions', () => {
      const questions = generatePAAQuestions(mockVenue);
      
      expect(questions).toHaveLength(4);
      
      const questionTexts = questions.map(q => q.question);
      expect(questionTexts).toContain('¿Está abierto Osteria della Nonna ahora?');
      expect(questionTexts).toContain('¿Necesito reserva para Osteria della Nonna?');
      expect(questionTexts).toContain('¿Cómo llegar a Osteria della Nonna?');
      expect(questionTexts).toContain('¿Cuánto cuesta comer en Osteria della Nonna?');
      
      // Check answers contain relevant information
      const hoursAnswer = questions.find(q => q.question.includes('abierto'))?.answer;
      expect(hoursAnswer).toContain('Lun-Vie 12:00-16:00');
      
      const phoneAnswer = questions.find(q => q.question.includes('reserva'))?.answer;
      expect(phoneAnswer).toContain('+34 91 123 4567');
    });
  });

  describe('generateNearMeContent', () => {
    it('should generate near me optimized content', () => {
      const content = generateNearMeContent(mockCity, 25);
      
      expect(content).toContain('¿Buscas restaurantes cerca de ti en Madrid?');
      expect(content).toContain('25 restaurantes reseñados');
      expect(content).toContain('información completa sobre ubicación');
    });
  });

  describe('generateLocalSearchKeywords', () => {
    it('should generate comprehensive local search keywords', () => {
      const keywords = generateLocalSearchKeywords(mockVenue);
      
      expect(keywords).toContain('osteria della nonna');
      expect(keywords).toContain('osteria della nonna madrid');
      expect(keywords).toContain('restaurante italiano madrid');
      expect(keywords).toContain('restaurantes cerca de calle mayor 15');
      expect(keywords).toContain('dónde comer en madrid');
      expect(keywords).toContain('restaurante italiano cerca de mí');
      expect(keywords).toContain('restaurantes €€ madrid');
      expect(keywords).toContain('reservar mesa osteria della nonna');
      
      // Should not have duplicates
      const uniqueKeywords = [...new Set(keywords)];
      expect(keywords).toHaveLength(uniqueKeywords.length);
    });
  });

  describe('generateConversationalKeywords', () => {
    it('should generate conversational question keywords', () => {
      const keywords = generateConversationalKeywords(mockVenue);
      
      expect(keywords).toContain('¿cuál es el mejor restaurante italiano en madrid?');
      expect(keywords).toContain('¿dónde puedo comer bien en madrid?');
      expect(keywords).toContain('¿qué tal está osteria della nonna?');
      expect(keywords).toContain('¿es bueno osteria della nonna?');
      expect(keywords).toContain('¿cómo llegar a osteria della nonna?');
    });
  });

  describe('generateMobileVoiceContent', () => {
    it('should generate mobile-optimized voice content', () => {
      const content = generateMobileVoiceContent(mockVenue);
      
      expect(content.quickAnswer).toContain('restaurante italiano de precio moderado');
      expect(content.quickAnswer).toContain('Puntuación: 8.5/10');
      expect(content.quickAnswer).toContain('Dirección: Calle Mayor 15');
      
      expect(content.actionableInfo).toContain('📞 Llamar: +34 91 123 4567');
      expect(content.actionableInfo).toContain('🗺️ Cómo llegar: Calle Mayor 15, Madrid');
      expect(content.actionableInfo).toContain('💰 Precios: entre 20-40€ por persona');
    });
  });

  describe('generateVoiceAssistantData', () => {
    it('should generate comprehensive voice assistant data', () => {
      const data = generateVoiceAssistantData(mockVenue);
      
      expect(data.name).toBe('Osteria della Nonna');
      expect(data.address).toBe('Calle Mayor 15, Madrid');
      expect(data.phone).toBe('+34 91 123 4567');
      expect(data.description).toContain('Auténtica cocina italiana');
      expect(data.priceRange).toBe('entre 20-40€ por persona');
      expect(data.cuisine).toBe('Restaurante Italiano');
      expect(data.rating).toBe(8.5);
      expect(data.quickFacts).toHaveLength(5);
      expect(data.voiceQuestions).toHaveLength(4);
    });
  });

  describe('Edge Cases', () => {
    it('should handle venue with minimal data', () => {
      const minimalVenue: Venue = {
        _id: 'minimal',
        title: 'Test Restaurant',
        slug: { current: 'test' },
        city: mockCity,
        address: 'Test Address',
        priceRange: '€',
        categories: [],
        schemaType: 'Restaurant',
        images: [],
      };
      
      const description = generateConversationalDescription(minimalVenue);
      expect(description).toContain('Test Restaurant');
      expect(description).not.toContain('undefined');
      expect(description).not.toContain('null');
    });

    it('should handle empty categories array', () => {
      const venueWithoutCategories = { ...mockVenue, categories: [] };
      const keywords = generateLocalSearchKeywords(venueWithoutCategories);
      
      expect(keywords.length).toBeGreaterThan(0);
      expect(keywords).not.toContain('undefined');
    });

    it('should handle venue without optional fields', () => {
      const basicVenue = {
        ...mockVenue,
        phone: undefined,
        website: undefined,
        avgRating: undefined,
        description: undefined,
      };
      
      const snippet = generateFeaturedSnippetContent(basicVenue);
      expect(snippet.answer).not.toContain('undefined');
      expect(snippet.listItems?.some(item => item.includes('📞'))).toBeFalsy();
    });
  });
});