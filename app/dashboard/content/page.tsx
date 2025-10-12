import { Suspense } from 'react';
import SEOContentStats from '@/components/dashboard/SEOContentStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Componente de loading para mostrar mientras se cargan los datos
function LoadingStats() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenidos SEO</h1>
        <p className="text-gray-600">Administra guías, rankings, recetas y todo el contenido especializado</p>
      </div>
      
      {/* Loading placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="flex gap-2">
                  <div className="h-8 flex-1 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ContentManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenidos SEO</h1>
        <p className="text-gray-600">Administra guías, rankings, recetas y todo el contenido especializado</p>
      </div>

      <Suspense fallback={<LoadingStats />}>
        <SEOContentStats />
      </Suspense>
    </div>
  );
}
