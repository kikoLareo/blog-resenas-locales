// Tipos comunes
interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
}

interface SanitySlug {
  current: string;
}

interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
}

// Tipos específicos
export interface City extends SanityDocument {
  title: string;
  slug: SanitySlug;
  region: string;
  heroImage: SanityImage;
}

export interface Category extends SanityDocument {
  title: string;
  slug: SanitySlug;
  featured: boolean;
}

export interface Venue extends SanityDocument {
  title: string;
  slug: SanitySlug;
  city: {
    _ref: string;
    _type: 'reference';
  };
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
  categories: {
    _ref: string;
    _type: 'reference';
  }[];
  images: SanityImage[];
  description: string;
  social?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    maps?: string;
  };
  schemaType: 'Restaurant' | 'CafeOrCoffeeShop' | 'BarOrPub' | 'LocalBusiness' | 'Bakery' | 'FastFoodRestaurant';
}

export interface Review extends SanityDocument {
  title: string;
  slug: SanitySlug;
  venue: {
    _ref: string;
    _type: 'reference';
  };
  visitDate: string;
  publishedAt: string | null;
  ratings: {
    food: number;
    service: number;
    ambience: number;
    value: number;
  };
  avgTicket: number;
  pros: string[];
  cons: string[];
  tldr: string;
  faq: {
    question: string;
    answer: string;
  }[];
  gallery: SanityImage[];
  author: string;
  tags: string[];
}

export interface Post extends SanityDocument {
  title: string;
  slug: SanitySlug;
  excerpt: string;
  heroImage: SanityImage;
  publishedAt: string | null;
  featured: boolean;
  author: string;
  tags: string[];
  body: any[]; // Portable Text
}
