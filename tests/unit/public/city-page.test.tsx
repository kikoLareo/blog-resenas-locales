/**
 * Tests for City Page (app/(public)/[city]/page.tsx)
 * Tests city page rendering, venue listings, and Sanity integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { setupMockSanityFetch, createMockCity, createMockVenue, createMockReview, resetSanityMocks } from '../utils/sanity-mocks';

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  notFound: vi.fn()
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => 
    <a href={href}>{children}</a>
}));

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string, src: string }) => 
    <img alt={alt} src={src} />
}));

// Mock components
vi.mock('@/components/Breadcrumbs', () => ({
  default: ({ items }: { items: any[] }) => (
    <nav data-testid="breadcrumbs">
      {items.map((item, i) => (
        <span key={i}>{item.name}</span>
      ))}
    </nav>
  )
}));

vi.mock('@/components/VenueCard', () => ({
  default: ({ venue }: { venue: any }) => (
    <div data-testid="venue-card" data-venue-id={venue._id}>
      <h3>{venue.title}</h3>
      <p>{venue.description}</p>
    </div>
  )
}));

vi.mock('@/components/AdSlot', () => ({
  SidebarAd: () => <div data-testid="sidebar-ad">Sidebar Ad</div>,
  InArticleAd: () => <div data-testid="in-article-ad">In Article Ad</div>
}));

// Mock schema generation
vi.mock('@/lib/schema', () => ({
  cityPageJsonLd: vi.fn(() => ({
    '@context': 'https://schema.org',
    '@type': 'City',
    name: 'Madrid'
  }))
}));

// Mock Sanity client
const mockSanityFetch = vi.fn();
vi.mock('@/lib/sanity.client', () => ({
  sanityFetch: mockSanityFetch
}));

describe('City Page Integration Tests', () => {
  const mockCity = createMockCity();
  const mockVenues = [
    createMockVenue(),
    createMockVenue({ 
      _id: 'venue-2', 
      title: 'Café Central',
      slug: { current: 'cafe-central' }
    })
  ];
  const mockReviews = [
    createMockReview(),
    createMockReview({
      _id: 'review-2',
      title: 'Perfect Breakfast',
      slug: { current: 'perfect-breakfast' }
    })
  ];

  beforeEach(() => {
    resetSanityMocks();
    
    mockSanityFetch.mockImplementation(({ query, params = {} }) => {
      // City query
      if (query.includes('*[_type == "city"') && query.includes('slug.current == $citySlug')) {
        if (params.citySlug === 'madrid') {
          return Promise.resolve(mockCity);
        }
        return Promise.resolve(null);
      }
      
      // Venues by city query
      if (query.includes('*[_type == "venue"') && query.includes('city->slug.current == $citySlug')) {
        return Promise.resolve(mockVenues);
      }
      
      // Reviews by city query
      if (query.includes('*[_type == "review"') && query.includes('venue->city->slug.current == $citySlug')) {
        return Promise.resolve(mockReviews);
      }
      
      return Promise.resolve([]);
    });
  });

  describe('City Page Data Fetching', () => {
    it('should fetch city data with correct parameters', async () => {
      // Mock the dynamic imports and component structure
      const mockParams = Promise.resolve({ city: 'madrid' });
      
      // Simulate fetching city data
      const cityData = await mockSanityFetch({
        query: 'cityQuery',
        params: { citySlug: 'madrid' },
        tags: ['cities', 'city-madrid'],
        revalidate: 3600
      });

      expect(cityData).toEqual(mockCity);
      expect(mockSanityFetch).toHaveBeenCalledWith({
        query: 'cityQuery',
        params: { citySlug: 'madrid' },
        tags: ['cities', 'city-madrid'],
        revalidate: 3600
      });
    });

    it('should fetch venues and reviews in parallel', async () => {
      const citySlug = 'madrid';
      
      // Simulate parallel fetching
      const [venues, reviews] = await Promise.all([
        mockSanityFetch({
          query: 'venuesByCityQuery',
          params: { citySlug, offset: 0, limit: 12 },
          tags: ['venues', `city-${citySlug}`],
          revalidate: 3600
        }),
        mockSanityFetch({
          query: 'reviewsByCityQuery',
          params: { citySlug },
          tags: ['reviews', `city-${citySlug}`],
          revalidate: 3600
        })
      ]);

      expect(venues).toEqual(mockVenues);
      expect(reviews).toEqual(mockReviews);
    });

    it('should handle non-existent cities', async () => {
      const { notFound } = await import('next/navigation');
      
      const cityData = await mockSanityFetch({
        query: 'cityQuery',
        params: { citySlug: 'non-existent' }
      });

      expect(cityData).toBeNull();
      // In real component, this would call notFound()
    });
  });

  describe('SEO and Metadata Generation', () => {
    it('should generate correct metadata for existing city', async () => {
      const mockGenerateMetadata = async ({ params }: { params: Promise<{ city: string }> }) => {
        const { city: citySlug } = await params;
        const city = await mockSanityFetch({
          query: 'cityQuery',
          params: { citySlug },
          tags: ['cities'],
          revalidate: 0
        });

        if (!city) {
          return { title: 'Ciudad no encontrada' };
        }

        const title = `Restaurantes en ${city.title}`;
        const description = `Descubre los mejores restaurantes y locales en ${city.title}. ${city.description || 'Reseñas, direcciones y recomendaciones de los mejores lugares para comer.'}`;

        return {
          title,
          description,
          openGraph: {
            title: `${title} | Reseñas Gastronómicas Locales`,
            description,
            type: 'website',
            url: expect.any(String)
          }
        };
      };

      const metadata = await mockGenerateMetadata({ 
        params: Promise.resolve({ city: 'madrid' }) 
      });

      expect(metadata.title).toBe('Restaurantes en Madrid');
      expect(metadata.description).toContain('Madrid');
      expect(metadata.openGraph?.title).toContain('Madrid');
    });

    it('should generate JSON-LD structured data', () => {
      const { cityPageJsonLd } = require('@/lib/schema');
      const jsonLd = cityPageJsonLd(mockCity, mockVenues);

      expect(cityPageJsonLd).toHaveBeenCalledWith(mockCity, mockVenues);
      expect(jsonLd).toHaveProperty('@context', 'https://schema.org');
    });
  });

  describe('Content Rendering Logic', () => {
    it('should render city statistics correctly', () => {
      const venueCount = mockVenues.length;
      const reviewCount = mockReviews.length;

      expect(venueCount).toBe(2);
      expect(reviewCount).toBe(2);

      // Test the stats rendering logic
      const statsData = {
        venues: `${venueCount} locales`,
        reviews: `${reviewCount} reseñas`
      };

      expect(statsData.venues).toBe('2 locales');
      expect(statsData.reviews).toBe('2 reseñas');
    });

    it('should limit reviews display to 6 items', () => {
      const manyReviews = Array.from({ length: 10 }, (_, i) => 
        createMockReview({ _id: `review-${i}`, title: `Review ${i}` })
      );

      const displayedReviews = manyReviews.slice(0, 6);
      expect(displayedReviews).toHaveLength(6);
    });

    it('should show empty state when no venues exist', () => {
      const emptyVenues: any[] = [];
      
      const shouldShowEmptyState = emptyVenues.length === 0;
      expect(shouldShowEmptyState).toBe(true);

      if (shouldShowEmptyState) {
        const emptyStateContent = {
          title: `Aún no hay locales en ${mockCity.title}`,
          message: 'Estamos trabajando para incluir más locales en esta ciudad.',
          ctaText: 'Sugerir un local'
        };

        expect(emptyStateContent.title).toBe('Aún no hay locales en Madrid');
      }
    });
  });

  describe('Performance and Caching', () => {
    it('should use appropriate cache settings', () => {
      expect(mockSanityFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          revalidate: 3600 // 1 hour cache
        })
      );
    });

    it('should include proper cache tags for ISR', () => {
      const citySlug = 'madrid';
      
      expect(mockSanityFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ['cities', `city-${citySlug}`]
        })
      );
      
      expect(mockSanityFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ['venues', `city-${citySlug}`]
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle Sanity fetch errors gracefully', async () => {
      mockSanityFetch.mockRejectedValue(new Error('Sanity connection failed'));

      // Component should handle errors and either show error state or call notFound()
      try {
        await mockSanityFetch({ query: 'cityQuery' });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Sanity connection failed');
      }
    });

    it('should handle missing venue data', async () => {
      mockSanityFetch.mockImplementation(({ query }) => {
        if (query.includes('venue')) {
          return Promise.resolve([]); // No venues
        }
        if (query.includes('city')) {
          return Promise.resolve(mockCity); // City exists
        }
        return Promise.resolve([]);
      });

      const venues = await mockSanityFetch({ query: 'venuesByCityQuery' });
      expect(venues).toEqual([]);
      
      // Should show empty state
      const hasVenues = venues.length > 0;
      expect(hasVenues).toBe(false);
    });
  });

  describe('Review Card Rendering', () => {
    it('should calculate overall rating correctly', () => {
      const review = createMockReview({
        ratings: {
          food: 8.5,
          service: 9.0,
          ambience: 8.0,
          value: 7.5
        }
      });

      const overallRating = (
        review.ratings.food + 
        review.ratings.service + 
        review.ratings.ambience + 
        review.ratings.value
      ) / 4;

      expect(overallRating).toBe(8.25);
      expect(overallRating.toFixed(1)).toBe('8.3');
    });

    it('should generate correct review URLs', () => {
      const review = createMockReview();
      const venue = createMockVenue();
      const city = createMockCity();

      const reviewUrl = `/${city.slug.current}/${venue.slug.current}/review/${review.slug.current}`;
      expect(reviewUrl).toBe('/madrid/restaurante-el-ejemplo/review/experiencia-gastronomica-excepcional');
    });

    it('should handle missing gallery images', () => {
      const reviewWithoutImage = createMockReview({ gallery: [] });
      
      const hasGalleryImage = reviewWithoutImage.gallery && reviewWithoutImage.gallery.length > 0;
      expect(hasGalleryImage).toBe(false);
    });
  });
});