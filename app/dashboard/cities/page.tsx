"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminSanityClient } from "@/lib/admin-sanity";
import { citiesListQuery } from "@/lib/admin-queries";
import Link from "next/link";
import { useState, useEffect } from "react";

interface City {
  _id: string;
  title: string;
  slug: { current: string };
  _createdAt: string;
  _updatedAt: string;
  venueCount: number;
  reviewCount: number;
}

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await adminSanityClient.fetch<City[]>(citiesListQuery);
        setCities(data);
        setFilteredCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    let filtered = cities;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(city =>
        city.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCities(filtered);
  }, [cities, searchTerm]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ciudades</h1>
            <p className="text-gray-600">Gestiona las ciudades disponibles</p>
          </div>
          <Link 
            href="/dashboard/cities/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nueva Ciudad
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando ciudades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ciudades</h1>
          <p className="text-gray-600">Gestiona las ciudades disponibles</p>
        </div>
        <Link 
          href="/dashboard/cities/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nueva Ciudad
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Ciudades ({filteredCities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="mb-6">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <Input
              id="search"
              placeholder="Buscar por nombre de ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredCities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm 
                    ? "No se encontraron ciudades con el término de búsqueda" 
                    : "No hay ciudades disponibles"}
                </p>
              </div>
            ) : (
              filteredCities.map((city) => (
                              <div
                  key={city._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {city.title}
                      </h3>
                      <div className="flex space-x-2">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                          {city.venueCount} locales
                        </span>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                          {city.reviewCount} reseñas
                        </span>
                      </div>
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400">
                      {new Date(city._updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                <div className="ml-4 flex items-center space-x-3">
                  <Link
                    href={`/dashboard/cities/${city._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Editar
                  </Link>
                  {city.slug?.current && (
                    <>
                      <span className="text-gray-300">|</span>
                      <Link
                        href={`/${city.slug.current}`}
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