import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { Review } from '@/lib/types';
import { CompactScore } from '@/components/ScoreBar';
import TLDR from '@/components/TLDR';

interface CategoryPageProps {
  params: { slug: string };
}

// Mock data - En producción, obtener de Sanity
const mockCategory = {
  _id: '1',
  title: 'Restaurantes',
  slug: { current: 'restaurantes' },
  description: 'Descubre los mejores restaurantes con nuestras reseñas detalladas y honestas.',
  venueCount: 45,
  reviewCount: 128,
};

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
    tldr: '¿Buscas auténtica cocina gallega? Casa Pepe ofrece el mejor pulpo de Santiago con precios justos y ambiente tradicional.',
    faq: [],
    body: [],
    gallery: [],
    author: 'María González',
    tags: ['gallego', 'pulpo', 'tradicional'],
    publishedAt: '2024-01-20T10:00:00Z',
  },
];

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  // En producción, obtener datos reales de Sanity basado en params.slug
  // const category = await getCategoryData(params.slug);
  const category = mockCategory;
  
  if (!category) {
    return {
      title: 'Categoría no encontrada',
    };
  }

  return {
    title: category.title,
    description: category.description,
    openGraph: {
      title: `${category.title} | ${SITE_CONFIG.name}`,
      description: category.description,
      type: 'website',
      url: `${SITE_CONFIG.url}/categorias/${params.slug}`,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/categorias/${params.slug}`,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CategoryPage({ params }: CategoryPageProps) {
  // En producción, obtener datos reales de Sanity basado en params.slug
  // const category = await getCategoryData(params.slug);
  const category = mockCategory;
  const reviews = mockReviews;

  if (!category) {
    notFound();
  }

  return (
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
              <Link href="/categorias" className="hover:text-primary-600">Categorías</Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">{category.title}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {category.title}
          </h1>
          {category.description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {category.description}
            </p>
          )}
          
          <div className="flex items-center justify-center space-x-8 text-gray-500">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {category.venueCount} locales
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {category.reviewCount} reseñas
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => {
            const overallRating = (review.ratings.food + review.ratings.service + review.ratings.ambience + review.ratings.value) / 4;
            
            return (
              <article key={review._id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md overflow-hidden">
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
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link 
                      href={`/${review.venue.city.slug.current}/${review.venue.slug.current}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {review.title}
                    </Link>
                  </h3>

                  {/* TLDR */}
                  <div className="mb-4">
                    <TLDR content={review.tldr} title="Resumen" className="text-sm" />
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <span>{review.author}</span>
                    <time dateTime={review.publishedAt}>
                      {new Date(review.publishedAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </time>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Cargar más reseñas
          </button>
        </div>
      </div>
    </div>
  );
}