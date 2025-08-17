import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { City, Venue } from '@/lib/types';
import { sanityFetch } from '@/lib/sanity.client';
import { cityQuery, venuesByCityQuery, venuesByCityCountQuery } from '@/sanity/lib/queries';
import { collectionPageJsonLd, breadcrumbsJsonLd, combineJsonLd } from '@/lib/schema';
import { urlFor } from '@/lib/sanity.client';

interface CityPageProps {
  params: { city: string };
  searchParams: { page?: string };
}

const ITEMS_PER_PAGE = 12;

async function getCityData(citySlug: string): Promise<City | null> {
  try {
    return await sanityFetch<City>({
      query: cityQuery,
      params: { citySlug },
      tags: ['cities'],
    });
  } catch {
    return null;
  }
}

async function getVenuesByCity(
  citySlug: string, 
  page: number = 1
): Promise<{ venues: Venue[]; total: number }> {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const limit = offset + ITEMS_PER_PAGE;
    
    const [venues, total] = await Promise.all([
      sanityFetch<Venue[]>({
        query: venuesByCityQuery,
        params: { citySlug, offset, limit },
        tags: ['venues'],
      }),
      sanityFetch<number>({
        query: venuesByCityCountQuery,
        params: { citySlug },
        tags: ['venues'],
      }),
    ]);

    return { venues: venues || [], total: total || 0 };
  } catch {
    return { venues: [], total: 0 };
  }
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const city = await getCityData(params.city);
  
  if (!city) {
    return {
      title: 'Ciudad no encontrada',
    };
  }

  const title = `${city.title} - Mejores Locales y Reseñas`;
  const description = city.description || `Descubre los mejores locales en ${city.title} con nuestras reseñas detalladas y honestas.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      type: 'website',
      url: `${SITE_CONFIG.url}/${params.city}`,
      images: city.heroImage ? [{
        url: urlFor(city.heroImage).width(1200).height(630).url(),
        width: 1200,
        height: 630,
        alt: city.title,
      }] : [],
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${params.city}`,
    },
  };
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  
  const [city, { venues, total }] = await Promise.all([
    getCityData(params.city),
    getVenuesByCity(params.city, currentPage),
  ]);

  if (!city) {
    notFound();
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Generar JSON-LD
  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: city.title, url: `/${params.city}` },
  ];

  const jsonLd = combineJsonLd(
    collectionPageJsonLd(
      `${city.title} - Mejores Locales`,
      city.description || `Los mejores locales en ${city.title}`,
      `${SITE_CONFIG.url}/${params.city}`,
      venues
    ),
    breadcrumbsJsonLd(breadcrumbs),
    venues.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      numberOfItems: venues.length,
      itemListElement: venues.map((venue, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': venue.schemaType || 'LocalBusiness',
          name: venue.title,
          url: `${SITE_CONFIG.url}/${params.city}/${venue.slug.current}`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: venue.address,
            addressLocality: city.title,
            addressRegion: city.region,
            addressCountry: 'ES',
          },
          priceRange: venue.priceRange,
          image: venue.images?.[0] ? urlFor(venue.images[0]).width(400).height(300).url() : undefined,
        },
      })),
    } : null
  );

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      <div className="min-h-screen bg-gray-50">
        <div className="container-wide py-12">
          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-primary-600">Inicio</Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-900 font-medium">{city.title}</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="text-center mb-12">
            {city.heroImage && (
              <div className="aspect-[3/1] relative mb-8 rounded-lg overflow-hidden">
                <Image
                  src={urlFor(city.heroImage).width(1200).height(400).url()}
                  alt={city.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
                    {city.title}
                  </h1>
                </div>
              </div>
            )}
            
            {!city.heroImage && (
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {city.title}
              </h1>
            )}
            
            {city.description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                {city.description}
              </p>
            )}
            
            <div className="flex items-center justify-center space-x-8 text-gray-500">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {city.venueCount || total} locales
              </div>
              {city.reviewCount && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {city.reviewCount} reseñas
                </div>
              )}
            </div>
          </div>

          {/* Venues Grid */}
          {venues.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {venues.map((venue) => (
                  <article key={venue._id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md overflow-hidden">
                    {/* Image */}
                    <Link href={`/${params.city}/${venue.slug.current}`}>
                      <div className="aspect-video bg-gray-100 relative">
                        {venue.images?.[0] ? (
                          <Image
                            src={urlFor(venue.images[0]).width(400).height(300).url()}
                            alt={venue.images[0].alt || venue.title}
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
                        
                        {/* Price Range Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800 shadow-sm">
                            {venue.priceRange}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {venue.address}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                        <Link 
                          href={`/${params.city}/${venue.slug.current}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {venue.title}
                        </Link>
                      </h3>

                      {venue.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {venue.description}
                        </p>
                      )}

                      {venue.categories && venue.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {venue.categories.slice(0, 2).map((category) => (
                            <span 
                              key={category.slug.current}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {category.title}
                            </span>
                          ))}
                          {venue.categories.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                              +{venue.categories.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
                  <div className="flex flex-1 justify-between sm:hidden">
                    {hasPreviousPage && (
                      <Link
                        href={`/${params.city}?page=${currentPage - 1}`}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Anterior
                      </Link>
                    )}
                    {hasNextPage && (
                      <Link
                        href={`/${params.city}?page=${currentPage + 1}`}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Siguiente
                      </Link>
                    )}
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando{' '}
                        <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>
                        {' '}-{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * ITEMS_PER_PAGE, total)}
                        </span>
                        {' '}de{' '}
                        <span className="font-medium">{total}</span>
                        {' '}locales
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {hasPreviousPage && (
                          <Link
                            href={`/${params.city}?page=${currentPage - 1}`}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          >
                            <span className="sr-only">Anterior</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        )}
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          if (pageNum > totalPages) return null;
                          
                          return (
                            <Link
                              key={pageNum}
                              href={`/${params.city}?page=${pageNum}`}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                pageNum === currentPage
                                  ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                              }`}
                            >
                              {pageNum}
                            </Link>
                          );
                        })}
                        
                        {hasNextPage && (
                          <Link
                            href={`/${params.city}?page=${currentPage + 1}`}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          >
                            <span className="sr-only">Siguiente</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        )}
                      </nav>
                    </div>
                  </div>
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay locales</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aún no hay locales registrados en {city.title}.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}