import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { Post } from '@/lib/types';
import { blogPageJsonLd } from '@/lib/schema';

// Mock data - En producción, obtener de Sanity
const mockPosts: Post[] = [
  {
    _id: 'post-1',
    _type: 'post',
    title: 'Los 10 mejores restaurantes gallegos de Santiago',
    slug: { current: 'mejores-restaurantes-gallegos-santiago' },
    excerpt: 'Descubre los restaurantes que mejor representan la gastronomía gallega en la capital compostelana.',
    author: 'Carlos Fernández',
    publishedAt: '2024-01-18T14:00:00Z',
    body: [],
    tags: ['guías', 'gastronomía', 'gallego'],
  },
  {
    _id: 'post-2',
    _type: 'post',
    title: 'Guía completa de tapas en Madrid',
    slug: { current: 'guia-completa-tapas-madrid' },
    excerpt: 'Todo lo que necesitas saber sobre la cultura del tapeo en la capital española.',
    author: 'Ana Martínez',
    publishedAt: '2024-01-15T10:30:00Z',
    body: [],
    tags: ['guías', 'tapas', 'madrid'],
  },
  {
    _id: 'post-3',
    _type: 'post',
    title: 'Cómo elegir el mejor vino para maridar',
    slug: { current: 'como-elegir-mejor-vino-maridar' },
    excerpt: 'Consejos de expertos para maridar vinos con diferentes tipos de comida.',
    author: 'Miguel Rodríguez',
    publishedAt: '2024-01-12T16:45:00Z',
    body: [],
    tags: ['consejos', 'vino', 'maridaje'],
  },
];

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

export default function BlogPage() {
  // Generate JSON-LD
  const jsonLd = blogPageJsonLd(mockPosts);

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
        {mockPosts.length > 0 && (
          <section className="mb-16">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto bg-gray-100">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="p-8 lg:p-12">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-100 rounded-full">
                      Artículo destacado
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    <Link 
                      href={`/blog/${mockPosts[0].slug.current}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {mockPosts[0].title}
                    </Link>
                  </h2>
                  {mockPosts[0].excerpt && (
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {mockPosts[0].excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{mockPosts[0].author}</span>
                      <span className="mx-2">•</span>
                      <time dateTime={mockPosts[0].publishedAt} suppressHydrationWarning>
                        {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(mockPosts[0].publishedAt))}
                      </time>
                    </div>
                    <Link
                      href={`/blog/${mockPosts[0].slug.current}`}
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
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Todos los Artículos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockPosts.slice(1).map((post) => (
              <article key={post._id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md overflow-hidden">
                {/* Image */}
                <div className="aspect-video bg-gray-100">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
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

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Cargar más artículos
          </button>
        </div>
      </div>
      </div>
    </>
  );
}