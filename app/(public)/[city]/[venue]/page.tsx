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
import { sanityFetch } from '@/lib/sanity.client';
import { venueQuery } from '@/sanity/lib/queries';

type VenuePageProps = {
  params: Promise<{
    city: string;
    venue: string;
  }>;
};

//

// mockReviews eliminado: las reseñas se cargan desde Sanity

// Generate metadata
const reviewsByVenueQuery = `
  *[_type == "review" && venue->slug.current == $venueSlug] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    tldr,
    visitDate,
    publishedAt,
    ratings,
    pros,
    cons,
    author,
    venue->{
      title,
      slug,
      city->{title, slug}
    }
  }
`;

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { venue: venueSlug, city } = await params;
  const venue = await sanityFetch<Venue | null>({ query: venueQuery, params: { slug: venueSlug } });
  
  if (!venue) {
    return {
      title: 'Local no encontrado',
    };
  }

  const title = `${venue.title} - ${venue.city.title}`;
  const description = `${venue.description || `Información completa sobre ${venue.title} en ${venue.city.title}`}. Dirección, horarios, teléfono y reseñas.`;

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

export default async function VenuePage({ params }: VenuePageProps) {
  const { venue: venueSlug } = await params;
  const venue = await sanityFetch<Venue | null>({ query: venueQuery, params: { slug: venueSlug }, tags: ['venues'], revalidate: 0 });
  const reviews = await sanityFetch<Review[]>({ query: reviewsByVenueQuery, params: { venueSlug }, tags: ['reviews'], revalidate: 0 });

  if (!venue) {
    notFound();
  }

  // Calculate average ratings from reviews
  const avgRatings = reviews.length > 0 ? {
    food: reviews.reduce((sum, r) => sum + r.ratings.food, 0) / reviews.length,
    service: reviews.reduce((sum, r) => sum + r.ratings.service, 0) / reviews.length,
    ambience: reviews.reduce((sum, r) => sum + r.ratings.ambience, 0) / reviews.length,
    value: reviews.reduce((sum, r) => sum + r.ratings.value, 0) / reviews.length,
  } : null;

  const overallRating = avgRatings ? 
    (avgRatings.food + avgRatings.service + avgRatings.ambience + avgRatings.value) / 4 : 0;

  // Generate JSON-LD
  const jsonLd = venuePageJsonLd(venue, reviews);

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
          <VenueBreadcrumbs 
            city={venue.city.title}
            venue={venue.title}
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="container-wide py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Venue Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {venue.title}
                  </h1>
                  <div className="flex items-center text-lg text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {venue.address}, {venue.city.title}
                  </div>
                </div>
                
                {reviews.length > 0 && (
                  <div className="text-right">
                    <CompactScore score={overallRating} className="mb-2" />
                    <div className="text-sm text-gray-600">
                      {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
                    </div>
                  </div>
                )}
              </div>

              {venue.description && (
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {venue.description}
                </p>
              )}

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-8">
                {venue.categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/categorias/${category.slug.current}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Info Sidebar */}
            <div className="lg:col-span-1">
              <Suspense fallback={<VenueInfoSkeleton />}>
                <LocalInfo venue={venue} compact showMap={false} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {venue.images && venue.images.length > 0 && (
        <section className="bg-white border-t border-gray-200">
          <div className="container-wide py-8">
            <Gallery 
              images={venue.images as any}
              title="Fotos del local"
              columns={3}
              priority
            />
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {/* Average Ratings */}
            {avgRatings && (
              <section className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Puntuaciones
                </h2>
                <MultiScore 
                  scores={[
                    { label: 'Comida', value: avgRatings.food },
                    { label: 'Servicio', value: avgRatings.service },
                    { label: 'Ambiente', value: avgRatings.ambience },
                    { label: 'Relación calidad-precio', value: avgRatings.value },
                  ]}
                  showAverage={true}
                />
              </section>
            )}

            {/* In-Article Ad */}
            <InArticleAd />

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Reseñas ({reviews.length})
                </h2>
                <Link
                  href={`/${(await params).city}/${(await params).venue}/resenas`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ver todas →
                </Link>
              </div>

              <Suspense fallback={
                <div className="space-y-6">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <ReviewCardSkeleton key={i} />
                  ))}
                </div>
              }>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <VenueReviewCard key={review._id} review={review} />
                  ))}
                </div>
              </Suspense>
            </section>

            {/* FAQ Section */}
            {reviews[0]?.faq && reviews[0].faq.length > 0 && (
              <section>
                <FAQ 
                  faqs={reviews[0].faq}
                  title="Preguntas frecuentes"
                />
              </section>
            )}

            {/* Full Local Info */}
            <section>
              <LocalInfo venue={venue} showMap={true} />
            </section>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Sidebar Ad */}
            <SidebarAd />

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Acciones rápidas
              </h3>
              <div className="space-y-3">
                {venue.phone && (
                  <a
                    href={`tel:${venue.phone}`}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-center font-medium flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Llamar
                  </a>
                )}
                
                {venue.geo && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${venue.geo.lat},${venue.geo.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-center font-medium flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Cómo llegar
                  </a>
                )}

                {venue.website && (
                  <a
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-center font-medium flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Sitio web
                  </a>
                )}
              </div>
            </div>

            {/* Related Venues */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Locales similares
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Próximamente: recomendaciones personalizadas basadas en tus gustos.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
      </div>
    </>
  );
}