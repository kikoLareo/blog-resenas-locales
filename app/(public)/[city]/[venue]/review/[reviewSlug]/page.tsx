import { notFound } from 'next/navigation';
import { client } from '@/lib/sanity.client';
import { reviewDetailQuery } from '@/lib/public-queries';
import ReviewDetailModern from '@/components/ReviewDetailModern';
import type { Metadata } from 'next';

// Mock data import for development
import reviewsData from '@/mocks/reviews.json';
import venuesData from '@/mocks/venues.json';

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
    // First try to get from Sanity
    const review = await client.fetch(reviewDetailQuery, {
      citySlug,
      venueSlug,
      reviewSlug,
    });
    
    if (review) {
      return review;
    }
  } catch (error) {
    console.warn('Failed to fetch from Sanity, using mock data:', error);
  }
  
  // Fallback to mock data
  const mockReview = reviewsData.reviews.find(r => 
    r.slug.current === reviewSlug && 
    r.venue.slug.current === venueSlug &&
    r.venue.citySlug === citySlug
  );
  
  if (!mockReview) {
    return null;
  }
  
  const mockVenue = venuesData.venues.find(v => v.slug.current === venueSlug);
  
  // Transform mock data to match expected format
  return {
    _id: mockReview._id,
    title: mockReview.title,
    slug: mockReview.slug.current,
    author: mockReview.author.name,
    authorAvatar: mockReview.author.avatar ? {
      asset: {
        _id: 'mock-avatar',
        url: mockReview.author.avatar
      }
    } : undefined,
    publishedAt: mockReview.publishedAt,
    ratings: {
      food: mockReview.ratings.food * 2, // Convert 0-5 to 0-10 scale
      service: mockReview.ratings.service * 2,
      ambience: mockReview.ratings.atmosphere * 2,
      value: mockReview.ratings.value * 2,
      overall: (mockReview.ratings.food + mockReview.ratings.service + mockReview.ratings.atmosphere + mockReview.ratings.value) * 0.5
    },
    highlights: mockReview.recommendedDishes,
    tldr: mockReview.tldr,
    content: mockReview.content,
    gallery: mockReview.gallery ? [{
      asset: {
        _id: 'mock-gallery',
        url: mockReview.gallery.asset.url
      },
      alt: `${mockReview.venue.name} - ${mockReview.title}`
    }] : [],
    tags: mockReview.tags,
    venue: {
      _id: mockReview.venue.name.replace(/\s+/g, '-').toLowerCase(),
      title: mockReview.venue.name,
      slug: mockReview.venue.slug.current,
      address: mockReview.venue.address,
      phone: mockVenue?.phone,
      website: mockVenue?.website,
      geo: mockVenue?.location ? {
        lat: mockVenue.location.lat,
        lng: mockVenue.location.lng
      } : undefined,
      priceRange: mockVenue ? '$'.repeat(mockVenue.priceLevel) : undefined,
      images: mockVenue?.gallery ? mockVenue.gallery.map(img => ({
        asset: {
          _id: 'mock-venue-image',
          url: img.asset.url
        }
      })) : [],
      city: {
        _id: mockReview.venue.citySlug,
        title: mockReview.venue.city,
        slug: mockReview.venue.citySlug,
        region: 'España'
      },
      categories: mockReview.tags.map(tag => ({
        _id: tag.toLowerCase().replace(/\s+/g, '-'),
        title: tag,
        slug: tag.toLowerCase().replace(/\s+/g, '-')
      }))
    }
  };
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

  const avgRating = review.ratings ? (
    review.ratings.food + 
    review.ratings.service + 
    review.ratings.ambience + 
    review.ratings.value
  ) / 4 : 0;
  
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

  const avgRating = review.ratings ? (
    review.ratings.food + 
    review.ratings.service + 
    review.ratings.ambience + 
    review.ratings.value
  ) / 4 : 0;

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
      <ReviewDetailModern review={review} />
    </>
  );
}
