import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedSections } from '@/components/FeaturedSections';
import { NewsletterCTA } from '@/components/NewsletterCTA';

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Descubre los mejores restaurantes y locales con reseñas auténticas y guías gastronómicas.',
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturedSections />
      <NewsletterCTA />
    </div>
  );
}
