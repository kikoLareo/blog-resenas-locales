import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, ExternalLink, Edit, MapPin, Phone, Globe } from "lucide-react";
import { adminSanityClient } from "@/lib/admin-sanity";
import { venuesListQuery } from "@/lib/admin-queries";
import Link from "next/link";

export default async function AdminVenuesPage() {
  // Obtener locales reales desde Sanity
  const venues = await adminSanityClient.fetch(venuesListQuery);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Locales</h1>
          <p className="text-gray-600">Administra todos los locales del sitio ({venues?.length || 0})</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Local</span>
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Busca y filtra los locales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar locales..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de locales */}
      <Card>
        <CardHeader>
          <CardTitle>Locales ({venues?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {venues && venues.length > 0 ? (
            <div className="space-y-4">
              {venues.map((venue: any) => (
                <div
                  key={venue._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{venue.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {venue.city?.name || 'Sin ciudad'}
                      </span>
                      {venue.phone && (
                        <span className="text-sm text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {venue.phone}
                        </span>
                      )}
                      {venue.website && (
                        <span className="text-sm text-gray-600 flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          Sitio web
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">
                        {venue.reviewCount || 0} reseñas
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(venue._createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/venues/${venue._id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/${venue.city?.slug}/${venue.slug?.current}`} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MapPin className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay locales</h3>
              <p className="text-gray-500 mb-4">Aún no se han creado locales en el sistema.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear primer local
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
