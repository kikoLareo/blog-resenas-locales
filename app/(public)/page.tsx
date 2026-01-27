import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import HomeSaborLocalServer from '@/components/HomeSaborLocalServer';
import { sanityFetch } from '@/lib/sanity.client';
import { homepageQuery, homepageConfigQuery } from '@/sanity/lib/queries';
import { venuesByMasterCategoryQuery } from '@/lib/public-queries';
import { getAllFeaturedItems } from '@/lib/featured-admin';
import { defaultHomepageConfig } from '@/lib/homepage-admin';
import { FeaturedSectionsModern, HeroModern, VenueCard } from '@/components';
import { getVenueUrl, getReviewUrl } from '@/lib/utils';
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
    image: review.gallery?.asset?.url || review.gallery?.[0]?.asset?.url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&q=85',
    rating: review.ratings?.food || review.ratings?.overall || 4.5,
    location: review.venue?.city || 'Madrid',
    readTime: '5 min',
    tags: review.tags || ['Gastronomía'],
    description: review.tldr || review.title,
    href: getReviewUrl(
      review.venue?.citySlug || 'madrid',
      review.venue?.slug?.current || '',
      review.slug?.current || ''
    ),
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
    href: getVenueUrl(venue.city?.slug?.current || 'madrid', venue.slug?.current || ''),
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
  const [homepageData, masterCategoryData] = await Promise.all([
    sanityFetch<any>({
      query: homepageQuery,
      tags: ['homepage'],
    }),
    sanityFetch<any>({
      query: venuesByMasterCategoryQuery,
      tags: ['venues'],
    })
  ]);

  const {
    featuredReviews = [],
    recentReviews = [],
    trendingReviews = [],
    topRatedVenues = [],
    categories = [],
    cities = [],
  } = homepageData;

  // Transformar datos
  const transformedFeatured = transformSanityReviews(featuredReviews);
  const transformedTrending = transformSanityReviews(trendingReviews);
  const transformedTopRated = transformSanityVenues(topRatedVenues);
  const transformedCategories = transformSanityCategories(categories);

  return (
    <div className="flex flex-col gap-12 pb-20">
      <HeroModern featuredItems={transformedFeatured} />
      
      <div className="container mx-auto px-4 space-y-24">
        {/* Gastronomía Section */}
        {masterCategoryData.gastro?.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                <span className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400">🍽️</span>
                Gastronomía
              </h2>
              <Link href="/categorias?grupo=gastro" className="text-primary hover:underline font-medium">Ver todo</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {masterCategoryData.gastro.map((venue: any) => (
                <VenueCard 
                  key={venue._id} 
                  id={venue._id}
                  name={venue.title}
                  image={venue.images?.asset?.url || ''}
                  href={getVenueUrl(venue.citySlug, venue.slug)}
                  cuisine="Restaurante"
                  averageRating={venue.averageRating}
                  reviewCount={venue.reviewCount}
                  address={venue.address || ''}
                  priceLevel={venue.priceRange?.length || 2}
                />
              ))}
            </div>
          </section>
        )}

        {/* Ocio Section */}
        {masterCategoryData.ocio?.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                <span className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">🎭</span>
                Ocio y Entretenimiento
              </h2>
              <Link href="/categorias?grupo=ocio" className="text-primary hover:underline font-medium">Ver todo</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {masterCategoryData.ocio.map((venue: any) => (
                <VenueCard 
                  key={venue._id} 
                  id={venue._id}
                  name={venue.title}
                  image={venue.images?.asset?.url || ''}
                  href={getVenueUrl(venue.citySlug, venue.slug)}
                  cuisine="Ocio"
                  averageRating={0}
                  reviewCount={0}
                  address={venue.address || ''}
                  priceLevel={venue.priceRange?.length || 2}
                />
              ))}
            </div>
          </section>
        )}

        {/* Deportes Section */}
        {masterCategoryData.deportes?.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                <span className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">⚽</span>
                Deportes y Bienestar
              </h2>
              <Link href="/categorias?grupo=deportes" className="text-primary hover:underline font-medium">Ver todo</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {masterCategoryData.deportes.map((venue: any) => (
                <VenueCard 
                  key={venue._id} 
                  id={venue._id}
                  name={venue.title}
                  image={venue.images?.asset?.url || ''}
                  href={getVenueUrl(venue.citySlug, venue.slug)}
                  cuisine="Deportes"
                  averageRating={0}
                  reviewCount={0}
                  address={venue.address || ''}
                  priceLevel={venue.priceRange?.length || 2}
                />
              ))}
            </div>
          </section>
        )}

        <FeaturedSectionsModern 
          trending={transformedTrending}
          topRated={transformedTopRated}
          categories={transformedCategories}
        />
      </div>
    </div>
  );
}
