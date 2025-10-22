"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Eye, Calendar, FileText, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardStats {
  totalReviews: number;
  totalVenues: number;
  totalCities: number;
  totalPosts: number;
  totalCategories: number;
  publishedReviews: number;
  draftReviews: number;
  publishedPosts: number;
  draftPosts: number;
}

interface RatingsStats {
  averageFood: number;
  averageService: number;
  averageAtmosphere: number;
  averageValue: number;
  averageOverall: number;
  totalReviews: number;
}

interface CityStats {
  _id: string;
  title: string;
  venueCount: number;
  reviewCount: number;
  publishedReviewCount: number;
}

interface CategoryStats {
  _id: string;
  title: string;
  venueCount: number;
  reviewCount: number;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [ratings, setRatings] = useState<RatingsStats | null>(null);
  const [cities, setCities] = useState<CityStats[]>([]);
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Cargar estadísticas generales
        const statsResponse = await fetch('/api/admin/analytics?type=overview');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Cargar ratings
        const ratingsResponse = await fetch('/api/admin/analytics?type=ratings');
        if (ratingsResponse.ok) {
          const ratingsData = await ratingsResponse.json();
          setRatings(ratingsData);
        }

        // Cargar ciudades
        const citiesResponse = await fetch('/api/admin/analytics?type=cities');
        if (citiesResponse.ok) {
          const citiesData = await citiesResponse.json();
          setCities(citiesData);
        }

        // Cargar categorías
        const categoriesResponse = await fetch('/api/admin/analytics?type=categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error cargando analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Cargando estadísticas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Métricas y estadísticas del sitio</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reseñas Totales</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReviews || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.publishedReviews || 0} publicadas • {stats?.draftReviews || 0} borradores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locales</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVenues || 0}</div>
            <p className="text-xs text-muted-foreground">
              En {stats?.totalCities || 0} ciudades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts de Blog</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.publishedPosts || 0} publicados • {stats?.draftPosts || 0} borradores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
            <p className="text-xs text-muted-foreground">
              Activas en el sitio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rating promedio */}
      {ratings && ratings.totalReviews > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rating Promedio</CardTitle>
            <CardDescription>
              Basado en {ratings.totalReviews} reseñas publicadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{ratings.averageOverall}</div>
                <p className="text-sm text-gray-600 mt-1">General</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{ratings.averageFood}</div>
                <p className="text-sm text-gray-600 mt-1">Comida</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{ratings.averageService}</div>
                <p className="text-sm text-gray-600 mt-1">Servicio</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{ratings.averageAtmosphere}</div>
                <p className="text-sm text-gray-600 mt-1">Ambiente</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{ratings.averageValue}</div>
                <p className="text-sm text-gray-600 mt-1">Precio/Calidad</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráficos y métricas detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Ciudades */}
        <Card>
          <CardHeader>
            <CardTitle>Ciudades con Más Contenido</CardTitle>
            <CardDescription>
              Top 10 ciudades por número de reseñas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cities.length > 0 ? (
              <div className="space-y-4">
                {cities.map((city, index) => (
                  <div key={city._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
                      <span className="text-sm font-medium">{city.title}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">
                        {city.venueCount} locales
                      </span>
                      <span className="text-blue-600 font-medium">
                        {city.publishedReviewCount} reseñas
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No hay ciudades aún. Crea tu primera ciudad para empezar.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top Categorías */}
        <Card>
          <CardHeader>
            <CardTitle>Categorías Más Populares</CardTitle>
            <CardDescription>
              Top 10 categorías por número de locales
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={category._id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
                        <span className="text-sm font-medium">{category.title}</span>
                      </div>
                      <span className="text-sm text-gray-600">{category.venueCount} locales</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (category.venueCount / (categories[0]?.venueCount || 1)) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No hay categorías aún. Crea tu primera categoría para empezar.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enlaces rápidos */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Gestiona tu contenido desde aquí
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/reviews/new">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Nueva Reseña
              </Button>
            </Link>
            <Link href="/dashboard/venues/new">
              <Button variant="outline" className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                Nuevo Local
              </Button>
            </Link>
            <Link href="/dashboard/blog/new">
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Nuevo Post
              </Button>
            </Link>
            <Link href="/dashboard/categories/new">
              <Button variant="outline" className="w-full">
                <Tag className="mr-2 h-4 w-4" />
                Nueva Categoría
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre las Estadísticas</CardTitle>
          <CardDescription>
            Información en tiempo real desde Sanity CMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Los datos se obtienen directamente desde Sanity CMS</p>
            <p>• Las estadísticas se actualizan en tiempo real al recargar la página</p>
            <p>• Los ratings son promedios de todas las reseñas publicadas</p>
            <p>• Para analíticas de tráfico, configura Google Analytics 4</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
