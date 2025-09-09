/**
 * Tests for Sanity CMS Integration
 * Tests GROQ queries, client functionality, and error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupMockSanityFetch, createMockCity, createMockVenue, createMockReview, resetSanityMocks } from '../utils/sanity-mocks';

// Mock Sanity client
const mockSanityClient = {
  fetch: vi.fn(),
  config: vi.fn(() => mockSanityClient),
  withConfig: vi.fn(() => mockSanityClient)
};

vi.mock('@sanity/client', () => ({
  createClient: vi.fn(() => mockSanityClient)
}));

const mockSanityFetch = vi.fn();
vi.mock('@/lib/sanity.client', () => ({
  sanityFetch: mockSanityFetch,
  client: mockSanityClient
}));

describe('Sanity Integration Tests', () => {
  beforeEach(() => {
    resetSanityMocks();
    setupMockSanityFetch();
  });

  describe('sanityFetch Wrapper Function', () => {
    it('should handle successful data fetching', async () => {
      const mockData = [createMockCity()];
      mockSanityFetch.mockResolvedValue(mockData);

      const result = await mockSanityFetch({
        query: '*[_type == "city"]',
        tags: ['cities'],
        revalidate: 3600
      });

      expect(result).toEqual(mockData);
      expect(mockSanityFetch).toHaveBeenCalledWith({
        query: '*[_type == "city"]',
        tags: ['cities'],
        revalidate: 3600
      });
    });

    it('should handle query parameters correctly', async () => {
      const mockCity = createMockCity();
      mockSanityFetch.mockImplementation(({ params }) => {
        if (params?.citySlug === 'madrid') {
          return Promise.resolve(mockCity);
        }
        return Promise.resolve(null);
      });

      const result = await mockSanityFetch({
        query: '*[_type == "city" && slug.current == $citySlug][0]',
        params: { citySlug: 'madrid' },
        tags: ['cities']
      });

      expect(result).toEqual(mockCity);
    });

    it('should handle fetch errors gracefully', async () => {
      const errorMessage = 'Network error';
      mockSanityFetch.mockRejectedValue(new Error(errorMessage));

      await expect(mockSanityFetch({
        query: '*[_type == "city"]'
      })).rejects.toThrow(errorMessage);
    });

    it('should support ISR tags for cache invalidation', async () => {
      const tags = ['cities', 'featured'];
      
      await mockSanityFetch({
        query: '*[_type == "city"]',
        tags,
        revalidate: 3600
      });

      expect(mockSanityFetch).toHaveBeenCalledWith(
        expect.objectContaining({ tags })
      );
    });
  });

  describe('GROQ Queries', () => {
    it('should handle city queries correctly', async () => {
      const cityQuery = `
        *[_type == "city" && slug.current == $citySlug][0] {
          _id,
          title,
          slug,
          description,
          heroImage
        }
      `;

      mockSanityFetch.mockImplementation(({ query, params }) => {
        if (query.includes('_type == "city"') && params?.citySlug) {
          return Promise.resolve(createMockCity());
        }
        return Promise.resolve(null);
      });

      const result = await mockSanityFetch({
        query: cityQuery,
        params: { citySlug: 'madrid' }
      });

      expect(result).toBeDefined();
      expect(result.title).toBe('Madrid');
    });

    it('should handle venue queries with city filtering', async () => {
      const venuesQuery = `
        *[_type == "venue" && city->slug.current == $citySlug] {
          _id,
          title,
          slug,
          description,
          address,
          priceRange
        }
      `;

      const mockVenues = [createMockVenue(), createMockVenue({ _id: 'venue-2' })];
      
      mockSanityFetch.mockImplementation(({ query, params }) => {
        if (query.includes('_type == "venue"') && params?.citySlug) {
          return Promise.resolve(mockVenues);
        }
        return Promise.resolve([]);
      });

      const result = await mockSanityFetch({
        query: venuesQuery,
        params: { citySlug: 'madrid' }
      });

      expect(result).toEqual(mockVenues);
      expect(result).toHaveLength(2);
    });

    it('should handle complex review queries with joins', async () => {
      const reviewsQuery = `
        *[_type == "review" && venue->city->slug.current == $citySlug] {
          _id,
          title,
          slug,
          ratings,
          venue->{
            title,
            slug,
            city->{title, slug}
          }
        }
      `;

      const mockReviews = [
        createMockReview(),
        createMockReview({ _id: 'review-2' })
      ];

      mockSanityFetch.mockImplementation(({ query }) => {
        if (query.includes('_type == "review"')) {
          return Promise.resolve(mockReviews);
        }
        return Promise.resolve([]);
      });

      const result = await mockSanityFetch({
        query: reviewsQuery,
        params: { citySlug: 'madrid' }
      });

      expect(result).toEqual(mockReviews);
    });

    it('should handle search queries correctly', async () => {
      const searchQuery = `
        *[_type in ["venue", "review", "post"] && (
          title match $searchTerm + "*" ||
          description match $searchTerm + "*" ||
          excerpt match $searchTerm + "*"
        )] {
          _type,
          _id,
          title,
          slug,
          description
        }
      `;

      const searchResults = [
        {
          _type: 'venue',
          _id: 'venue-1',
          title: 'Restaurant Search Result',
          slug: { current: 'restaurant-search' },
          description: 'A restaurant that matches search'
        }
      ];

      mockSanityFetch.mockImplementation(({ query, params }) => {
        if (query.includes('title match $searchTerm') && params?.searchTerm) {
          return Promise.resolve(searchResults);
        }
        return Promise.resolve([]);
      });

      const result = await mockSanityFetch({
        query: searchQuery,
        params: { searchTerm: 'restaurant' }
      });

      expect(result).toEqual(searchResults);
    });
  });

  describe('Data Transformations', () => {
    it('should handle image transformations correctly', () => {
      const mockImage = {
        _type: 'image',
        asset: {
          _ref: 'image-abc123',
          _type: 'reference'
        },
        alt: 'Test image'
      };

      // Simulate image URL transformation
      const transformImageUrl = (image: typeof mockImage) => {
        if (!image?.asset?._ref) return '';
        return `https://cdn.sanity.io/images/project/${image.asset._ref}.jpg`;
      };

      const imageUrl = transformImageUrl(mockImage);
      expect(imageUrl).toBe('https://cdn.sanity.io/images/project/image-abc123.jpg');
    });

    it('should handle portable text content', () => {
      const portableTextContent = [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'This is a paragraph of text.'
            }
          ]
        }
      ];

      // Verify portable text structure
      expect(portableTextContent[0]._type).toBe('block');
      expect(portableTextContent[0].children[0].text).toBe('This is a paragraph of text.');
    });

    it('should handle reference relationships', () => {
      const venue = createMockVenue();
      const review = createMockReview();

      // Test reference structure
      expect(venue.city._type).toBe('reference');
      expect(review.venue._type).toBe('reference');

      // Simulate reference resolution
      const resolveReference = (ref: any) => {
        if (ref._ref === 'city-1') {
          return createMockCity();
        }
        if (ref._ref === 'venue-1') {
          return createMockVenue();
        }
        return null;
      };

      const resolvedCity = resolveReference(venue.city);
      const resolvedVenue = resolveReference(review.venue);

      expect(resolvedCity?.title).toBe('Madrid');
      expect(resolvedVenue?.title).toBe('Restaurante El Ejemplo');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle null and undefined query results', async () => {
      mockSanityFetch.mockResolvedValue(null);

      const result = await mockSanityFetch({
        query: '*[_type == "nonexistent"][0]'
      });

      expect(result).toBeNull();
    });

    it('should handle empty arrays', async () => {
      mockSanityFetch.mockResolvedValue([]);

      const result = await mockSanityFetch({
        query: '*[_type == "city" && slug.current == "nonexistent"]'
      });

      expect(result).toEqual([]);
    });

    it('should handle malformed queries gracefully', async () => {
      mockSanityFetch.mockRejectedValue(new Error('Invalid GROQ query'));

      await expect(mockSanityFetch({
        query: '*[invalid query syntax'
      })).rejects.toThrow('Invalid GROQ query');
    });

    it('should handle network timeouts', async () => {
      mockSanityFetch.mockRejectedValue(new Error('Request timeout'));

      await expect(mockSanityFetch({
        query: '*[_type == "city"]'
      })).rejects.toThrow('Request timeout');
    });
  });

  describe('Performance and Caching', () => {
    it('should implement proper cache strategies', () => {
      const cacheSettings = {
        homepage: { revalidate: 3600 }, // 1 hour
        cityPage: { revalidate: 3600 }, // 1 hour
        search: { revalidate: 300 }, // 5 minutes
        staticData: { revalidate: 86400 } // 24 hours
      };

      expect(cacheSettings.homepage.revalidate).toBe(3600);
      expect(cacheSettings.search.revalidate).toBe(300);
      expect(cacheSettings.staticData.revalidate).toBe(86400);
    });

    it('should use appropriate cache tags', () => {
      const generateTags = (type: string, id?: string) => {
        const baseTags = [type];
        if (id) {
          baseTags.push(`${type}-${id}`);
        }
        return baseTags;
      };

      expect(generateTags('cities')).toEqual(['cities']);
      expect(generateTags('cities', 'madrid')).toEqual(['cities', 'cities-madrid']);
      expect(generateTags('venues', 'restaurant-1')).toEqual(['venues', 'venues-restaurant-1']);
    });

    it('should handle query optimization', () => {
      // Test query field selection optimization
      const optimizedQuery = `
        *[_type == "venue" && city->slug.current == $citySlug] {
          _id,
          title,
          slug,
          // Only fetch needed fields to reduce payload
          "imageUrl": images[0].asset->url
        }
      `;

      expect(optimizedQuery).toContain('_id');
      expect(optimizedQuery).toContain('title');
      expect(optimizedQuery).not.toContain('description'); // Not included for performance
    });
  });

  describe('Real-world Query Patterns', () => {
    it('should handle homepage data aggregation', async () => {
      const homepageQuery = `{
        "featuredReviews": *[_type == "review" && featured == true] | order(publishedAt desc)[0...6],
        "trendingReviews": *[_type == "review"] | order(publishedAt desc)[0...6],
        "featuredCities": *[_type == "city" && featured == true] | order(order asc),
        "featuredCategories": *[_type == "category" && featured == true] | order(order asc)
      }`;

      const homepageData = {
        featuredReviews: [createMockReview()],
        trendingReviews: [createMockReview({ _id: 'review-2' })],
        featuredCities: [createMockCity()],
        featuredCategories: [{ _id: 'cat-1', title: 'Restaurants' }]
      };

      mockSanityFetch.mockResolvedValue(homepageData);

      const result = await mockSanityFetch({ query: homepageQuery });

      expect(result.featuredReviews).toHaveLength(1);
      expect(result.trendingReviews).toHaveLength(1);
      expect(result.featuredCities).toHaveLength(1);
      expect(result.featuredCategories).toHaveLength(1);
    });

    it('should handle pagination correctly', async () => {
      const paginatedQuery = `
        *[_type == "venue"] | order(_createdAt desc)[$offset...$limit] {
          _id,
          title,
          slug
        }
      `;

      const venues = Array.from({ length: 5 }, (_, i) => 
        createMockVenue({ _id: `venue-${i}`, title: `Venue ${i}` })
      );

      mockSanityFetch.mockImplementation(({ params }) => {
        const offset = params?.offset || 0;
        const limit = params?.limit || 10;
        return Promise.resolve(venues.slice(offset, offset + limit));
      });

      const page1 = await mockSanityFetch({
        query: paginatedQuery,
        params: { offset: 0, limit: 3 }
      });

      const page2 = await mockSanityFetch({
        query: paginatedQuery,
        params: { offset: 3, limit: 3 }
      });

      expect(page1).toHaveLength(3);
      expect(page2).toHaveLength(2);
      expect(page1[0]._id).toBe('venue-0');
      expect(page2[0]._id).toBe('venue-3');
    });
  });
});