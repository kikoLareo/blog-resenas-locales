import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { sanityFetch } from '@/lib/sanity.client';
import { Category } from '@/lib/types';

// Query para obtener todas las categorías con estadísticas
const categoriesQuery = `
  *[_type == "category"] {
    _id,
    title,
    slug,
    description,
    icon,
    color,
    group,
    "venueCount": count(*[_type == "venue" && ^._id in categories[]._ref]),
    "reviewCount": count(*[_type == "review" && ^._id in venue->categories[]._ref])
  }[venueCount > 0 || reviewCount > 0] | order(title asc)
`;

export const metadata: Metadata = {
  title: 'Categorías',
  description: 'Explora nuestras categorías de restaurantes y locales. Encuentra el tipo de establecimiento que buscas.',
  openGraph: {
    title: 'Categorías | ' + SITE_CONFIG.name,
    description: 'Explora nuestras categorías de restaurantes y locales.',
    type: 'website',
    url: `${SITE_CONFIG.url}/categorias`,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/categorias`,
  },
};

export default async function CategoriasPage() {
  // Obtener categorías reales de Sanity
  const categories: Category[] = await sanityFetch({
    query: categoriesQuery,
    tags: ['category'],
  });

  const groups = {
    gastro: { title: 'Gastronomía', items: [] as Category[] },
    ocio: { title: 'Ocio', items: [] as Category[] },
    deportes: { title: 'Deportes', items: [] as Category[] },
  };

  categories.forEach(cat => {
    if (cat.group === 'ocio') groups.ocio.items.push(cat);
    else if (cat.group === 'deportes') groups.deportes.items.push(cat);
    else groups.gastro.items.push(cat); // Default to gastro
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-wide py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explora por <span className="text-primary-600">Categorías</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra exactamente lo que buscas navegando por nuestras categorías especializadas.
          </p>
        </div>

        {/* Categories Grid */}
        {categories?.length > 0 ? (
          <div className="space-y-16">
            {Object.entries(groups).map(([key, group]) => (
              group.items.length > 0 && (
                <section key={key}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4 flex items-center">
                    <span className="mr-2 text-4xl">
                      {key === 'gastro' ? '🍽️' : key === 'ocio' ? '🎭' : '⚽'}
                    </span>
                    {group.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {group.items.map((category) => (
                      <Link
                        key={category._id}
                        href={`/categorias/${category.slug.current}`}
                        className="group"
                      >
                        <article className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg overflow-hidden h-full">
                          <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                              {category.title}
                            </h3>
                            
                            {category.description && (
                              <p className="text-gray-600 mb-6 leading-relaxed">
                                {category.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                  {category.venueCount || 0} locales
                                </span>
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                  {category.reviewCount || 0} reseñas
                                </span>
                              </div>
                              <span className="text-primary-600 group-hover:text-primary-700 font-medium">
                                Explorar →
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay categorías disponibles
              </h3>
              <p className="text-gray-600">
                Las categorías se mostrarán aquí una vez que sean creadas en el sistema.
              </p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-gray-600 mb-6">
              Contáctanos para sugerir nuevas categorías o locales que te gustaría que reseñemos.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Contactar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}