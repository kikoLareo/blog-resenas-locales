import { sanityFetch } from '@/lib/sanity.client';

export default async function TestCategoriaPage() {
  try {
    // Test simple query
    const simpleQuery = `*[_type == "category"][0]`;
    const category = await sanityFetch<any>({ 
      query: simpleQuery, 
      params: {}, 
      tags: ['categories'], 
      revalidate: 0 
    });
    
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">
          Test Categoría - Primera categoría en Sanity
        </h1>
        {category ? (
          <div>
            <p><strong>ID:</strong> {category._id}</p>
            <p><strong>Título:</strong> {category.title}</p>
            <p><strong>Slug:</strong> {category.slug?.current}</p>
          </div>
        ) : (
          <p>No se encontraron categorías</p>
        )}
        
        <details className="mt-8">
          <summary className="cursor-pointer font-semibold">Debug Info</summary>
          <pre className="bg-gray-100 p-4 mt-4 overflow-auto text-sm">
            {JSON.stringify(category, null, 2)}
          </pre>
        </details>
      </div>
    );
    
  } catch (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1>Error en test categoría</h1>
        <p className="text-red-600">
          {error instanceof Error ? error.message : 'Error desconocido'}
        </p>
      </div>
    );
  }
}