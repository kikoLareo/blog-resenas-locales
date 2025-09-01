import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchForm from '@/components/SearchForm';
import FilterBar from '@/components/FilterBar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SidebarAd } from '@/components/AdSlot';
import { SITE_CONFIG } from '@/lib/constants';

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    city?: string;
    priceRange?: string;
  }>;
};

// Generate metadata
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';
  
  const title = query 
    ? `Resultados de búsqueda para "${query}" | ${SITE_CONFIG.name}`
    : `Buscar restaurantes | ${SITE_CONFIG.name}`;
    
  const description = query
    ? `Encuentra los mejores restaurantes que coinciden con "${query}". Reseñas locales y recomendaciones.`
    : 'Busca restaurantes por ciudad, categoría, precio y más. Encuentra tu próximo lugar favorito.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  
  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs 
          items={[
            { name: 'Inicio', url: '/' },
            { name: 'Buscar', url: '/buscar' }
          ]} 
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contenido principal */}
          <main className="lg:w-2/3">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Buscar restaurantes
            </h1>

            {/* Formulario de búsqueda */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <SearchForm initialQuery={params.q} />
            </div>

            {/* Filtros */}
            <div className="mb-8">
              <FilterBar 
                initialFilters={{
                  category: params.category,
                  city: params.city,
                  priceRange: params.priceRange,
                }}
              />
            </div>

            {/* Resultados */}
            <div className="space-y-6">
              <Suspense fallback={<SearchResultsSkeleton />}>
                <SearchResults searchParams={params} />
              </Suspense>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-8">
              <SidebarAd />
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Consejos de búsqueda</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Usa términos específicos como &quot;paella&quot; o &quot;sushi&quot;</li>
                  <li>• Combina filtros para mejores resultados</li>
                  <li>• Busca por nombre del restaurante o tipo de cocina</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Componente de resultados de búsqueda
async function SearchResults({ searchParams }: { searchParams: any }) {
  const { q, category, city, priceRange } = searchParams;

  // Por ahora mostrar un mensaje placeholder
  // TODO: Implementar búsqueda real con Sanity
  if (!q && !category && !city && !priceRange) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Introduce términos de búsqueda o selecciona filtros para ver resultados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Resultados {q && `para &quot;${q}&quot;`}
        </h2>
        <p className="text-sm text-gray-500">
          0 resultados encontrados
        </p>
      </div>

      <div className="text-center py-12">
        <p className="text-gray-500">
          No se encontraron resultados. 
          <br />
          La funcionalidad de búsqueda está en desarrollo.
        </p>
      </div>
    </div>
  );
}

// Skeleton loader para resultados
function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
          <div className="flex space-x-4">
            <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}