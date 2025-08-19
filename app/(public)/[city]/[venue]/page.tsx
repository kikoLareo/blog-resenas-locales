import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { VenueBreadcrumbs } from '@/components/Breadcrumbs';
import LocalInfo from '@/components/LocalInfo';
import Gallery from '@/components/Gallery';
import { MultiScore, CompactScore } from '@/components/ScoreBar';
import FAQ from '@/components/FAQ';
import { SidebarAd, InArticleAd } from '@/components/AdSlot';
import { Venue, Review } from '@/lib/types';
import { SITE_CONFIG } from '@/lib/constants';
import { venuePageJsonLd } from '@/lib/schema';

type VenuePageProps = {
  params: Promise<{
    city: string;
    venue: string;
  }>;
};

// Datos temporales hardcodeados para desarrollo
const mockVenue: Venue = {
  _id: 'venue-madrid-cafe-encanto',
  title: 'Café con Encanto',
  slug: { current: 'cafe-con-encanto' },
  description: 'Un acogedor café en el corazón de Madrid que ofrece la mejor experiencia gastronómica con un ambiente único y personalizado.',
  address: 'Calle Gran Vía, 123',
  postalCode: '28013',
  phone: '+34 91 123 45 67',
  website: 'https://cafeconencanto.com',
  openingHours: [
    'Lunes 08:00-22:00',
    'Martes 08:00-22:00',
    'Miércoles 08:00-22:00',
    'Jueves 08:00-23:00',
    'Viernes 08:00-23:00',
    'Sábado 09:00-23:00',
    'Domingo 09:00-21:00'
  ],
  priceRange: '€€',
  schemaType: 'CafeOrCoffeeShop',
  images: [
    {
      _type: 'image',
      asset: {
        _id: 'image-1',
        url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
        metadata: {
          dimensions: {
            width: 800,
            height: 600,
            aspectRatio: 1.33
          }
        }
      },
      alt: 'Interior del café'
    }
  ],
  geo: {
    lat: 40.4168,
    lng: -3.7038
  },
  social: {
    instagram: '@cafeconencanto',
    facebook: 'cafeconencanto'
  },
  city: {
    _id: 'city-madrid',
    title: 'Madrid',
    slug: { current: 'madrid' },
    region: 'Comunidad de Madrid'
  },
  categories: [
    {
      _id: 'cat-cafe',
      title: 'Cafeterías',
      slug: { current: 'cafeterias' },
      icon: 'coffee',
      color: '#8B4513'
    },
    {
      _id: 'cat-brunch',
      title: 'Brunch',
      slug: { current: 'brunch' },
      icon: 'egg',
      color: '#FFD700'
    }
  ],
  reviews: []
};

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { venue: venueSlug, city } = await params;
  
  if (venueSlug !== 'cafe-con-encanto') {
    return {
      title: 'Local no encontrado',
    };
  }

  const venue = mockVenue;
  const title = `${venue.title} - ${venue.city.title}`;
  const description = `${venue.description}. Dirección, horarios, teléfono y reseñas.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      type: 'website',
      url: `${SITE_CONFIG.url}/${city}/${venueSlug}`,
      images: (venue.images && venue.images.length > 0) ? [
        {
          url: (venue.images[0] as any).asset?.url || (venue.images[0] as any).url,
          width: 1200,
          height: 630,
          alt: (venue.images[0] as any).alt || title,
        },
      ] : [],
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      images: (venue.images && venue.images.length > 0) ? [(venue.images[0] as any).asset?.url || (venue.images[0] as any).url] : [],
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${city}/${venueSlug}`,
    },
  };
}

// Loading components
function VenueInfoSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="flex space-x-4">
          <div className="h-20 bg-gray-200 rounded w-1/2" />
          <div className="h-20 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

// Review Card Component
function VenueReviewCard({ review }: { review: Review }) {
  const overallRating = (review.ratings.food + review.ratings.service + review.ratings.ambience + review.ratings.value) / 4;

  return (
    <article className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            <Link 
              href={`/${review.venue.city.slug.current}/${review.venue.slug.current}/review/${review.slug.current}`}
              className="hover:text-primary-600 transition-colors"
            >
              {review.title}
            </Link>
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <span>{review.author}</span>
            <span className="mx-2">•</span>
            <time dateTime={review.publishedAt} suppressHydrationWarning>
              {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(review.publishedAt))}
            </time>
          </div>
        </div>
        <CompactScore score={overallRating} />
      </div>

      {/* Ratings */}
      <div className="mb-4">
        <MultiScore 
          scores={[
            { label: 'Comida', value: review.ratings.food },
            { label: 'Servicio', value: review.ratings.service },
            { label: 'Ambiente', value: review.ratings.ambience },
            { label: 'Precio', value: review.ratings.value },
          ]}
          showAverage={false}
        />
      </div>

      {/* TLDR */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {review.tldr}
      </p>

      {/* Pros/Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-green-700 mb-2">✓ Pros</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {review.pros.map((pro, index) => (
              <li key={index}>• {pro}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-red-700 mb-2">✗ Contras</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {review.cons?.map((con, index) => (
              <li key={index}>• {con}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Read More Link */}
      <div className="pt-4 border-t border-gray-100">
        <Link
          href={`/${review.venue.city.slug.current}/${review.venue.slug.current}/review/${review.slug.current}`}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          Leer reseña completa →
        </Link>
      </div>
    </article>
  );
}

export default async function VenuePage({ params }: { params: Promise<{ city: string; venue: string }> }) {
  const { city, venue } = await params;
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Café con Encanto
        </h1>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-lg text-gray-700 mb-4">
            Ciudad: <strong>{city}</strong>
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Local: <strong>{venue}</strong>
          </p>
          <p className="text-gray-600">
            Un acogedor café en el corazón de Madrid que ofrece la mejor experiencia gastronómica con un ambiente único y personalizado.
          </p>
        </div>
      </div>
    </div>
  );
}