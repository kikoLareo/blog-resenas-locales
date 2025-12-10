import { calculateOverallRating } from '@/lib/rating';
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

type VenuePageProps = {
  params: Promise<{
    city: string;
    slug: string;
  }>;
};

export default async function VenuePage({ params }: VenuePageProps) {
  const { city, slug } = await params;
  
  // Query para obtener venue completo con reseñas
  const venueDetailQuery = `
    *[_type == "venue" && slug.current == $slug && city->slug.current == $citySlug][0] {
      _id,
      title,
      slug,
      description,
      address,
      postalCode,
      phone,
      website,
      openingHours,
      priceRange,
      schemaType,
      images[] {
        _type,
        asset-> {
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        alt,
        caption
      },
      geo,
      social,
      city-> {
        _id,
        title,
        slug,
        region
      },
      categories[]-> {
        _id,
        title,
        slug,
        icon,
        color
      },
      "reviews": *[_type == "review" && venue._ref == ^._id] | order(publishedAt desc) {
        _id,
        title,
        slug,
        visitDate,
        publishedAt,
        ratings,
        avgTicket,
        highlights,
        pros,
        cons,
        tldr,
        author,
        gallery[] {
          asset-> {
            _id,
            url
          },
          alt,
          caption
        },
        tags
      },
      "averageRating": math::avg(*[_type == "review" && venue._ref == ^._id].ratings.overall),
      "reviewCount": count(*[_type == "review" && venue._ref == ^._id])
    }
  `;
  
  // Obtener datos reales de Sanity
  const venueData = await sanityFetch<Venue | null>({ 
    query: venueDetailQuery, 
    params: { slug, citySlug: city }, 
    tags: ['venue'], 
    revalidate: 0 
  });

  if (!venueData) {
    notFound();
  }

  // Generate JSON-LD
  const jsonLd = venuePageJsonLd(venueData);

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
              city={venueData.city.title}
              venue={venueData.title}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="container-wide py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <main className="lg:col-span-3">
              {/* Venue Info */}
              <section className="mb-8">
                <LocalInfo venue={venueData} />
              </section>

              {/* Gallery */}
              {venueData.images && venueData.images.length > 0 && (
                <section className="mb-8">
                  <Gallery images={venueData.images} />
                </section>
              )}

              {/* In-Article Ad */}
              <InArticleAd />

              {/* Reviews */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Reseñas ({venueData.reviews?.length || 0})
                  </h2>
                  <Link
                    href={`/${venueData.city.slug.current}/reviews`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Ver todas →
                  </Link>
                </div>

                <div className="space-y-6">
                  {venueData.reviews?.map((review) => (
                    <div key={review._id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            <Link 
                              href={`/${venueData.city.slug.current}/reviews/${review.slug.current}`}
                              className="hover:text-primary-600 transition-colors"
                            >
                              {review.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600">{review.tldr}</p>
                        </div>
                        <CompactScore score={calculateOverallRating(review.ratings)} />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Por {review.author}</span>
                        <span>{new Date(review.visitDate).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section className="mb-8">
                <FAQ />
              </section>
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Sidebar Ad */}
              <SidebarAd />

              {/* Venue Stats */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Estadísticas
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Puntuación media:</span>
                    <span className="font-semibold">
                      {venueData.reviews && venueData.reviews.length > 0 
                        ? (venueData.reviews.reduce((sum, r) => sum + calculateOverallRating(r.ratings), 0) / venueData.reviews.length).toFixed(1)
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reseñas:</span>
                    <span className="font-semibold">{venueData.reviews?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio:</span>
                    <span className="font-semibold">{venueData.priceRange}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de contacto
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-sm">Dirección:</span>
                    <p className="text-gray-900">{venueData.address}</p>
                  </div>
                  {venueData.phone && (
                    <div>
                      <span className="text-gray-600 text-sm">Teléfono:</span>
                      <p className="text-gray-900">{venueData.phone}</p>
                    </div>
                  )}
                  {venueData.website && (
                    <div>
                      <span className="text-gray-600 text-sm">Web:</span>
                      <a 
                        href={venueData.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {venueData.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Opening Hours */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Horarios
                </h3>
                <div className="space-y-2">
                  {venueData.openingHours?.map((day, index) => {
                    const [dayName, hours] = day.split(' ');
                    const daysMap: { [key: string]: string } = {
                      'Monday': 'Lunes',
                      'Tuesday': 'Martes',
                      'Wednesday': 'Miércoles',
                      'Thursday': 'Jueves',
                      'Friday': 'Viernes',
                      'Saturday': 'Sábado',
                      'Sunday': 'Domingo',
                    };
                    return (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{daysMap[dayName] || dayName}:</span>
                        <span className="text-gray-900">{hours}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
