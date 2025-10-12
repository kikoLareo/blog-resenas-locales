import { adminSanityClient } from '@/lib/admin-sanity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Trophy, 
  ChefHat, 
  Utensils, 
  Newspaper, 
  Tag,
  Plus,
  BarChart3,
  Clock,
  Eye,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { getSEOContentStatsQuery, getRecentSEOActivityQuery, getEditorialCalendarQuery } from '@/lib/seo-queries';

// Función para obtener estadísticas de contenidos SEO
async function getSEOStats() {
  try {
    const stats = await adminSanityClient.fetch(getSEOContentStatsQuery);
    return stats;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching SEO stats:', error);
    // Fallback con datos vacíos
    return {
      guides: { total: 0, published: 0, drafts: 0, featured: 0, thisMonth: 0, avgViews: 0 },
      lists: { total: 0, published: 0, drafts: 0, featured: 0, thisMonth: 0, avgViews: 0 },
      recipes: { total: 0, published: 0, drafts: 0, featured: 0, thisMonth: 0, avgCookTime: 0 },
      dishGuides: { total: 0, published: 0, drafts: 0, featured: 0, thisMonth: 0 },
      news: { total: 0, published: 0, drafts: 0, featured: 0, expiringSoon: 0, thisMonth: 0 },
      offers: { total: 0, published: 0, drafts: 0, featured: 0, expiringSoon: 0, active: 0, thisMonth: 0 }
    };
  }
}

