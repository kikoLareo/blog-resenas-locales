"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";

export default function NewCategoryPage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica para guardar en Sanity
      console.log('Guardando nueva categoría:', formData);
      // Redirigir a la lista de categorías después de guardar
      window.location.href = '/dashboard/categories';
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/categories">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Categorías
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/categories'}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Guardando...' : 'Guardar Categoría'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Nueva Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <form role="form" className="space-y-6">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Pizzería"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="pizzeria"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  placeholder="Describe la categoría..."
                />
              </div>
            </div>

            {/* Ejemplos de categorías existentes */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ejemplos de Categorías</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "Pizzería",
                  "Restaurante",
                  "Café",
                  "Bar",
                  "Heladería",
                  "Pastelería",
                  "Asador",
                  "Sushi"
                ].map((category) => (
                  <button
                    key={category}
                    onClick={() => setFormData({
                      ...formData,
                      title: category,
                      slug: category.toLowerCase().replace(/\s+/g, '-')
                    })}
                    className="p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
