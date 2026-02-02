import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Venue, Category } from '@/lib/types';
import { SITE_CONFIG } from '@/lib/constants';
import { sanityFetch } from '@/lib/sanity.client';
import { categoryQuery } from '@/sanity/lib/queries';
import { venuesByCategoryQuery } from '@/lib/public-queries';
import { getVenueUrl } from '@/lib/utils';

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

    // Query de venues con la versión proyectada de public-queries que ya trae slugs como strings
    let venues: any[] = [];
    try {
      venues = await sanityFetch<any[]>({ 
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
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        {/* Breadcrumbs */}
        <div className="bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-white/10">
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
        <section className="bg-white dark:bg-[#111111] dark:border-b dark:border-white/5">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {category.title}
              </h1>
              
              {category.description && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  {category.description}
                </p>
              )}
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                <span className="bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">{venues.length} locales encontrados</span>
                <span className="flex items-center">•</span>
                <span className="bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">Actualizado recientemente</span>
              </div>
            </div>
          </div>
        </section>

        {/* Venues Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {venues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {venues.map((venue) => (
                  <VenueCard key={venue._id} venue={venue} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  No hay locales disponibles aún
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Estamos trabajando en agregar más locales en esta categoría para ofrecerte las mejores reseñas.
                </p>
                <Link
                  href="/categorias"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95"
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
function VenueCard({ venue }: { venue: any }) {
  // Usar la función centralizada para generar la URL correcta sin duplicar slugs
  const venueUrl = getVenueUrl(venue.city?.slug, venue.slug);
  
  return (
    <Link href={venueUrl}>
      <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm hover:shadow-xl dark:shadow-none dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all duration-300 overflow-hidden group h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={venue.images?.asset?.url || venue.images?.[0]?.asset?.url || '/placeholder-venue.jpg'}
            alt={venue.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Price badge */}
          {venue.priceRange && (
            <div className="absolute top-4 right-4">
              <span className="bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                {venue.priceRange}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {venue.title}
          </h3>
          
          {venue.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 md:line-clamp-3">
              {venue.description}
            </p>
          )}
          
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5 text-sm">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <span className="truncate max-w-[120px]">{venue.city?.title || 'Ciudad'}</span>
            </div>
            
            <span className="text-primary font-semibold flex items-center gap-1">
              Ver detalles
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}