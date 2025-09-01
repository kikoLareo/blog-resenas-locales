import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SidebarAd, InArticleAd } from '@/components/AdSlot';
import { Venue, Category } from '@/lib/types';
import { SITE_CONFIG } from '@/lib/constants';
import { categoryPageJsonLd } from '@/lib/schema';
import { sanityFetch } from '@/lib/sanity.client';
import { categoryQuery, venuesByCategoryQuery } from '@/sanity/lib/queries';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

// Tamaño de página para listados
// const PAGE_SIZE = 12; // reservado para paginación futura

// Nota: los venues se obtienen desde Sanity en runtime

// Generate metadata
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await sanityFetch<Category | null>({ query: categoryQuery, params: { categorySlug: slug }, tags: ['categories'], revalidate: 0 });
  
  if (!category) {
    return {
      title: 'Categoría no encontrada',
    };
  }

  const title = category.title;
  const description = category.description || `Descubre los mejores ${category.title.toLowerCase()} con nuestras reseñas detalladas y recomendaciones.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      type: 'website',
      url: `${SITE_CONFIG.url}/categorias/${slug}`,
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/categorias/${slug}`,
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

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {venue.address} • {venue.city.title}
        </div>

        {/* Description */}
        {venue.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {venue.description}
          </p>
        )}

        {/* Price Range and Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">
              {venue.priceRange}
            </span>
          </div>
          <div className="flex items-center">
            {venue.reviewCount && (
              <span className="text-sm text-gray-500">
                {venue.reviewCount} reseñas
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await sanityFetch<Category | null>({ query: categoryQuery, params: { categorySlug: slug }, tags: ['categories'], revalidate: 0 });
  const venues = await sanityFetch<Venue[]>({ query: venuesByCategoryQuery, params: { categorySlug: slug, $offset: 0, $limit: 12 } as any, tags: ['venues'], revalidate: 0 });

  if (!category) {
    notFound();
  }

  // Generate JSON-LD
  const jsonLd = categoryPageJsonLd(category, venues);

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
                { name: 'Categorías', url: '/categorias' },
                { name: category.title, url: `/categorias/${category.slug.current}` },
              ]}
            />
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-white">
          <div className="container-wide py-12">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {category.title}
              </h1>
              {category.description && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {category.description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="text-sm text-gray-500">
                  {venues.length} locales encontrados
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
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Locales destacados
                  </h2>
                  <div className="text-sm text-gray-600">
                    Mostrando {venues.length} resultados
                  </div>
                </div>

                <Suspense fallback={
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
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
              <div className="my-12">
                <InArticleAd />
              </div>

              {/* Additional Info */}
              <section className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Sobre {category.title}
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p>
                    Los {category.title.toLowerCase()} representan una parte fundamental de la gastronomía española. 
                    En nuestra selección encontrarás desde locales tradicionales que mantienen las recetas de toda la vida, 
                    hasta propuestas más modernas que reinterpretan los clásicos con técnicas contemporáneas.
                  </p>
                  <p>
                    Cada establecimiento ha sido visitado y evaluado por nuestro equipo, teniendo en cuenta aspectos como 
                    la calidad de los ingredientes, la preparación de los platos, el servicio al cliente y la relación 
                    calidad-precio.
                  </p>
                </div>
              </section>
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Sidebar Ad */}
              <SidebarAd />

              {/* Category Stats */}
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
                    <span className="text-gray-600">Puntuación media:</span>
                    <span className="font-semibold">
                      {venues.length > 0 
                        ? (venues.reduce((sum, v) => sum + (v.avgRating || 0), 0) / venues.length).toFixed(1)
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total reseñas:</span>
                    <span className="font-semibold">
                      {venues.reduce((sum, v) => sum + (v.reviewCount || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Rango de precios
                </h3>
                <div className="space-y-3">
                  {['€', '€€', '€€€', '€€€€'].map((range) => {
                    const count = venues.filter(v => v.priceRange === range).length;
                    return (
                      <div key={range} className="flex items-center justify-between">
                        <span className="text-gray-700">{range}</span>
                        <span className="text-sm text-gray-500">({count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Related Categories */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Categorías relacionadas
                </h3>
                <ul className="space-y-3">
                  {[
                    'Marisquerías',
                    'Bares de tapas',
                    'Tabernas tradicionales',
                    'Restaurantes de autor',
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