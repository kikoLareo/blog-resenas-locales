import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, ExternalLink, Edit, MapPin, Building } from "lucide-react";
import { adminSanityClient } from "@/lib/admin-sanity";
import { citiesListQuery } from "@/lib/admin-queries";
import Link from "next/link";

export default async function AdminCitiesPage() {
  // Obtener ciudades reales desde Sanity
  const cities = await adminSanityClient.fetch(citiesListQuery);

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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Ciudades</h1>
          <p className="text-gray-600">Administra todas las ciudades del sitio ({cities?.length || 0})</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nueva Ciudad</span>
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Busca y filtra las ciudades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar ciudades..."
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

      {/* Lista de ciudades */}
      <Card>
        <CardHeader>
          <CardTitle>Ciudades ({cities?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {cities && cities.length > 0 ? (
            <div className="space-y-4">
              {cities.map((city: any) => (
                <div
                  key={city._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{city.name}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500 flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {city.venueCount || 0} locales
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {city.reviewCount || 0} reseñas
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(city._createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/cities/${city._id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/${city.slug?.current}`} target="_blank">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ciudades</h3>
              <p className="text-gray-500 mb-4">Aún no se han creado ciudades en el sistema.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear primera ciudad
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
