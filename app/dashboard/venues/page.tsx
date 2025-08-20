"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useState, useEffect } from "react";

// Tipos específicos para los datos que devuelve la query
interface VenueWithDetails {
  _id: string;
  title: string;
  slug: { current: string };
  _createdAt: string;
  _updatedAt: string;
  city: { title: string; slug: { current: string } };
  address: string;
  phone?: string;
  website?: string;
  priceRange: string;
  reviewCount: number;
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<VenueWithDetails[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<VenueWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Importación dinámica para evitar problemas de SSR
        const { adminSanityClient } = await import("@/lib/admin-sanity");
        const { venuesListQuery } = await import("@/lib/admin-queries");
        
        const data = await adminSanityClient.fetch<VenueWithDetails[]>(venuesListQuery);
        setVenues(data || []);
        setFilteredVenues(data || []);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setError('Error al cargar los locales');
        setVenues([]);
        setFilteredVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  useEffect(() => {
    let filtered = venues;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(venue =>
        venue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.city?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por ciudad
    if (cityFilter !== "all") {
      filtered = filtered.filter(venue => venue.city?.title === cityFilter);
    }

    setFilteredVenues(filtered);
  }, [venues, searchTerm, cityFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Locales</h1>
            <p className="text-gray-600">Gestiona los locales disponibles</p>
          </div>
          <Link 
            href="/dashboard/venues/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nuevo Local
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando locales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Locales</h1>
            <p className="text-gray-600">Gestiona los locales disponibles</p>
          </div>
          <Link 
            href="/dashboard/venues/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nuevo Local
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Obtener ciudades únicas para el filtro
  const cities = [...new Set(venues.map(venue => venue.city?.title).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Locales</h1>
          <p className="text-gray-600">Gestiona los locales disponibles</p>
        </div>
        <Link 
          href="/dashboard/venues/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nuevo Local
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Locales ({filteredVenues.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <Input
                  placeholder="Buscar por nombre, ciudad o dirección..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ciudades</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredVenues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm || cityFilter !== "all" 
                    ? "No se encontraron locales con los filtros aplicados" 
                    : "No hay locales disponibles"}
                </p>
              </div>
            ) : (
              filteredVenues.map((venue) => (
                <div
                  key={venue._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {venue.title}
                      </h3>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                        {venue.reviewCount} reseñas
                      </span>
                    </div>
                    <div className="mt-0.5 text-sm text-gray-500">
                      {venue.city?.title || "Sin ciudad"} • {venue.priceRange} • {venue.address}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400">
                      {new Date(venue._updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-3">
                    <Link
                      href={`/dashboard/venues/${venue._id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Editar
                    </Link>
                    {venue.city?.slug?.current && venue.slug?.current && (
                      <>
                        <span className="text-gray-300">|</span>
                        <Link
                          href={`/${venue.city.slug.current}/venue/${venue.slug.current}`}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                          target="_blank"
                        >
                          Ver
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}