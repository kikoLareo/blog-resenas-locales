import { Suspense } from 'react';
import FeaturedItemsManager from '../../../components/admin/FeaturedItemsManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, TrendingUp, Settings } from 'lucide-react';

export default function FeaturedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Elementos Destacados</h1>
        <p className="text-gray-600">Gestiona el carrusel principal de la homepage</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Elementos Activos</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Mostrándose en carrusel
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Más Popular</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              CTR del elemento principal
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-rotación</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7s</div>
            <p className="text-xs text-muted-foreground">
              Intervalo de cambio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Manager Component */}
      <Suspense fallback={<div className="text-center py-8">Cargando elementos destacados...</div>}>
        <FeaturedItemsManager />
      </Suspense>
    </div>
  );
}
