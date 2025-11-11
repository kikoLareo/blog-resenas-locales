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

interface PerformanceData {
  totalSessions: number;
  totalMetrics: number;
  aggregatedStats: {
    sampleSize: number;
    coreWebVitals: {
      lcp: { p50: number; p75: number; p90: number; p95: number };
      cls: { p50: number; p75: number; p90: number; p95: number };
      fcp: { p50: number; p75: number; p90: number; p95: number };
      ttfb: { p50: number; p75: number; p90: number; p95: number };
    };
    loadTimes: { p50: number; p75: number; p90: number; p95: number };
    deviceInfo: {
      connectionTypes: string[];
      avgMemory: number;
      avgConcurrency: number;
    };
  } | null;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [ratings, setRatings] = useState<RatingsStats | null>(null);
  const [cities, setCities] = useState<CityStats[]>([]);
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
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

        // Cargar métricas de rendimiento
        const performanceResponse = await fetch('/api/performance/metrics?hours=24');
        if (performanceResponse.ok) {
          const performanceData = await performanceResponse.json();
          setPerformance(performanceData);
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

      {/* Core Web Vitals y Performance */}
      {performance && performance.aggregatedStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Core Web Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals (Últimas 24h)</CardTitle>
              <CardDescription>
                {performance.totalSessions} sesiones • {performance.aggregatedStats.sampleSize} métricas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* LCP - Largest Contentful Paint */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">LCP (Largest Contentful Paint)</span>
                    <span className={`text-sm font-bold ${
                      performance.aggregatedStats.coreWebVitals.lcp.p75 <= 2500 
                        ? 'text-green-600' 
                        : performance.aggregatedStats.coreWebVitals.lcp.p75 <= 4000 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {(performance.aggregatedStats.coreWebVitals.lcp.p75 / 1000).toFixed(2)}s
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    P50: {(performance.aggregatedStats.coreWebVitals.lcp.p50 / 1000).toFixed(2)}s • 
                    P90: {(performance.aggregatedStats.coreWebVitals.lcp.p90 / 1000).toFixed(2)}s
                  </div>
                </div>

                {/* CLS - Cumulative Layout Shift */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">CLS (Cumulative Layout Shift)</span>
                    <span className={`text-sm font-bold ${
                      performance.aggregatedStats.coreWebVitals.cls.p75 <= 0.1 
                        ? 'text-green-600' 
                        : performance.aggregatedStats.coreWebVitals.cls.p75 <= 0.25 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {performance.aggregatedStats.coreWebVitals.cls.p75.toFixed(3)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    P50: {performance.aggregatedStats.coreWebVitals.cls.p50.toFixed(3)} • 
                    P90: {performance.aggregatedStats.coreWebVitals.cls.p90.toFixed(3)}
                  </div>
                </div>

                {/* FCP - First Contentful Paint */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">FCP (First Contentful Paint)</span>
                    <span className={`text-sm font-bold ${
                      performance.aggregatedStats.coreWebVitals.fcp.p75 <= 1800 
                        ? 'text-green-600' 
                        : performance.aggregatedStats.coreWebVitals.fcp.p75 <= 3000 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {(performance.aggregatedStats.coreWebVitals.fcp.p75 / 1000).toFixed(2)}s
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    P50: {(performance.aggregatedStats.coreWebVitals.fcp.p50 / 1000).toFixed(2)}s • 
                    P90: {(performance.aggregatedStats.coreWebVitals.fcp.p90 / 1000).toFixed(2)}s
                  </div>
                </div>

                {/* TTFB - Time to First Byte */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">TTFB (Time to First Byte)</span>
                    <span className={`text-sm font-bold ${
                      performance.aggregatedStats.coreWebVitals.ttfb.p75 <= 800 
                        ? 'text-green-600' 
                        : performance.aggregatedStats.coreWebVitals.ttfb.p75 <= 1800 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {(performance.aggregatedStats.coreWebVitals.ttfb.p75 / 1000).toFixed(2)}s
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    P50: {(performance.aggregatedStats.coreWebVitals.ttfb.p50 / 1000).toFixed(2)}s • 
                    P90: {(performance.aggregatedStats.coreWebVitals.ttfb.p90 / 1000).toFixed(2)}s
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Dispositivos</CardTitle>
              <CardDescription>
                Datos de los usuarios en las últimas 24 horas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Tipos de Conexión</div>
                  <div className="flex flex-wrap gap-2">
                    {performance.aggregatedStats.deviceInfo.connectionTypes.length > 0 ? (
                      performance.aggregatedStats.deviceInfo.connectionTypes.map((type, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {type}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No hay datos disponibles</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Memoria del Dispositivo</div>
                  <div className="text-2xl font-bold">
                    {performance.aggregatedStats.deviceInfo.avgMemory > 0 
                      ? `${performance.aggregatedStats.deviceInfo.avgMemory.toFixed(1)} GB`
                      : 'N/A'
                    }
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Promedio</p>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Núcleos de CPU</div>
                  <div className="text-2xl font-bold">
                    {performance.aggregatedStats.deviceInfo.avgConcurrency > 0 
                      ? performance.aggregatedStats.deviceInfo.avgConcurrency.toFixed(1)
                      : 'N/A'
                    }
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Promedio de núcleos</p>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Tiempo de Carga</div>
                  <div className="text-2xl font-bold">
                    {(performance.aggregatedStats.loadTimes.p75 / 1000).toFixed(2)}s
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    P75 • P90: {(performance.aggregatedStats.loadTimes.p90 / 1000).toFixed(2)}s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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

      {/* Configuración de Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Analytics</CardTitle>
          <CardDescription>
            Herramientas de análisis configuradas en el sitio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Google Analytics 4 */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  Google Analytics 4
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Activo</span>
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  ID: {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XSLBYXBEZJ'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Tracking de eventos, páginas y conversiones activo
                </p>
              </div>
              <Link href="https://analytics.google.com" target="_blank">
                <Button variant="outline" size="sm">
                  Ver en GA4 →
                </Button>
              </Link>
            </div>
            
            {/* Performance Monitor */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  Performance Monitor
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Activo</span>
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Core Web Vitals y Real User Monitoring
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {performance ? `${performance.totalSessions} sesiones en las últimas 24h` : 'Recopilando datos...'}
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                En Vivo
              </Button>
            </div>

            {/* Sanity Analytics */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  Sanity CMS Analytics
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Activo</span>
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Estadísticas de contenido en tiempo real
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats ? `${stats.totalReviews} reseñas • ${stats.totalVenues} locales` : 'Cargando...'}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Actualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre las Estadísticas</CardTitle>
          <CardDescription>
            Información sobre los datos mostrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">📊 Datos de Contenido</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Obtienen desde Sanity CMS</p>
                <p>• Actualizados en tiempo real</p>
                <p>• Incluyen borradores y publicados</p>
                <p>• Ratings promediados automáticamente</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">⚡ Core Web Vitals</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Datos reales de usuarios (RUM)</p>
                <p>• Últimas 24 horas de actividad</p>
                <p>• Percentiles: P50, P75, P90, P95</p>
                <p>• Colores: 🟢 Bueno 🟡 Regular 🔴 Pobre</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">🌐 Google Analytics 4</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Tracking automático de páginas</p>
                <p>• Eventos personalizados activos</p>
                <p>• Ver reportes completos en GA4</p>
                <p>• Exportar datos disponible</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">💡 Recomendaciones</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• LCP objetivo: &lt; 2.5s</p>
                <p>• CLS objetivo: &lt; 0.1</p>
                <p>• FCP objetivo: &lt; 1.8s</p>
                <p>• TTFB objetivo: &lt; 800ms</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
