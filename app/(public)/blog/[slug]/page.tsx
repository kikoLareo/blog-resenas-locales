import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { Post } from '@/lib/types';
import { postPageJsonLd } from '@/lib/schema';
import FAQ from '@/components/Faq';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

// Mock data - En producción, obtener de Sanity
const mockPost: Post = {
  _id: 'post-1',
  _type: 'post',
  title: 'Los 10 mejores restaurantes gallegos de Santiago',
  slug: { current: 'mejores-restaurantes-gallegos-santiago' },
  excerpt: 'Descubre los restaurantes que mejor representan la gastronomía gallega en la capital compostelana.',
  author: 'Carlos Fernández',
  publishedAt: '2024-01-18T14:00:00Z',
  body: [],
  tags: ['guías', 'gastronomía', 'gallego'],
  faq: [
    {
      question: '¿Cuáles son los platos gallegos más típicos?',
      answer: 'Los platos más representativos incluyen pulpo a la gallega, empanada gallega, lacón con grelos, caldeirada y tarta de Santiago.',
    },
    {
      question: '¿Qué vino gallego recomiendan con mariscos?',
      answer: 'Los vinos blancos gallegos como Albariño, Godello o Ribeiro son perfectos para maridar con mariscos y pescados.',
    },
  ],
};

const mockRelatedPosts: Post[] = [
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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  // En producción, obtener datos reales de Sanity basado en params.slug
  // const post = await getPostData(params.slug);
  const post = mockPost;
  
  if (!post) {
    return {
      title: 'Artículo no encontrado',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || 'Artículo del blog gastronómico',
    openGraph: {
      title: `${post.title} | ${SITE_CONFIG.name}`,
      description: post.excerpt || 'Artículo del blog gastronómico',
      type: 'article',
      url: `${SITE_CONFIG.url}/blog/${(await params).slug}`,
      publishedTime: post.publishedAt,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/blog/${(await params).slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // En producción, obtener datos reales de Sanity basado en params.slug
  // const post = await getPostData(params.slug);
  const post = mockPost;

  if (!post) {
    notFound();
  }

  // Generate JSON-LD
  const jsonLd = postPageJsonLd(post);

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
            <li>
              <Link href="/blog" className="hover:text-primary-600">Blog</Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium line-clamp-1">{post.title}</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center justify-center space-x-4 text-gray-500 mb-8">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.author}
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={post.publishedAt} suppressHydrationWarning>
                    {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(post.publishedAt))}
                  </time>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 text-sm font-medium text-primary-700 bg-primary-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <article className="bg-white rounded-lg border border-gray-200 p-8 lg:p-12 mb-12">
            <div className="prose prose-lg max-w-none">
              <p className="lead">
                Santiago de Compostela, además de ser destino de peregrinaje, es un paraíso gastronómico que combina tradición gallega con innovación culinaria. En esta guía, exploramos los restaurantes que mejor representan la esencia de la cocina gallega.
              </p>
              
              <h2>1. Casa Pepe - El templo del pulpo</h2>
              <p>
                Ubicado en la emblemática Rúa do Franco, Casa Pepe es sinónimo de autenticidad gallega. Su pulpo a la gallega es legendario entre locales y turistas.
              </p>
              
              <h2>2. O Dezaseis - Mariscos de primera</h2>
              <p>
                Con productos directos de las rías gallegas, O Dezaseis ofrece una experiencia marina incomparable en pleno centro histórico.
              </p>
              
              <h2>3. A Tabacalera - Tradición familiar</h2>
              <p>
                Tres generaciones llevando la cocina gallega tradicional a las mesas compostelanas. Su empanada es de las mejores de la ciudad.
              </p>
              
              <p>
                La gastronomía gallega en Santiago es un reflejo de la riqueza cultural y natural de la región. Cada restaurante cuenta una historia, cada plato es un viaje a las tradiciones más profundas de Galicia.
              </p>
            </div>
          </article>

          {/* FAQ Section */}
          {post.faq && post.faq.length > 0 && (
            <section className="mb-12">
              <FAQ faqs={post.faq} />
            </section>
          )}

          {/* Related Posts */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Artículos Relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockRelatedPosts.slice(0, 2).map((relatedPost) => (
                <article key={relatedPost._id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md overflow-hidden">
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link 
                        href={`/blog/${relatedPost.slug.current}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {relatedPost.title}
                      </Link>
                    </h4>
                    
                    {relatedPost.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{relatedPost.author}</span>
                      <time dateTime={relatedPost.publishedAt} suppressHydrationWarning>
                        {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(relatedPost.publishedAt))}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
      </div>
    </>
  );
}