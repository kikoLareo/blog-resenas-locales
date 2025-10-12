"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageManager from "@/components/ImageManager";
import Link from "next/link";
import { ArrowLeft, Edit, Eye, MapPin, Phone, Globe, Clock, Euro, Tag, Building2, X, Save } from "lucide-react";
import { useState } from "react";
import { validatePhone } from "@/lib/phone-validation";

// Phone number validation function
const validatePhoneNumber = (phone: string): boolean => {
  if (!phone.trim()) {
    return true; // Phone is optional, empty is valid
  }
  
  // Allow international and local phone formats
  // Clean the phone number by removing spaces and dashes, then validate
  const cleanPhone = phone.replace(/[\s\-]/g, '');
  
  // International: +XX followed by 7-15 digits
  // Local: 7-15 digits without country code
  const phoneRegex = /^(\+\d{1,4})?\d{7,15}$/;
  return phoneRegex.test(cleanPhone);
};

interface VenueWithDetails {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  address: string;
  phone?: string;
  website?: string;
  priceRange: string;
  schemaType?: string;
  _createdAt: string;
  _updatedAt: string;
  city: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  categories: {
    _id: string;
    title: string;
  }[];
  reviews: {
    _id: string;
    title: string;
    slug: { current: string };
    ratings: {
      food: number;
      service: number;
      ambience: number;
      value: number;
    };
    _createdAt: string;
  }[];
}

export default function VenueDetailClient({ venue }: { venue: VenueWithDetails }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(venue);
  const [images, setImages] = useState<any[]>([]);
  const [phoneError, setPhoneError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const publicVenueUrl = venue.slug?.current && venue.city?.slug?.current
    ? `/${venue.city.slug.current}/venue/${venue.slug.current}`
    : '#';

  // Calculate average rating
  const avgRating = venue.reviews && venue.reviews.length > 0
    ? venue.reviews.reduce((acc, review) => {
        // Verificar que ratings exista y tenga todos los campos necesarios
        if (!review.ratings || 
            typeof review.ratings.food !== 'number' ||
            typeof review.ratings.service !== 'number' ||
            typeof review.ratings.ambience !== 'number' ||
            typeof review.ratings.value !== 'number') {
          return acc;
        }
        return acc + (review.ratings.food + review.ratings.service + review.ratings.ambience + review.ratings.value) / 4;
      }, 0) / venue.reviews.length
    : 0;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!formData.title || !formData.title.toString().trim() || !formData.address || !formData.address.toString().trim()) {
        setIsLoading(false);
        window.alert('Título y dirección son campos requeridos');
        return;
      }

      // Validate phone number
      if (formData.phone && !validatePhoneNumber(formData.phone)) {
        setPhoneError('Formato de teléfono inválido');
        setIsLoading(false);
        return;
      }
      setPhoneError('');

      console.log('Guardando venue con ID:', venue._id);
      console.log('Datos a enviar:', { ...formData, images });

      // Call API to update venue
      const res = await fetch(`/api/admin/venues/${venue._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, images }),
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
      window.alert('Local actualizado exitosamente');
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
          <Link href="/dashboard/venues">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Locales
            </Button>
          </Link>
          <div className="flex space-x-2">
            {publicVenueUrl !== '#' && (
              <a href={publicVenueUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Público
                </Button>
              </a>
            )}
            <Button onClick={() => setIsEditModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Local
            </Button>
          </div>
        </div>

        {/* Header con información básica */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{venue.title}</CardTitle>
                <p className="text-muted-foreground">/{venue.slug?.current}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{venue.reviews?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Reseñas</div>
                {avgRating > 0 && (
                  <div className="text-lg font-semibold text-yellow-600">
                    ⭐ {avgRating.toFixed(1)}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-muted-foreground">{venue.description}</p>
                </div>

                <div className="space-y-2">
                  {venue.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{venue.address}</span>
                    </div>
                  )}
                  {venue.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{venue.phone}</span>
                    </div>
                  )}
                  {venue.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={venue.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {venue.website}
                      </a>
                    </div>
                  )}
                  {venue.priceRange && (
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{venue.priceRange}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Ciudad</h3>
                  <Link 
                    href={`/dashboard/cities/${venue.city?._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {venue.city?.title || 'Sin ciudad'}
                  </Link>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Categorías</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.categories && venue.categories.length > 0 ? (
                      venue.categories.map((category) => (
                        <span 
                          key={category._id}
                          className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                        >
                          {category.title}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">Sin categorías</span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Creado: {new Date(venue._createdAt).toLocaleDateString()}</p>
                  <p>Actualizado: {new Date(venue._updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reseñas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Reseñas ({venue.reviews?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {venue.reviews && venue.reviews.length > 0 ? (
              <div className="space-y-4">
                {venue.reviews.map((review) => {
                  // Verificar que ratings exista y tenga todos los campos necesarios
                  const hasValidRatings = review.ratings && 
                    typeof review.ratings.food === 'number' &&
                    typeof review.ratings.service === 'number' &&
                    typeof review.ratings.ambience === 'number' &&
                    typeof review.ratings.value === 'number';
                  
                  const averageRating = hasValidRatings
                    ? (review.ratings.food + review.ratings.service + review.ratings.ambience + review.ratings.value) / 4
                    : 0;

                  return (
                    <div key={review._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <Link 
                          href={`/dashboard/reviews/${review._id}/edit`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {review.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">/{review.slug?.current}</p>
                        {hasValidRatings ? (
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>Comida: {review.ratings.food}/5</span>
                            <span>Servicio: {review.ratings.service}/5</span>
                            <span>Ambiente: {review.ratings.ambience}/5</span>
                            <span>Valor: {review.ratings.value}/5</span>
                          </div>
                        ) : (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Calificaciones no disponibles
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {hasValidRatings ? (
                          <div className="text-lg font-bold text-yellow-600">
                            ⭐ {averageRating.toFixed(1)}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Sin calificación
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {new Date(review._createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay reseñas para este local
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
                <p className="text-muted-foreground">{venue._id}</p>
              </div>
              <div>
                <span className="font-medium">Tipo de Schema:</span>
                <p className="text-muted-foreground">{venue.schemaType || 'venue'}</p>
              </div>
              <div>
                <span className="font-medium">Creado:</span>
                <p className="text-muted-foreground">
                  {new Date(venue._createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="font-medium">Última actualización:</span>
                <p className="text-muted-foreground">
                  {new Date(venue._updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de edición */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Editar Local</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Información básica */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Nombre del Local</Label>
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

                <div className="mt-4">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea 
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>

              {/* Contacto y ubicación */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contacto y Ubicación</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input 
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input 
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className={phoneError ? 'border-red-500' : ''}
                      />
                      {phoneError && (
                        <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input 
                        id="website"
                        value={formData.website || ''}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="priceRange">Rango de Precios</Label>
                    <Select 
                      value={formData.priceRange || ''} 
                      onValueChange={(value) => setFormData({...formData, priceRange: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rango de precios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="€">€ - Económico</SelectItem>
                        <SelectItem value="€€">€€ - Moderado</SelectItem>
                        <SelectItem value="€€€">€€€ - Caro</SelectItem>
                        <SelectItem value="€€€€">€€€€ - Muy Caro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Imágenes */}
              <div>
                <Label>Imágenes</Label>
                <ImageManager 
                  entityId={venue._id}
                  entityType="venue"
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