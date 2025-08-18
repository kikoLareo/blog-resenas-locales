import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminSanityClient } from "@/lib/admin-sanity";
import { categoriesListQuery } from "@/lib/admin-queries";
import Link from "next/link";

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  _createdAt: string;
  _updatedAt: string;
  venueCount: number;
}

export default async function CategoriesPage() {
  const categories = await adminSanityClient.fetch<Category[]>(categoriesListQuery);

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
          <CardTitle>Todas las Categorías ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {category.title}
                    </h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {category.venueCount} locales
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500 truncate">
                    {category.description || "Sin descripción"}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    Última actualización:{" "}
                    {new Date(category._updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="ml-4">
                  <Link
                    href={`/dashboard/categories/${category._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}