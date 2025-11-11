"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Save, X, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function NewBlogPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
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
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentTag, setCurrentTag] = useState("");

  // Cargar categorías y venues
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar categorías
        const catResponse = await fetch('/api/admin/references?type=category');
        if (catResponse.ok) {
          const catData = await catResponse.json();
          setCategories(catData);
        }
        setLoadingCategories(false);

        // Cargar venues
        const venueResponse = await fetch('/api/admin/references?type=venue');
        if (venueResponse.ok) {
          const venueData = await venueResponse.json();
          setVenues(venueData);
        }
        setLoadingVenues(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoadingCategories(false);
        setLoadingVenues(false);
      }
    };

    fetchData();
  }, []);

  // Auto-generar slug desde el título
  const handleTitleChange = (value: string) => {
    setFormData({ ...formData, title: value });
    if (!formData.slug || formData.slug === "") {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Convertir content simple a body de Portable Text
      const body = formData.content ? [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: formData.content
            }
          ]
        }
      ] : [];

      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          body,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push('/dashboard/blog');
      } else {
        const error = await response.json();
        setErrors({ general: error.error || 'Error al guardar el post' });
      }
    } catch (error) {
      console.error('Error guardando post:', error);
      setErrors({ general: 'Error de conexión al guardar el post' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/blog">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Blog
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/blog')}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Guardando...' : 'Guardar Post'}
          </Button>
        </div>
      </div>

      {/* Mensajes de error generales */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      {/* Formulario */}
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
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ej: Los 10 mejores restaurantes de Madrid"
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
                  placeholder="los-10-mejores-restaurantes-madrid"
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
                  placeholder="Breve descripción del post para listados y SEO..."
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
                  placeholder="Nombre del autor"
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
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={15}
                  placeholder="Escribe el contenido del post aquí..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nota: Para contenido más avanzado, edita desde Sanity Studio
                </p>
              </div>

              <div>
                <Label htmlFor="tldr">TL;DR - Resumen AEO (opcional)</Label>
                <Textarea
                  id="tldr"
                  value={formData.tldr}
                  onChange={(e) => setFormData({ ...formData, tldr: e.target.value })}
                  rows={3}
                  placeholder="Resumen de 50-85 palabras optimizado para asistentes de voz..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  200-350 caracteres. {formData.tldr.length}/350
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

          {/* FAQ Section */}
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
                
                {errors.faq && (
                  <p className="text-sm text-red-600">{errors.faq}</p>
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
                <Label htmlFor="featured">Post Destacado</Label>
                <Switch
                  id="featured"
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
                  const cat = categories.find(c => c._id === catId);
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
                  const venue = venues.find(v => v._id === venueId);
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
