import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import Gallery from '@/components/Gallery';
import { MultiScore, CompactScore } from '@/components/ScoreBar';
import FAQ from '@/components/FAQ';
import LocalInfo from '@/components/LocalInfo';
import { SidebarAd, InArticleAd } from '@/components/AdSlot';
import { Venue, Review } from '@/lib/types';
import { SITE_CONFIG } from '@/lib/constants';
import { reviewPageJsonLd } from '@/lib/schema';

type ReviewPageProps = {
  params: Promise<{
    city: string;
    venue: string;
    slug: string;
  }>;
};

// Mock data - In production, fetch from Sanity
const mockVenue: Venue = {
  _id: 'venue-1',
  title: 'Casa Pepe',
  slug: { current: 'casa-pepe' },
  city: {
    _id: 'city-1',
    title: 'Santiago de Compostela',
    slug: { current: 'santiago-compostela' },
    region: 'Galicia',
  },
  address: 'Rúa do Franco, 24',
  postalCode: '15705',
  phone: '+34 981 58 38 09',
  website: 'https://www.casapepe-santiago.com',
  geo: {
    lat: 42.8782,
    lng: -8.5448,
  },
  openingHours: [
    'Monday 12:00-16:00,20:00-24:00',
    'Tuesday 12:00-16:00,20:00-24:00',
    'Wednesday 12:00-16:00,20:00-24:00',
    'Thursday 12:00-16:00,20:00-24:00',
    'Friday 12:00-16:00,20:00-01:00',
    'Saturday 12:00-16:00,20:00-01:00',
    'Sunday 12:00-16:00,20:00-24:00',
  ],
  priceRange: '€€',
  categories: [
    {
      _id: 'cat-1',
      title: 'Restaurante Gallego',
      slug: { current: 'restaurante-gallego' },
    },
  ],
  images: [
    {
      _type: 'image',
      asset: {
        _id: 'img-1',
        url: 'https://cdn.sanity.io/images/project/dataset/image-1.jpg',
        metadata: { dimensions: { width: 1200, height: 800, aspectRatio: 1.5 } }
      },
      alt: 'Fachada de Casa Pepe en Santiago',
      caption: 'Entrada principal del restaurante',
    },
  ],
  description: 'Restaurante tradicional gallego ubicado en el corazón del casco histórico de Santiago de Compostela.',
  social: {
    instagram: 'https://instagram.com/casapepe_santiago',
    facebook: 'https://facebook.com/casapepe.santiago',
  },
  schemaType: 'Restaurant',
};

const mockReview: Review = {
  _id: 'review-1',
  title: 'Casa Pepe: Auténtica cocina gallega en el corazón de Santiago',
  slug: { current: 'casa-pepe-autentica-cocina-gallega' },
  venue: mockVenue,
  visitDate: '2024-01-15',
  publishedAt: '2024-01-20T10:00:00Z',
  ratings: { food: 8.5, service: 8.0, ambience: 7.5, value: 8.5 },
  avgTicket: 35,
  highlights: ['Pulpo a feira excepcional', 'Ambiente tradicional auténtico', 'Excelente relación calidad-precio'],
  pros: ['Pulpo excelente', 'Ambiente auténtico', 'Buen precio'],
  cons: ['Algo ruidoso', 'Servicio lento en horas punta'],
  tldr: '¿Buscas auténtica cocina gallega? Casa Pepe ofrece el mejor pulpo de Santiago con precios justos y ambiente tradicional.',
  faq: [
    {
      question: '¿Necesito reserva en Casa Pepe?',
      answer: 'Se recomienda reservar, especialmente los fines de semana y en temporada alta. Puedes llamar al teléfono del restaurante.',
    },
    {
      question: '¿Cuál es el plato más recomendado?',
      answer: 'El pulpo a feira es su especialidad más famosa, preparado de forma tradicional con pimentón dulce y aceite de oliva.',
    },
    {
      question: '¿Tienen opciones vegetarianas?',
      answer: 'Sí, ofrecen varias opciones vegetarianas como pimientos de padrón, ensalada mixta y tortilla española.',
    },
  ],
  body: [],
  gallery: [
    {
      _type: 'image',
      asset: {
        _id: 'img-gallery-1',
        url: 'https://cdn.sanity.io/images/project/dataset/pulpo-1.jpg',
        metadata: { dimensions: { width: 800, height: 600, aspectRatio: 1.33 } }
      },
      alt: 'Pulpo a feira de Casa Pepe',
      caption: 'El famoso pulpo a feira, preparado de forma tradicional',
    },
    {
      _type: 'image',
      asset: {
        _id: 'img-gallery-2',
        url: 'https://cdn.sanity.io/images/project/dataset/interior-1.jpg',
        metadata: { dimensions: { width: 800, height: 600, aspectRatio: 1.33 } }
      },
      alt: 'Interior de Casa Pepe',
      caption: 'Ambiente tradicional gallego con decoración auténtica',
    },
  ],
  author: 'María González',
  authorAvatar: {
    _type: 'image',
    asset: {
      _id: 'avatar-1',
      url: 'https://cdn.sanity.io/images/project/dataset/maria-avatar.jpg',
      metadata: { dimensions: { width: 150, height: 150, aspectRatio: 1 } }
    },
    alt: 'María González',
  },
  tags: ['gallego', 'pulpo', 'tradicional'],
};

