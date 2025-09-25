import { Suspense } from 'react';
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

export default function ContentManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenidos SEO</h1>
        <p className="text-gray-600">Administra guías, rankings, recetas y todo el contenido especializado</p>
      </div>

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
              <div className="text-2xl font-bold">12</div>
              <p className="text-sm text-gray-600">
                Guías gastronómicas por barrios y temáticas
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <TrendingUp className="h-3 w-3" />
                <span>+3 este mes</span>
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
              <div className="text-2xl font-bold">8</div>
              <p className="text-sm text-gray-600">
                Rankings comparativos y listas temáticas
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Eye className="h-3 w-3" />
                <span>1.2k vistas promedio</span>
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
              <div className="text-2xl font-bold">15</div>
              <p className="text-sm text-gray-600">
                Recetas tradicionales y modernas
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>45 min promedio</span>
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
              <div className="text-2xl font-bold">6</div>
              <p className="text-sm text-gray-600">
                Guías específicas de platos tradicionales
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <BarChart3 className="h-3 w-3" />
                <span>Alto engagement</span>
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
              <div className="text-2xl font-bold">23</div>
              <p className="text-sm text-gray-600">
                Novedades, aperturas y tendencias
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>5 pendientes de expirar</span>
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
              <div className="text-2xl font-bold">11</div>
              <p className="text-sm text-gray-600">
                Ofertas especiales y menús temporales
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>3 expiran pronto</span>
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
            <div className="text-2xl font-bold">75</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68</div>
            <p className="text-xs text-muted-foreground">
              91% de tasa de publicación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Pendientes de revisión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actualizaciones</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
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
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nueva guía &quot;Dónde comer en Chueca&quot; publicada</p>
                <p className="text-xs text-muted-foreground">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Ranking &quot;Mejores tortillas de Madrid&quot; actualizado</p>
                <p className="text-xs text-muted-foreground">Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Oferta &quot;Menús de San Valentín&quot; próxima a expirar</p>
                <p className="text-xs text-muted-foreground">Hace 1 día</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nueva receta &quot;Empanada gallega&quot; en borrador</p>
                <p className="text-xs text-muted-foreground">Hace 2 días</p>
              </div>
            </div>
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
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div>
                <p className="text-sm font-medium">Guía de brunch en &quot;Malasaña&quot;</p>
                <p className="text-xs text-muted-foreground">Programado para publicar</p>
              </div>
              <div className="text-xs text-blue-600 font-medium">Mañana</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div>
                <p className="text-sm font-medium">Ranking &quot;mejores hamburguesas&quot;</p>
                <p className="text-xs text-muted-foreground">Revisión programada</p>
              </div>
              <div className="text-xs text-green-600 font-medium">Viernes</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div>
                <p className="text-sm font-medium">Ofertas de &quot;temporada&quot;</p>
                <p className="text-xs text-muted-foreground">Actualización mensual</p>
              </div>
              <div className="text-xs text-orange-600 font-medium">Próx. semana</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
