import { notFound } from 'next/navigation';
import { sanityFetch } from '@/lib/sanity.client';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MinimalCategoryPage({ params }: CategoryPageProps) {
  try {
    const { slug } = await params;
    
    // Only test the category query
    const categoryQuery = `*[_type == "category" && slug.current == $categorySlug][0] {
      _id,
      title,
      slug,
      description
    }`;
    
    const category = await sanityFetch<any>({ 
      query: categoryQuery, 
      params: { categorySlug: slug }, 
      tags: ['categories'], 
      revalidate: 0 
    });
    
    if (!category) {
      notFound();
    }

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">
          Categoría: {category.title}
        </h1>
        <p>Slug: {slug}</p>
        <p>ID: {category._id}</p>
        <p>Descripción: {category.description}</p>
        
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Datos de la categoría:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(category, null, 2)}
          </pre>
        </div>
      </div>
    );
    
  } catch (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-red-600">Error en categoría</h1>
        <p className="mt-4">
          {error instanceof Error ? error.message : String(error)}
        </p>
      </div>
    );
  }
}