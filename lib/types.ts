
// Tipos base
export interface SanityImage {
  _type: 'image';
  asset: {
    _id: string;
    url: string;
    metadata: {
      dimensions: {
        width: number;
        height: number;
        aspectRatio: number;
      };
      lqip?: string;
    };
  };
  alt: string;
  caption?: string;
}

// Alias para compatibilidad con componentes que importan `Image`
export type Image = SanityImage;

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  maps?: string;
}

// Interfaces principales
export interface City {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  region?: string;
  geo?: GeoPoint;
  heroImage?: SanityImage;
  description?: string;
  // Campos calculados
  venueCount?: number;
  reviewCount?: number;
}

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  icon?: string;
  color?: string;
  heroImage?: SanityImage;
  // Campos calculados
  venueCount?: number;
  reviewCount?: number;
}

export interface Venue {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  city: City;
  address: string;
  postalCode?: string;
  geo?: GeoPoint;
  phone?: string;
  website?: string;
  openingHours?: string[];
  priceRange: '€' | '€€' | '€€€' | '€€€€';
  categories: Category[];
  schemaType: 'Restaurant' | 'CafeOrCoffeeShop' | 'BarOrPub' | 'LocalBusiness';
  description?: string;
  social?: SocialLinks;
  images: SanityImage[];
  // Campos calculados
  reviews?: Review[];
  reviewCount?: number;
  avgRating?: number;
  latestReview?: {
    publishedAt: string;
    ratings: Ratings;
  };
}

export interface Ratings {
  food: number;
  service: number;
  ambience: number;
  value: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Review {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  venue: Venue;
  visitDate: string;
  publishedAt: string;
  ratings: Ratings;
  avgTicket?: number;
  highlights?: string[];
  pros: string[];
  cons?: string[];
  tldr: string;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  body: unknown[]; // Portable Text blocks
  gallery: SanityImage[];
  author: string;
  authorAvatar?: SanityImage;
  tags?: string[];
}

// Post type
export interface Post {
  _id: string;
  _type: 'post';
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  cover?: SanityImage;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  body: unknown[]; // Portable Text blocks
  tags?: string[];
  author: string;
  authorAvatar?: SanityImage;
  publishedAt: string;
}

export interface SitemapUrl {
  slug: string;
  _updatedAt: string;
  publishedAt?: string;
  citySlug?: string;
  venueSlug?: string;
}

export interface SitemapData {
  venues: SitemapUrl[];
  reviews: SitemapUrl[];
  posts: SitemapUrl[];
  cities: SitemapUrl[];
  categories: SitemapUrl[];
}

// Tipos para estadísticas
export interface SiteStats {
  totalReviews: number;
  totalVenues: number;
  totalCities: number;
  avgRating: number;
  latestReview: {
    title: string;
    slug: {
      current: string;
    };
    publishedAt: string;
    venue: {
      title: string;
      slug: {
        current: string;
      };
    };
  };
}

// Tipos para búsqueda
export interface SearchResults {
  venues: Venue[];
  reviews: Review[];
}

// Tipos para tags populares
export interface PopularTag {
  tag: string;
  count: number;
}

// Tipos para JSON-LD
export interface LocalBusinessJsonLd {
  '@context': 'https://schema.org';
  '@type': string;
  '@id'?: string;
  name: string;
  description?: string;
  image?: string[];
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: 'ES';
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  url?: string;
  openingHours?: string[];
  priceRange?: string;
  servesCuisine?: string[];
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
    bestRating: 10;
    worstRating: 0;
  };
  sameAs?: string[];
}

export interface ReviewJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Review';
  '@id'?: string;
  url?: string;
  headline?: string;
  itemReviewed: {
    '@type': string;
    name: string;
    image?: string;
    address: {
      '@type': 'PostalAddress';
      streetAddress: string;
      addressLocality: string;
      addressRegion?: string;
      addressCountry: 'ES';
    };
  };
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  name: string;
  author: {
    '@type': 'Person';
    name: string;
    image?: string;
  };
  reviewBody: string;
  datePublished: string;
  isPartOf?: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
}

export interface ArticleJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Article' | 'BlogPosting';
  '@id'?: string;
  headline: string;
  description: string;
  image?: string[];
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  url?: string;
  keywords?: string;
}

export interface FAQJsonLd {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export interface BreadcrumbJsonLd {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

// Tipo base para breadcrumbs usado por componentes UI
export interface BreadcrumbItem {
  name: string;
  url: string;
}

// Tipos para utilidades SEO
export interface SEOData {
  title: string;
  description: string;
  canonical: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: 'website' | 'article';
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
    siteName: string;
    locale: 'es_ES';
  };

  additionalMetaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
}

// Tipos para configuración de imágenes
export interface ImageConfig {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
  fit?: 'crop' | 'fill' | 'max' | 'min' | 'scale';
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'entropy' | 'focalpoint';
  auto?: 'format' | 'compress';
  blur?: number;
  sharpen?: number;
}

// Tipos para paginación
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResults<T> {
  items: T[];
  pagination: PaginationInfo;
}

// Constantes de tipos
export const VENUE_SCHEMA_TYPES = [
  'Restaurant',
  'CafeOrCoffeeShop', 
  'BarOrPub',
  'LocalBusiness'
] as const;

export const PRICE_RANGES = ['€', '€€', '€€€', '€€€€'] as const;

export const RATING_CATEGORIES = [
  'food',
  'service', 
  'ambience',
  'value'
] as const;

// Tipos para Homepage con datos de Sanity
export interface HomepageData {
  featuredReviews: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    ratings: Ratings;
    gallery: SanityImage[];
    venue: {
      title: string;
      slug: { current: string };
      city: string;
      citySlug: string;
    };
  }>;
  featuredPosts: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    excerpt?: string;
    heroImage?: SanityImage;
    publishedAt: string;
  }>;
  featuredCities: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    description?: string;
    heroImage?: SanityImage;
    venueCount?: number;
  }>;
  featuredCategories: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    icon?: string;
    color?: string;
    description?: string;
    venueCount?: number;
  }>;
}
