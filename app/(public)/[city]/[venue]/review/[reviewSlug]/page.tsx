import { notFound } from 'next/navigation';
import { client } from '@/lib/sanity.client';
import { reviewDetailQuery } from '@/lib/public-queries';
import ReviewDetailPublic from '@/components/ReviewDetailPublic';
import type { Metadata } from 'next';

interface ReviewPageProps {
  params: Promise<{
    city: string;
    venue: string;
    reviewSlug: string;
  }>;
}

// Tipo de reseña completa
type ReviewWithVenue = {
  _id: string;
  title: string;
  slug: string;
  author: string;
  authorAvatar?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
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
  content?: string;
  gallery?: Array<{
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
    caption?: string;
  }>;
  tags?: string[];
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  venue: {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    address: string;
    phone?: string;
    website?: string;
    geo?: {
      lat: number;
      lng: number;
    };
    priceRange?: string;
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
  };
};

async function getReview(
  citySlug: string, 
  venueSlug: string, 
  reviewSlug: string
): Promise<ReviewWithVenue | null> {
  try {
    const review = await client.fetch(reviewDetailQuery, {
      citySlug,
      venueSlug,
      reviewSlug,
    });
    return review;
  } catch (error) {
    console.error('Error fetching review:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { city, venue: venueSlug, reviewSlug } = await params;
  const review = await getReview(city, venueSlug, reviewSlug);

  if (!review) {
    return {
      title: 'Reseña no encontrada',
      description: 'La reseña que buscas no existe o ha sido eliminada.',
    };
  }

  const avgRating = (
    review.ratings.food + 
    review.ratings.service + 
    review.ratings.ambience + 
    review.ratings.value
  ) / 4;
  
  const ratingText = avgRating >= 8 ? 'Excelente' : avgRating >= 6 ? 'Muy bueno' : avgRating >= 4 ? 'Bueno' : 'Regular';
  
  const title = `${review.venue.title} - Reseña ${ratingText} (${avgRating.toFixed(1)}/10) | ${review.venue.city.title}`;
  const description = review.tldr.slice(0, 160);
  
  const images = review.gallery?.map(img => ({
    url: img.asset.url,
    alt: img.alt || `${review.venue.title} - ${review.title}`,
    width: 1200,
    height: 800,
  })) || [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images,
      siteName: 'Blog de Reseñas Locales',
      publishedTime: review.publishedAt,
      authors: [review.author],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map(img => img.url),
    },
    alternates: {
      canonical: `/${city}/${venueSlug}/review/${reviewSlug}`,
    },
  };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { city, venue: venueSlug, reviewSlug } = await params;
  const review = await getReview(city, venueSlug, reviewSlug);

  if (!review) {
    notFound();
  }

  const avgRating = (
    review.ratings.food + 
    review.ratings.service + 
    review.ratings.ambience + 
    review.ratings.value
  ) / 4;

  // Generar JSON-LD para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: avgRating,
      bestRating: 10,
      worstRating: 0,
    },
    author: {
      '@type': 'Person',
      name: review.author,
    },
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: review.venue.title,
      address: {
        '@type': 'PostalAddress',
        streetAddress: review.venue.address,
        addressLocality: review.venue.city.title,
        addressRegion: review.venue.city.region,
        addressCountry: 'ES',
      },
      telephone: review.venue.phone,
      url: review.venue.website,
      image: review.venue.images?.map(img => img.asset.url) || [],
      priceRange: review.venue.priceRange,
      geo: review.venue.geo ? {
        '@type': 'GeoCoordinates',
        latitude: review.venue.geo.lat,
        longitude: review.venue.geo.lng,
      } : undefined,
    },
    reviewBody: review.tldr,
    datePublished: review.publishedAt,
    headline: review.title,
    image: review.gallery?.map(img => img.asset.url) || [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReviewDetailPublic review={review} />
    </>
  );
}
