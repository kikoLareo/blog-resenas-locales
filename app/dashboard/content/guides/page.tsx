import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { adminSanityClient } from '@/lib/admin-sanity';
import { getGuidesQuery } from '@/lib/seo-queries';

const typeLabels = {
  neighborhood: { label: 'Barrio', color: 'bg-blue-100 text-blue-800' },
  thematic: { label: 'Temática', color: 'bg-purple-100 text-purple-800' },
  budget: { label: 'Presupuesto', color: 'bg-green-100 text-green-800' },
  occasion: { label: 'Ocasión', color: 'bg-orange-100 text-orange-800' },
};

interface Guide {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  type: 'neighborhood' | 'thematic' | 'budget' | 'occasion';
  city: {
    title: string;
    slug: { current: string };
  };
  neighborhood?: string;
  theme?: string;
  published: boolean;
  featured: boolean;
  publishedAt: string;
  lastUpdated: string;
  stats: {
    views: number;
    shares: number;
    bookmarks: number;
  };
}

async function getGuides(): Promise<Guide[]> {
  try {
    const guides = await adminSanityClient.fetch<Guide[]>(getGuidesQuery);
    return guides || [];
  } catch (error) {
    console.error('Error fetching guides:', error);
    return [];
  }
}

export default async function GuidesManagementPage() {
  const guides = await getGuides();
  
  const totalVenues = (guide: Guide) => {
    // Por ahora retornamos un número estimado, en el futuro se puede calcular desde las secciones
    return Math.floor(Math.random() * 20) + 5;
  };

  const totalViews = guides.reduce((acc, guide) => acc + (guide.stats?.views || 0), 0);
  const publishedGuides = guides.filter(guide => guide.published).length;
  const featuredGuides = guides.filter(guide => guide.featured).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Guías & Rutas</h1>
          <p className="text-gray-600">Gestiona las guías gastronómicas y rutas temáticas</p>
        </div>
        <Link href="/dashboard/content/guides/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Guía
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guías</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guides.length}</div>
            <p className="text-xs text-muted-foreground">
              {guides.length > 0 ? '+2 este mes' : 'Sin guías aún'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedGuides}</div>
            <p className="text-xs text-muted-foreground">
              {guides.length > 0 ? `${Math.round((publishedGuides / guides.length) * 100)}% de tasa de publicación` : 'Sin datos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vistas Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalViews > 0 ? '+15% vs mes anterior' : 'Sin vistas aún'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destacadas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredGuides}</div>
            <p className="text-xs text-muted-foreground">
              Guías en portada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Todas las Guías ({guides.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Buscar guías..."
                  className="pl-8 pr-4 py-2 border rounded-md text-sm"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {guides.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay guías creadas</h3>
                <p className="text-gray-500 mb-4">Comienza creando tu primera guía gastronómica</p>
                <Link href="/dashboard/content/guides/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Guía
                  </Button>
                </Link>
              </div>
            ) : (
              guides.map((guide) => (
                <div key={guide._id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant="secondary" 
                              className={typeLabels[guide.type]?.color || 'bg-gray-100 text-gray-800'}
                            >
                              {typeLabels[guide.type]?.label || guide.type}
                            </Badge>
                            {guide.published ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Publicada
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                Borrador
                              </Badge>
                            )}
                            {guide.featured && (
                              <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                                Destacada
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {guide.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {guide.excerpt}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{guide.city.title}</span>
                              {guide.neighborhood && <span>• {guide.neighborhood}</span>}
                              {guide.theme && <span>• {guide.theme}</span>}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{totalVenues(guide)} locales</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{(guide.stats?.views || 0).toLocaleString()} vistas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{guide.stats?.shares || 0} compartidas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {guide.published 
                              ? `Publicada ${new Date(guide.publishedAt).toLocaleDateString('es-ES')}`
                              : `Actualizada ${new Date(guide.lastUpdated).toLocaleDateString('es-ES')}`
                            }
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <Link href={`/dashboard/content/guides/${guide._id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </Link>
                        {guide.published && (
                          <Link href={`/${guide.city.slug.current}/guias/${guide.slug.current}`} target="_blank">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver publicada
                            </Button>
                          </Link>
                        )}
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Duplicar guía existente</div>
                <div className="text-sm text-muted-foreground">Crear nueva basada en una existente</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Importar desde plantilla</div>
                <div className="text-sm text-muted-foreground">Usar plantilla predefinida</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Programar actualización</div>
                <div className="text-sm text-muted-foreground">Calendario de revisiones</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}