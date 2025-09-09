/**
 * Sanity CMS Mock Utilities for Testing
 * Provides mock data and utilities for testing components that depend on Sanity
 */

import { vi } from 'vitest';

// Define basic types for mock data (simplified versions)
export interface MockSanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface MockSanitySlug {
  current: string;
}

export interface MockSanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

// Factory functions for creating mock data
export const createMockCity = (overrides?: Partial<any>) => ({
  _id: 'city-1',
  _type: 'city',
  _createdAt: '2024-01-01T00:00:00Z',
  _updatedAt: '2024-01-01T00:00:00Z',
  title: 'Madrid',
  slug: { current: 'madrid' },
  region: 'Comunidad de Madrid',
  description: 'La vibrante capital de España con una rica escena gastronómica.',
  heroImage: {
    _type: 'image' as const,
    asset: {
      _ref: 'image-1',
      _type: 'reference' as const
    },
    alt: 'Vista de Madrid'
  },
  ...overrides
});

export const createMockVenue = (overrides?: Partial<any>) => ({
  _id: 'venue-1',
  _type: 'venue',
  _createdAt: '2024-01-01T00:00:00Z',
  _updatedAt: '2024-01-01T00:00:00Z',
  title: 'Restaurante El Ejemplo',
  slug: { current: 'restaurante-el-ejemplo' },
  city: {
    _ref: 'city-1',
    _type: 'reference' as const
  },
  address: 'Calle Ejemplo 123, Madrid',
  postalCode: '28001',
  phone: '+34 91 123 4567',
  website: 'https://www.ejemplo.com',
  geo: {
    lat: 40.4168,
    lng: -3.7038
  },
  openingHours: ['Lun-Dom: 12:00-24:00'],
  priceRange: '€€' as const,
  categories: [{
    _ref: 'category-1',
    _type: 'reference' as const
  }],
  images: [{
    _type: 'image' as const,
    asset: {
      _ref: 'image-2',
      _type: 'reference' as const
    },
    alt: 'Interior del restaurante'
  }],
  description: 'Un restaurante acogedor en el corazón de Madrid.',
  social: {
    instagram: '@ejemplo',
    facebook: 'ejemplo',
    maps: 'https://maps.google.com/ejemplo'
  },
  schemaType: 'Restaurant' as const,
  ...overrides
});

export const createMockReview = (overrides?: Partial<any>) => ({
  _id: 'review-1',
  _type: 'review',
  _createdAt: '2024-01-01T00:00:00Z',
  _updatedAt: '2024-01-01T00:00:00Z',
  title: 'Una experiencia gastronómica excepcional',
  slug: { current: 'experiencia-gastronomica-excepcional' },
  venue: {
    _ref: 'venue-1',
    _type: 'reference' as const
  },
  visitDate: '2024-01-15',
  publishedAt: '2024-01-20T10:00:00Z',
  ratings: {
    food: 8.5,
    service: 9.0,
    ambience: 8.0,
    value: 7.5
  },
  avgTicket: 45,
  pros: ['Excelente servicio', 'Platos creativos', 'Ambiente acogedor'],
  cons: ['Precio elevado', 'Reservas necesarias'],
  tldr: 'Un restaurante excepcional con servicio impecable y cocina creativa.',
  faq: [
    {
      question: '¿Es necesario reservar?',
      answer: 'Sí, recomendamos hacer reserva especialmente los fines de semana.'
    }
  ],
  gallery: [{
    _type: 'image' as const,
    asset: {
      _ref: 'image-3',
      _type: 'reference' as const
    },
    alt: 'Plato principal'
  }],
  author: 'Ana García',
  tags: ['cocina creativa', 'cena romántica'],
  ...overrides
});

export const createMockCategory = (overrides?: Partial<any>) => ({
  _id: 'category-1',
  _type: 'category',
  _createdAt: '2024-01-01T00:00:00Z',
  _updatedAt: '2024-01-01T00:00:00Z',
  title: 'Restaurantes',
  slug: { current: 'restaurantes' },
  featured: true,
  ...overrides
});

export const createMockPost = (overrides?: Partial<any>) => ({
  _id: 'post-1',
  _type: 'post',
  _createdAt: '2024-01-01T00:00:00Z',
  _updatedAt: '2024-01-01T00:00:00Z',
  title: 'Los mejores restaurantes de Madrid',
  slug: { current: 'mejores-restaurantes-madrid' },
  excerpt: 'Descubre nuestra selección de los mejores restaurantes de la capital.',
  heroImage: {
    _type: 'image' as const,
    asset: {
      _ref: 'image-4',
      _type: 'reference' as const
    },
    alt: 'Restaurantes de Madrid'
  },
  publishedAt: '2024-01-20T10:00:00Z',
  featured: true,
  author: 'Equipo Editorial',
  tags: ['madrid', 'restaurantes', 'guía'],
  body: [], // Portable Text content
  ...overrides
});

// Mock data collections
export const mockCities = [
  createMockCity(),
  createMockCity({ 
    _id: 'city-2', 
    title: 'Barcelona', 
    slug: { current: 'barcelona' },
    region: 'Cataluña'
  })
];

export const mockVenues = [
  createMockVenue(),
  createMockVenue({ 
    _id: 'venue-2', 
    title: 'Café Central', 
    slug: { current: 'cafe-central' },
    priceRange: '€'
  })
];

export const mockReviews = [
  createMockReview(),
  createMockReview({ 
    _id: 'review-2', 
    title: 'Desayuno perfecto en el centro', 
    slug: { current: 'desayuno-perfecto-centro' }
  })
];

// Mock Sanity Client
export const mockSanityFetch = vi.fn();

// Helper functions for setting up mock responses
export const setupMockSanityFetch = () => {
  mockSanityFetch.mockImplementation(({ query, params = {} }) => {
    // Mock different queries based on query content
    if (query.includes('*[_type == "city"') && query.includes('slug.current == $citySlug')) {
      const citySlug = params.citySlug;
      return Promise.resolve(mockCities.find(city => city.slug.current === citySlug) || null);
    }
    
    if (query.includes('*[_type == "venue"') && query.includes('city->slug.current == $citySlug')) {
      return Promise.resolve(mockVenues);
    }
    
    if (query.includes('*[_type == "review"') && query.includes('venue->city->slug.current == $citySlug')) {
      return Promise.resolve(mockReviews);
    }
    
    if (query.includes('homepageQuery')) {
      return Promise.resolve({
        featuredReviews: mockReviews,
        trendingReviews: mockReviews,
        topReviews: mockReviews,
        featuredPosts: [createMockPost()],
        featuredCities: mockCities,
        featuredCategories: [createMockCategory()]
      });
    }
    
    // Default empty response
    return Promise.resolve([]);
  });
};

export const setupMockSanityError = (errorMessage = 'Sanity fetch error') => {
  mockSanityFetch.mockRejectedValue(new Error(errorMessage));
};

export const resetSanityMocks = () => {
  vi.clearAllMocks();
  mockSanityFetch.mockReset();
};