import { Suspense } from 'react';
import FeaturedItemsManager from '../../../components/admin/FeaturedItemsManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, FileText, Eye, EyeOff } from 'lucide-react';
import { getFeaturedItemsStats } from '@/lib/featured-admin';

export default async function FeaturedPage() {
  // Obtener estadísticas reales
  const stats = await getFeaturedItemsStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Elementos Destacados</h1>
        <p className="text-gray-600">Gestiona el carrusel principal de la homepage</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Elementos configurados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              Mostrándose en carrusel
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive || 0}</div>
            <p className="text-xs text-muted-foreground">
              Ocultos del carrusel
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reseñas</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.byType?.find((t: any) => t.type === 'review')?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Elementos tipo reseña
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
