// Base types for the blog
export interface Image {
  asset: {
    _id: string;
    url: string;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  alt?: string;
  caption?: string;
}

export interface Slug {
  current: string;
  _type: 'slug';
}

export interface Reference {
  _ref: string;
  _type: 'reference';
}

// City type
export interface City {
  _id: string;
  _type: 'city';
  title: string;
  slug: Slug;
  region?: string;
  geo?: {
    lat: number;
    lng: number;
  };
  heroImage?: Image;
  description?: string;
}

// Category type
export interface Category {
  _id: string;
  _type: 'category';
  title: string;
  slug: Slug;
  description?: string;
}

// Venue type
export interface Venue {
  _id: string;
  _type: 'venue';
  title: string;
  slug: Slug;
  city: City;
  address: string;
  postalCode?: string;
  phone?: string;
  website?: string;
  geo?: {
    lat: number;
    lng: number;
  };
  openingHours?: string[];
  priceRange: '€' | '€€' | '€€€' | '€€€€';
  categories: Category[];
  images: Image[];
  description?: string;
  social?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    maps?: string;
  };
  schemaType: 'Restaurant' | 'CafeOrCoffeeShop' | 'BarOrPub' | 'LocalBusiness';
}

// Review type
export interface Review {
  _id: string;
  _type: 'review';
  title: string;
  slug: Slug;
  venue: Venue;
  visitDate: string;
  ratings: {
    food: number;
    service: number;
    ambience: number;
    value: number;
  };
  avgTicket?: number;
  highlights?: string[];
  pros: string[];
  cons: string[];
  tldr: string;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  body: unknown[]; // Portable Text blocks
  gallery: Image[];
  author: string;
  authorAvatar?: Image;
  tags?: string[];
  publishedAt: string;
}

// Post type
export interface Post {
  _id: string;
  _type: 'post';
  title: string;
  slug: Slug;
  excerpt?: string;
  cover?: Image;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  body: unknown[]; // Portable Text blocks
  tags?: string[];
  author: string;
  authorAvatar?: Image;
  publishedAt: string;
}

// Navigation and UI types
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface MenuItem {
  title: string;
  href: string;
  children?: MenuItem[];
}

// SEO types
export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

// JSON-LD types
export interface LocalBusinessJsonLd {
  '@context': string;
  '@type': string;
  name: string;
  address: {
    '@type': string;
    streetAddress: string;
    postalCode?: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  telephone?: string;
  url: string;
  geo?: {
    '@type': string;
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
  sameAs?: string[];
  aggregateRating?: {
    '@type': string;
    ratingValue: number;
    reviewCount: number;
  };
}

export interface ReviewJsonLd {
  '@context': string;
  '@type': string;
  itemReviewed: LocalBusinessJsonLd;
  author: {
    '@type': string;
    name: string;
  };
  reviewRating: {
    '@type': string;
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  datePublished: string;
  reviewBody: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Search types
export interface SearchParams {
  query?: string;
  city?: string;
  category?: string;
  priceRange?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  venues: Venue[];
  reviews: Review[];
  posts: Post[];
  total: number;
}
