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
    slug: string;
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
    'Monday 08:00-22:00',
    'Tuesday 08:00-22:00',
    'Wednesday 08:00-22:00',
    'Thursday 08:00-23:00',
    'Friday 08:00-23:00',
    'Saturday 09:00-23:00',
    'Sunday 09:00-21:00'
  ],
  priceRange: '€€',
  schemaType: 'CafeOrCoffeeShop',
  images: [
    {
      _key: '1',
      asset: {
        _ref: 'image-1',
        _type: 'reference'
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
    facebook: 'cafeconencanto',
    twitter: '@cafeconencanto'
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
  reviews: [
    {
      _id: 'review-1',
      title: 'Excelente café y ambiente',
      slug: { current: 'excelente-cafe-ambiente' },
      visitDate: '2024-01-15',
      ratings: {
        overall: 4.5,
        food: 4.0,
        service: 5.0,
        atmosphere: 4.5,
        value: 4.0
      },
      tldr: 'Un lugar perfecto para tomar un café y trabajar',
      author: 'María García',
      gallery: [
        {
          _key: '1',
          asset: {
            _ref: 'image-review-1',
            _type: 'reference'
          },
          alt: 'Café con leche'
        }
      ]
    },
    {
      _id: 'review-2',
      title: 'Brunch de fin de semana espectacular',
      slug: { current: 'brunch-fin-semana' },
      visitDate: '2024-01-20',
      ratings: {
        overall: 4.8,
        food: 5.0,
        service: 4.5,
        atmosphere: 5.0,
        value: 4.5
      },
      tldr: 'El brunch de los domingos es una experiencia única',
      author: 'Carlos López',
      gallery: [
        {
          _key: '1',
          asset: {
            _ref: 'image-review-2',
            _type: 'reference'
          },
          alt: 'Plato de brunch'
        }
      ]
    }
  ],
  _createdAt: '2024-01-01T00:00:00Z',
  _updatedAt: '2024-01-15T00:00:00Z'
};

export default async function VenuePage({ params }: VenuePageProps) {
  const { city, slug } = await params;
  
  // Para desarrollo, usar datos mock si es el venue específico
  let venueData = mockVenue;
  
  // En producción, aquí se obtendrían los datos reales de Sanity
  // const venueData = await sanityFetch<Venue | null>({ 
  //   query: venueQuery, 
  //   params: { slug }, 
  //   tags: ['venues'], 
  //   revalidate: 0 
  // });

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
                    Reseñas ({venueData.reviews.length})
                  </h2>
                  <Link
                    href={`/${venueData.city.slug.current}/reviews`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Ver todas →
                  </Link>
                </div>

                <div className="space-y-6">
                  {venueData.reviews.map((review) => (
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
                        <CompactScore rating={review.ratings.overall} />
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
                      {venueData.reviews.length > 0 
                        ? (venueData.reviews.reduce((sum, r) => sum + r.ratings.overall, 0) / venueData.reviews.length).toFixed(1)
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reseñas:</span>
                    <span className="font-semibold">{venueData.reviews.length}</span>
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
                  {venueData.openingHours.map((day, index) => {
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
