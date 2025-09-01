import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import SearchForm from '@/components/SearchForm';
import { SidebarAd, InArticleAd } from '@/components/AdSlot';
import { sanityFetch } from '@/lib/sanity.client';
import { searchQuery } from '@/sanity/lib/queries';
import { websiteJsonLd } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';

// Tipos para los resultados de búsqueda
type SearchResult = {
  _type: 'venue' | 'review' | 'post';
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  excerpt?: string;
  image?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  venue?: string;
  city?: string;
};

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

// Generate metadata
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const searchTerm = q ? decodeURIComponent(q) : '';
  
  const title = searchTerm 
    ? `Resultados para "${searchTerm}" - ${SITE_CONFIG.name}`
    : `Buscar - ${SITE_CONFIG.name}`;
  
  const description = searchTerm
    ? `Encuentra reseñas, locales y contenido relacionado con "${searchTerm}" en nuestro blog de reseñas locales.`
    : 'Busca reseñas de restaurantes, locales y contenido gastronómico en nuestro blog de reseñas locales.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_CONFIG.url}/buscar${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ''}`,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/buscar${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ''}`,
    },
  };
}

// Componente de resultados de búsqueda
function SearchResults({ results, searchTerm }: { results: SearchResult[]; searchTerm: string }) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No se encontraron resultados
        </h3>
        <p className="text-gray-600 mb-6">
          No encontramos contenido relacionado con &ldquo;{searchTerm}&rdquo;. 
          Intenta con otros términos o navega por nuestras categorías.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/categorias"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ver Categorías
          </Link>
          <Link
            href="/"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Ir al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Resultados para &ldquo;{searchTerm}&rdquo;
        </h2>
        <span className="text-sm text-gray-500">
          {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid gap-6">
        {results.map((result) => (
          <SearchResultCard key={result._id} result={result} />
        ))}
      </div>
    </div>
  );
}

// Componente para cada resultado
function SearchResultCard({ result }: { result: SearchResult }) {
  const getResultUrl = () => {
    switch (result._type) {
      case 'venue':
        return `/venues/${result.slug.current}`;
      case 'review':
        return `/reviews/${result.slug.current}`;
      case 'post':
        return `/blog/${result.slug.current}`;
      default:
        return '#';
    }
  };

  const getResultType = () => {
    switch (result._type) {
      case 'venue':
        return { label: 'Local', color: 'bg-blue-100 text-blue-800' };
      case 'review':
        return { label: 'Reseña', color: 'bg-green-100 text-green-800' };
      case 'post':
        return { label: 'Artículo', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Contenido', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const resultType = getResultType();

  return (
    <article className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Imagen */}
        <div className="sm:w-32 sm:h-32 w-full h-48 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          {result.image?.asset?.url ? (
            <Image
              src={result.image.asset.url}
              alt={result.image.alt || result.title}
              fill
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${resultType.color} mb-2`}>
                {resultType.label}
              </span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                <Link 
                  href={getResultUrl()}
                  className="hover:text-primary-600 transition-colors"
                >
                  {result.title}
                </Link>
              </h3>
            </div>
          </div>

          {/* Descripción */}
          {(result.description || result.excerpt) && (
            <p className="text-gray-600 mb-3 line-clamp-2">
              {result.description || result.excerpt}
            </p>
          )}

          {/* Metadata adicional */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {result.venue && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {result.venue}
              </span>
            )}
            {result.city && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {result.city}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const searchTerm = q ? decodeURIComponent(q) : '';

  // Realizar búsqueda si hay términos
  let results: SearchResult[] = [];
  if (searchTerm) {
    try {
      results = await sanityFetch<SearchResult[]>({
        query: searchQuery,
        params: { searchTerm },
        tags: ['search'],
        revalidate: 300, // Cache por 5 minutos
      });
    } catch (error) {
      // Silently handle errors in production, log in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error en búsqueda:', error);
      }
      results = [];
    }
  }

  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: 'Buscar', url: '/buscar' },
  ];

  const jsonLd = websiteJsonLd();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-wide py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-primary-600">Buscar</span> Contenido
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Encuentra reseñas de restaurantes, locales y contenido gastronómico
          </p>
          
          {/* Formulario de búsqueda */}
          <div className="max-w-2xl mx-auto">
            <SearchForm initialValue={searchTerm} />
          </div>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenido principal */}
          <main className="lg:col-span-3">
            <Suspense fallback={<SearchResultsSkeleton />}>
              {searchTerm ? (
                <SearchResults results={results} searchTerm={searchTerm} />
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    ¿Qué estás buscando?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Utiliza el formulario de arriba para buscar reseñas, locales y contenido gastronómico.
                  </p>
                  
                  {/* Sugerencias de búsqueda */}
                  <div className="max-w-lg mx-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Búsquedas populares:</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['Restaurantes', 'Cafeterías', 'Bares', 'Comida italiana', 'Tapas', 'Brunch'].map((term) => (
                        <Link
                          key={term}
                          href={`/buscar?q=${encodeURIComponent(term)}`}
                          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors text-sm"
                        >
                          {term}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Suspense>

            {/* Ad placement */}
            {searchTerm && results.length > 0 && (
              <div className="mt-8">
                <InArticleAd />
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-8">
            <SidebarAd />
            
            {/* Enlaces relacionados */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Explorar más
              </h3>
              <div className="space-y-3">
                <Link
                  href="/categorias"
                  className="block text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Ver todas las categorías →
                </Link>
                <Link
                  href="/ciudades"
                  className="block text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Explorar por ciudades →
                </Link>
                <Link
                  href="/blog"
                  className="block text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Leer el blog →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Skeleton de loading para resultados
function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-32 sm:h-32 w-full h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}