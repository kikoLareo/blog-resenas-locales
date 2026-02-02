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

      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container-wide py-12">
        {/* Breadcrumbs */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 dark:text-white font-medium">Blog</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Blog <span className="text-primary">Gastronómico</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Artículos, guías y consejos de expertos sobre gastronomía, restaurantes y cultura culinaria.
          </p>
        </div>

        {/* Featured Post */}
        {posts?.length > 0 && (
          <section className="mb-16">
            <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto bg-gray-100 dark:bg-white/5 relative">
                  {posts[0].heroImage?.asset?.url ? (
                    <Image
                      src={posts[0].heroImage.asset.url}
                      alt={posts[0].heroImage.alt || posts[0].title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Sin imagen</div>
                  )}
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-primary text-sm font-bold tracking-wider uppercase">Destacado</span>
                    <span className="text-gray-400 dark:text-gray-500 text-sm">{new Date(posts[0].publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    <Link href={`/blog/${posts[0].slug.current}`} className="hover:text-primary transition-colors">
                      {posts[0].title}
                    </Link>
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 line-clamp-3">
                    {posts[0].excerpt}
                  </p>
                  <Link
                    href={`/blog/${posts[0].slug.current}`}
                    className="inline-flex items-center text-primary font-bold gap-2 hover:gap-3 transition-all"
                  >
                    Leer artículo completo
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.slice(1).map((post) => (
            <article key={post._id} className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
              <Link href={`/blog/${post.slug.current}`} className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-white/5 flex-shrink-0">
                {post.heroImage?.asset?.url ? (
                  <Image
                    src={post.heroImage.asset.url}
                    alt={post.heroImage.alt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">Sin imagen</div>
                )}
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-gray-400 dark:text-gray-500 text-sm mb-3">
                  {new Date(post.publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug.current}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 text-sm flex-grow">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="inline-flex items-center text-primary font-semibold text-sm gap-1 hover:gap-2 transition-all mt-auto"
                >
                  Continuar leyendo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

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