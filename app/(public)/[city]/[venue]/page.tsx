import { notFound } from 'next/navigation';
import { client } from '@/lib/sanity.client';
import { venueWithReviewsQuery } from '@/lib/public-queries';
import VenueDetail from '@/components/venues/VenueDetail';
import type { Metadata } from 'next';

interface VenuePageProps {
  params: Promise<{
    city: string;
    venue: string;
  }>;
}

// Definir el tipo del venue para TypeScript
type VenueWithReviews = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  address: string;
  postalCode?: string;
  phone?: string;
  website?: string;
  geo?: {
    lat: number;
    lng: number;
  };
  openingHours?: string;
  priceRange?: string;
  schemaType?: string;
  social?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  images?: Array<{
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
    caption?: string;
  }>;
  city: {
    _id: string;
    title: string;
    slug: string;
    region?: string;
  };
  categories: Array<{
    _id: string;
    title: string;
    slug: string;
    icon?: string;
    color?: string;
  }>;
  reviews: Array<{
    _id: string;
    title: string;
    slug: string;
    author: string;
    visitDate?: string;
    publishedAt: string;
    ratings: {
      food: number;
      service: number;
      ambience: number;
      value: number;
      overall: number;
    };
    avgTicket?: number;
    highlights?: string[];
    pros?: string[];
    cons?: string[];
    tldr: string;
    gallery?: Array<{
      asset: {
        _id: string;
        url: string;
      };
      alt?: string;
    }>;
    tags?: string[];
  }>;
  averageRating?: number;
  reviewCount: number;
};

async function getVenue(citySlug: string, venueSlug: string): Promise<VenueWithReviews | null> {
  try {
    const venue = await client.fetch(venueWithReviewsQuery, {
      citySlug,
      venueSlug,
    }, {
      cache: 'force-cache',
      next: { 
        revalidate: 3600, // 1 hour
        tags: ['venues', `venue-${venueSlug}`, `city-${citySlug}`]
      }
    });
    return venue;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { city, venue: venueSlug } = await params;
  const venue = await getVenue(city, venueSlug);

  if (!venue) {
    return {
      title: 'Local no encontrado',
      description: 'El local que buscas no existe o ha sido eliminado.',
    };
  }

  const averageRating = venue.averageRating || 0;
  const ratingText = averageRating >= 8 ? 'Excelente' : averageRating >= 6 ? 'Muy bueno' : averageRating >= 4 ? 'Bueno' : 'Regular';
  
  const title = venue.reviewCount > 0 
    ? `${venue.title} - ${ratingText} (${averageRating.toFixed(1)}/10) | ${venue.city.title}`
    : `${venue.title} | ${venue.city.title}`;
  
  const description = venue.description 
    ? venue.description.slice(0, 160)
    : `Descubre ${venue.title} en ${venue.city.title}. ${venue.priceRange ? `${venue.priceRange} • ` : ''}${venue.categories.map(c => c.title).join(', ')}`;

  const images = venue.images?.map(img => ({
    url: img.asset.url,
    alt: img.alt || venue.title,
    width: 1200,
    height: 800,
  })) || [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images,
      siteName: 'Blog de Reseñas Locales',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map(img => img.url),
    },
    alternates: {
      canonical: `/${city}/${venueSlug}`,
    },
  };
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { city, venue: venueSlug } = await params;
  const venue = await getVenue(city, venueSlug);

  if (!venue) {
    notFound();
  }

  // Generar JSON-LD para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: venue.title,
    description: venue.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address,
      addressLocality: venue.city.title,
      addressRegion: venue.city.region,
      postalCode: venue.postalCode,
      addressCountry: 'ES',
    },
    telephone: venue.phone,
    url: venue.website,
    image: venue.images?.map(img => img.asset.url) || [],
    priceRange: venue.priceRange,
    geo: venue.geo ? {
      '@type': 'GeoCoordinates',
      latitude: venue.geo.lat,
      longitude: venue.geo.lng,
    } : undefined,
    aggregateRating: venue.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: venue.averageRating,
      reviewCount: venue.reviewCount,
      bestRating: 10,
      worstRating: 0,
    } : undefined,
    review: venue.reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.publishedAt,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.ratings.overall,
        bestRating: 10,
        worstRating: 0,
      },
      reviewBody: review.tldr,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VenueDetail venue={venue} />
    </>
  );
}
