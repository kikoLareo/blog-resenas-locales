import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { HeaderAd, SidebarAd } from '@/components/AdSlot';
import { CompactScore } from '@/components/ScoreBar';
import { SITE_CONFIG } from '@/lib/constants';
import { HomepageData } from '@/lib/types';
import { sanityFetch } from '@/lib/sanity.client';
import { homepageQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/lib/sanity.client';

// Función server para obtener datos de homepage con manejo de errores
async function getHomepageData(): Promise<HomepageData> {
  try {
    const data = await sanityFetch<HomepageData>({
      query: homepageQuery,
      tags: ['homepage', 'reviews', 'posts', 'cities', 'categories'],
      revalidate: 3600, // 1 hora
    });

    // Asegurar que siempre tenemos arrays (fallback)
    return {
      featuredReviews: data?.featuredReviews || [],
      featuredPosts: data?.featuredPosts || [],
      featuredCities: data?.featuredCities || [],
      featuredCategories: data?.featuredCategories || [],
    };
  } catch (error) {
    // Error silencioso para producción, fallback a datos vacíos
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching homepage data:', error);
    }
    return {
      featuredReviews: [],
      featuredPosts: [],
      featuredCities: [],
      featuredCategories: [],
    };
  }
}

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



// Review Card Component actualizado para datos de Sanity
function ReviewCard({ review }: { review: HomepageData['featuredReviews'][0] }) {
  const overallRating = (review.ratings.food + review.ratings.service + review.ratings.ambience + review.ratings.value) / 4;
  const firstImage = review.gallery?.[0];

  return (
    <article className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md overflow-hidden">
      {/* Image */}
      <div className="aspect-video bg-gray-100 relative">
        {firstImage ? (
          <Image
            src={urlFor(firstImage).width(600).height(400).url()}
            alt={firstImage.alt || review.title}
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
          {review.venue.title} • {review.venue.city}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link 
            href={`/${review.venue.citySlug}/${review.venue.slug.current}/review/${review.slug.current}`}
            className="hover:text-primary-600 transition-colors"
          >
            {review.title}
          </Link>
        </h2>

        {/* Rating breakdown */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Comida:</span>
            <span className="font-medium">{review.ratings.food}/10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Servicio:</span>
            <span className="font-medium">{review.ratings.service}/10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ambiente:</span>
            <span className="font-medium">{review.ratings.ambience}/10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Valor:</span>
            <span className="font-medium">{review.ratings.value}/10</span>
          </div>
        </div>

        {/* Overall rating */}
        <div className="text-center pt-4 border-t border-gray-100">
          <span className="text-2xl font-bold text-primary-600">
            {overallRating.toFixed(1)}
          </span>
          <span className="text-gray-500 text-sm ml-1">/10</span>
        </div>
      </div>
    </article>
  );
}

// Post Card Component actualizado
function PostCard({ post }: { post: HomepageData['featuredPosts'][0] }) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md overflow-hidden">
      {/* Hero Image */}
      {post.heroImage && (
        <div className="aspect-video bg-gray-100 relative">
          <Image
            src={urlFor(post.heroImage).width(600).height(400).url()}
            alt={post.heroImage.alt || post.title}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      )}
      
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
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('es-ES', {
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

// City Card Component
function CityCard({ city }: { city: HomepageData['featuredCities'][0] }) {
  return (
    <Link
      href={`/${city.slug.current}`}
      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {city.heroImage && (
        <div className="aspect-video bg-gray-100 relative">
          <Image
            src={urlFor(city.heroImage).width(400).height(300).url()}
            alt={city.heroImage.alt || city.title}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {city.title}
        </h3>
        {city.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {city.description}
          </p>
        )}
        {city.venueCount && (
          <p className="text-primary-600 text-sm font-medium">
            {city.venueCount} locales
          </p>
        )}
      </div>
    </Link>
  );
}

// Category Card Component
function CategoryCard({ category }: { category: HomepageData['featuredCategories'][0] }) {
  return (
    <Link
      href={`/categorias/${category.slug.current}`}
      className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:border-gray-300 hover:shadow-md transition-all duration-200"
    >
      {category.icon && (
        <div className="text-3xl mb-2">{category.icon}</div>
      )}
      <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
      {category.venueCount && (
        <p className="text-sm text-gray-500">{category.venueCount} locales</p>
      )}
    </Link>
  );
}

export default async function HomePage() {
  const homepageData = await getHomepageData();

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
            {/* Featured Reviews */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Reseñas Destacadas
                </h2>
                <Link
                  href="/resenas"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ver todas →
                </Link>
              </div>

              {homepageData.featuredReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {homepageData.featuredReviews.slice(0, 4).map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Próximamente tendremos reseñas destacadas para ti.</p>
                </div>
              )}
            </section>

            {/* Featured Categories */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Categorías Destacadas
              </h2>
              
              {homepageData.featuredCategories.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {homepageData.featuredCategories.slice(0, 6).map((category) => (
                    <CategoryCard key={category._id} category={category} />
                  ))}
                </div>
              ) : (
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
              )}
            </section>

            {/* Featured Posts */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Artículos Destacados
                </h2>
                <Link
                  href="/blog"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ver todos →
                </Link>
              </div>

              {homepageData.featuredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {homepageData.featuredPosts.slice(0, 4).map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Próximamente tendremos artículos destacados para ti.</p>
                </div>
              )}
            </section>

            {/* Featured Cities */}
            {homepageData.featuredCities.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Ciudades Destacadas
                  </h2>
                  <Link
                    href="/ciudades"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Ver todas →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {homepageData.featuredCities.slice(0, 4).map((city) => (
                    <CityCard key={city._id} city={city} />
                  ))}
                </div>
              </section>
            )}
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

            {/* Popular Categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Más Populares
              </h3>
              <ul className="space-y-3">
                {homepageData.featuredCategories.slice(0, 4).length > 0 ? (
                  homepageData.featuredCategories.slice(0, 4).map((category) => (
                    <li key={category._id}>
                      <Link
                        href={`/categorias/${category.slug.current}`}
                        className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                      >
                        {category.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  [
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
                  ))
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
