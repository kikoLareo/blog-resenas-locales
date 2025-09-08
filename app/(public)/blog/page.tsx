import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { Post } from '@/lib/types';
import { blogPageJsonLd } from '@/lib/schema';
import { sanityFetch } from '@/lib/sanity.client';
import Image from 'next/image';

// Query para obtener posts del blog
const blogPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    excerpt,
    author,
    publishedAt,
    heroImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    tags
  }
`;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artículos, guías y consejos sobre gastronomía, restaurantes y la cultura culinaria. Descubre tips de expertos y tendencias gastronómicas.',
  openGraph: {
    title: 'Blog | ' + SITE_CONFIG.name,
    description: 'Artículos, guías y consejos sobre gastronomía y restaurantes.',
    type: 'website',
    url: `${SITE_CONFIG.url}/blog`,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
};

export default async function BlogPage() {
  // Obtener posts reales de Sanity
  const posts: Post[] = await sanityFetch({
    query: blogPostsQuery,
    tags: ['post'],
  });

  // Generate JSON-LD only if we have posts
  const jsonLd = posts?.length > 0 ? blogPageJsonLd(posts) : null;

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
            <li className="text-gray-900 font-medium">Blog</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Blog <span className="text-primary-600">Gastronómico</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Artículos, guías y consejos de expertos sobre gastronomía, restaurantes y cultura culinaria.
          </p>
        </div>

        {/* Featured Post */}
        {posts?.length > 0 && (
          <section className="mb-16">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto bg-gray-100">
                  {posts[0].cover ? (
                    <Image
                      src={posts[0].cover.asset.url}
                      alt={posts[0].cover.alt || posts[0].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-8 lg:p-12">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-100 rounded-full">
                      Artículo destacado
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    <Link 
                      href={`/blog/${posts[0].slug.current}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {posts[0].title}
                    </Link>
                  </h2>
                  {posts[0].excerpt && (
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {posts[0].excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{posts[0].author}</span>
                      <span className="mx-2">•</span>
                      <time dateTime={posts[0].publishedAt} suppressHydrationWarning>
                        {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(posts[0].publishedAt))}
                      </time>
                    </div>
                    <Link
                      href={`/blog/${posts[0].slug.current}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Leer más →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Posts Grid */}
        {posts?.length > 1 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Todos los Artículos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(1).map((post) => (
                <article key={post._id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md overflow-hidden">
                  {/* Image */}
                  <div className="aspect-video bg-gray-100">
                    {post.cover ? (
                      <Image
                        src={post.cover.asset.url}
                        alt={post.cover.alt || post.title}
                        className="w-full h-full object-cover"
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
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link 
                        href={`/blog/${post.slug.current}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <span>{post.author}</span>
                      <time dateTime={post.publishedAt} suppressHydrationWarning>
                        {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(post.publishedAt))}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {(!posts || posts.length === 0) && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay artículos disponibles
              </h3>
              <p className="text-gray-600">
                Los artículos del blog se mostrarán aquí una vez que sean publicados.
              </p>
            </div>
          </div>
        )}

        {/* Load More */}
        {posts?.length > 6 && (
          <div className="text-center mt-12">
            <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Cargar más artículos
            </button>
          </div>
        )}
      </div>
      </div>
    </>
  );
}