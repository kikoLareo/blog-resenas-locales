"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageManager from "@/components/ImageManager";
import Link from "next/link";
import { ArrowLeft, Edit, Eye, MapPin, Building2, FileText, X, Save } from "lucide-react";
import { useState } from "react";

interface CityWithDetails {
  _id: string;
  title: string;
  slug: { current: string };
  region?: string;
  description?: string;
  _createdAt: string;
  _updatedAt: string;
  venues: {
    _id: string;
    title: string;
    slug: { current: string };
    address: string;
    phone?: string;
    website?: string;
    priceRange?: string;
    reviewCount: number;
    _createdAt: string;
  }[];
  reviews: {
    _id: string;
    title: string;
    slug: { current: string };
    venue: {
      title: string;
      slug: { current: string };
    };
    ratings: {
      overall: number;
    };
    _createdAt: string;
  }[];
}

export default function CityDetailClient({ city }: { city: CityWithDetails }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(city);
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const publicCityUrl = city.slug?.current ? `/${city.slug.current}` : '#';

  const avgRating = city.reviews && city.reviews.length > 0
    ? city.reviews.reduce((acc, review) => acc + review.ratings.overall, 0) / city.reviews.length
    : 0;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!formData.title || !formData.title.toString().trim()) {
        setIsLoading(false);
        window.alert('Título es un campo requerido');
        return;
      }

      // Transform data for API
      const apiData = {
        title: formData.title,
        slug: formData.slug?.current || formData.slug,
        region: formData.region,
        description: formData.description,
        images: images
      };

      console.log('Guardando ciudad con ID:', city._id);
      console.log('Datos a enviar:', apiData);

      // Call API to update city
      const res = await fetch(`/api/admin/cities/${city._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const data = await res.json();
      console.log('Respuesta del servidor:', data);

      if (!res.ok) {
        const errorMsg = data?.details || data?.error || 'Error al actualizar';
        console.error('Error al guardar:', errorMsg);
        window.alert(`Error: ${errorMsg}`);
        return;
      }

      // Close modal on success and reload page to show updated data
      window.alert('Ciudad actualizada exitosamente');
      setIsEditModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error en handleSave:', error);
      window.alert((error as any)?.message || 'Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/cities">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Ciudades
            </Button>
          </Link>
          <div className="flex space-x-2">
            {publicCityUrl !== '#' && (
              <a href={publicCityUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Público
                </Button>
              </a>
            )}
            <Button onClick={() => setIsEditModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Ciudad
            </Button>
          </div>
        </div>

        {/* Header con información básica */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{city.title}</CardTitle>
                <p className="text-muted-foreground">/{city.slug?.current}</p>
                {city.region && (
                  <p className="text-sm text-muted-foreground">Región: {city.region}</p>
                )}
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{city.venues?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Locales</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-muted-foreground">
                    {city.description || 'Sin descripción disponible'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{city.venues?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Locales</div>
                </div>

                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{city.reviews?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Reseñas</div>
                </div>

                {avgRating > 0 && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{avgRating.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Puntuación Media</div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Locales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Locales en {city.title} ({city.venues?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {city.venues && city.venues.length > 0 ? (
              <div className="space-y-4">
                {city.venues.map((venue) => (
                  <div key={venue._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Link 
                        href={`/dashboard/venues/${venue._id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {venue.title}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">{venue.address}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        {venue.phone && <span>Tel: {venue.phone}</span>}
                        {venue.priceRange && <span>Precio: {venue.priceRange}</span>}
                        <span>{venue.reviewCount || 0} reseñas</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {new Date(venue._createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay locales registrados en esta ciudad
              </p>
            )}
          </CardContent>
        </Card>

        {/* Reseñas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Reseñas en {city.title} ({city.reviews?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {city.reviews && city.reviews.length > 0 ? (
              <div className="space-y-4">
                {city.reviews.map((review) => (
                  <div key={review._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Link 
                        href={`/dashboard/reviews/${review._id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {review.title}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        En: {review.venue?.title || 'Sin local'}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm font-medium">
                          ⭐ {review.ratings?.overall || 0}/5
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review._createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay reseñas registradas en esta ciudad
              </p>
            )}
          </CardContent>
        </Card>

        {/* Metadatos */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">ID:</span>
                <p className="text-muted-foreground">{city._id}</p>
              </div>
              <div>
                <span className="font-medium">Región:</span>
                <p className="text-muted-foreground">{city.region || 'Sin región'}</p>
              </div>
              <div>
                <span className="font-medium">Creado:</span>
                <p className="text-muted-foreground">
                  {new Date(city._createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="font-medium">Última actualización:</span>
                <p className="text-muted-foreground">
                  {new Date(city._updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de edición */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Editar Ciudad</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Nombre de la Ciudad</Label>
                  <Input 
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input 
                    id="slug"
                    value={formData.slug?.current || ''}
                    onChange={(e) => setFormData({...formData, slug: { current: e.target.value }})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="region">Región</Label>
                <Input 
                  id="region"
                  value={formData.region || ''}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea 
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label>Imágenes</Label>
                <ImageManager 
                  entityId={city._id}
                  entityType="city"
                  currentImages={images}
                  onImagesChange={setImages}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}