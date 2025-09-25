import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  localBusinessJsonLd,
  reviewJsonLd,
  articleJsonLd,
  faqJsonLd,
  breadcrumbsJsonLd,
  websiteJsonLd,
  organizationJsonLd,
  combineJsonLd,
} from '@/lib/schema';
import type { Venue, Review, Post, BreadcrumbItem } from '@/lib/types';

// Mock SITE_CONFIG
vi.mock('@/lib/constants', () => ({
  SITE_CONFIG: {
    name: 'Blog de Reseñas Test',
    description: 'El mejor blog de reseñas de restaurantes',
    url: 'https://test-blog.com',
  },
}));

describe('Schema.org JSON-LD Generators', () => {
  let mockVenue: Venue;
  let mockReview: Review;
  let mockPost: Post;

  beforeEach(() => {
    mockVenue = {
      _id: 'venue-1',
      title: 'Restaurante El Buen Sabor',
      slug: { current: 'restaurante-el-buen-sabor' },
      description: 'Un restaurante familiar con comida tradicional',
      address: 'Calle Mayor 123',
      postalCode: '28001',
      phone: '+34 91 123 4567',
      website: 'https://elbuensabor.com',
      schemaType: 'Restaurant',
      priceRange: '€€',
      openingHours: ['Mo-Fr 12:00-16:00', 'Mo-Fr 20:00-24:00'],
      city: {
        title: 'Madrid',
        slug: { current: 'madrid' },
        region: 'Comunidad de Madrid',
      },
      geo: {
        lat: 40.4168,
        lng: -3.7038,
      },
      images: [
        {
          asset: {
            url: 'https://cdn.sanity.io/images/test/restaurant1.jpg',
          },
        },
      ],
      social: {
        instagram: 'https://instagram.com/elbuensabor',
        facebook: 'https://facebook.com/elbuensabor',
        maps: 'https://maps.google.com/place/elbuensabor',
      },
    } as Venue;

    mockReview = {
      _id: 'review-1',
      title: 'Excelente experiencia gastronómica',
      slug: { current: 'excelente-experiencia-gastronomica' },
      author: 'María García',
      tldr: 'Un lugar perfecto para cenar en familia',
      publishedAt: '2024-01-15T19:30:00Z',
      ratings: {
        food: 9,
        service: 8,
        ambience: 9,
        value: 7,
      },
      authorAvatar: {
        asset: {
          url: 'https://cdn.sanity.io/images/test/author1.jpg',
        },
      },
    } as Review;

    mockPost = {
      _id: 'post-1',
      title: 'Los mejores restaurantes de Madrid 2024',
      slug: { current: 'mejores-restaurantes-madrid-2024' },
      excerpt: 'Descubre los restaurantes más destacados de la capital',
      author: 'Carlos López',
      publishedAt: '2024-01-20T10:00:00Z',
      tags: ['restaurantes', 'madrid', 'gastronomía'],
      cover: {
        asset: {
          url: 'https://cdn.sanity.io/images/test/post1.jpg',
        },
      },
      authorAvatar: {
        asset: {
          url: 'https://cdn.sanity.io/images/test/carlos.jpg',
        },
      },
    } as Post;
  });

  describe('localBusinessJsonLd', () => {
    it('generates valid LocalBusiness schema', () => {
      const schema = localBusinessJsonLd(mockVenue);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Restaurant');
      expect(schema['@id']).toBe('https://test-blog.com/madrid/restaurante-el-buen-sabor#business');
      expect(schema.name).toBe(mockVenue.title);
      expect(schema.description).toBe(mockVenue.description);
      expect(schema.url).toBe('https://test-blog.com/madrid/restaurante-el-buen-sabor');
    });

    it('includes proper address structure', () => {
      const schema = localBusinessJsonLd(mockVenue);

      expect(schema.address).toBeDefined();
      expect(schema.address['@type']).toBe('PostalAddress');
      expect(schema.address.streetAddress).toBe(mockVenue.address);
      expect(schema.address.postalCode).toBe(mockVenue.postalCode);
      expect(schema.address.addressLocality).toBe(mockVenue.city.title);
      expect(schema.address.addressRegion).toBe(mockVenue.city.region);
      expect(schema.address.addressCountry).toBe('ES');
    });

    it('includes geo coordinates when available', () => {
      const schema = localBusinessJsonLd(mockVenue);

      expect(schema.geo).toBeDefined();
      expect(schema.geo['@type']).toBe('GeoCoordinates');
      expect(schema.geo.latitude).toBe(mockVenue.geo.lat);
      expect(schema.geo.longitude).toBe(mockVenue.geo.lng);
    });

    it('handles missing geo coordinates', () => {
      const venueWithoutGeo = { ...mockVenue, geo: undefined };
      const schema = localBusinessJsonLd(venueWithoutGeo);

      expect(schema.geo).toBeUndefined();
    });

    it('includes social media links', () => {
      const schema = localBusinessJsonLd(mockVenue);

      expect(schema.sameAs).toContain('https://instagram.com/elbuensabor');
      expect(schema.sameAs).toContain('https://facebook.com/elbuensabor');
      expect(schema.sameAs).toContain('https://maps.google.com/place/elbuensabor');
      expect(schema.sameAs).toContain(mockVenue.website);
    });

    it('filters out falsy social media links', () => {
      const venueWithPartialSocial = {
        ...mockVenue,
        social: {
          instagram: 'https://instagram.com/test',
          facebook: null,
          tiktok: undefined,
          maps: '',
        },
        website: null,
      };

      const schema = localBusinessJsonLd(venueWithPartialSocial);

      expect(schema.sameAs).toEqual(['https://instagram.com/test']);
    });

    it('uses default LocalBusiness type when schemaType is not provided', () => {
      const venueWithoutSchemaType = { ...mockVenue, schemaType: undefined };
      const schema = localBusinessJsonLd(venueWithoutSchemaType);

      expect(schema['@type']).toBe('LocalBusiness');
    });
  });

  describe('reviewJsonLd', () => {
    it('generates valid Review schema', () => {
      const schema = reviewJsonLd(mockReview, mockVenue);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Review');
      expect(schema['@id']).toBe('https://test-blog.com/madrid/restaurante-el-buen-sabor/review/excelente-experiencia-gastronomica#review');
      expect(schema.headline).toBe(mockReview.title);
      expect(schema.reviewBody).toBe(mockReview.tldr);
    });

    it('includes proper author information', () => {
      const schema = reviewJsonLd(mockReview, mockVenue);

      expect(schema.author).toBeDefined();
      expect(schema.author['@type']).toBe('Person');
      expect(schema.author.name).toBe(mockReview.author);
      expect(schema.author.image).toBe(mockReview.authorAvatar.asset.url);
    });

    it('calculates correct rating from individual ratings', () => {
      const schema = reviewJsonLd(mockReview, mockVenue);

      // Average: (9 + 8 + 9 + 7) / 4 = 8.25
      // Converted to 5-point scale: (8.25 / 10) * 5 = 4.125 -> 4.1
      expect(schema.reviewRating).toBeDefined();
      expect(schema.reviewRating['@type']).toBe('Rating');
      expect(schema.reviewRating.ratingValue).toBe(4.1);
      expect(schema.reviewRating.bestRating).toBe(5);
      expect(schema.reviewRating.worstRating).toBe(1);
    });

    it('includes itemReviewed as LocalBusiness schema', () => {
      const schema = reviewJsonLd(mockReview, mockVenue);

      expect(schema.itemReviewed).toBeDefined();
      expect(schema.itemReviewed['@type']).toBe('Restaurant');
      expect(schema.itemReviewed.name).toBe(mockVenue.title);
    });

    it('includes proper publication date', () => {
      const schema = reviewJsonLd(mockReview, mockVenue);

      expect(schema.datePublished).toBe(mockReview.publishedAt);
    });

    it('includes website reference', () => {
      const schema = reviewJsonLd(mockReview, mockVenue);

      expect(schema.isPartOf).toBeDefined();
      expect(schema.isPartOf['@type']).toBe('WebSite');
      expect(schema.isPartOf.name).toBe('Blog de Reseñas Test');
      expect(schema.isPartOf.url).toBe('https://test-blog.com');
    });
  });

  describe('articleJsonLd', () => {
    it('generates valid BlogPosting schema', () => {
      const schema = articleJsonLd(mockPost);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BlogPosting');
      expect(schema['@id']).toBe('https://test-blog.com/blog/mejores-restaurantes-madrid-2024#article');
      expect(schema.headline).toBe(mockPost.title);
      expect(schema.description).toBe(mockPost.excerpt);
    });

    it('includes proper author and publisher information', () => {
      const schema = articleJsonLd(mockPost);

      expect(schema.author).toBeDefined();
      expect(schema.author['@type']).toBe('Person');
      expect(schema.author.name).toBe(mockPost.author);

      expect(schema.publisher).toBeDefined();
      expect(schema.publisher['@type']).toBe('Organization');
      expect(schema.publisher.name).toBe('Blog de Reseñas Test');
    });

    it('includes mainEntityOfPage reference', () => {
      const schema = articleJsonLd(mockPost);

      expect(schema.mainEntityOfPage).toBeDefined();
      expect(schema.mainEntityOfPage['@type']).toBe('WebPage');
      expect(schema.mainEntityOfPage['@id']).toBe('https://test-blog.com/blog/mejores-restaurantes-madrid-2024');
    });

    it('includes keywords from tags', () => {
      const schema = articleJsonLd(mockPost);

      expect(schema.keywords).toBe('restaurantes, madrid, gastronomía');
    });

    it('handles missing tags', () => {
      const postWithoutTags = { ...mockPost, tags: undefined };
      const schema = articleJsonLd(postWithoutTags);

      expect(schema.keywords).toBeUndefined();
    });
  });

  describe('faqJsonLd', () => {
    const mockFAQs = [
      {
        question: '¿Cuáles son los horarios?',
        answer: 'Abrimos de 12:00 a 24:00 todos los días.',
      },
      {
        question: '¿Aceptan reservas?',
        answer: 'Sí, puedes reservar llamando al teléfono.',
      },
    ];

    it('generates valid FAQPage schema', () => {
      const schema = faqJsonLd(mockFAQs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(2);
    });

    it('structures FAQ items correctly', () => {
      const schema = faqJsonLd(mockFAQs);

      const firstFAQ = schema.mainEntity[0];
      expect(firstFAQ['@type']).toBe('Question');
      expect(firstFAQ.name).toBe(mockFAQs[0].question);
      expect(firstFAQ.acceptedAnswer).toBeDefined();
      expect(firstFAQ.acceptedAnswer['@type']).toBe('Answer');
      expect(firstFAQ.acceptedAnswer.text).toBe(mockFAQs[0].answer);
    });

    it('returns null for empty FAQ array', () => {
      const schema = faqJsonLd([]);
      expect(schema).toBeNull();
    });

    it('returns null for null or undefined input', () => {
      expect(faqJsonLd(null as any)).toBeNull();
      expect(faqJsonLd(undefined as any)).toBeNull();
    });
  });

  describe('breadcrumbsJsonLd', () => {
    const mockBreadcrumbs: BreadcrumbItem[] = [
      { name: 'Inicio', url: '/' },
      { name: 'Madrid', url: '/madrid' },
      { name: 'Restaurantes', url: '/madrid/restaurantes' },
    ];

    it('generates valid BreadcrumbList schema', () => {
      const schema = breadcrumbsJsonLd(mockBreadcrumbs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
    });

    it('structures breadcrumb items correctly', () => {
      const schema = breadcrumbsJsonLd(mockBreadcrumbs);

      const firstItem = schema.itemListElement[0];
      expect(firstItem['@type']).toBe('ListItem');
      expect(firstItem.position).toBe(1);
      expect(firstItem.name).toBe('Inicio');
      expect(firstItem.item).toBe('https://test-blog.com/');
    });

    it('handles absolute URLs correctly', () => {
      const breadcrumbsWithAbsoluteUrl: BreadcrumbItem[] = [
        { name: 'Inicio', url: 'https://test-blog.com/' },
        { name: 'Externo', url: 'https://external.com/page' },
      ];

      const schema = breadcrumbsJsonLd(breadcrumbsWithAbsoluteUrl);

      expect(schema.itemListElement[0].item).toBe('https://test-blog.com/');
      expect(schema.itemListElement[1].item).toBe('https://external.com/page');
    });

    it('maintains correct position sequence', () => {
      const schema = breadcrumbsJsonLd(mockBreadcrumbs);

      schema.itemListElement.forEach((item, index) => {
        expect(item.position).toBe(index + 1);
      });
    });
  });

  describe('websiteJsonLd', () => {
    it('generates valid WebSite schema', () => {
      const schema = websiteJsonLd();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema['@id']).toBe('https://test-blog.com#website');
      expect(schema.name).toBe('Blog de Reseñas Test');
      expect(schema.url).toBe('https://test-blog.com');
    });

    it('includes search action', () => {
      const schema = websiteJsonLd();

      expect(schema.potentialAction).toBeDefined();
      expect(schema.potentialAction['@type']).toBe('SearchAction');
      expect(schema.potentialAction.target).toBeDefined();
      expect(schema.potentialAction.target.urlTemplate).toBe('https://test-blog.com/buscar?q={search_term_string}');
      expect(schema.potentialAction['query-input']).toBe('required name=search_term_string');
    });

    it('includes publisher information', () => {
      const schema = websiteJsonLd();

      expect(schema.publisher).toBeDefined();
      expect(schema.publisher['@type']).toBe('Organization');
      expect(schema.publisher.name).toBe('Blog de Reseñas Test');
    });
  });

  describe('organizationJsonLd', () => {
    it('generates valid Organization schema', () => {
      const schema = organizationJsonLd();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
      expect(schema['@id']).toBe('https://test-blog.com#organization');
      expect(schema.name).toBe('Blog de Reseñas Test');
      expect(schema.url).toBe('https://test-blog.com');
      expect(schema.logo).toBe('https://test-blog.com/logo.png');
    });

    it('includes description and sameAs array', () => {
      const schema = organizationJsonLd();

      expect(schema.description).toBe('El mejor blog de reseñas de restaurantes');
      expect(schema.sameAs).toEqual([]);
    });
  });

  describe('combineJsonLd', () => {
    it('returns null for no valid schemas', () => {
      const result = combineJsonLd();
      expect(result).toBeNull();
    });

    it('returns single schema when only one provided', () => {
      const singleSchema = { '@type': 'WebSite', name: 'Test' };
      const result = combineJsonLd(singleSchema);
      expect(result).toEqual(singleSchema);
    });

    it('combines multiple schemas into @graph', () => {
      const schema1 = { '@type': 'WebSite', name: 'Test Site' };
      const schema2 = { '@type': 'Organization', name: 'Test Org' };
      
      const result = combineJsonLd(schema1, schema2);
      
      expect(result['@context']).toBe('https://schema.org');
      expect(result['@graph']).toEqual([schema1, schema2]);
    });

    it('filters out null and undefined schemas', () => {
      const schema1 = { '@type': 'WebSite', name: 'Test' };
      const result = combineJsonLd(schema1, null, undefined, schema1);
      
      expect(result['@graph']).toEqual([schema1, schema1]);
    });
  });

  describe('Schema validation', () => {
    it('all schemas have required @context', () => {
      const schemas = [
        localBusinessJsonLd(mockVenue),
        reviewJsonLd(mockReview, mockVenue),
        articleJsonLd(mockPost),
        faqJsonLd([{ question: 'Test?', answer: 'Yes.' }]),
        breadcrumbsJsonLd([{ name: 'Home', url: '/' }]),
        websiteJsonLd(),
        organizationJsonLd(),
      ];

      schemas.forEach(schema => {
        if (schema) {
          expect(schema['@context']).toBe('https://schema.org');
          expect(schema['@type']).toBeTruthy();
        }
      });
    });

    it('all schemas have valid URLs', () => {
      const venue = localBusinessJsonLd(mockVenue);
      const review = reviewJsonLd(mockReview, mockVenue);
      const article = articleJsonLd(mockPost);

      // Check URL formats
      expect(venue.url).toMatch(/^https:\/\//);
      expect(venue['@id']).toMatch(/^https:\/\//);
      expect(review.url).toMatch(/^https:\/\//);
      expect(review['@id']).toMatch(/^https:\/\//);
      expect(article.url).toMatch(/^https:\/\//);
      expect(article['@id']).toMatch(/^https:\/\//);
    });

    it('rating values are within valid ranges', () => {
      const schema = reviewJsonLd(mockReview, mockVenue);
      
      expect(schema.reviewRating.ratingValue).toBeGreaterThan(0);
      expect(schema.reviewRating.ratingValue).toBeLessThanOrEqual(5);
      expect(schema.reviewRating.bestRating).toBe(5);
      expect(schema.reviewRating.worstRating).toBe(1);
    });
  });
});