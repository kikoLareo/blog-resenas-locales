"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";

export default function NewBlogPostPage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft" as "draft" | "published"
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica para guardar en Sanity
      console.log('Guardando nuevo artículo:', formData);
      // Redirigir a la lista de artículos después de guardar
      window.location.href = '/dashboard/blog';
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/blog">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Blog
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/blog'}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Guardando...' : 'Guardar Artículo'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Nuevo Artículo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título del Artículo *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Las mejores pizzerías de Madrid"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="mejores-pizzerias-madrid"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="excerpt">Extracto</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows={3}
                  placeholder="Breve descripción del artículo..."
                />
              </div>
            </div>

            {/* Contenido */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contenido</h3>
              <div>
                <Label htmlFor="content">Contenido del Artículo</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={12}
                  placeholder="Escribe el contenido del artículo aquí..."
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Estado</h3>
              <div>
                <Label htmlFor="status">Estado del Artículo</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "draft" | "published") => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Plantillas de artículos */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Plantillas de Artículos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Guía de Restaurantes",
                    excerpt: "Descubre los mejores restaurantes de la ciudad...",
                    content: "# Guía de Restaurantes\n\n## Introducción\n\nEn esta guía te presentamos los mejores restaurantes...\n\n## Criterios de Selección\n\n- Calidad de la comida\n- Servicio\n- Ambiente\n- Relación calidad-precio\n\n## Restaurantes Destacados\n\n### 1. Restaurante Ejemplo\n\n**Dirección:** Calle Ejemplo, 123\n**Precio:** €€€\n**Especialidad:** Cocina mediterránea\n\n..."
                  },
                  {
                    title: "Reseña de Local",
                    excerpt: "Una experiencia gastronómica única...",
                    content: "# Reseña: [Nombre del Local]\n\n## Primera Impresión\n\nAl entrar en [nombre del local], lo primero que llama la atención es...\n\n## Ambiente\n\nEl local cuenta con un ambiente...\n\n## Comida\n\n### Entrantes\n\n### Platos Principales\n\n### Postres\n\n## Servicio\n\n## Valoración Final\n\n**Puntuación:** X/5\n\n**Recomendación:** Sí/No"
                  }
                ].map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setFormData({
                      ...formData,
                      title: template.title,
                      excerpt: template.excerpt,
                      content: template.content,
                      slug: template.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                    })}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <h4 className="font-medium text-gray-900">{template.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.excerpt}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
