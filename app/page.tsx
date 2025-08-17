import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedSections } from '@/components/FeaturedSections';
import { NewsletterCTA } from '@/components/NewsletterCTA';
import { sanityFetch } from '@/lib/sanity.client';
import { homepageQuery } from '@/sanity/lib/queries';

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Descubre los mejores restaurantes y locales con reseñas auténticas y guías gastronómicas.',
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

export default async function HomePage() {
  // Obtener contenido destacado desde Sanity
  const data = await sanityFetch<{ featuredReviews: any[]; featuredPosts: any[]; featuredCities: any[]; featuredCategories: any[] }>({
    query: homepageQuery,
    revalidate: 900,
    tags: ['homepage'],
  });

  // Mapear reviews para Hero y Featured
  const heroItems = (data?.featuredReviews || []).slice(0, 3).map((r) => ({
    id: r._id,
    title: r.title,
    image: r.gallery?.asset?.url ?? r.gallery?.url ?? '',
    rating: (r.ratings?.food ?? 9),
    location: r.venue?.city ?? '',
    readTime: '5 min',
    tags: [],
    description: r.tldr ?? '',
  }));

  const trending = heroItems;
  const topRated = heroItems;

  return (
    <div className="min-h-screen bg-white">
      <HeroSection reviews={heroItems} />
      <FeaturedSections trending={trending} topRated={topRated} />
      <NewsletterCTA />
    </div>
  );
}
