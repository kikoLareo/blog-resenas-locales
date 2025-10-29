type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function UltraSimpleCategoryPage({ params }: CategoryPageProps) {
  try {
    const { slug } = await params;
    
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">
          Categoría Test: {slug}
        </h1>
        <p className="mb-4">Esta es una página de prueba simple</p>
        <p className="text-sm text-gray-600">
          Si ves esto, significa que el routing funciona correctamente.
        </p>
      </div>
    );
    
  } catch (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1>Error básico</h1>
        <p className="text-red-600">
          {error instanceof Error ? error.message : 'Error desconocido'}
        </p>
      </div>
    );
  }
}