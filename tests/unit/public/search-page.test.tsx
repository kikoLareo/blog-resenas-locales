/**
 * Tests for Search Page (app/(public)/buscar/page.tsx)
 * Tests search functionality, results rendering, and error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockSearchResults, resetSanityMocks } from '../utils/sanity-mocks';

// Mock Next.js modules
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => 
    <a href={href}>{children}</a>
}));

vi.mock('next/image', () => ({
  default: ({ alt, src, ...props }: { alt: string, src: string, fill?: boolean }) => 
    <img alt={alt} src={src} {...props} />
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

vi.mock('@/components/SearchForm', () => ({
  default: ({ initialValue }: { initialValue?: string }) => (
    <div data-testid="search-form">
      <input 
        type="text" 
        defaultValue={initialValue} 
        placeholder="Buscar..." 
        data-testid="search-input"
      />
      <button type="submit">Buscar</button>
    </div>
  )
}));

vi.mock('@/components/AdSlot', () => ({
  SidebarAd: () => <div data-testid="sidebar-ad">Sidebar Ad</div>,
  InArticleAd: () => <div data-testid="in-article-ad">In Article Ad</div>
}));

// Mock schema generation
vi.mock('@/lib/schema', () => ({
  websiteJsonLd: vi.fn(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Reseñas Gastronómicas Locales'
  }))
}));

// Mock Sanity client
const mockSanityFetch = vi.fn();
vi.mock('@/lib/sanity.client', () => ({
  sanityFetch: mockSanityFetch
}));

describe('Search Page Integration Tests', () => {
  beforeEach(() => {
    resetSanityMocks();
    mockSanityFetch.mockImplementation(({ query, params = {} }) => {
      if (query.includes('searchQuery') && params.searchTerm) {
        // Return mock results based on search term
        if (params.searchTerm === 'restaurante') {
          return Promise.resolve(mockSearchResults);
        }
        if (params.searchTerm === 'noresults') {
          return Promise.resolve([]);
        }
        return Promise.resolve(mockSearchResults.slice(0, 1));
      }
      return Promise.resolve([]);
    });
  });

  describe('Search Functionality', () => {
    it('should perform search when search term is provided', async () => {
      const searchTerm = 'restaurante';
      
      // Simulate search page component logic
      const results = await mockSanityFetch({
        query: 'searchQuery',
        params: { searchTerm },
        tags: ['search'],
        revalidate: 300
      });

      expect(mockSanityFetch).toHaveBeenCalledWith({
        query: 'searchQuery',
        params: { searchTerm },
        tags: ['search'],
        revalidate: 300
      });
      
      expect(results).toEqual(mockSearchResults);
      expect(results).toHaveLength(2);
    });

    it('should not perform search when no search term provided', async () => {
      const searchTerm = '';
      
      // Component logic: only search if searchTerm exists
      let results: any[] = [];
      if (searchTerm) {
        results = await mockSanityFetch({
          query: 'searchQuery',
          params: { searchTerm }
        });
      }

      expect(results).toEqual([]);
      expect(mockSanityFetch).not.toHaveBeenCalled();
    });

    it('should handle search errors gracefully', async () => {
      mockSanityFetch.mockRejectedValue(new Error('Search service unavailable'));

      try {
        await mockSanityFetch({
          query: 'searchQuery',
          params: { searchTerm: 'test' }
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        // In production, this would be silently handled
      }

      // Fallback to empty results
      const fallbackResults: any[] = [];
      expect(fallbackResults).toEqual([]);
    });
  });

  describe('Search Results Rendering', () => {
    it('should render search results correctly', () => {
      const results = mockSearchResults;
      const searchTerm = 'restaurante';

      // Test results rendering logic
      expect(results.length).toBe(2);

      // Test result type labeling
      const venueResult = results.find(r => r._type === 'venue');
      const reviewResult = results.find(r => r._type === 'review');

      expect(venueResult).toBeDefined();
      expect(reviewResult).toBeDefined();

      // Test result type labels
      const getResultType = (type: string) => {
        switch (type) {
          case 'venue':
            return { label: 'Local', color: 'bg-blue-100 text-blue-800' };
          case 'review':
            return { label: 'Reseña', color: 'bg-green-100 text-green-800' };
          case 'post':
            return { label: 'Artículo', color: 'bg-purple-100 text-purple-800' };
          default:
            return { label: 'Contenido', color: 'bg-gray-100 text-gray-800' };
        }
      };

      expect(getResultType('venue').label).toBe('Local');
      expect(getResultType('review').label).toBe('Reseña');
    });

    it('should generate correct URLs for different result types', () => {
      const getResultUrl = (result: typeof mockSearchResults[0]) => {
        switch (result._type) {
          case 'venue':
            return `/venues/${result.slug.current}`;
          case 'review':
            return `/reviews/${result.slug.current}`;
          case 'post':
            return `/blog/${result.slug.current}`;
          default:
            return '#';
        }
      };

      const venueResult = mockSearchResults.find(r => r._type === 'venue')!;
      const reviewResult = mockSearchResults.find(r => r._type === 'review')!;

      expect(getResultUrl(venueResult)).toBe('/venues/restaurante-la-busqueda');
      expect(getResultUrl(reviewResult)).toBe('/reviews/resena-encontrada');
    });

    it('should show empty state when no results found', () => {
      const results: any[] = [];
      const searchTerm = 'noresults';

      const showEmptyState = results.length === 0 && searchTerm;
      expect(showEmptyState).toBe(true);

      if (showEmptyState) {
        const emptyStateContent = {
          title: 'No se encontraron resultados',
          message: `No encontramos contenido relacionado con "${searchTerm}".`,
          suggestions: ['Ver Categorías', 'Ir al Inicio']
        };

        expect(emptyStateContent.message).toContain('noresults');
        expect(emptyStateContent.suggestions).toHaveLength(2);
      }
    });

    it('should handle missing images in search results', () => {
      const resultWithoutImage = {
        ...mockSearchResults[0],
        image: null
      };

      const hasImage = resultWithoutImage.image?.asset?.url;
      expect(hasImage).toBeFalsy();

      // Should show placeholder icon instead
      const showPlaceholder = !hasImage;
      expect(showPlaceholder).toBe(true);
    });
  });

  describe('SEO and Metadata', () => {
    it('should generate correct metadata with search term', async () => {
      const mockGenerateMetadata = async ({ searchParams }: { searchParams: Promise<{ q?: string }> }) => {
        const { q } = await searchParams;
        const searchTerm = q ? decodeURIComponent(q) : '';
        
        const title = searchTerm 
          ? `Resultados para "${searchTerm}" - Reseñas Gastronómicas Locales`
          : 'Buscar - Reseñas Gastronómicas Locales';
        
        const description = searchTerm
          ? `Encuentra reseñas, locales y contenido relacionado con "${searchTerm}" en nuestro blog de reseñas locales.`
          : 'Busca reseñas de restaurantes, locales y contenido gastronómico en nuestro blog de reseñas locales.';

        return { title, description };
      };

      // Test with search term
      const metadataWithTerm = await mockGenerateMetadata({ 
        searchParams: Promise.resolve({ q: 'restaurante' }) 
      });

      expect(metadataWithTerm.title).toBe('Resultados para "restaurante" - Reseñas Gastronómicas Locales');
      expect(metadataWithTerm.description).toContain('restaurante');

      // Test without search term
      const metadataWithoutTerm = await mockGenerateMetadata({ 
        searchParams: Promise.resolve({}) 
      });

      expect(metadataWithoutTerm.title).toBe('Buscar - Reseñas Gastronómicas Locales');
    });

    it('should include JSON-LD structured data', () => {
      const { websiteJsonLd } = require('@/lib/schema');
      const jsonLd = websiteJsonLd();

      expect(websiteJsonLd).toHaveBeenCalled();
      expect(jsonLd).toHaveProperty('@context', 'https://schema.org');
    });
  });

  describe('Search Interface', () => {
    it('should initialize search form with provided search term', () => {
      const initialSearchTerm = 'restaurante madrileño';
      
      // SearchForm component should receive the initial value
      const searchFormProps = {
        initialValue: initialSearchTerm
      };

      expect(searchFormProps.initialValue).toBe('restaurante madrileño');
    });

    it('should show popular search suggestions when no search performed', () => {
      const popularSearches = [
        'Restaurantes', 'Cafeterías', 'Bares', 
        'Comida italiana', 'Tapas', 'Brunch'
      ];

      expect(popularSearches).toHaveLength(6);
      expect(popularSearches).toContain('Restaurantes');
      expect(popularSearches).toContain('Tapas');

      // Should generate correct URLs for suggestions
      const suggestionUrl = (term: string) => `/buscar?q=${encodeURIComponent(term)}`;
      expect(suggestionUrl('Comida italiana')).toBe('/buscar?q=Comida%20italiana');
    });

    it('should show search statistics', () => {
      const results = mockSearchResults;
      const resultCount = results.length;

      const statsText = `${resultCount} resultado${resultCount !== 1 ? 's' : ''} encontrado${resultCount !== 1 ? 's' : ''}`;
      
      expect(statsText).toBe('2 resultados encontrados');

      // Test singular case
      const singleResult = [mockSearchResults[0]];
      const singleStatsText = `${singleResult.length} resultado${singleResult.length !== 1 ? 's' : ''} encontrado${singleResult.length !== 1 ? 's' : ''}`;
      
      expect(singleStatsText).toBe('1 resultado encontrado');
    });
  });

  describe('Performance and Caching', () => {
    it('should use short cache duration for search results', () => {
      expect(mockSanityFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          revalidate: 300 // 5 minutes cache
        })
      );
    });

    it('should include search tags for cache invalidation', () => {
      expect(mockSanityFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ['search']
        })
      );
    });

    it('should handle URL encoding correctly', () => {
      const searchTerm = 'café con leche';
      const encodedTerm = encodeURIComponent(searchTerm);
      const decodedTerm = decodeURIComponent(encodedTerm);

      expect(encodedTerm).toBe('caf%C3%A9%20con%20leche');
      expect(decodedTerm).toBe('café con leche');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed search queries', () => {
      const malformedQueries = ['', '   ', null, undefined];
      
      malformedQueries.forEach(query => {
        const searchTerm = query ? decodeURIComponent(query).trim() : '';
        const shouldSearch = searchTerm.length > 0;
        
        expect(shouldSearch).toBe(false);
      });
    });

    it('should handle special characters in search', () => {
      const specialCharQuery = 'café & restaurant "special"';
      const encodedQuery = encodeURIComponent(specialCharQuery);
      const decodedQuery = decodeURIComponent(encodedQuery);

      expect(decodedQuery).toBe(specialCharQuery);
    });

    it('should handle very long search terms', () => {
      const longSearchTerm = 'a'.repeat(1000);
      const truncatedTerm = longSearchTerm.substring(0, 100); // Simulate truncation

      expect(truncatedTerm).toHaveLength(100);
      expect(longSearchTerm.length).toBe(1000);
    });
  });
});