type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

// Página de categorías sin layout - para diagnosticar si el problema está en el layout
export default async function CategoryPageNoLayout({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  return (
    <html lang="es">
      <head>
        <title>Debug Categoría: {slug}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ color: '#059669', marginBottom: '1rem' }}>
          ✅ Categoría funcionando: {slug}
        </h1>
        <p>Si ves esto, el problema no está en el layout público.</p>
        <p>Esto confirma que el error 500 está relacionado con alguna dependencia del layout.</p>
      </body>
    </html>
  );
}