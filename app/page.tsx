import { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { websiteJsonLd, organizationJsonLd } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';
// Ads desactivados temporalmente

// This would be replaced with actual Sanity queries
const mockReviews = [
  {
    id: '1',
    title: 'Casa Marcelo - Una experiencia gastronómica única',
    venue: {
      name: 'Casa Marcelo',
      city: 'Santiago de Compostela',
      slug: 'casa-marcelo',
      citySlug: 'santiago-de-compostela',
    },
    rating: 9.2,
    image: '/images/casa-marcelo.jpg',
    tldr: 'Restaurante innovador que fusiona cocina gallega con influencias asiáticas. Ambiente íntimo, servicio excepcional y platos sorprendentes.',
    publishedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'A Tafona - Tradición renovada en el corazón de Santiago',
    venue: {
      name: 'A Tafona',
      city: 'Santiago de Compostela',
      slug: 'a-tafona',
      citySlug: 'santiago-de-compostela',
    },
    rating: 8.8,
    image: '/images/a-tafona.jpg',
    tldr: 'Cocina gallega contemporánea en un espacio elegante. Producto local de primera calidad y técnicas modernas.',
    publishedAt: '2024-01-10',
  },
];

const mockCities = [
  { name: 'Santiago de Compostela', slug: 'santiago-de-compostela', count: 25 },
  { name: 'A Coruña', slug: 'a-coruna', count: 18 },
  { name: 'Vigo', slug: 'vigo', count: 22 },
  { name: 'Pontevedra', slug: 'pontevedra', count: 12 },
];

export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
};

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      websiteJsonLd(),
      organizationJsonLd(),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-wide py-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance">
              Descubre los mejores locales con reseñas honestas
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 mb-8 text-pretty">
              Exploramos restaurantes, bares y cafeterías para ofrecerte la información más completa y veraz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/categorias"
                className="btn btn-secondary text-center"
              >
                Explorar por categorías
              </Link>
              <Link
                href="/blog"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-center"
              >
                Leer el blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Slot - Header (placeholder sin anuncios) */}
      <div className="container-wide py-4">
        <AdSlot slotId="header" className="mx-auto" lazy={false} />
      </div>

      {/* Latest Reviews Section */}
      <section className="py-16">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Últimas reseñas
            </h2>
            <Link
              href="/reseñas"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todas las reseñas →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockReviews.map((review) => (
                  <article key={review.id} className="card hover:shadow-md transition-shadow">
                    <div className="aspect-venue mb-4 bg-gray-200 rounded-lg overflow-hidden">
                      {/* <Image
                        src={review.image}
                        alt={review.venue.name}
                        fill
                        className="object-cover"
                      /> */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Imagen del local</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {review.venue.city}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-semibold">{review.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                        <Link
                          href={`/${review.venue.citySlug}/${review.venue.slug}/review-${review.publishedAt}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {review.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.tldr}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <time dateTime={review.publishedAt}>
                          {new Date(review.publishedAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                        <Link
                          href={`/${review.venue.citySlug}/${review.venue.slug}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          Ver local →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ad Slot - Sidebar (placeholder sin anuncios) */}
              <AdSlot slotId="sidebar" />
              
              {/* Cities Section */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Explorar por ciudades
                </h3>
                <div className="space-y-2">
                  {mockCities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/${city.slug}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700">{city.name}</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {city.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="card bg-primary-50 border-primary-200">
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  No te pierdas nada
                </h3>
                <p className="text-primary-700 text-sm mb-4">
                  Recibe las últimas reseñas y descubrimientos gastronómicos.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    aria-label="Email para newsletter"
                  />
                  <button
                    type="submit"
                    className="w-full btn btn-primary text-sm"
                  >
                    Suscribirse
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Explora por categorías
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Restaurantes', icon: '🍽️', slug: 'restaurantes' },
              { name: 'Bares', icon: '🍻', slug: 'bares' },
              { name: 'Cafeterías', icon: '☕', slug: 'cafeterias' },
              { name: 'Marisquerías', icon: '🦐', slug: 'marisquerias' },
            ].map((category) => (
              <Link
                key={category.slug}
                href={`/categorias/${category.slug}`}
                className="card text-center hover:shadow-md transition-shadow group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Ad (placeholder sin anuncios) */}
      <div className="container-wide py-4">
        <AdSlot slotId="footer" className="mx-auto" />
      </div>
    </>
  );
}
