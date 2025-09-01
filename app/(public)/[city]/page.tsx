import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
// import { ReviewCard } from '@/components/ReviewCard'; // Component will be created inline
import { SidebarAd, InArticleAd } from '@/components/AdSlot';
import { Venue, Review, City } from '@/lib/types';
import { SITE_CONFIG } from '@/lib/constants';
import { cityPageJsonLd } from '@/lib/schema';
import { sanityFetch } from '@/lib/sanity.client';
import { cityQuery, venuesByCityQuery } from '@/sanity/lib/queries';
import VenueCard from '@/components/VenueCard';

type CityPageProps = {
  params: Promise<{
    city: string;
  }>;
};

// Reseñas por ciudad (limit 6)
const reviewsByCityQuery = `
  *[_type == "review" && venue->city->slug.current == $citySlug] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    tldr,
    publishedAt,
    ratings,
    author,
    gallery[0]{..., "asset": asset->{url, metadata}},
    venue->{
      title,
      slug,
      city->{title, slug}
    }
  }
`;

// Generate metadata
export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = await sanityFetch<City | null>({ query: cityQuery, params: { citySlug }, tags: ['cities'], revalidate: 0 });
  
  if (!city) {
    return {
      title: 'Ciudad no encontrada',
    };
  }

  const title = `Restaurantes en ${city.title}`;
  const description = `Descubre los mejores restaurantes y locales en ${city.title}. ${city.description || 'Reseñas, direcciones y recomendaciones de los mejores lugares para comer.'}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      type: 'website',
      url: `${SITE_CONFIG.url}/${citySlug}`,
      images: (city as any).heroImage ? [
        {
          url: (city as any).heroImage.asset.url,
          width: 1200,
          height: 630,
          alt: (city as any).heroImage.alt || title,
        },
      ] : [],
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      images: (city as any).heroImage ? [(city as any).heroImage.asset.url] : [],
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${citySlug}`,
    },
  };
}

// Loading components
function VenueCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

// Review Card Component
function ReviewCard({ review }: { review: Review }) {
  const overallRating = (review.ratings.food + review.ratings.service + review.ratings.ambience + review.ratings.value) / 4;

  return (
    <article className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md overflow-hidden">
      {/* Image */}
      <div className="aspect-video bg-gray-100 relative">
        {review.gallery?.[0] ? (
          <Image
            src={(review as any).gallery?.asset?.url || (review as any).gallery?.url}
            alt={(review as any).gallery?.alt || review.title}
            fill
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white rounded-full px-3 py-1 shadow-sm">
            <span className="text-sm font-semibold text-gray-900">
              {overallRating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Venue Info */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {review.venue.title} • {review.venue.city.title}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link 
            href={`/${review.venue.city.slug.current}/${review.venue.slug.current}/review/${review.slug.current}`}
            className="hover:text-primary-600 transition-colors"
          >
            {review.title}
          </Link>
        </h3>

        {/* TLDR */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {review.tldr}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <span>{review.author}</span>
          <time dateTime={review.publishedAt} suppressHydrationWarning>
            {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(review.publishedAt))}
          </time>
        </div>
      </div>
    </article>
  );
}

export default async function CityPage({ params }: CityPageProps) {
  const { city: citySlug } = await params;
  
  try {
    // Fetch city data
    const city = await sanityFetch<City | null>({
      query: cityQuery,
      params: { citySlug },
      tags: ['cities', `city-${citySlug}`],
      revalidate: 3600,
    });

    if (!city) {
      notFound();
    }

    // Fetch venues and reviews for this city
    const [venues, reviews] = await Promise.all([
      sanityFetch<Venue[]>({
        query: venuesByCityQuery,
        params: { citySlug, offset: 0, limit: 12 },
        tags: ['venues', `city-${citySlug}`],
        revalidate: 3600,
      }),
      sanityFetch<Review[]>({
        query: reviewsByCityQuery,
        params: { citySlug },
        tags: ['reviews', `city-${citySlug}`],
        revalidate: 3600,
      }),
    ]);

    // Generate JSON-LD for SEO
    const jsonLd = cityPageJsonLd(city, venues);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <div className="min-h-screen bg-gray-50">
          {/* Breadcrumbs */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <Breadcrumbs
                items={[
                  { name: 'Inicio', url: '/' },
                  { name: city.title, url: `/${citySlug}` },
                ]}
              />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Restaurantes en {city.title}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {city.description || `Descubre los mejores restaurantes y locales en ${city.title}. Reseñas auténticas y recomendaciones locales.`}
              </p>
              
              {/* Stats */}
              <div className="flex justify-center items-center gap-8 mt-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {venues.length} locales
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {reviews.length} reseñas
                </span>
              </div>
            </div>

            {/* Featured Reviews Section */}
            {reviews.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Últimas reseñas</h2>
                  <Link href={`/${citySlug}/reviews`} className="text-blue-600 hover:text-blue-800 font-medium">
                    Ver todas →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.slice(0, 6).map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              </section>
            )}

            {/* Venues Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Todos los locales</h2>
                {venues.length >= 12 && (
                  <Link href={`/${citySlug}/locales`} className="text-blue-600 hover:text-blue-800 font-medium">
                    Ver todos →
                  </Link>
                )}
              </div>

              {venues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {venues.map((venue) => (
                    <VenueCard key={venue._id} venue={venue} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aún no hay locales en {city.title}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Estamos trabajando para incluir más locales en esta ciudad.
                  </p>
                  <Link 
                    href="/contacto" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Sugerir un local
                  </Link>
                </div>
              )}
            </section>

            {/* Ad Slots */}
            <div className="mt-16">
              <InArticleAd />
            </div>
          </div>

          {/* Sidebar Ad */}
          <div className="hidden lg:block">
            <SidebarAd />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading city page:', error);
    notFound();
  }
}