// Función para obtener actividad reciente
async function getRecentActivity() {
  try {
    const activity = await adminSanityClient.fetch(getRecentSEOActivityQuery);
    return activity.recent || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

// Función para obtener calendario editorial
async function getEditorialCalendar() {
  try {
    const calendar = await adminSanityClient.fetch(getEditorialCalendarQuery);
    return calendar;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching editorial calendar:', error);
    return { scheduled: [], expiring: [] };
  }
}

// Mapeo de tipos a nombres en español
const typeNames: Record<string, string> = {
  guide: 'Guía',
  list: 'Lista',
  recipe: 'Receta',
  'dish-guide': 'Guía de plato',
  news: 'Noticia',
  offer: 'Oferta'
};

// Mapeo de acciones a colores
const actionColors: Record<string, string> = {
  published: 'bg-green-500',
  updated: 'bg-blue-500',
  expires: 'bg-orange-500',
  draft: 'bg-purple-500'
};

export default async function SEOContentStats() {
  const stats = await getSEOStats();
  const recentActivity = await getRecentActivity();
  const calendar = await getEditorialCalendar();

  // Calcular totales
  const totalContent = stats.guides.total + stats.lists.total + stats.recipes.total + 
                      stats.dishGuides.total + stats.news.total + stats.offers.total;
  
  const totalPublished = stats.guides.published + stats.lists.published + stats.recipes.published + 
                        stats.dishGuides.published + stats.news.published + stats.offers.published;
  
  const totalDrafts = stats.guides.drafts + stats.lists.drafts + stats.recipes.drafts + 
                     stats.dishGuides.drafts + stats.news.drafts + stats.offers.drafts;
  
  const totalThisMonth = stats.guides.thisMonth + stats.lists.thisMonth + stats.recipes.thisMonth + 
                        stats.dishGuides.thisMonth + stats.news.thisMonth + stats.offers.thisMonth;

  const publicationRate = totalContent > 0 ? Math.round((totalPublished / totalContent) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Content Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Guides */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Guías & Rutas</CardTitle>
            <MapPin className="h-6 w-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">{stats.guides.total}</div>
              <p className="text-sm text-gray-600">
                Guías gastronómicas por barrios y temáticas
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <TrendingUp className="h-3 w-3" />
                <span>+{stats.guides.thisMonth} este mes</span>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard/content/guides/new">
                  <Button size="sm" className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Nueva Guía
                  </Button>
                </Link>
                <Link href="/dashboard/content/guides">
                  <Button size="sm" variant="outline">
                    Ver todas
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lists & Rankings */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Listas & Rankings</CardTitle>
            <Trophy className="h-6 w-6 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">{stats.lists.total}</div>
              <p className="text-sm text-gray-600">
                Rankings comparativos y listas temáticas
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Eye className="h-3 w-3" />
                <span>{stats.lists.avgViews ? `${Math.round(stats.lists.avgViews)} vistas promedio` : 'Sin datos de vistas'}</span>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard/content/lists/new">
                  <Button size="sm" className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Nuevo Ranking
                  </Button>
                </Link>
                <Link href="/dashboard/content/lists">
                  <Button size="sm" variant="outline">
                    Ver todos
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipes */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Recetas</CardTitle>
            <ChefHat className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">{stats.recipes.total}</div>
              <p className="text-sm text-gray-600">
                Recetas tradicionales y modernas
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{stats.recipes.avgCookTime ? `${Math.round(stats.recipes.avgCookTime)} min promedio` : 'Sin tiempo promedio'}</span>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard/content/recipes/new">
                  <Button size="sm" className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Nueva Receta
                  </Button>
                </Link>
                <Link href="/dashboard/content/recipes">
                  <Button size="sm" variant="outline">
                    Ver todas
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dish Guides */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Guías de Platos</CardTitle>
            <Utensils className="h-6 w-6 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">{stats.dishGuides.total}</div>
              <p className="text-sm text-gray-600">
                Guías específicas de platos tradicionales
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <BarChart3 className="h-3 w-3" />
                <span>{stats.dishGuides.featured > 0 ? 'Con contenido destacado' : 'Sin destacados'}</span>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard/content/dish-guides/new">
                  <Button size="sm" className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Nueva Guía
                  </Button>
                </Link>
                <Link href="/dashboard/content/dish-guides">
                  <Button size="sm" variant="outline">
                    Ver todas
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Noticias</CardTitle>
            <Newspaper className="h-6 w-6 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">{stats.news.total}</div>
              <p className="text-sm text-gray-600">
                Novedades, aperturas y tendencias
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{stats.news.expiringSoon} pendientes de expirar</span>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard/content/news/new">
                  <Button size="sm" className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Nueva Noticia
                  </Button>
                </Link>
                <Link href="/dashboard/content/news">
                  <Button size="sm" variant="outline">
                    Ver todas
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offers */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Ofertas & Menús</CardTitle>
            <Tag className="h-6 w-6 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">{stats.offers.total}</div>
              <p className="text-sm text-gray-600">
                Ofertas especiales y menús temporales
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{stats.offers.expiringSoon} expiran pronto</span>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard/content/offers/new">
                  <Button size="sm" className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Nueva Oferta
                  </Button>
                </Link>
                <Link href="/dashboard/content/offers">
                  <Button size="sm" variant="outline">
                    Ver todas
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contenidos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContent}</div>
            <p className="text-xs text-muted-foreground">
              +{totalThisMonth} desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPublished}</div>
            <p className="text-xs text-muted-foreground">
              {publicationRate}% de tasa de publicación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDrafts}</div>
            <p className="text-xs text-muted-foreground">
              Pendientes de revisión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Publicaciones nuevas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((item: any) => (
                <div key={item._id} className="flex items-center gap-4">
                  <div className={`w-2 h-2 ${actionColors[item.action]} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {typeNames[item._type]} &quot;{item.title}&quot; {item.action === 'published' ? 'publicada' : 'actualizada'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.publishedAt || item.lastUpdated).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Calendar Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calendario Editorial</CardTitle>
          <Button variant="outline" size="sm">
            Ver calendario completo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Contenido programado (borradores) */}
            {calendar.scheduled.map((item: any) => (
              <div key={item._id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{typeNames[item._type]}: &quot;{item.title}&quot;</p>
                  <p className="text-xs text-muted-foreground">En borrador</p>
                </div>
                <div className="text-xs text-blue-600 font-medium">
                  {new Date(item._createdAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            ))}

            {/* Contenido que expira próximamente */}
            {calendar.expiring.map((item: any) => (
              <div key={item._id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{typeNames[item._type]}: &quot;{item.title}&quot;</p>
                  <p className="text-xs text-muted-foreground">Próximo a expirar</p>
                </div>
                <div className="text-xs text-orange-600 font-medium">
                  {new Date(item.expiryDate || item.validUntil).toLocaleDateString('es-ES')}
                </div>
              </div>
            ))}

            {calendar.scheduled.length === 0 && calendar.expiring.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay eventos programados próximamente
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}