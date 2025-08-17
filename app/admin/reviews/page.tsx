import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, ExternalLink, Edit, FileText } from "lucide-react";
import { adminSanityClient } from "@/lib/admin-sanity";
import { reviewsListQuery } from "@/lib/admin-queries";
import Link from "next/link";

export default async function AdminReviewsPage() {
  // Obtener reseñas reales desde Sanity
  const reviews = await adminSanityClient.fetch(reviewsListQuery);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calcular rating promedio
  const getAverageRating = (ratings: any) => {
    if (!ratings) return 0;
    const values = Object.values(ratings).filter(v => typeof v === 'number');
    if (values.length === 0) return 0;
    return (values.reduce((a: any, b: any) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Reseñas</h1>
          <p className="text-gray-600">Administra todas las reseñas del sitio ({reviews?.length || 0})</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nueva Reseña</span>
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Busca y filtra las reseñas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar reseñas..."
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

      {/* Lista de reseñas */}
      <Card>
        <CardHeader>
          <CardTitle>Reseñas ({reviews?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div
                  key={review._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{review.title}</h3>
                    <p className="text-sm text-gray-600">
                      {review.venue?.name || 'Sin local'} • {review.venue?.city?.name || 'Sin ciudad'}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">
                        Rating: {getAverageRating(review.ratings)}/5
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(review._createdAt)}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          review.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {review.status === "published" ? "Publicado" : "Borrador"}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/reviews/${review._id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/${review.venue?.city?.slug}/${review.venue?.slug?.current}/review/${review.slug?.current}`} target="_blank">
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
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reseñas</h3>
              <p className="text-gray-500 mb-4">Aún no se han creado reseñas en el sistema.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear primera reseña
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
