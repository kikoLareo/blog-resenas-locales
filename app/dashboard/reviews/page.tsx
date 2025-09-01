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
        console.log('Fetching reviews with query:', reviewsListQuery);
        const data = await adminSanityClient.fetch<Review[]>(reviewsListQuery);
        console.log('Fetched reviews:', data);
        setReviews(data);
        setFilteredReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <Input
                  placeholder="Buscar por título, local o ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
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
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all" 
                    ? "No se encontraron reseñas con los filtros aplicados" 
                    : "No hay reseñas disponibles"}
                </p>
              </div>
            ) : (
              filteredReviews.map((review) => {
                // Construir las URLs de manera segura
                const editUrl = `/dashboard/reviews/${review._id}`;
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