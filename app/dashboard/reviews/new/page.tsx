"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";

export default function NewReviewPage() {
  const router = useRouter();
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
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al guardar la reseña');
      }

      // Redirect to reviews list on success
      router.push('/dashboard/reviews');
    } catch (error) {
      console.error('Error al guardar:', error);
      setError(error instanceof Error ? error.message : 'Error al guardar la reseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/reviews');
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
          <Button variant="outline" onClick={handleCancel}>
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
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          <div className="space-y-6">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título de la Reseña *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Pizza Margherita - La mejor de Madrid"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
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
                  <SelectTrigger>
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
                  <Select 
                    value={formData.ratings.food.toString()} 
                    onValueChange={(value) => setFormData({
                      ...formData, 
                      ratings: {...formData.ratings, food: parseInt(value)}
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}/5</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="service">Servicio</Label>
                  <Select 
                    value={formData.ratings.service.toString()} 
                    onValueChange={(value) => setFormData({
                      ...formData, 
                      ratings: {...formData.ratings, service: parseInt(value)}
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}/5</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ambience">Ambiente</Label>
                  <Select 
                    value={formData.ratings.ambience.toString()} 
                    onValueChange={(value) => setFormData({
                      ...formData, 
                      ratings: {...formData.ratings, ambience: parseInt(value)}
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}/5</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Relación Calidad-Precio</Label>
                  <Select 
                    value={formData.ratings.value.toString()} 
                    onValueChange={(value) => setFormData({
                      ...formData, 
                      ratings: {...formData.ratings, value: parseInt(value)}
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}/5</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
