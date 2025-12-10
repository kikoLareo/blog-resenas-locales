"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TiptapEditor from "@/components/TiptapEditor";
import { PortableTextBlock } from "@portabletext/types";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Save, X, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}

interface Venue {
  _id: string;
  title: string;
  slug: { current: string };
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  body?: any[];
  categories: Array<{ _id: string; title: string }>;
  relatedVenues?: Array<{ _id: string; title: string }>;
  tags?: string[];
  hasFaq?: boolean;
  faq?: FAQItem[];
  tldr?: string;
  author: string;
  readingTime?: number;
  featured?: boolean;
  publishedAt: string;
  _createdAt: string;
  _updatedAt: string;
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: [] as PortableTextBlock[],
    categories: [] as string[],
    relatedVenues: [] as string[],
    tags: [] as string[],
    hasFaq: false,
    faq: [] as FAQItem[],
    tldr: "",
    author: "Blog de Reseñas Team",
    readingTime: 5,
    featured: false,
    publishedAt: new Date().toISOString(),
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentTag, setCurrentTag] = useState("");

  // Cargar post existente
  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetch(`/api/admin/blog/${postId}`);
        if (response.ok) {
          const data: BlogPost = await response.json();
          setPost(data);
          
          setFormData({
            title: data.title,
            slug: data.slug.current,
            excerpt: data.excerpt,
            body: data.body || [],
            categories: data.categories.map(cat => cat._id),
            relatedVenues: data.relatedVenues?.map(venue => venue._id) || [],
            tags: data.tags || [],
            hasFaq: data.hasFaq || false,
            faq: data.faq || [],
            tldr: data.tldr || "",
            author: data.author,
            readingTime: data.readingTime || 5,
            featured: data.featured || false,
            publishedAt: data.publishedAt,
          });
        } else {
          setErrors({ general: 'Post no encontrado' });
        }
      } catch (error) {
        setErrors({ general: 'Error al cargar el post' });
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId]);

  // Cargar categorías y venues
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catResponse = await fetch('/api/admin/references?type=category');
        if (catResponse.ok) {
          const catData = await catResponse.json();
          setCategories(catData);
        }
        setLoadingCategories(false);

        const venueResponse = await fetch('/api/admin/references?type=venue');
        if (venueResponse.ok) {
          const venueData = await venueResponse.json();
          setVenues(venueData);
        }
        setLoadingVenues(false);
      } catch (error) {
        setLoadingCategories(false);
        setLoadingVenues(false);
      }
    };

    fetchData();
  }, []);

  // Agregar tag
  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      if (formData.tags.length < 10) {
        setFormData({
          ...formData,
          tags: [...formData.tags, currentTag.trim()]
        });
        setCurrentTag("");
      }
    }
  };

  // Eliminar tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Agregar pregunta FAQ
  const handleAddFaq = () => {
    if (formData.faq.length < 8) {
      setFormData({
        ...formData,
        faq: [...formData.faq, { question: "", answer: "" }]
      });
    }
  };

  // Actualizar pregunta FAQ
  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaq = [...formData.faq];
    updatedFaq[index][field] = value;
    setFormData({ ...formData, faq: updatedFaq });
  };

  // Eliminar pregunta FAQ
  const handleRemoveFaq = (index: number) => {
    setFormData({
      ...formData,
      faq: formData.faq.filter((_, i) => i !== index)
    });
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    } else if (formData.title.length < 10 || formData.title.length > 100) {
      newErrors.title = "El título debe tener entre 10 y 100 caracteres";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "El slug es requerido";
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "El extracto es requerido";
    } else if (formData.excerpt.length < 100 || formData.excerpt.length > 200) {
      newErrors.excerpt = "El extracto debe tener entre 100 y 200 caracteres";
    }

    if (formData.categories.length === 0) {
      newErrors.categories = "Selecciona al menos una categoría";
    } else if (formData.categories.length > 3) {
      newErrors.categories = "Máximo 3 categorías";
    }

    if (formData.hasFaq && formData.faq.length === 0) {
      newErrors.faq = "Debes agregar al menos una pregunta";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar cambios
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {

      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard/blog');
      } else {
        const error = await response.json();
        setErrors({ general: error.error || 'Error al actualizar el post' });
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión al actualizar el post' });
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar post
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard/blog');
      } else {
        const error = await response.json();
        setErrors({ general: error.error || 'Error al eliminar el post' });
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión al eliminar el post' });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Cargando post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Post no encontrado</h2>
          <Link href="/dashboard/blog">
            <Button>Volver a Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Blog
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Editar Post</h1>
            <p className="text-sm text-gray-500">
              Creado: {new Date(post._createdAt).toLocaleDateString()} • 
              Actualizado: {new Date(post._updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/blog')}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <CardTitle>Confirmar Eliminación</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer.</p>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar Post'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mensajes de error */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      {/* Formulario - Reutiliza la misma estructura que el formulario de nuevo post */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título del Post *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100 caracteres
                </p>
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className={errors.slug ? 'border-red-500' : ''}
                />
                {errors.slug && (
                  <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
                )}
              </div>

              <div>
                <Label htmlFor="excerpt">Extracto * (100-200 caracteres)</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className={errors.excerpt ? 'border-red-500' : ''}
                />
                {errors.excerpt && (
                  <p className="text-sm text-red-600 mt-1">{errors.excerpt}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.excerpt.length}/200 caracteres
                </p>
              </div>

              <div>
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contenido */}
          <Card>
            <CardHeader>
              <CardTitle>Contenido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Contenido del Post</Label>
                <TiptapEditor
                  value={formData.body}
                  onChange={(body) => setFormData({ ...formData, body })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Editor visual para contenido enriquecido con formato, listas e imágenes
                </p>
              </div>

              <div>
                <Label htmlFor="tldr">TL;DR - Resumen AEO</Label>
                <Textarea
                  id="tldr"
                  value={formData.tldr}
                  onChange={(e) => setFormData({ ...formData, tldr: e.target.value })}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.tldr.length}/350 caracteres
                </p>
              </div>

              <div>
                <Label htmlFor="readingTime">Tiempo de lectura (minutos)</Label>
                <Input
                  id="readingTime"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.readingTime}
                  onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) || 1 })}
                />
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Preguntas Frecuentes (FAQ)</CardTitle>
                <Switch
                  checked={formData.hasFaq}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasFaq: checked })}
                />
              </div>
            </CardHeader>
            {formData.hasFaq && (
              <CardContent className="space-y-4">
                {formData.faq.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Pregunta {index + 1}</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFaq(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="¿Pregunta?"
                      value={item.question}
                      onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                    />
                    <Textarea
                      placeholder="Respuesta..."
                      rows={3}
                      value={item.answer}
                      onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                    />
                  </div>
                ))}
                
                {formData.faq.length < 8 && (
                  <Button
                    variant="outline"
                    onClick={handleAddFaq}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Pregunta
                  </Button>
                )}
              </CardContent>
            )}
          </Card>
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          {/* Configuración */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Post Destacado</Label>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>

              <div>
                <Label htmlFor="publishedAt">Fecha de Publicación</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  value={formData.publishedAt.slice(0, 16)}
                  onChange={(e) => setFormData({ ...formData, publishedAt: new Date(e.target.value).toISOString() })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Categorías */}
          <Card>
            <CardHeader>
              <CardTitle>Categorías *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value=""
                onValueChange={(value) => {
                  if (!formData.categories.includes(value) && formData.categories.length < 3) {
                    setFormData({
                      ...formData,
                      categories: [...formData.categories, value]
                    });
                  }
                }}
                disabled={loadingCategories || formData.categories.length >= 3}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    loadingCategories ? "Cargando..." :
                    formData.categories.length >= 3 ? "Máximo 3 categorías" :
                    "Añadir categoría"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem 
                      key={cat._id} 
                      value={cat._id}
                      disabled={formData.categories.includes(cat._id)}
                    >
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2">
                {formData.categories.map((catId) => {
                  const cat = categories.find(c => c._id === catId) || 
                              post.categories.find(c => c._id === catId);
                  return cat ? (
                    <Badge key={catId} variant="secondary">
                      {cat.title}
                      <button
                        onClick={() => setFormData({
                          ...formData,
                          categories: formData.categories.filter(id => id !== catId)
                        })}
                        className="ml-2"
                      >
                        ×
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>

              {errors.categories && (
                <p className="text-sm text-red-600">{errors.categories}</p>
              )}
            </CardContent>
          </Card>

          {/* Locales Relacionados */}
          <Card>
            <CardHeader>
              <CardTitle>Locales Relacionados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value=""
                onValueChange={(value) => {
                  if (!formData.relatedVenues.includes(value) && formData.relatedVenues.length < 5) {
                    setFormData({
                      ...formData,
                      relatedVenues: [...formData.relatedVenues, value]
                    });
                  }
                }}
                disabled={loadingVenues || formData.relatedVenues.length >= 5}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    loadingVenues ? "Cargando..." :
                    formData.relatedVenues.length >= 5 ? "Máximo 5 locales" :
                    "Añadir local"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((venue) => (
                    <SelectItem 
                      key={venue._id} 
                      value={venue._id}
                      disabled={formData.relatedVenues.includes(venue._id)}
                    >
                      {venue.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2">
                {formData.relatedVenues.map((venueId) => {
                  const venue = venues.find(v => v._id === venueId) ||
                                post.relatedVenues?.find(v => v._id === venueId);
                  return venue ? (
                    <Badge key={venueId} variant="outline">
                      {venue.title}
                      <button
                        onClick={() => setFormData({
                          ...formData,
                          relatedVenues: formData.relatedVenues.filter(id => id !== venueId)
                        })}
                        className="ml-2"
                      >
                        ×
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Etiquetas SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Nueva etiqueta"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  disabled={formData.tags.length >= 10}
                />
                <Button
                  onClick={handleAddTag}
                  disabled={!currentTag.trim() || formData.tags.length >= 10}
                >
                  +
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>

              <p className="text-xs text-gray-500">
                {formData.tags.length}/10 etiquetas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

