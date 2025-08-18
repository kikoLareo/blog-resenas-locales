import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminSanityClient } from "@/lib/admin-sanity";
import { venuesListQuery } from "@/lib/admin-queries";
import type { Venue } from "@/types/sanity";
import Link from "next/link";

export default async function VenuesPage() {
  const venues = await adminSanityClient.fetch<(Venue & {
    city: { title: string; slug: { current: string } };
    reviewCount: number;
  })[]>(venuesListQuery);

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
          <CardTitle>Todos los Locales ({venues.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {venues.map((venue) => (
              <div
                key={venue._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-medium text-gray-900">
                      {venue.title}
                    </h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {venue.reviewCount} reseñas
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {venue.city?.title || "Sin ciudad"} • {venue.priceRange} • {venue.address}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    Última actualización:{" "}
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}