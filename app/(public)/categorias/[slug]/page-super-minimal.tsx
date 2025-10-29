type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SuperMinimalCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">
        Categoría funcionando: {slug}
      </h1>
      <p>Si ves esto, la página básica funciona.</p>
    </div>
  );
}