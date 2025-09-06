"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminSanityClient } from "@/lib/admin-sanity";
import { categoriesListQuery } from "@/lib/admin-queries";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  _createdAt: string;
  _updatedAt: string;
  venueCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminSanityClient.fetch<Category[]>(categoriesListQuery);
        setCategories(data);
        setFilteredCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = categories;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
            <p className="text-gray-600">Gestiona las categorías de locales</p>
          </div>
          <Link 
            href="/dashboard/categories/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nueva Categoría
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600">Gestiona las categorías de locales</p>
        </div>
        <Link 
          href="/dashboard/categories/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nueva Categoría
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Categorías ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="mb-6">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <Input
              id="search"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm 
                    ? "No se encontraron categorías con el término de búsqueda" 
                    : "No hay categorías disponibles"}
                </p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                              <div
                  key={category._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {category.title}
                      </h3>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                        {category.venueCount} locales
                      </span>
                    </div>
                    <div className="mt-0.5 text-sm text-gray-500 truncate">
                      {category.description || "Sin descripción"}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400">
                      {new Date(category._updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                <div className="ml-4 flex items-center space-x-3">
                  <Link
                    href={`/dashboard/categories/${category._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Editar
                  </Link>
                  {category.slug?.current && (
                    <>
                      <span className="text-gray-300">|</span>
                      <Link
                        href={`/categorias/${category.slug.current}`}
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