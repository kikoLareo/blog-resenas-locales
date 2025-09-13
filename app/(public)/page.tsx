import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { HeroModern } from '@/components/HeroModern';
import { FeaturedSectionsModern } from '@/components/FeaturedSectionsModern';
import { sanityFetch } from '@/lib/sanity.client';
import { homepageQuery, homepageConfigQuery } from '@/sanity/lib/queries';
import { getAllFeaturedItems } from '@/lib/featured-admin';
import { defaultHomepageConfig } from '@/lib/homepage-admin';

// Mock data import for development
import reviewsData from '@/mocks/reviews.json';
import venuesData from '@/mocks/venues.json';
import topicsData from '@/mocks/topics.json';

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

// Transform mock data to match expected format
const transformMockReviews = (reviews: any[]) => {
  return reviews.map((review, index) => ({
    id: review._id,
    title: review.title,
    image: review.gallery?.asset?.url ?? '',
    rating: review.ratings?.food ?? 4.5,
    location: review.venue?.city ?? '',
    readTime: '5 min',
    tags: review.tags || [],
    description: review.tldr ?? '',
    href: `/${review.venue?.citySlug}/${review.venue?.slug?.current}/review/${review.slug?.current}`,
  }));
};

const transformMockVenues = (venues: any[]) => {
  return venues.map((venue) => ({
    id: venue._id,
    name: venue.name,
    image: venue.gallery?.[0]?.asset?.url ?? '',
    averageRating: venue.averageRating || 4.0,
    reviewCount: venue.reviewCount || 0,
    address: venue.address,
    neighborhood: venue.neighborhood,
    priceLevel: venue.priceLevel || 2,
    cuisine: venue.cuisine,
    href: `/${venue.citySlug}/${venue.slug.current}`,
    isOpen: venue.isOpen,
    openingHours: venue.openingHours,
  }));
};

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Descubre los mejores restaurantes y locales con reseñas auténticas y guías gastronómicas.',
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: 'Reseñas Gastronómicas Locales',
    description: 'Los mejores restaurantes cerca de ti con reseñas auténticas',
    type: 'website',
    url: SITE_CONFIG.url,
  }
};

// Componente para renderizar sección dinámicamente pero de forma estática
function renderSection(
  section: SectionConfig, 
  data: any, 
  featuredItems: any[],
  mockData: {
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
          trending={mockData.trendingReviews}
          topRated={mockData.topReviews}
          categories={mockData.categories}
          venues={mockData.venues}
        />
      );
    
    default:
      return null;
  }
}

export default async function HomePage() {
  // Fetch paralelo para optimizar rendimiento
  const [data, homepageConfig, featuredItems] = await Promise.all([
    sanityFetch<{
      featuredReviews: any[];
      trendingReviews: any[];
      topReviews: any[];
      featuredPosts: any[];
      featuredCities: any[];
      featuredCategories: any[];
    }>({
      query: homepageQuery,
      revalidate: 3600, // Cache por 1 hora
      tags: ['homepage', 'reviews'],
    }).catch((error) => {
      console.warn('Failed to fetch Sanity homepage data:', error.message);
      return {
        featuredReviews: [],
        trendingReviews: [],
        topReviews: [],
        featuredPosts: [],
        featuredCities: [],
        featuredCategories: []
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
    
    getAllFeaturedItems().catch((error) => {
      console.warn('Failed to fetch featured items:', error.message);
      return []; // Fallback en caso de error
    })
  ]);

  // Preparar datos mock como fallback
  const mockData = {
    trendingReviews: transformMockReviews(reviewsData.reviews.slice(0, 6)),
    topReviews: transformMockReviews(reviewsData.reviews.slice(0, 6).reverse()),
    venues: transformMockVenues(venuesData.venues.slice(0, 6)),
    categories: topicsData.topics.map(topic => ({
      id: topic._id,
      name: topic.name,
      slug: topic.slug.current,
      reviewCount: topic.reviewCount,
      color: topic.color,
      emoji: topic.emoji,
    })),
  };

  // Configuración por defecto si no existe en Sanity
  const sections = homepageConfig?.sections || defaultHomepageConfig;

  return (
    <div className="min-h-screen bg-white">
      {sections
        .filter(section => section.enabled) // Solo secciones habilitadas
        .sort((a, b) => (a.order || 0) - (b.order || 0)) // Ordenar por prioridad
        .map(section => renderSection(section, data, featuredItems, mockData))
        .filter(Boolean) // Remover elementos null
      }
    </div>
  );
}
