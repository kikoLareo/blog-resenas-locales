// Site configuration constants
export const SITE_CONFIG = {
  name: process.env.SITE_NAME || 'Blog de Reseñas',
  url: process.env.SITE_URL || 'https://example.com',
  description: 'Descubre los mejores locales y restaurantes con nuestras reseñas detalladas y honestas.',
  author: 'Blog de Reseñas Team',
  locale: 'es-ES',
  defaultImage: '/og/default.jpg',
} as const;

// Sanity configuration
export const SANITY_CONFIG = {
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_READ_TOKEN,
} as const;

// Price range mappings
export const PRICE_RANGES = {
  '€': 'Económico (€)',
  '€€': 'Moderado (€€)',
  '€€€': 'Caro (€€€)',
  '€€€€': 'Muy caro (€€€€)',
} as const;

// Rating scale mappings
export const RATING_SCALE = {
  0: 'Sin valorar',
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Muy bueno',
  6: 'Excelente',
  7: 'Sobresaliente',
  8: 'Excepcional',
  9: 'Perfecto',
  10: 'Legendario',
} as const;

// Rating colors for UI
export const RATING_COLORS = {
  poor: 'bg-red-500',      // 0-3
  fair: 'bg-orange-500',   // 4-5
  good: 'bg-yellow-500',   // 6-7
  'very-good': 'bg-lime-500',  // 8-9
  excellent: 'bg-green-500',   // 10
} as const;

// Schema.org types for venues
export const VENUE_SCHEMA_TYPES = {
  Restaurant: 'Restaurant',
  CafeOrCoffeeShop: 'CafeOrCoffeeShop',
  BarOrPub: 'BarOrPub',
  LocalBusiness: 'LocalBusiness',
} as const;

// Social media platforms
export const SOCIAL_PLATFORMS = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  maps: 'Google Maps',
} as const;

// Ad configuration
export const ADS_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true',
  provider: process.env.ADS_PROVIDER || 'none',
  scriptUrl: process.env.ADS_SCRIPT_URL || '',
  slots: {
    header: 'header-banner',
    sidebar: 'sidebar-300x250',
    inArticle: 'in-article-336x280',
    footer: 'footer-728x90',
  },
  sizes: {
    'header-banner': { width: 728, height: 90 },
    'sidebar-300x250': { width: 300, height: 250 },
    'in-article-336x280': { width: 336, height: 280 },
    'footer-728x90': { width: 728, height: 90 },
  },
} as const;

// Maps configuration
export const MAPS_CONFIG = {
  provider: process.env.MAPS_PROVIDER || 'google',
  googleMapsKey: process.env.GOOGLE_MAPS_KEY || '',
  defaultZoom: 15,
  defaultCenter: {
    lat: 42.8782, // Santiago de Compostela
    lng: -8.5448,
  },
} as const;

// Analytics configuration
export const ANALYTICS_CONFIG = {
  provider: process.env.ANALYTICS || 'none',
  googleAnalytics: {
    measurementId: process.env.GA_MEASUREMENT_ID || '',
  },
  plausible: {
    domain: process.env.PLAUSIBLE_DOMAIN || '',
  },
} as const;

// Pagination defaults
export const PAGINATION = {
  defaultPageSize: 12,
  maxPageSize: 50,
  reviewsPerVenue: 6,
  relatedPosts: 4,
} as const;

// Image sizes for optimization
export const IMAGE_SIZES = {
  thumbnail: { width: 300, height: 200 },
  card: { width: 600, height: 400 },
  hero: { width: 1200, height: 800 },
  gallery: { width: 800, height: 600 },
  og: { width: 1200, height: 630 },
} as const;

// Cache tags for ISR
export const CACHE_TAGS = {
  venues: 'venues',
  reviews: 'reviews',
  posts: 'posts',
  cities: 'cities',
  categories: 'categories',
  content: 'content',
} as const;

// Revalidation times (in seconds)
export const REVALIDATION_TIME = {
  static: 86400, // 24 hours
  dynamic: 3600, // 1 hour
  frequent: 300, // 5 minutes
} as const;

// SEO defaults
export const SEO_DEFAULTS = {
  titleTemplate: '%s | Blog de Reseñas',
  description: 'Descubre los mejores locales y restaurantes con nuestras reseñas detalladas y honestas.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Blog de Reseñas',
  },
  twitter: {
    cardType: 'summary_large_image',
    handle: '@blogresenas',
  },
} as const;

// Content limits for AEO optimization
export const CONTENT_LIMITS = {
  tldr: { min: 50, max: 75 }, // words
  faqAnswer: { min: 40, max: 55 }, // words
  metaDescription: { min: 150, max: 160 }, // characters
  title: { min: 50, max: 60 }, // characters
} as const;

// AEO (Answer Engine Optimization) configuration
export const AEO_CONFIG = {
  // Voice search optimization
  voiceSearch: {
    enabled: true,
    maxAnswerLength: 300, // characters for voice responses
    questionPatterns: [
      'cómo', 'qué', 'cuál', 'dónde', 'cuándo', 'por qué', 'quién'
    ],
  },
  
  // Featured snippets optimization
  featuredSnippets: {
    paragraphLength: 50, // words
    listItemCount: 8, // max items in lists
    tableColumns: 4, // max columns
  },
  
  // FAQ optimization
  faq: {
    minQuestions: 3,
    maxQuestions: 8,
    answerLength: { min: 40, max: 300 },
    requireQuestionMark: true,
  },
  
  // Schema.org requirements
  schema: {
    requiredTypes: ['LocalBusiness', 'Review', 'FAQPage'],
    speakableRequired: true,
    breadcrumbsRequired: true,
  },
  
  // Performance thresholds
  performance: {
    aeoScoreThreshold: 80, // minimum AEO score
    validationRequired: process.env.NODE_ENV === 'development',
  },
} as const;

// Voice search question templates
export const VOICE_SEARCH_TEMPLATES = {
  venue: {
    location: '¿Dónde está {name}?',
    hours: '¿A qué hora abre {name}?',
    price: '¿Cuánto cuesta comer en {name}?',
    quality: '¿Es bueno {name}?',
    food: '¿Qué sirven en {name}?',
    contact: '¿Cómo contactar con {name}?',
  },
  
  review: {
    rating: '¿Qué puntuación tiene {name}?',
    experience: '¿Cómo fue la experiencia en {name}?',
    recommendation: '¿Recomiendas {name}?',
    highlights: '¿Qué destacas de {name}?',
  },
  
  general: {
    best: '¿Cuáles son los mejores {category}?',
    nearby: '¿Qué {category} hay cerca?',
    popular: '¿Cuál es el {category} más popular?',
    recommended: '¿Qué {category} recomiendas?',
  },
} as const;
