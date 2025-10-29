import { notFound } from 'next/navigation';
import { sanityFetch } from '@/lib/sanity.client';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SimpleCategoryPage({ params }: CategoryPageProps) {
  try {
    const { slug } = await params;
    
    // Test simple query first
    const simpleQuery = `*[_type == "category" && slug.current == $categorySlug][0]`;
    const category = await sanityFetch<any>({ 
      query: simpleQuery, 
      params: { categorySlug: slug }, 
      tags: ['categories'], 
      revalidate: 0 
    });
    
    if (!category) {
      return (
        <div className="container mx-auto py-8 px-4">
          <h1>Categoría no encontrada: {slug}</h1>
          <p>No se pudo encontrar la categoría con el slug: {slug}</p>
        </div>
      );
    }

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">
          {category.title || 'Categoría'}
        </h1>
        <p className="mb-4">Slug: {slug}</p>
        <p className="mb-4">ID: {category._id}</p>
        
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
        <h1>Error en la página de categorías</h1>
        <p className="text-red-600">
          {error instanceof Error ? error.message : 'Error desconocido'}
        </p>
      </div>
    );
  }
}