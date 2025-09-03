"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";

interface Venue {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

export default function NewReviewPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [venuesError, setVenuesError] = useState<string | null>(null);
  
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

  // Fetch venues on component mount
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setVenuesLoading(true);
        setVenuesError(null);
        
        const response = await fetch('/api/admin/venues');
        if (!response.ok) {
          throw new Error('Error al cargar los locales');
        }
        
        const venuesData = await response.json();
        setVenues(venuesData);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setVenuesError(error instanceof Error ? error.message : 'Error al cargar los locales');
      } finally {
        setVenuesLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica para guardar en Sanity
      console.log('Guardando nueva reseña:', formData);
      // Redirigir a la lista de reseñas después de guardar
      window.location.href = '/dashboard/reviews';
    } catch (error) {
      console.error('Error al guardar:', error);
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
                    <SelectValue placeholder={venuesLoading ? "Cargando locales..." : "Selecciona un local"} />
                  </SelectTrigger>
                  <SelectContent>
                    {venuesLoading ? (
                      <SelectItem value="loading" disabled>Cargando locales...</SelectItem>
                    ) : venuesError ? (
                      <SelectItem value="error" disabled>Error: {venuesError}</SelectItem>
                    ) : venues.length === 0 ? (
                      <SelectItem value="empty" disabled>No hay locales disponibles</SelectItem>
                    ) : (
                      venues.map((venue) => (
                        <SelectItem key={venue._id} value={venue._id}>
                          {venue.title}
                        </SelectItem>
                      ))
                    )}
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
