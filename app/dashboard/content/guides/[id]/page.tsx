"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { ArrowLeft, Save, X, Trash2 } from "lucide-react";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import { useParams, useRouter } from "next/navigation";

interface City {
  _id: string;
  title: string;
  slug: string;
}

interface Guide {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  type: "neighborhood" | "thematic" | "budget" | "occasion";
  city: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  neighborhood?: string;
  theme?: string;
  published: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  _createdAt: string;
  _updatedAt: string;
}

export default function EditGuidePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    type: "neighborhood" as "neighborhood" | "thematic" | "budget" | "occasion",
    city: "",
    neighborhood: "",
    theme: "",
    published: false,
    featured: false,
    seoTitle: "",
    seoDescription: "",
    keywords: [] as string[]
  });
  
  const [initialFormData, setInitialFormData] = useState(formData);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGuide, setIsLoadingGuide] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [guide, setGuide] = useState<Guide | null>(null);

  // Fetch guide data
  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await fetch(`/api/admin/guides/${id}`);
        if (response.ok) {
          const data = await response.json();
          setGuide(data);
          
          const formValues = {
            title: data.title || "",
            slug: data.slug?.current || "",
            excerpt: data.excerpt || "",
            type: data.type || "neighborhood",
            city: data.city?._id || "",
            neighborhood: data.neighborhood || "",
            theme: data.theme || "",
            published: data.published || false,
            featured: data.featured || false,
            seoTitle: data.seoTitle || "",
            seoDescription: data.seoDescription || "",
            keywords: data.keywords || []
          };
          
          setFormData(formValues);
          setInitialFormData(formValues);
        } else {
          alert('Error al cargar la guía');
          router.push('/dashboard/content/guides');
        }
      } catch (error) {
        console.error('Error fetching guide:', error);
        alert('Error al cargar la guía');
      } finally {
        setIsLoadingGuide(false);
      }
    };

    if (id) {
      fetchGuide();
    }
  }, [id, router]);

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/admin/cities');
        if (response.ok) {
          const data = await response.json();
          setCities(data);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // Check if form has unsaved changes
  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData);
  
  // Add unsaved changes warning
  useUnsavedChangesWarning({ 
    hasUnsavedChanges: hasUnsavedChanges && !isLoading,
    message: "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?"
  });

  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      // Validate required fields
      const newErrors: {[key: string]: string} = {};
      
      if (!formData.title) newErrors.title = 'El título es requerido';
      if (!formData.excerpt) newErrors.excerpt = 'El extracto es requerido';
      if (!formData.type) newErrors.type = 'El tipo es requerido';
      if (!formData.city) newErrors.city = 'La ciudad es requerida';

      // If there are errors, show them and stop submission
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setTimeout(() => setIsLoading(false), 50);
        return;
      }

      const response = await fetch(`/api/admin/guides/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Guía actualizada exitosamente');
        setInitialFormData(formData); // Update initial state to prevent unsaved changes warning
        router.push('/dashboard/content/guides');
      } else {
        alert(result.error || 'Error al actualizar la guía');
      }
    } catch (error) {
      console.error('Error updating guide:', error);
      alert('Error al actualizar la guía');
    } finally {
      setTimeout(() => setIsLoading(false), 50);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta guía? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/admin/guides/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        alert('Guía eliminada exitosamente');
        router.push('/dashboard/content/guides');
      } else {
        alert(result.error || 'Error al eliminar la guía');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error deleting guide:', error);
      alert('Error al eliminar la guía');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave();
  };

  if (isLoadingGuide) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Cargando guía...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/content/guides">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Guías
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="text-red-600 hover:text-red-700"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/content/guides')}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      {guide && (
        <div className="text-sm text-gray-600">
          <p>Creada: {new Date(guide._createdAt).toLocaleString('es-ES')}</p>
          <p>Última modificación: {new Date(guide._updatedAt).toLocaleString('es-ES')}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Editar Guía</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Información Básica */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título de la Guía *</Label>
                    <Input
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({...formData, title: e.target.value});
                        if (errors.title) setErrors({...errors, title: ''});
                      }}
                      placeholder="Ej: Dónde comer en Malasaña 2025"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      placeholder="donde-comer-malasana-2025"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="excerpt">Extracto *</Label>
                  <Textarea
                    id="excerpt"
                    required
                    value={formData.excerpt}
                    onChange={(e) => {
                      setFormData({...formData, excerpt: e.target.value});
                      if (errors.excerpt) setErrors({...errors, excerpt: ''});
                    }}
                    rows={3}
                    placeholder="Resumen de la guía (120-200 caracteres)"
                    className={errors.excerpt ? 'border-red-500' : ''}
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-red-600 mt-1">{errors.excerpt}</p>
                  )}
                </div>
              </div>

              {/* Tipo y Ubicación */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Tipo y Ubicación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Tipo de Guía *</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: "neighborhood" | "thematic" | "budget" | "occasion") => {
                        setFormData({...formData, type: value});
                        if (errors.type) setErrors({...errors, type: ''});
                      }}
                    >
                      <SelectTrigger id="type" className={errors.type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neighborhood">Guía de Barrio</SelectItem>
                        <SelectItem value="thematic">Ruta Temática</SelectItem>
                        <SelectItem value="budget">Por Presupuesto</SelectItem>
                        <SelectItem value="occasion">Por Ocasión</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-red-600 mt-1">{errors.type}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="city">Ciudad *</Label>
                    <Select 
                      value={formData.city} 
                      onValueChange={(value) => {
                        setFormData({...formData, city: value});
                        if (errors.city) setErrors({...errors, city: ''});
                      }}
                      disabled={loadingCities}
                    >
                      <SelectTrigger id="city" className={errors.city ? 'border-red-500' : ''}>
                        <SelectValue placeholder={loadingCities ? "Cargando..." : "Selecciona una ciudad"} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city._id} value={city._id}>
                            {city.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>
                
                {/* Campos condicionales */}
                {formData.type === 'neighborhood' && (
                  <div className="mt-4">
                    <Label htmlFor="neighborhood">Barrio Específico</Label>
                    <Input
                      id="neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                      placeholder="Ej: Malasaña, Chueca, etc."
                    />
                  </div>
                )}
                
                {formData.type !== 'neighborhood' && (
                  <div className="mt-4">
                    <Label htmlFor="theme">Tema de la Ruta</Label>
                    <Select 
                      value={formData.theme} 
                      onValueChange={(value) => setFormData({...formData, theme: value})}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Selecciona un tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="con-ninos">Con niños</SelectItem>
                        <SelectItem value="grupos">En grupo</SelectItem>
                        <SelectItem value="barato">Económico</SelectItem>
                        <SelectItem value="brunch">Brunch</SelectItem>
                        <SelectItem value="noche">Nocturno</SelectItem>
                        <SelectItem value="romantico">Romántico</SelectItem>
                        <SelectItem value="negocios">Negocios</SelectItem>
                        <SelectItem value="celebraciones">Celebraciones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* SEO */}
              <div>
                <h3 className="text-lg font-semibold mb-4">SEO (Opcional)</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="seoTitle">Título SEO</Label>
                    <Input
                      id="seoTitle"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                      placeholder="Si está vacío, se usará el título principal"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.seoTitle.length}/60 caracteres
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="seoDescription">Meta Descripción</Label>
                    <Textarea
                      id="seoDescription"
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                      rows={2}
                      placeholder="Si está vacía, se usará el extracto"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.seoDescription.length}/160 caracteres
                    </p>
                  </div>
                </div>
              </div>

              {/* Configuración */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Configuración</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="published">Publicar</Label>
                      <p className="text-sm text-gray-500">
                        Hacer visible la guía en el sitio público
                      </p>
                    </div>
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData({...formData, published: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="featured">Destacar</Label>
                      <p className="text-sm text-gray-500">
                        Mostrar en homepage y secciones destacadas
                      </p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
