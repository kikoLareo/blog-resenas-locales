import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, ExternalLink, Edit, FileText, User } from "lucide-react";
import { adminSanityClient } from "@/lib/admin-sanity";
import { blogPostsListQuery } from "@/lib/admin-queries";
import Link from "next/link";

export default async function AdminBlogPage() {
  // Obtener posts del blog reales desde Sanity
  const posts = await adminSanityClient.fetch(blogPostsListQuery);

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
          <h1 className="text-3xl font-bold text-gray-900">Gestión del Blog</h1>
          <p className="text-gray-600">Administra todos los posts del blog ({posts?.length || 0})</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Post</span>
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Busca y filtra los posts del blog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar posts..."
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

      {/* Lista de posts */}
      <Card>
        <CardHeader>
          <CardTitle>Posts del Blog ({posts?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post: any) => (
                <div
                  key={post._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{post.title}</h3>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      {post.author && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {post.author}
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {formatDate(post._createdAt)}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.status === "published" ? "Publicado" : "Borrador"}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/blog/${post._id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/blog/${post.slug?.current}`} target="_blank">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay posts</h3>
              <p className="text-gray-500 mb-4">Aún no se han creado posts en el blog.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear primer post
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
