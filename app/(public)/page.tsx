import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import HomeSaborLocalServer from '@/components/HomeSaborLocalServer';
import { sanityFetch } from '@/lib/sanity.client';
import { homepageQuery, homepageConfigQuery } from '@/sanity/lib/queries';
import { getAllFeaturedItems } from '@/lib/featured-admin';
import { defaultHomepageConfig } from '@/lib/homepage-admin';
import { FeaturedSectionsModern, HeroModern } from '@/components';
// Using featuredItems from Sanity for hero carousel

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
  const [data, homepageConfig, allFeaturedItems] = await Promise.all([
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
    }),

    // Obtener featuredItems del dashboard
    getAllFeaturedItems().catch((error) => {
      console.warn('Failed to fetch featured items:', error.message);
      return [];
    })
  ]);

  // Filtrar solo los featuredItems activos y transformarlos para el hero
  const heroFeaturedItems = allFeaturedItems
    .filter((item: any) => item.isActive === true)
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    .map((item: any) => {
      // Si es tipo review y tiene reviewRef, usar datos de la review
      if (item.type === 'review' && item.reviewRef) {
        const review = item.reviewRef;
        return {
          id: item._id,
          type: 'review' as const,
          title: item.customTitle || review.title,
          description: item.customDescription || review.summary || review.tldr || '',
          image: review.gallery?.asset?.url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop&q=85',
          href: item.customUrl || `/${review.venue?.city?.slug?.current || 'madrid'}/${review.venue?.slug?.current || 'local'}/review/${review.slug?.current || 'review'}`,
          rating: review.ratings?.overall || review.ratings?.food || 4.5,
          location: `${review.venue?.city?.title || 'Madrid'}, España`,
          readTime: review.readTime ? `${review.readTime} min lectura` : '5 min lectura',
          tags: review.tags || [],
          isActive: true,
          order: item.order || 0,
          cuisine: review.venue?.cuisine || 'Gastronomía',
          neighborhood: review.venue?.address?.split(',')[0] || review.venue?.city?.title || '',
          priceRange: review.venue?.priceRange || '$$',
          author: review.author || 'Equipo SaborLocal',
          publishedDate: review.publishedAt ? new Date(review.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          ctaText: item.customCTA || 'Leer reseña completa',
        };
      }
      
      // Si es tipo venue y tiene venueRef, usar datos del venue
      if (item.type === 'venue' && item.venueRef) {
        const venue = item.venueRef;
        return {
          id: item._id,
          type: 'venue' as const,
          title: item.customTitle || venue.title,
          description: item.customDescription || venue.description || `Descubre ${venue.title} en ${venue.city?.title || 'España'}`,
          image: venue.images?.asset?.url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop&q=85',
          href: item.customUrl || `/${venue.city?.slug?.current || 'madrid'}/${venue.slug?.current}`,
          rating: venue.averageRating || 4.5,
          location: `${venue.city?.title || 'Madrid'}, España`,
          readTime: `${venue.reviewCount || 0} reseñas`,
          tags: venue.categories?.map((c: any) => c.title) || [],
          isActive: true,
          order: item.order || 0,
          cuisine: venue.cuisine || venue.categories?.[0]?.title || 'Local',
          neighborhood: venue.address?.split(',')[0] || venue.city?.title || '',
          priceRange: venue.priceRange || '$$',
          ctaText: item.customCTA || 'Ver local',
          reviewCount: venue.reviewCount || 0,
        };
      }
      
      // Si no tiene reviewRef o venueRef, usar los datos custom del featuredItem
      return {
        id: item._id,
        type: item.type,
        title: item.customTitle || item.title,
        description: item.customDescription || '',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop&q=85',
        href: item.customUrl || '/',
        isActive: true,
        order: item.order || 0,
        ctaText: item.customCTA || 'Ver más',
      };
    });

  // Si no hay featuredItems activos, usar heroItems de reviews como fallback
  const finalHeroItems = heroFeaturedItems.length > 0 
    ? heroFeaturedItems 
    : data.heroItems.map((review: any) => ({
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

  return (
    <HomeSaborLocalServer />
  );
}
