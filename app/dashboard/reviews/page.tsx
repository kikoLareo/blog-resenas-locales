"use client";
import { adminSanityClient } from "@/lib/admin-sanity";
import { reviewsListQuery } from "@/lib/admin-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Review {
  _id: string;
  title: string;
  slug: { current: string };
  _createdAt: string;
  _updatedAt: string;
  published: boolean;
  publishedAt: string | null;
  venue: {
    title: string;
    city: {
      title: string;
      slug: { current: string };
    };
  };
  ratings: {
    overall: number;
    food: number;
    service: number;
    ambience: number;
    value: number;
  };
  status: "published" | "draft";
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await adminSanityClient.fetch<Review[]>(reviewsListQuery);
        setReviews(data);
        setFilteredReviews(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    let filtered = reviews;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.venue?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.venue?.city?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter(review => review.status === statusFilter);
    }

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reseñas</h1>
            <p className="text-gray-600">Gestiona las reseñas del sitio</p>
          </div>
          <Link 
            href="/dashboard/reviews/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nueva Reseña
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando reseñas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reseñas</h1>
          <p className="text-gray-600">Gestiona las reseñas del sitio</p>
        </div>
        <Link 
          href="/dashboard/reviews/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nueva Reseña
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Reseñas ({filteredReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <Input
                  id="search"
                  placeholder="Buscar por título, local o ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="published">Publicados</SelectItem>
                    <SelectItem value="draft">Borradores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== "all" ? "No se encontraron reseñas" : "No hay reseñas aún"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "Intenta ajustar los filtros de búsqueda" 
                    : "Crea tu primera reseña para comenzar"}
                </p>
                {(!searchTerm && statusFilter === "all") && (
                  <Link 
                    href="/dashboard/reviews/new"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nueva Reseña
                  </Link>
                )}
              </div>
            ) : (
              filteredReviews.map((review) => {
                // Construir las URLs de manera segura
                const editUrl = `/dashboard/reviews/${review._id}/edit`;
                const viewUrl = review.venue?.city?.slug?.current && review.slug?.current
                  ? `/${review.venue.city.slug.current}/review/${review.slug.current}`
                  : '#';

                return (
                  <div
                    key={review._id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {review.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            review.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {review.status === "published" ? "Publicado" : "Borrador"}
                        </span>
                      </div>
                      <div className="mt-0.5 text-sm text-gray-500">
                        {review.venue?.title} ({review.venue?.city?.title || 'Sin ciudad'})
                      </div>
                      <div className="mt-0.5 text-xs text-gray-400">
                        {new Date(review._updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-3">
                      <Link
                        href={editUrl}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Editar
                      </Link>
                      {viewUrl !== '#' && (
                        <>
                          <span className="text-gray-300">|</span>
                          <Link
                            href={viewUrl}
                            className="text-gray-600 hover:text-gray-800 text-sm"
                            target="_blank"
                          >
                            Ver
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}