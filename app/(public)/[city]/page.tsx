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
    gallery[0],
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
  const city = await sanityFetch<City | null>({ query: cityQuery, params: { citySlug } });
  
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

// Venue Card Component
function VenueCard({ venue }: { venue: Venue }) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md overflow-hidden">
      {/* Image */}
      <div className="aspect-video bg-gray-100 relative">
        {venue.images?.[0] ? (
          <Image
            src={(venue.images[0] as any).asset?.url || (venue.images[0] as any).url}
            alt={(venue.images[0] as any).alt || venue.title}
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
        {venue.avgRating && (
          <div className="absolute top-4 right-4">
            <div className="bg-white rounded-full px-3 py-1 shadow-sm">
              <span className="text-sm font-semibold text-gray-900">
                {venue.avgRating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          <Link 
            href={`/${venue.city.slug.current}/${venue.slug.current}`}
            className="hover:text-primary-600 transition-colors"
          >
            {venue.title}
          </Link>
        </h3>

        {/* Address */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {venue.address}
        </div>

        {/* Description */}
        {venue.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {venue.description}
          </p>
        )}

        {/* Categories and Price Range */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {venue.categories.slice(0, 2).map((category) => (
              <span
                key={category._id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800"
              >
                {category.title}
              </span>
            ))}
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">
              {venue.priceRange}
            </span>
            {venue.reviewCount && (
              <span className="ml-2 text-sm text-gray-500">
                ({venue.reviewCount} reseñas)
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function CityPage({ params }: CityPageProps) {
  const { city: citySlug } = await params;
  const city = await sanityFetch<City | null>({ query: cityQuery, params: { citySlug } });
  const venues = await sanityFetch<Venue[]>({ query: venuesByCityQuery, params: { citySlug, $offset: 0, $limit: 12 } as any });
  const reviews = await sanityFetch<Review[]>({ query: reviewsByCityQuery, params: { citySlug } });

  if (!city) {
    notFound();
  }

  // Generate JSON-LD
  const jsonLd = cityPageJsonLd(city, venues);

  return (
    <>
      {/* JSON-LD Schema */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd, null, 0),
          }}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="container-wide py-4">
            <Breadcrumbs 
              items={[
                { name: 'Inicio', url: '/' },
                { name: city.title, url: `/${city.slug.current}` },
              ]}
            />
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-white">
          <div className="container-wide py-12">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Restaurantes en{' '}
                <span className="text-primary-600">{city.title}</span>
              </h1>
              {city.description && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {city.description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="text-sm text-gray-500">
                  {venues.length} locales • {reviews.length} reseñas
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container-wide py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <main className="lg:col-span-3">
              {/* Venues */}
              <section className="mb-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Locales destacados
                  </h2>
                  <Link
                    href={`/${(await params).city}/locales`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Ver todos →
                  </Link>
                </div>

                <Suspense fallback={
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <VenueCardSkeleton key={i} />
                    ))}
                  </div>
                }>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {venues.map((venue) => (
                      <VenueCard key={venue._id} venue={venue} />
                    ))}
                  </div>
                </Suspense>
              </section>

              {/* In-Article Ad */}
              <InArticleAd />

              {/* Recent Reviews */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Últimas reseñas
                  </h2>
                  <Link
                    href={`/${(await params).city}/resenas`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Ver todas →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              </section>
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Sidebar Ad */}
              <SidebarAd />

              {/* City Stats */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Estadísticas
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Locales:</span>
                    <span className="font-semibold">{venues.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reseñas:</span>
                    <span className="font-semibold">{reviews.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Puntuación media:</span>
                    <span className="font-semibold">
                      {venues.length > 0 
                        ? (venues.reduce((sum, v) => sum + (v.avgRating || 0), 0) / venues.length).toFixed(1)
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Popular Categories */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Categorías populares
                </h3>
                <ul className="space-y-3">
                  {[
                    'Restaurantes gallegos',
                    'Marisquerías',
                    'Bares de tapas',
                    'Cafeterías',
                  ].map((category, index) => (
                    <li key={index}>
                      <Link
                        href={`/categorias/${category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}