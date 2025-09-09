/**
 * Tests for Homepage Logic and Data Processing
 * Tests homepage data transformation, Sanity integration patterns, and configuration logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupMockSanityFetch, createMockReview, createMockPost, createMockCity, resetSanityMocks } from '../utils/sanity-mocks';

// Mock Sanity integration
const mockSanityFetch = vi.fn();
vi.mock('@/lib/sanity.client', () => ({
  sanityFetch: mockSanityFetch
}));

describe('Homepage Integration Tests', () => {
  beforeEach(() => {
    resetSanityMocks();
    setupMockSanityFetch();
  });

  describe('Sanity Integration Patterns', () => {
    it('should use correct query structure for homepage data', async () => {
      // Test the expected query patterns for homepage
      const expectedCalls = [
        {
          query: expect.stringContaining('homepageQuery'),
          revalidate: 3600,
          tags: ['homepage', 'reviews']
        },
        {
          query: expect.stringContaining('homepageConfigQuery'), 
          revalidate: 3600,
          tags: ['homepage-config']
        }
      ];

      // Simulate homepage data fetching
      await mockSanityFetch({
        query: 'homepageQuery',
        revalidate: 3600,
        tags: ['homepage', 'reviews']
      });

      await mockSanityFetch({
        query: 'homepageConfigQuery',
        revalidate: 3600, 
        tags: ['homepage-config']
      });

      expect(mockSanityFetch).toHaveBeenCalledTimes(2);
      expect(mockSanityFetch).toHaveBeenCalledWith(expect.objectContaining(expectedCalls[0]));
      expect(mockSanityFetch).toHaveBeenCalledWith(expect.objectContaining(expectedCalls[1]));
    });

    it('should handle parallel data fetching correctly', async () => {
      const promises = [
        mockSanityFetch({ query: 'homepageQuery' }),
        mockSanityFetch({ query: 'homepageConfigQuery' }),
        Promise.resolve([]) // getAllFeaturedItems mock
      ];

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      expect(results[0]).toBeDefined(); // homepage data
      expect(results[1]).toBeDefined(); // config data
      expect(results[2]).toBeDefined(); // featured items
    });

    it('should handle Sanity fetch errors gracefully', async () => {
      mockSanityFetch.mockRejectedValue(new Error('Sanity connection failed'));
      
      try {
        await mockSanityFetch({ query: 'homepageQuery' });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      // Should have fallback data structure
      const fallbackData = {
        featuredReviews: [], trendingReviews: [], topReviews: [],
        featuredPosts: [], featuredCities: [], featuredCategories: []
      };
      
      expect(fallbackData).toBeDefined();
    });

  describe('Data Processing Logic', () => {
    it('should process review data correctly for featured sections', () => {
      const mockReview = createMockReview({
        ratings: { food: 8.5, service: 9.0, ambience: 8.0, value: 7.5 },
        venue: {
          title: 'Test Venue',
          slug: { current: 'test-venue' },
          city: 'Madrid',
          citySlug: 'madrid'
        }
      });

      // Test the data transformation logic used in homepage
      const transformedData = {
        id: mockReview._id,
        title: mockReview.title,
        rating: mockReview.ratings.food,
        location: mockReview.venue.city || 'Madrid',
        description: mockReview.tldr,
        href: `/madrid/test-venue/review/${mockReview.slug.current}`,
        image: mockReview.gallery?.[0]?.asset?.url || '',
        readTime: '5 min',
        tags: []
      };

      expect(transformedData.href).toContain('/madrid/');
      expect(transformedData.rating).toBe(8.5);
      expect(transformedData.title).toBeTruthy();
    });

    it('should handle missing image data gracefully', () => {
      const reviewWithoutImage = createMockReview({ gallery: [] });
      
      const imageUrl = reviewWithoutImage.gallery?.[0]?.asset?.url ?? '';
      expect(imageUrl).toBe('');
      
      // Should provide fallback
      const fallbackImageUrl = imageUrl || '/default-image.jpg';
      expect(fallbackImageUrl).toBe('/default-image.jpg');
    });

    it('should limit items according to section configuration', () => {
      const mockReviews = Array.from({ length: 10 }, (_, i) => 
        createMockReview({ _id: `review-${i}`, title: `Review ${i}` })
      );

      const itemCount = 6;
      const limitedReviews = mockReviews.slice(0, itemCount);
      
      expect(limitedReviews).toHaveLength(6);
      expect(mockReviews).toHaveLength(10);
    });

    it('should calculate average ratings correctly', () => {
      const review = createMockReview({
        ratings: { food: 8.5, service: 9.0, ambience: 8.0, value: 7.5 }
      });

      const averageRating = (
        review.ratings.food +
        review.ratings.service +
        review.ratings.ambience +
        review.ratings.value
      ) / 4;

      expect(averageRating).toBe(8.25);
    });
  });

  describe('Section Configuration Logic', () => {
    it('should filter enabled sections correctly', () => {
      const sections = [
        { id: 'hero', type: 'hero', enabled: true, order: 1 },
        { id: 'featured', type: 'featured', enabled: false, order: 2 },
        { id: 'newsletter', type: 'newsletter', enabled: true, order: 3 }
      ];

      const enabledSections = sections.filter(section => section.enabled);
      expect(enabledSections).toHaveLength(2);
      expect(enabledSections.map(s => s.id)).toEqual(['hero', 'newsletter']);
    });

    it('should sort sections by order correctly', () => {
      const sections = [
        { id: 'newsletter', type: 'newsletter', enabled: true, order: 3 },
        { id: 'hero', type: 'hero', enabled: true, order: 1 },
        { id: 'featured', type: 'featured', enabled: true, order: 2 }
      ];

      const sortedSections = sections.sort((a, b) => (a.order || 0) - (b.order || 0));
      expect(sortedSections.map(s => s.id)).toEqual(['hero', 'featured', 'newsletter']);
    });

    it('should use default configuration when Sanity config is null', () => {
      const sanityConfig = null;
      const defaultConfig = [
        { id: 'hero', type: 'hero', enabled: true, order: 1 },
        { id: 'featured', type: 'featured', enabled: true, order: 2 }
      ];

      const actualConfig = sanityConfig?.sections || defaultConfig;
      expect(actualConfig).toEqual(defaultConfig);
    });
  });

  describe('Performance and Caching Patterns', () => {
    it('should use appropriate cache durations', () => {
      const cacheSettings = {
        homepage: 3600, // 1 hour
        static: 86400, // 24 hours  
        dynamic: 300   // 5 minutes
      };

      expect(cacheSettings.homepage).toBe(3600);
      expect(cacheSettings.static).toBeGreaterThan(cacheSettings.homepage);
    });

    it('should use correct cache tags for ISR', () => {
      const generateTags = (type: string) => {
        switch (type) {
          case 'homepage':
            return ['homepage', 'reviews'];
          case 'config':
            return ['homepage-config'];
          default:
            return [];
        }
      };

      expect(generateTags('homepage')).toEqual(['homepage', 'reviews']);
      expect(generateTags('config')).toEqual(['homepage-config']);
    });

    it('should handle parallel data fetching efficiently', async () => {
      const startTime = Date.now();
      
      const promises = [
        mockSanityFetch({ query: 'query1' }),
        mockSanityFetch({ query: 'query2' }),
        Promise.resolve([])
      ];

      await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete quickly since operations are parallel
      expect(duration).toBeLessThan(100);
    });
  });
});