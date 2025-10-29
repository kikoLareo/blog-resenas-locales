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
    value?: number;
    valueForMoney?: number;
    overall: number;
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

// QR Code types
export interface QRCode extends SanityDocument {
  title: string;
  code: string;
  venue: {
    _ref: string;
    _type: 'reference';
  } | Venue;
  isActive: boolean;
  isOnboarding: boolean;
  isUsed: boolean;
  usedAt?: string;
  expiresAt?: string;
  maxUses?: number;
  currentUses: number;
  lastUsedAt?: string;
  description?: string;
  submission?: {
    _ref: string;
    _type: 'reference';
  } | VenueSubmission;
}

// Opening Hours type
export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

// Venue Submission types
export interface VenueSubmission extends SanityDocument {
  status: 'pending' | 'approved' | 'rejected';
  qrCode: {
    _ref: string;
    _type: 'reference';
  } | QRCode;
  submittedAt: string;
  submittedBy: string;
  
  // Venue data
  title: string;
  slug: SanitySlug;
  description: string;
  address: string;
  postalCode?: string;
  city: {
    _ref: string;
    _type: 'reference';
  } | City;
  categories: ({
    _ref: string;
    _type: 'reference';
  } | Category)[];
  
  // Contact info
  phone: string;
  email: string;
  website?: string;
  
  // Additional info
  priceRange: '€' | '€€' | '€€€' | '€€€€';
  openingHours?: OpeningHours;
  geo?: {
    lat: number;
    lng: number;
    alt?: number;
  };
  images: SanityImage[];
  
  // Approval process
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  createdVenue?: {
    _ref: string;
    _type: 'reference';
  } | Venue;
  internalNotes?: string;
}
