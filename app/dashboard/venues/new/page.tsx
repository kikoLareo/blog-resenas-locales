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

export default function NewVenuePage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    address: "",
    phone: "",
    website: "",
    priceRange: "€€",
    city: "",
    categories: [] as string[]
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!formData.title || !formData.address) {
        alert('Título y dirección son campos requeridos');
        return;
      }

      // Validate website URL if provided
      if (formData.website && formData.website.trim()) {
        try {
          new URL(formData.website.trim());
        } catch {
          alert('Por favor, introduce una URL válida (ej: https://www.ejemplo.com)');
          return;
        }
      }

      const response = await fetch('/api/admin/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Local guardado exitosamente');
        window.location.href = '/dashboard/venues';
      } else {
        alert(result.error || 'Error al guardar el local');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el local');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/venues">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Locales
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/venues'}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Guardando...' : 'Guardar Local'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Nuevo Local</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Nombre del Local *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Pizzería Tradizionale"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="pizzeria-tradizionale"
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
                  placeholder="Describe el local..."
                />
              </div>
            </div>

            {/* Información de Contacto */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Calle Mayor, 123"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+34 91 123 45 67"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://www.ejemplo.com"
                  />
                </div>
              </div>
            </div>

            {/* Ubicación y Categorías */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ubicación y Categorías</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Select value={formData.city} onValueChange={(value) => setFormData({...formData, city: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="madrid">Madrid</SelectItem>
                      <SelectItem value="barcelona">Barcelona</SelectItem>
                      <SelectItem value="valencia">Valencia</SelectItem>
                      <SelectItem value="sevilla">Sevilla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priceRange">Rango de Precios</Label>
                  <Select value={formData.priceRange} onValueChange={(value) => setFormData({...formData, priceRange: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="€">Económico (€)</SelectItem>
                      <SelectItem value="€€">Moderado (€€)</SelectItem>
                      <SelectItem value="€€€">Alto (€€€)</SelectItem>
                      <SelectItem value="€€€€">Lujo (€€€€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="categories">Categorías</Label>
                <Select 
                  value="" 
                  onValueChange={(value) => {
                    if (!formData.categories.includes(value)) {
                      setFormData({
                        ...formData, 
                        categories: [...formData.categories, value]
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Añadir categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pizzeria">Pizzería</SelectItem>
                    <SelectItem value="restaurante">Restaurante</SelectItem>
                    <SelectItem value="cafe">Café</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="heladeria">Heladería</SelectItem>
                  </SelectContent>
                </Select>
                {formData.categories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center"
                      >
                        {category}
                        <button
                          onClick={() => setFormData({
                            ...formData,
                            categories: formData.categories.filter((_, i) => i !== index)
                          })}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
