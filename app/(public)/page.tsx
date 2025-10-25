import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { HomeSaborLocal } from '@/components/HomeSaborLocal';
import { sanityFetch } from '@/lib/sanity.client';
import { homepageQuery, homepageConfigQuery } from '@/sanity/lib/queries';
import { defaultHomepageConfig } from '@/lib/homepage-admin';
import { FeaturedSectionsModern, HeroModern } from '@/components';
// Now using real Sanity data only - heroItems from reviews

// Force dynamic rendering in build environments to avoid timeout issues
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

// Tipos para las secciones configurables
interface SectionConfig {
  id: string;
  type: 'hero' | 'featured' | 'trending' | 'topRated' | 'categories' | 'newsletter';
  enabled: boolean;
  title?: string;
  order?: number;
  config: {
    title?: string;
    subtitle?: string;
    itemCount?: number;
    layout?: 'grid' | 'carousel' | 'list';
    showImages?: boolean;
  };
}

interface HomepageConfig {
  sections: SectionConfig[];
}

// Transform Sanity data to match expected format for components
const transformSanityReviews = (reviews: any[]) => {
  return reviews.map((review) => ({
    id: review._id,
    title: review.title,
    image: review.gallery?.asset?.url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&q=85',
    rating: review.ratings?.food || review.ratings?.overall || 4.5,
    location: review.venue?.city || 'Madrid',
    readTime: '5 min',
    tags: review.tags || ['Gastronomía'],
    description: review.tldr || review.title,
    href: `/${review.venue?.citySlug}/${review.venue?.slug?.current}/review/${review.slug?.current}`,
    isNew: false,
    isTrending: true,
    isPopular: review.ratings?.food >= 8.0,
    author: 'Equipo SaborLocal',
    publishedDate: review.publishedAt || new Date().toISOString(),
    viewCount: Math.floor(Math.random() * 2000) + 500,
    shareCount: Math.floor(Math.random() * 100) + 20,
    commentCount: Math.floor(Math.random() * 30) + 5,
    cuisine: review.venue?.title || 'Local',
    priceRange: '$$' as const,
    neighborhood: review.venue?.city || 'Madrid',
    openNow: true,
    deliveryAvailable: false,
    reservationRequired: false,
  }));
};

const transformSanityVenues = (venues: any[]) => {
  return venues.map((venue) => ({
    id: venue._id,
    name: venue.title,
    image: venue.images?.[0]?.asset?.url ?? '',
    averageRating: 4.0, // Will be calculated from reviews in the future
    reviewCount: venue.reviews?.length || 0,
    address: venue.address,
    neighborhood: venue.address?.split(',')[0] || '',
    priceLevel: venue.priceRange?.length || 2,
    cuisine: venue.categories?.[0]?.title || '',
    href: `/${venue.city?.slug?.current}/${venue.slug?.current}`,
    isOpen: true, // Default to open
    openingHours: venue.openingHours?.[0] || 'Consultar horarios',
  }));
};

const transformSanityCategories = (categories: any[]) => {
  return categories.map(category => ({
    id: category._id,
    name: category.title,
    slug: category.slug?.current || category.slug,
    count: category.venueCount || 0,
    color: category.color || '#3b82f6',
    emoji: category.icon || '🍴',
    image: category.heroImage?.asset?.url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&q=85',
    description: category.description || '',
  }));
};