// Generate metadata
export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  // In production, fetch review data from Sanity based on params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { city, venue, slug } = await params;
  const review = mockReview;
  const venueData = mockVenue;
  
  if (!review || !venueData) {
    return {
      title: 'Reseña no encontrada',
    };
  }

  const title = review.title;
  const description = review.tldr;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      type: 'article',
      url: `${SITE_CONFIG.url}/${city}/${venue}/review/${slug}`,
      images: review.gallery.length > 0 ? [
        {
          url: review.gallery[0].asset.url,
          width: 1200,
          height: 630,
          alt: review.gallery[0].alt || title,
        },
      ] : [],
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      images: review.gallery.length > 0 ? [review.gallery[0].asset.url] : [],
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${city}/${venue}/review/${slug}`,
    },
  };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  // In production, fetch review data from Sanity based on params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { city, venue, slug } = await params;
  const review = mockReview;
  const venueData = mockVenue;

  if (!review || !venueData) {
    notFound();
  }

  // Generate JSON-LD
  const jsonLd = reviewPageJsonLd(review, venueData);

  // Calculate overall rating
  const overallRating = (review.ratings.food + review.ratings.service + review.ratings.ambience + review.ratings.value) / 4;

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
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="container-wide py-4">
            <Breadcrumbs 
              items={[
                { name: 'Inicio', url: '/' },
                { name: venueData.city.title, url: `/${venueData.city.slug.current}` },
                { name: venueData.title, url: `/${venueData.city.slug.current}/${venueData.slug.current}` },
                { name: review.title, url: `/${venueData.city.slug.current}/${venueData.slug.current}/review/${review.slug.current}` },
              ]}
            />
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-white">
          <div className="container-wide py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Review Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      {review.title}
                    </h1>
                    <div className="flex items-center text-lg text-gray-600 mb-4">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                                          <Link 
                      href={`/${venueData.city.slug.current}/${venueData.slug.current}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {venueData.title}
                    </Link>
                    <span className="mx-2">•</span>
                    <span>{venueData.city.title}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>{review.author}</span>
                      <span className="mx-2">•</span>
                      <time dateTime={review.publishedAt}>
                        {new Date(review.publishedAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                  </div>
                  
                  <CompactScore score={overallRating} className="ml-4" />
                </div>

                {/* TLDR */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
                  <h2 className="text-lg font-semibold text-primary-900 mb-3">
                    📝 Resumen
                  </h2>
                  <p className="text-primary-800 leading-relaxed">
                    {review.tldr}
                  </p>
                </div>

                {/* Ratings */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Puntuaciones
                  </h2>
                  <MultiScore 
                    scores={[
                      { label: 'Comida', value: review.ratings.food },
                      { label: 'Servicio', value: review.ratings.service },
                      { label: 'Ambiente', value: review.ratings.ambience },
                      { label: 'Relación calidad-precio', value: review.ratings.value },
                    ]}
                    showAverage={true}
                  />
                </div>
              </div>

              {/* Quick Info Sidebar */}
              <div className="lg:col-span-1">
                <Suspense fallback={<div>Cargando...</div>}>
                  <LocalInfo venue={venueData} compact showMap={false} />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {review.gallery && review.gallery.length > 0 && (
          <section className="bg-white border-t border-gray-200">
            <div className="container-wide py-8">
              <Gallery 
                images={review.gallery}
                title="Fotos de la visita"
                columns={2}
                priority
              />
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="container-wide py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <main className="lg:col-span-3 space-y-8">
              {/* Highlights */}
              {review.highlights && review.highlights.length > 0 && (
                <section className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    ✨ Lo más destacado
                  </h2>
                  <ul className="space-y-3">
                    {review.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-600 mr-3 mt-1">•</span>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* In-Article Ad */}
              <InArticleAd />

              {/* Pros/Cons */}
              <section className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Pros y contras
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 mb-4">✓ Pros</h3>
                    <ul className="space-y-2">
                      {review.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2 mt-1">•</span>
                          <span className="text-gray-700">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-700 mb-4">✗ Contras</h3>
                    <ul className="space-y-2">
                      {review.cons?.map((con, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-600 mr-2 mt-1">•</span>
                          <span className="text-gray-700">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              {review.faq && review.faq.length > 0 && (
                <section>
                  <FAQ 
                    faqs={review.faq}
                    title="Preguntas frecuentes"
                  />
                </section>
              )}

              {/* Venue Details */}
              <section>
                <LocalInfo venue={venueData} showMap={true} />
              </section>
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Sidebar Ad */}
              <SidebarAd />

              {/* Visit Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de la visita
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Fecha de visita:</span>
                    <div className="text-gray-600">
                      {new Date(review.visitDate).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  {review.avgTicket && (
                    <div>
                      <span className="font-medium text-gray-700">Ticket promedio:</span>
                      <div className="text-gray-600">{review.avgTicket}€ por persona</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {review.tags && review.tags.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Etiquetas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* More from venue */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Más sobre este local
                </h3>
                <Link
                  href={`/${venueData.city.slug.current}/${venueData.slug.current}`}
                  className="block w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-center font-medium"
                >
                  Ver información completa
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}