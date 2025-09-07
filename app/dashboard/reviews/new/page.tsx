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

export default function NewReviewPage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    venue: "",
    ratings: {
      food: 5,
      service: 5,
      ambience: 5,
      value: 5
    },
    status: "draft" as "draft" | "published"
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica para guardar en Sanity
      // console.log('Guardando nueva reseña:', formData);
      
      // Simular un delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir a la lista de reseñas después de guardar
      window.location.href = '/dashboard/reviews';
    } catch (error) {
      // console.error('Error al guardar:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/reviews">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Reseñas
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/reviews'}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Guardando...' : 'Guardar Reseña'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Nueva Reseña</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título de la Reseña *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Pizza Margherita - La mejor de Madrid"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="pizza-margherita-madrid"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="content">Contenido de la Reseña</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={8}
                  placeholder="Escribe tu reseña aquí..."
                />
              </div>
            </div>

            {/* Local */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Local</h3>
              <div>
                <Label htmlFor="venue">Seleccionar Local *</Label>
                <Select value={formData.venue} onValueChange={(value) => setFormData({...formData, venue: value})}>
                  <SelectTrigger id="venue">
                    <SelectValue placeholder="Selecciona un local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local1">Pizzería Tradizionale</SelectItem>
                    <SelectItem value="local2">Restaurante El Bueno</SelectItem>
                    <SelectItem value="local3">Café Central</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Valoraciones */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Valoraciones</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="food">Comida</Label>
                  <Input
                    id="food"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.ratings.food.toString()}
                    onChange={(e) => setFormData({
                      ...formData,
                      ratings: {...formData.ratings, food: parseInt(e.target.value) || 5}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="service">Servicio</Label>
                  <Input
                    id="service"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.ratings.service.toString()}
                    onChange={(e) => setFormData({
                      ...formData,
                      ratings: {...formData.ratings, service: parseInt(e.target.value) || 5}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="ambience">Ambiente</Label>
                  <Input
                    id="ambience"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.ratings.ambience.toString()}
                    onChange={(e) => setFormData({
                      ...formData,
                      ratings: {...formData.ratings, ambience: parseInt(e.target.value) || 5}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="value">Relación Calidad-Precio</Label>
                  <Input
                    id="value"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.ratings.value.toString()}
                    onChange={(e) => setFormData({
                      ...formData,
                      ratings: {...formData.ratings, value: parseInt(e.target.value) || 5}
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Estado */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Estado</h3>
              <div>
                <Label htmlFor="status">Estado de la Reseña</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "draft" | "published") => setFormData({...formData, status: value})}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
