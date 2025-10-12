import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminSanityClient } from "@/lib/admin-sanity";
import Link from "next/link";

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  _createdAt: string;
  _updatedAt: string;
  publishedAt: string | null;
  status: "published" | "draft";
  excerpt: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await adminSanityClient.fetch<BlogPost[]>(`
      *[_type == "post"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        _createdAt,
        _updatedAt,
        publishedAt,
        excerpt,
        "status": select(
          publishedAt != null => "published",
          "draft"
        )
      }
    `);
    return posts || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600">Gestiona los artículos del blog</p>
        </div>
        <Link 
          href="/dashboard/blog/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nuevo Artículo
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Artículos ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => {
              const editUrl = `/dashboard/blog/${post._id}`;
              const viewUrl = post.slug?.current ? `/blog/${post.slug.current}` : '#';

              return (
                <div
                  key={post._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </h3>
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
                    <div className="mt-1 text-sm text-gray-500 truncate">
                      {post.excerpt}
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      Última actualización:{" "}
                      {new Date(post._updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-3">
                    <Link
                      href={editUrl}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Editar
                    </Link>
                    {viewUrl !== '#' && post.status === "published" && (
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