export const metadata: Metadata = {
  title: 'SaborLocal - Descubre los Mejores Restaurantes y Locales Gastronómicos',
  description:
    'Encuentra los mejores restaurantes, bares y locales gastronómicos cerca de ti. Reseñas auténticas, guías especializadas y las últimas tendencias culinarias en SaborLocal.',
  keywords: [
    'restaurantes Madrid',
    'mejores restaurantes',
    'reseñas gastronómicas',
    'guías restaurantes',
    'comida local',
    'tendencias culinarias',
    'bares tapas',
    'cocina española',
    'restaurantes cerca',
    'SaborLocal'
  ],
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: 'SaborLocal - Reseñas Gastronómicas y Guías de Restaurantes',
    description: 'Descubre los mejores restaurantes y locales gastronómicos con reseñas auténticas y guías especializadas',
    type: 'website',
    url: SITE_CONFIG.url,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-home.jpg`,
        width: 1200,
        height: 630,
        alt: 'SaborLocal - Reseñas Gastronómicas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaborLocal - Descubre los Mejores Restaurantes',
    description: 'Reseñas auténticas y guías gastronómicas de los mejores locales',
    images: [`${SITE_CONFIG.url}/og-home.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Componente para renderizar sección dinámicamente pero de forma estática
function renderSection(
  section: SectionConfig, 
  data: any, 
  featuredItems: any[],
  sanityData: {
    trendingReviews: any[];
    topReviews: any[];
    venues: any[];
    categories: any[];
  }
) {
  if (!section.enabled) return null;

  switch (section.type) {
    case 'hero':
      return <HeroModern key={section.id} featuredItems={featuredItems} />;
    
    case 'featured':
    case 'trending':
      return (
        <FeaturedSectionsModern 
          key={section.id}
          trending={sanityData.trendingReviews}
          topRated={sanityData.topReviews}
          categories={sanityData.categories}
          venues={sanityData.venues}
        />
      );
    
    default:
      return null;
  }
}

export default async function HomePage() {
  // Fetch paralelo para optimizar rendimiento
  const [data, homepageConfig] = await Promise.all([
    sanityFetch<{
      heroItems: any[];
      featuredReviews: any[];
      trendingReviews: any[];
      topReviews: any[];
      featuredPosts: any[];
      featuredCities: any[];
      featuredCategories: any[];
      featuredVenues: any[];
    }>({
      query: homepageQuery,
      revalidate: 3600, // Cache por 1 hora
      tags: ['homepage', 'reviews'],
    }).catch((error) => {
      console.warn('Failed to fetch Sanity homepage data:', error.message);
      return {
        heroItems: [],
        featuredReviews: [],
        trendingReviews: [],
        topReviews: [],
        featuredPosts: [],
        featuredCities: [],
        featuredCategories: [],
        featuredVenues: []
      };
    }),
    
    sanityFetch<HomepageConfig>({
      query: homepageConfigQuery,
      revalidate: 3600, // Cache por 1 hora
      tags: ['homepage-config'],
    }).catch((error) => {
      console.warn('Failed to fetch homepage config:', error.message);
      return null;
    })
  ]);

  // Transformar heroItems para el carrusel principal
  const heroFeaturedItems = data.heroItems.map((review: any) => ({
    id: review._id,
    type: 'review' as const,
    title: review.title,
    description: review.summary || review.tldr || '',
    image: review.gallery?.asset?.url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop&q=85',
    href: `/${review.venue?.city?.slug?.current || 'madrid'}/${review.venue?.slug?.current || 'local'}/review/${review.slug?.current || 'review'}`,
    rating: review.ratings?.overall || review.ratings?.food || 4.5,
    location: `${review.venue?.city?.title || 'Madrid'}, España`,
    readTime: review.readTime ? `${review.readTime} min lectura` : '5 min lectura',
    tags: review.tags || [],
    isActive: true,
    order: 0,
    cuisine: review.venue?.cuisine || 'Gastronomía',
    neighborhood: review.venue?.address?.split(',')[0] || review.venue?.city?.title || '',
    priceRange: review.venue?.priceRange || '$$',
    author: review.author || 'Equipo SaborLocal',
    publishedDate: review.publishedAt ? new Date(review.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  }));

  // Preparar datos de Sanity transformados
  const sanityData = {
    trendingReviews: transformSanityReviews(data.trendingReviews || []),
    topReviews: transformSanityReviews(data.topReviews || []),
    venues: transformSanityVenues(data.featuredVenues || []),
    categories: transformSanityCategories(data.featuredCategories || []),
  };

  // Configuración por defecto si no existe en Sanity
  const sections = homepageConfig?.sections || defaultHomepageConfig;

  return (
    <HomeSaborLocal
      featuredItems={heroFeaturedItems}
      trendingReviews={sanityData.trendingReviews}
      topRatedReviews={sanityData.topReviews}
      categories={sanityData.categories}
      venues={sanityData.venues}
    />
  );
}
