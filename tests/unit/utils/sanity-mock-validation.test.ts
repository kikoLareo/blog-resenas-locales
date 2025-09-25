/**
 * Validation tests for Sanity Mock Utilities
 * Simple standalone tests to validate our mocking infrastructure
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  createMockCity, 
  createMockVenue, 
  createMockReview, 
  createMockCategory, 
  createMockPost,
  mockCities,
  mockVenues,
  mockReviews
} from './sanity-mocks';

describe('Sanity Mock Utilities Validation', () => {
  describe('Mock Data Factory Functions', () => {
    it('should create valid City mock data', () => {
      const city = createMockCity();
      
      expect(city).toBeDefined();
      expect(city._id).toBeTruthy();
      expect(city._type).toBe('city');
      expect(city.title).toBeTruthy();
      expect(city.slug.current).toBeTruthy();
      expect(city.region).toBeTruthy();
    });

    it('should create valid Venue mock data', () => {
      const venue = createMockVenue();
      
      expect(venue).toBeDefined();
      expect(venue._id).toBeTruthy();
      expect(venue._type).toBe('venue');
      expect(venue.title).toBeTruthy();
      expect(venue.slug.current).toBeTruthy();
      expect(venue.city._type).toBe('reference');
      expect(venue.priceRange).toMatch(/^€+$/);
    });

    it('should create valid Review mock data', () => {
      const review = createMockReview();
      
      expect(review).toBeDefined();
      expect(review._id).toBeTruthy();
      expect(review._type).toBe('review');
      expect(review.title).toBeTruthy();
      expect(review.ratings).toBeDefined();
      expect(review.ratings.food).toBeGreaterThan(0);
      expect(review.venue._type).toBe('reference');
    });

    it('should create valid Category mock data', () => {
      const category = createMockCategory();
      
      expect(category).toBeDefined();
      expect(category._type).toBe('category');
      expect(category.title).toBeTruthy();
      expect(category.featured).toBe(true);
    });

    it('should create valid Post mock data', () => {
      const post = createMockPost();
      
      expect(post).toBeDefined();
      expect(post._type).toBe('post');
      expect(post.title).toBeTruthy();
      expect(post.excerpt).toBeTruthy();
      expect(post.featured).toBe(true);
    });

    it('should allow overrides in factory functions', () => {
      const customCity = createMockCity({ 
        title: 'Custom City',
        region: 'Custom Region' 
      });
      
      expect(customCity.title).toBe('Custom City');
      expect(customCity.region).toBe('Custom Region');
      expect(customCity._type).toBe('city'); // Should preserve base properties
    });
  });

  describe('Mock Data Collections', () => {
    it('should provide mock cities collection', () => {
      expect(mockCities).toBeDefined();
      expect(Array.isArray(mockCities)).toBe(true);
      expect(mockCities.length).toBeGreaterThan(0);
      
      const firstCity = mockCities[0];
      expect(firstCity._type).toBe('city');
      expect(firstCity.title).toBeTruthy();
    });

    it('should provide mock venues collection', () => {
      expect(mockVenues).toBeDefined();
      expect(Array.isArray(mockVenues)).toBe(true);
      expect(mockVenues.length).toBeGreaterThan(0);
      
      const firstVenue = mockVenues[0];
      expect(firstVenue._type).toBe('venue');
      expect(firstVenue.title).toBeTruthy();
    });

    it('should provide mock reviews collection', () => {
      expect(mockReviews).toBeDefined();
      expect(Array.isArray(mockReviews)).toBe(true);
      expect(mockReviews.length).toBeGreaterThan(0);
      
      const firstReview = mockReviews[0];
      expect(firstReview._type).toBe('review');
      expect(firstReview.title).toBeTruthy();
    });
  });

  describe('Data Relationships and Structure', () => {
    it('should maintain proper Sanity document structure', () => {
      const city = createMockCity();
      
      // Standard Sanity fields
      expect(city._id).toBeTruthy();
      expect(city._type).toBeTruthy();
      expect(city._createdAt).toBeTruthy();
      expect(city._updatedAt).toBeTruthy();
      
      // Slug structure
      expect(city.slug).toHaveProperty('current');
      expect(typeof city.slug.current).toBe('string');
      
      // Image structure
      if (city.heroImage) {
        expect(city.heroImage._type).toBe('image');
        expect(city.heroImage.asset).toHaveProperty('_ref');
        expect(city.heroImage.asset._type).toBe('reference');
      }
    });

    it('should maintain proper reference relationships', () => {
      const venue = createMockVenue();
      const review = createMockReview();
      
      // Venue → City reference
      expect(venue.city._type).toBe('reference');
      expect(venue.city._ref).toBeTruthy();
      
      // Review → Venue reference
      expect(review.venue._type).toBe('reference');
      expect(review.venue._ref).toBeTruthy();
      
      // Category references
      expect(venue.categories).toBeDefined();
      expect(venue.categories.length).toBeGreaterThan(0);
      expect(venue.categories[0]._type).toBe('reference');
    });

    it('should handle complex data structures', () => {
      const review = createMockReview();
      
      // Ratings object
      expect(review.ratings).toBeDefined();
      expect(typeof review.ratings.food).toBe('number');
      expect(typeof review.ratings.service).toBe('number');
      expect(typeof review.ratings.ambience).toBe('number');
      expect(typeof review.ratings.value).toBe('number');
      
      // Arrays
      expect(Array.isArray(review.pros)).toBe(true);
      expect(Array.isArray(review.cons)).toBe(true);
      expect(Array.isArray(review.faq)).toBe(true);
      expect(Array.isArray(review.gallery)).toBe(true);
      expect(Array.isArray(review.tags)).toBe(true);
      
      // FAQ structure
      if (review.faq.length > 0) {
        expect(review.faq[0]).toHaveProperty('question');
        expect(review.faq[0]).toHaveProperty('answer');
      }
    });
  });

  describe('Business Logic Validation', () => {
    it('should provide realistic rating values', () => {
      const review = createMockReview();
      
      Object.values(review.ratings).forEach(rating => {
        expect(rating).toBeGreaterThan(0);
        expect(rating).toBeLessThanOrEqual(10);
      });
    });

    it('should provide valid price ranges', () => {
      const venue = createMockVenue();
      
      const validPriceRanges = ['€', '€€', '€€€', '€€€€'];
      expect(validPriceRanges).toContain(venue.priceRange);
    });

    it('should provide valid schema types for venues', () => {
      const venue = createMockVenue();
      
      const validSchemaTypes = [
        'Restaurant', 'CafeOrCoffeeShop', 'BarOrPub', 
        'LocalBusiness', 'Bakery', 'FastFoodRestaurant'
      ];
      expect(validSchemaTypes).toContain(venue.schemaType);
    });

    it('should handle date formats correctly', () => {
      const review = createMockReview();
      
      // Should be ISO date strings
      expect(review.visitDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(review.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
      
      // Should be valid dates
      expect(new Date(review.visitDate).getTime()).toBeGreaterThan(0);
      expect(new Date(review.publishedAt).getTime()).toBeGreaterThan(0);
    });
  });

  describe('URL and Slug Generation', () => {
    it('should generate valid slugs', () => {
      const city = createMockCity();
      const venue = createMockVenue();
      const review = createMockReview();
      
      // Should be URL-safe
      expect(city.slug.current).toMatch(/^[a-z0-9-]+$/);
      expect(venue.slug.current).toMatch(/^[a-z0-9-]+$/);
      expect(review.slug.current).toMatch(/^[a-z0-9-]+$/);
    });

    it('should generate consistent URL patterns', () => {
      const city = createMockCity({ slug: { current: 'madrid' } });
      const venue = createMockVenue({ slug: { current: 'test-venue' } });
      const review = createMockReview({ slug: { current: 'test-review' } });
      
      // Test URL pattern generation
      const cityUrl = `/${city.slug.current}`;
      const venueUrl = `/${city.slug.current}/${venue.slug.current}`;
      const reviewUrl = `/${city.slug.current}/${venue.slug.current}/review/${review.slug.current}`;
      
      expect(cityUrl).toBe('/madrid');
      expect(venueUrl).toBe('/madrid/test-venue');
      expect(reviewUrl).toBe('/madrid/test-venue/review/test-review');
    });
  });
});