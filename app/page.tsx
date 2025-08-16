import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { HeaderAd, SidebarAd } from '@/components/AdSlot';
import TLDR from '@/components/TLDR';
import { CompactScore } from '@/components/ScoreBar';
import { SITE_CONFIG } from '@/lib/constants';
import { Review, Post } from '@/lib/types';

// Mock data - In production, fetch from Sanity
const mockReviews: Review[] = [
  {
    _id: '1',
    
    title: 'Casa Pepe: Auténtica cocina gallega en el corazón de Santiago',
    slug: { current: 'casa-pepe-autentica-cocina-gallega' },
    venue: {
      _id: 'venue-1',
      
      title: 'Casa Pepe',
      slug: { current: 'casa-pepe' },
      city: {
        _id: 'city-1',
        title: 'Santiago de Compostela',
        slug: { current: 'santiago-compostela' },
      },
      address: 'Rúa do Franco, 24',
      priceRange: '€€' as const,
      categories: [],
      images: [],
      schemaType: 'Restaurant' as const,
    },
    visitDate: '2024-01-15',
    ratings: { food: 8.5, service: 8.0, ambience: 7.5, value: 8.5 },
    avgTicket: 35,
    pros: ['Pulpo excelente', 'Ambiente auténtico', 'Buen precio'],
    cons: ['Algo ruidoso', 'Servicio lento en horas punta'],
    tldr: '¿Buscas auténtica cocina gallega? Casa Pepe ofrece el mejor pulpo de Santiago con precios justos y ambiente tradicional. Ideal para turistas y locales que valoran la tradición culinaria gallega.',
    faq: [
      {
        question: '¿Necesito reserva en Casa Pepe?',
        answer: 'Se recomienda reservar, especialmente los fines de semana y en temporada alta. Puedes llamar al teléfono del restaurante o reservar online.',
      },
    ],
    body: [],
    gallery: [],
    author: 'María González',
    tags: ['gallego', 'pulpo', 'tradicional'],
    publishedAt: '2024-01-20T10:00:00Z',
  },
  // Add more mock reviews...
];

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
];

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Descubre los mejores restaurantes y locales con nuestras reseñas detalladas. Guías gastronómicas, recomendaciones y críticas honestas para encontrar tu próximo lugar favorito.',
  openGraph: {
    title: `${SITE_CONFIG.name} - Reseñas de restaurantes y locales`,
    description: 'Descubre los mejores restaurantes y locales con nuestras reseñas detalladas y honestas.',
    type: 'website',
    url: SITE_CONFIG.url,
    images: [
      {
        url: `${SITE_CONFIG.url}/og/home.jpg`,
        width: 1200,
        height: 630,
        alt: 'Blog de Reseñas - Descubre los mejores locales',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} - Reseñas de restaurantes`,
    description: 'Descubre los mejores restaurantes y locales con nuestras reseñas detalladas.',
    images: [`${SITE_CONFIG.url}/og/home.jpg`],
    creator: '@blogresenas',
    site: '@blogresenas',
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

// Loading components
function ReviewCardSkeleton() {
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

// Review Card Component
function ReviewCard({ review }: { review: Review }) {
  const overallRating = (review.ratings.food + review.ratings.service + review.ratings.ambience + review.ratings.value) / 4;

  return (
    <article className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md overflow-hidden">
      {/* Image */}
      <div className="aspect-video bg-gray-100 relative">
        {review.gallery?.[0] ? (
          <Image
            src={review.gallery[0].asset.url}
            alt={review.gallery[0].alt || review.title}
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
        <div className="absolute top-4 right-4">
          <CompactScore score={overallRating} className="shadow-sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Venue Info */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {review.venue.title} • {review.venue.city.title}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link 
            href={`/${review.venue.city.slug.current}/${review.venue.slug.current}/review-${new Date(review.visitDate).getFullYear()}-${String(new Date(review.visitDate).getMonth() + 1).padStart(2, '0')}`}
            className="hover:text-primary-600 transition-colors"
          >
            {review.title}
          </Link>
        </h2>

        {/* TLDR */}
        <div className="mb-4">
          <TLDR content={review.tldr} title="Resumen" className="text-sm" />
        </div>

        {/* Pros/Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-1">✓ Pros</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {review.pros.slice(0, 2).map((pro, index) => (
                <li key={index} className="truncate">{pro}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-700 mb-1">✗ Contras</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {review.cons?.slice(0, 2).map((con, index) => (
                <li key={index} className="truncate">{con}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <span>{review.author}</span>
          <time dateTime={review.publishedAt}>
            {new Date(review.publishedAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </div>
      </div>
    </article>
  );
}

// Blog Post Card
function PostCard({ post }: { post: Post }) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
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

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{post.author}</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            })}
          </time>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Ad */}
      <div className="container-wide py-4">
        <HeaderAd className="mx-auto" />
      </div>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container-wide py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Descubre los mejores{' '}
              <span className="text-primary-600">restaurantes y locales</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Reseñas honestas y detalladas para ayudarte a encontrar tu próximo lugar favorito. 
              Desde joyas ocultas hasta clásicos imprescindibles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/categorias"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Explorar por categorías
              </Link>
              <Link
                href="/ciudades"
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Ver por ciudades
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Latest Reviews */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Últimas Reseñas
                </h2>
                <Link
                  href="/resenas"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ver todas →
                </Link>
              </div>

              <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ReviewCardSkeleton key={i} />
                  ))}
                </div>
              }>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockReviews.slice(0, 4).map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              </Suspense>
            </section>

            {/* Featured Categories */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Categorías Populares
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Restaurantes', icon: '🍽️', href: '/categorias/restaurantes' },
                  { name: 'Bares', icon: '🍺', href: '/categorias/bares' },
                  { name: 'Cafeterías', icon: '☕', href: '/categorias/cafeterias' },
                  { name: 'Tapas', icon: '🍤', href: '/categorias/tapas' },
                ].map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:border-gray-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  </Link>
                ))}
              </div>
            </section>

            {/* Blog Posts */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Artículos del Blog
                </h2>
                <Link
                  href="/blog"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ver todos →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Sidebar Ad */}
            <SidebarAd />

            {/* Newsletter */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Newsletter
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Recibe las últimas reseñas y recomendaciones directamente en tu email.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Suscribirse
                </button>
              </form>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Más Populares
              </h3>
              <ul className="space-y-3">
                {[
                  'Restaurantes gallegos',
                  'Marisquerías',
                  'Bares de tapas',
                  'Cafeterías con encanto',
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
  );
}
