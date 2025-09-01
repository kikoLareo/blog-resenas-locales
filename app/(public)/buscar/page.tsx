import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/lib/sanity.client';
import { searchVenues, searchReviews, searchPosts } from '@/lib/groq';
import { websiteJsonLd } from '@/lib/schema';
import SearchForm from '@/components/SearchForm';
import VenueCard from '@/components/VenueCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import Image from 'next/image';
import type { Venue, Review, Post } from '@/lib/types';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: 'venues' | 'reviews' | 'posts' | 'all';
  }>;
}

interface SearchResults {
  venues: Venue[];
  reviews: Review[];
  posts: Post[];
  totalResults: number;
}

async function getSearchResults(searchTerm: string, type: string = 'all'): Promise<SearchResults> {
  try {
    const queries: Promise<any>[] = [];
    
    if (type === 'all' || type === 'venues') {
      queries.push(sanityFetch<Venue[]>({
        query: searchVenues,
        params: { searchTerm },
        tags: ['venues', 'search'],
        revalidate: 300, // 5 minutes
      }));
    } else {
      queries.push(Promise.resolve([]));
    }
    
    if (type === 'all' || type === 'reviews') {
      queries.push(sanityFetch<Review[]>({
        query: searchReviews,
        params: { searchTerm },
        tags: ['reviews', 'search'],
        revalidate: 300,
      }));
    } else {
      queries.push(Promise.resolve([]));
    }
    
    if (type === 'all' || type === 'posts') {
      queries.push(sanityFetch<Post[]>({
        query: searchPosts,
        params: { searchTerm },
        tags: ['posts', 'search'],
        revalidate: 300,
      }));
    } else {
      queries.push(Promise.resolve([]));
    }

    const [venues, reviews, posts] = await Promise.all(queries);
    
    return {
      venues: venues || [],
      reviews: reviews || [],
      posts: posts || [],
      totalResults: (venues?.length || 0) + (reviews?.length || 0) + (posts?.length || 0)
    };
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching search results:', error);
    }
    return {
      venues: [],
      reviews: [],
      posts: [],
      totalResults: 0
    };
  }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q: searchTerm } = await searchParams;
  
  const title = searchTerm 
    ? `Resultados para "${searchTerm}" - Blog de Reseñas de Restaurantes`
    : 'Buscar - Blog de Reseñas de Restaurantes';
    
  const description = searchTerm
    ? `Encuentra restaurantes, reseñas y artículos relacionados con "${searchTerm}". Descubre los mejores lugares para comer.`
    : 'Busca restaurantes, reseñas y artículos en nuestro blog de reseñas de restaurantes. Encuentra el lugar perfecto para comer.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: !searchTerm, // Don't index search result pages
      follow: true,
    },
  };
}

function SearchResultsContent({ results, searchTerm, currentType }: {
  results: SearchResults;
  searchTerm: string;
  currentType: string;
}) {
  const { venues, reviews, posts, totalResults } = results;

  if (totalResults === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No se encontraron resultados
        </h3>
        <p className="text-gray-600 mb-6">
          No encontramos nada para &quot;{searchTerm}&quot;. Intenta con otros términos de búsqueda.
        </p>
        <div className="max-w-md mx-auto">
          <SearchForm placeholder="Buscar de nuevo..." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            {totalResults} resultado{totalResults !== 1 ? 's' : ''} para &quot;{searchTerm}&quot;
          </h2>
          
          {/* Filter Tabs */}
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'Todo', count: totalResults },
              { key: 'venues', label: 'Restaurantes', count: venues.length },
              { key: 'reviews', label: 'Reseñas', count: reviews.length },
              { key: 'posts', label: 'Artículos', count: posts.length },
            ].map((tab) => (
              <a
                key={tab.key}
                href={`/buscar?q=${encodeURIComponent(searchTerm)}&type=${tab.key}`}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  currentType === tab.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Venues Results */}
      {venues.length > 0 && (currentType === 'all' || currentType === 'venues') && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Restaurantes ({venues.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue._id} venue={venue} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews Results */}
      {reviews.length > 0 && (currentType === 'all' || currentType === 'reviews') && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Reseñas ({reviews.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <article key={review._id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md overflow-hidden">
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
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    <Link href={`/${review.venue.city.slug}/${review.venue.slug}/review/${review.slug.current}`} className="hover:text-blue-600">
                      {review.title}
                    </Link>
                  </h4>
                  
                  {review.tldr && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{review.tldr}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{review.venue.title}</span>
                    <span>{new Date(review.publishedAt).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Posts Results */}
      {posts.length > 0 && (currentType === 'all' || currentType === 'posts') && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Artículos del Blog ({posts.length})
          </h3>
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  <a href={`/blog/${post.slug}`} className="hover:text-blue-600">
                    {post.title}
                  </a>
                </h4>
                {post.excerpt && (
                  <p className="text-gray-600 mb-3">{post.excerpt}</p>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <span>{new Date(post.publishedAt).toLocaleDateString('es-ES')}</span>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{post.tags.slice(0, 3).join(', ')}</span>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: searchTerm, type = 'all' } = await searchParams;

  // Generate JSON-LD for search page
  const jsonLd = websiteJsonLd();

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
                { name: 'Buscar', url: '/buscar' },
                ...(searchTerm ? [{ name: `"${searchTerm}"`, url: `/buscar?q=${encodeURIComponent(searchTerm)}` }] : [])
              ]}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {searchTerm ? `Resultados de búsqueda` : 'Buscar'}
            </h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {searchTerm 
                ? `Encuentra todo lo relacionado con "${searchTerm}" en nuestros restaurantes, reseñas y artículos.`
                : 'Encuentra restaurantes, reseñas y artículos del blog. Escribe lo que buscas y descubre nuevos lugares.'
              }
            </p>
            
            {/* Search Form */}
            <div className="max-w-2xl mx-auto">
              <SearchForm autoFocus={!searchTerm} />
            </div>
          </div>

          {/* Search Results */}
          {searchTerm && (
            <Suspense 
              fallback={
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Buscando...</p>
                </div>
              }
            >
              <SearchResultsAsync searchTerm={searchTerm} type={type} />
            </Suspense>
          )}
        </div>
      </div>
    </>
  );
}

async function SearchResultsAsync({ searchTerm, type }: { searchTerm: string; type: string }) {
  const results = await getSearchResults(searchTerm, type);
  return <SearchResultsContent results={results} searchTerm={searchTerm} currentType={type} />;
}