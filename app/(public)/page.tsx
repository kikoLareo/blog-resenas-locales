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
  return reviews.map((review) => {
    const venueSlug = typeof review.venue?.slug === 'string' 
      ? review.venue.slug 
      : review.venue?.slug?.current || '';
    
    const reviewSlug = typeof review.slug === 'string'
      ? review.slug
      : review.slug?.current || '';

    return {
      id: review._id,
      title: review.title,
      image: review.gallery?.asset?.url || review.gallery?.[0]?.asset?.url || review.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&q=85',
      rating: review.ratings?.food || review.ratings?.overall || 4.5,
      location: review.venue?.city || 'Madrid',
      readTime: '5 min',
      tags: review.tags || ['Gastronomía'],
      description: review.tldr || review.title,
      href: getReviewUrl(
        review.venue?.citySlug || 'madrid',
        venueSlug,
        reviewSlug
      ),
      isNew: false,
      isTrending: true,
      isPopular: (review.ratings?.food || 0) >= 8.0,
      author: review.author || 'Equipo SaborLocal',
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
    };
  });
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
  const [homepageData, masterCategoryData, homepageConfig] = await Promise.all([
    sanityFetch<any>({
      query: homepageQuery,
      tags: ['homepage'],
    }).catch(err => {
      console.error('Error fetching homepage data:', err);
      return null;
    }),
    sanityFetch<any>({
      query: venuesByMasterCategoryQuery,
      tags: ['venues'],
    }).catch(err => {
      console.error('Error fetching master category data:', err);
      return null;
    }),
    sanityFetch<any>({
      query: homepageConfigQuery,
      tags: ['homepageConfig'],
    }).catch(err => {
      console.error('Error fetching homepage config:', err);
      return null;
    })
  ]);

  if (!homepageData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-bold mb-4">¡Ups! Algo salió mal</h1>
        <p className="text-muted-foreground mb-8">No hemos podido cargar los datos de la página principal. Por favor, inténtalo de nuevo más tarde.</p>
        <Link href="/" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity">
          Reintentar
        </Link>
      </div>
    );
  }

  const {
    featuredReviews = [],
    recentReviews = [],
    trendingReviews = [],
    topReviews = [],
    categories = [],
    cities = [],
  } = homepageData;

  // Transformar datos
  const transformedFeatured = transformSanityReviews(featuredReviews || []);
  const transformedTrending = transformSanityReviews(trendingReviews || []);
  const transformedTopRated = transformSanityReviews(topReviews || []);
  const transformedCategories = transformSanityCategories(categories || []);

  const hasMasterCategories = masterCategoryData && (
    (masterCategoryData.gastro?.length > 0) || 
    (masterCategoryData.ocio?.length > 0) || 
    (masterCategoryData.deportes?.length > 0)
  );

  // Si no hay configuración en Sanity, usar el orden por defecto
  const sections = homepageConfig?.sections || [
    { id: 'hero', type: 'hero', enabled: true },
    { id: 'master-gastro', type: 'master-categories', enabled: true, config: { masterCategory: 'gastro' } },
    { id: 'master-ocio', type: 'master-categories', enabled: true, config: { masterCategory: 'ocio' } },
    { id: 'master-deportes', type: 'master-categories', enabled: true, config: { masterCategory: 'deportes' } },
    { id: 'featured-sections', type: 'featured', enabled: true }
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {sections.map((section: any) => {
        if (!section.enabled) return null;

        switch (section.type) {
          case 'hero':
            return <HeroModern key={section.id} featuredItems={transformedFeatured} />;
          
          case 'featured':
          case 'trending':
          case 'topRated':
            return (
              <div key={section.id} className="container mx-auto px-4">
                <FeaturedSectionsModern 
                  trending={transformedTrending}
                  topRated={transformedTopRated}
                  categories={transformedCategories}
                  venues={[]} 
                />
              </div>
            );

          case 'categories':
            return (
              <div key={section.id} className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-8">
                  {section.title || section.config?.title || 'Explora por Categorías'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {transformedCategories.map((cat: any) => (
                    <Link 
                      key={cat.id} 
                      href={`/categorias/${cat.slug}`}
                      className="group flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                        {cat.emoji || '🍴'}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100 text-center">
                        {cat.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {cat.count} locales
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );

          case 'master-categories':
            const mCat = section.config?.masterCategory;
            const data = masterCategoryData?.[mCat];
            if (!data || data.length === 0) return null;

            const config = {
              gastro: { title: 'Gastronomía', icon: '🍽️', color: 'orange', link: '/categorias?grupo=gastro' },
              ocio: { title: 'Ocio y Entretenimiento', icon: '🎭', color: 'purple', link: '/categorias?grupo=ocio' },
              deportes: { title: 'Deportes y Bienestar', icon: '⚽', color: 'green', link: '/categorias?grupo=deportes' },
            }[mCat as 'gastro' | 'ocio' | 'deportes'];

            if (!config) return null;

            return (
              <section key={section.id} className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                    <span className={`bg-${config.color}-100 dark:bg-${config.color}-900/30 p-2 rounded-lg text-${config.color}-600 dark:text-${config.color}-400`}>
                      {config.icon}
                    </span>
                    {config.title}
                  </h2>
                  <Link href={config.link} className="text-primary hover:underline font-medium">Ver todo</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.map((venue: any) => (
                    <VenueCard 
                      key={venue._id} 
                      id={venue._id}
                      name={venue.title}
                      image={venue.images?.asset?.url || venue.images?.[0]?.asset?.url || ''}
                      href={getVenueUrl(venue.citySlug, venue.slug)}
                      cuisine={config.title}
                      averageRating={venue.averageRating}
                      reviewCount={venue.reviewCount}
                      address={venue.address || ''}
                      priceLevel={venue.priceRange?.length || 2}
                    />
                  ))}
                </div>
              </section>
            );
          
          default:
            return null;
        }
      })}
    </div>
  );
}
