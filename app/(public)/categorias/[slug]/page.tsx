import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Venue, Category } from '@/lib/types';
import { SITE_CONFIG } from '@/lib/constants';
import { sanityFetch } from '@/lib/sanity.client';
import { categoryQuery, venuesByCategoryQuery } from '@/sanity/lib/queries';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

// Generate metadata - SIMPLIFICADA para evitar errores
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    
    // Query simplificada para evitar errores
    const simpleQuery = `*[_type == "category" && slug.current == $categorySlug][0] {
      title,
      description
    }`;
    
    const category = await sanityFetch<{title: string, description?: string} | null>({ 
      query: simpleQuery, 
      params: { categorySlug: slug }, 
      tags: ['categories'], 
      revalidate: 0 
    });
    
    if (!category) {
      return {
        title: 'Categoría no encontrada',
        description: 'La categoría que buscas no existe.'
      };
    }

    const title = `${category.title} | ${SITE_CONFIG.name}`;
    const description = category.description || `Descubre los mejores ${category.title.toLowerCase()} con nuestras reseñas detalladas y recomendaciones.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${SITE_CONFIG.url}/categorias/${slug}`,
        locale: 'es_ES',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch (error) {
    // En caso de error, devolver metadata básica
    return {
      title: 'Categoría | Blog de Reseñas',
      description: 'Explora nuestra selección de restaurantes y locales por categoría.'
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  try {
    const { slug } = await params;
    
    // Query principal con manejo de errores
    const category = await sanityFetch<Category | null>({ 
      query: categoryQuery, 
      params: { categorySlug: slug }, 
      tags: ['categories'], 
      revalidate: 0 
    });

    if (!category) {
      notFound();
    }

    // Query de venues simplificada - solo si la categoría existe
    let venues: Venue[] = [];
    try {
      venues = await sanityFetch<Venue[]>({ 
        query: venuesByCategoryQuery, 
        params: { categorySlug: slug, offset: 0, limit: 12 }, 
        tags: ['venues'], 
        revalidate: 0 
      });
    } catch (venueError) {
      // Si falla la query de venues, continuar con array vacío
      venues = [];
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumbs 
              items={[
                { name: 'Inicio', url: '/' },
                { name: 'Categorías', url: '/categorias' },
                { name: category.title, url: `/categorias/${slug}` },
              ]}
            />
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-white">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {category.title}
              </h1>
              
              {category.description && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {category.description}
                </p>
              )}
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <span>{venues.length} locales encontrados</span>
                <span>•</span>
                <span>Actualizado recientemente</span>
              </div>
            </div>
          </div>
        </section>

        {/* Venues Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {venues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {venues.map((venue) => (
                  <VenueCard key={venue._id} venue={venue} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No hay locales disponibles aún
                </h3>
                <p className="text-gray-600 mb-8">
                  Estamos trabajando en agregar más locales en esta categoría.
                </p>
                <Link
                  href="/categorias"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
                >
                  Ver otras categorías
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    );
    
  } catch (error) {
    // Error general - mostrar página de error amigable
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error al cargar la categoría
          </h1>
          <p className="text-gray-600 mb-6">
            Ha ocurrido un error al cargar esta categoría. Por favor, inténtalo de nuevo.
          </p>
          <Link
            href="/categorias"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Ver todas las categorías
          </Link>
        </div>
      </div>
    );
  }
}

// Componente para mostrar venues
function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Link href={`/${venue.city?.slug?.current || 'ciudad'}/${venue.slug?.current || venue._id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {venue.images?.[0] && (
            <Image
              src={venue.images[0].asset?.url || '/placeholder-venue.jpg'}
              alt={venue.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          )}
          
          {/* Price badge */}
          {venue.priceRange && (
            <div className="absolute top-3 right-3">
              <span className="bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-full">
                {venue.priceRange}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {venue.title}
          </h3>
          
          {venue.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {venue.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{venue.city?.title || 'Ciudad'}</span>
            {venue.categories?.[0] && (
              <span className="text-primary">{venue.categories[0].title}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}