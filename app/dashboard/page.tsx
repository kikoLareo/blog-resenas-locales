import { adminSanityClient } from "@/lib/admin-sanity";
import { dashboardStatsQuery } from "@/lib/admin-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, MapPin, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  let data: any = null;
  let sanityError = false;

  try {
    data = await adminSanityClient.fetch(dashboardStatsQuery);
  } catch (error) {
    console.error('Error fetching Sanity data:', error);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al panel de administración</p>
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
              NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id<br/>
              NEXT_PUBLIC_SANITY_DATASET=production<br/>
              SANITY_API_READ_TOKEN=tu-read-token
            </code>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Reseñas</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Locales</CardTitle>
            <MapPin className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVenues || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Ciudades</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCities || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Posts</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Reseñas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews?.map((review: any) => (
                <div key={review._id} className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{review.title}</p>
                    <p className="text-sm text-gray-500">
                      {review.venue?.title} ({review.venue?.city?.title})
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review._createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Locales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVenues?.map((venue: any) => (
                <div key={venue._id} className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{venue.name}</p>
                    <p className="text-sm text-gray-500">{venue.city}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(venue._createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}