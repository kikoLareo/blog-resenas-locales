import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedSections } from '@/components/FeaturedSections';
import { NewsletterCTA } from '@/components/NewsletterCTA';

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Descubre los mejores restaurantes y locales con nuestras reseñas detalladas. Guías gastronómicas, recomendaciones y críticas honestas para encontrar tu próximo lugar favorito.',
  openGraph: {
    title: `${SITE_CONFIG.name} - Reseñas de restaurantes y locales`,
    description:
      'Descubre los mejores restaurantes y locales con nuestras reseñas detalladas y honestas.',
    type: 'website',
    url: SITE_CONFIG.url,
    images: [
      {
        url: `${SITE_CONFIG.url}/og/home.jpg`,
        width: 1200,
        height: 630,
        alt: 'Blog de Reseñas - Descubre los mejores locales',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} - Reseñas de restaurantes`,
    description:
      'Descubre los mejores restaurantes y locales con nuestras reseñas detalladas.',
    images: [`${SITE_CONFIG.url}/og/home.jpg`],
    creator: '@blogresenas',
    site: '@blogresenas',
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <FeaturedSections />
        <NewsletterCTA />
      </main>
    </div>
  );
}
