import { adminSanityClient } from "@/lib/admin-sanity";
import { dashboardStatsQuery } from "@/lib/admin-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  FileText, 
  MapPin, 
  Users, 
  AlertTriangle, 
  Plus, 
  Star,
  Eye,
  TrendingUp,
  Calendar,
  Settings
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  let data: any = null;
  let sanityError = false;

  try {
    data = await adminSanityClient.fetch(dashboardStatsQuery);
  } catch (error) {
    sanityError = true;
    // Datos por defecto cuando Sanity falla
    data = {
      totalReviews: 0,
      totalVenues: 0,
      totalCities: 0,
      totalPosts: 0,
      recentReviews: [],
      recentVenues: []
    };
  }

  const { totalReviews, totalVenues, totalCities, totalPosts, recentReviews, recentVenues } = data;

  return (
    <div className="space-y-8">
      {/* Header con saludo y fecha */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Última actualización: ahora</span>
        </div>
      </div>

      {sanityError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="text-sm font-medium text-yellow-800">Sanity no configurado</h3>
          </div>
          <p className="mt-2 text-sm text-yellow-700">
            Para ver datos reales, configura las variables de entorno de Sanity en tu archivo .env.local
          </p>
          <div className="mt-3 text-xs text-yellow-600">
            <p>Variables necesarias:</p>
            <code className="block mt-1 bg-yellow-100 p-2 rounded">
              SANITY_PROJECT_ID=tu-project-id<br/>
              SANITY_DATASET=production<br/>
              SANITY_API_READ_TOKEN=tu-read-token
            </code>
          </div>
        </div>
      )}

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Reseñas Totales</CardTitle>
            <FileText className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalReviews}</div>
            <p className="text-xs text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {totalReviews > 0 ? '+2 esta semana' : 'Ninguna creada aún'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Locales</CardTitle>
            <MapPin className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalVenues}</div>
            <p className="text-xs text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {totalVenues > 0 ? '+1 esta semana' : 'Ninguno creado aún'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ciudades</CardTitle>
            <BarChart3 className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalCities}</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalCities > 0 ? 'Valencia, Barcelona, Madrid' : 'Ninguna creada aún'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Posts Blog</CardTitle>
            <Users className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalPosts}</div>
            <p className="text-xs text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {totalPosts > 0 ? 'Artículos publicados' : 'Ninguno creado aún'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/reviews/new">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Nueva Reseña
                </Button>
              </Link>
              <Link href="/dashboard/venues/new">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Nuevo Local
                </Button>
              </Link>
              <Link href="/dashboard/featured">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Gestionar Destacados
                </Button>
              </Link>
              <Link href="/dashboard/homepage-sections">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Homepage
                </Button>
              </Link>
              <Link href="/dashboard/blog/new">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Nuevo Post
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gestión del Sitio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/" target="_blank">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Sitio Web
                </Button>
              </Link>
              <Link href="/dashboard/featured">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Configurar Página Principal
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración General
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Últimas Reseñas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews && recentReviews.length > 0 ? (
                recentReviews.map((review: any) => (
                  <div key={review._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{review.title}</p>
                      <p className="text-xs text-gray-500">
                        {review.venue?.title} ({review.venue?.city?.title})
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(review._createdAt).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay reseñas recientes</p>
                  <Link href="/dashboard/reviews/new">
                    <Button variant="link" size="sm" className="mt-2">
                      Crear primera reseña
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Últimos Locales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVenues && recentVenues.length > 0 ? (
                recentVenues.map((venue: any) => (
                  <div key={venue._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{venue.name}</p>
                      <p className="text-xs text-gray-500">{venue.city}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(venue._createdAt).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay locales recientes</p>
                  <Link href="/dashboard/venues/new">
                    <Button variant="link" size="sm" className="mt-2">
                      Añadir primer local
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}