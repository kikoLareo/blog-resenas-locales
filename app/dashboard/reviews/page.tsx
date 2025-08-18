import { adminSanityClient } from "@/lib/admin-sanity";
import { reviewsListQuery } from "@/lib/admin-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Review {
  _id: string;
  title: string;
  slug: { current: string };
  _createdAt: string;
  _updatedAt: string;
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
    ambiance: number;
    value: number;
  };
  status: "published" | "draft";
}

export default async function ReviewsPage() {
  const reviews = await adminSanityClient.fetch<Review[]>(reviewsListQuery);

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
          <CardTitle>Todas las Reseñas ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((review) => {
              // Construir las URLs de manera segura
              const editUrl = `/dashboard/reviews/${review._id}`;
              const viewUrl = review.venue?.city?.slug?.current && review.slug?.current
                ? `/${review.venue.city.slug.current}/review/${review.slug.current}`
                : '#';

              return (
                <div
                  key={review._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {review.title}
                      </h3>
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
                    <div className="mt-1 text-sm text-gray-500">
                      {review.venue?.title} ({review.venue?.city?.title || 'Sin ciudad'})
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      Última actualización:{" "}
                      {new Date(review._updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-3">
                    <Link
                      href={editUrl}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Ver
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
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}