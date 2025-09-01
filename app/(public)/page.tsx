import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedSections } from '@/components/FeaturedSections';
import { NewsletterCTA } from '@/components/NewsletterCTA';
import { sanityFetch } from '@/lib/sanity.client';
import { homepageQuery, homepageConfigQuery } from '@/sanity/lib/queries';
import { getAllFeaturedItems } from '@/lib/featured-admin';
import { defaultHomepageConfig } from '@/lib/homepage-admin';

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
  featuredItems: any[]
) {
  if (!section.enabled) return null;

  switch (section.type) {
    case 'hero':
      return <HeroSection key={section.id} featuredItems={featuredItems} />;
    
    case 'featured':
    case 'trending':
      const trendingData = (data.trendingReviews || []).slice(0, section.config.itemCount || 6).map((r: any) => ({
        id: r._id,
        title: r.title,
        image: r.gallery?.asset?.url ?? '',
        rating: (r.ratings?.food ?? 9),
        location: r.venue?.city ?? '',
        readTime: '5 min',
        tags: [],
        description: r.tldr ?? '',
        href: `/${r.venue?.citySlug}/${r.venue?.slug?.current}/review/${r.slug?.current}`,
      }));

      const topRatedData = (data.topReviews || []).slice(0, section.config.itemCount || 6).map((r: any) => ({
        id: r._id,
        title: r.title,
        image: r.gallery?.asset?.url ?? '',
        rating: (r.ratings?.food ?? 9),
        location: r.venue?.city ?? '',
        readTime: '5 min',
        tags: [],
        description: r.tldr ?? '',
        href: `/${r.venue?.citySlug}/${r.venue?.slug?.current}/review/${r.slug?.current}`,
      }));

      return (
        <FeaturedSections 
          key={section.id}
          trending={trendingData}
          topRated={topRatedData}
        />
      );
    
    case 'newsletter':
      return <NewsletterCTA key={section.id} />;
    
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
    }),
    
    sanityFetch<HomepageConfig>({
      query: homepageConfigQuery,
      revalidate: 3600, // Cache por 1 hora
      tags: ['homepage-config'],
    }),
    
    getAllFeaturedItems().catch(() => []) // Fallback en caso de error
  ]);

  // Configuración por defecto si no existe en Sanity
  const sections = homepageConfig?.sections || defaultHomepageConfig;

  return (
    <div className="min-h-screen bg-white">
      {sections
        .filter(section => section.enabled) // Solo secciones habilitadas
        .sort((a, b) => (a.order || 0) - (b.order || 0)) // Ordenar por prioridad
        .map(section => renderSection(section, data, featuredItems))
        .filter(Boolean) // Remover elementos null
      }
    </div>
  );
}
