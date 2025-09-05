"use client";
import { adminSanityClient } from "@/lib/admin-sanity";
import { venueByIdQuery } from "@/lib/admin-queries";
import type { Venue } from "@/types/sanity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageManager from "@/components/ImageManager";
import Link from "next/link";
import { ArrowLeft, Edit, Eye, MapPin, Phone, Globe, Clock, Euro, Tag, Building2, X, Save } from "lucide-react";
import { notFound } from "next/navigation";
import { useState } from "react";

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

interface VenueDetailPageProps {
  params: Promise<{ id: string }>;
}

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

function VenueDetailClient({ venue }: { venue: VenueWithDetails }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(venue);
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const publicVenueUrl = venue.slug?.current && venue.city?.slug?.current
    ? `/${venue.city.slug.current}/venue/${venue.slug.current}`
    : '#';

  const avgRating = venue.reviews && venue.reviews.length > 0
    ? venue.reviews.reduce((acc, review) => {
        const avg = (review.ratings.food + review.ratings.service + review.ratings.ambience + review.ratings.value) / 4;
        return acc + avg;
      }, 0) / venue.reviews.length
    : 0;

  const handleSave = async () => {
    setIsLoading(true);
    try {
       // Validate required fields
      if (!formData.title || !formData.address) {
        alert('Título y dirección son campos requeridos');
        return;
      }

      // Validate phone number format
      if (!validatePhoneNumber(formData.phone || '')) {
        alert('El formato del teléfono no es válido. Use formato internacional (+34 91 123 45 67) o local (91 123 45 67)');
        return;
      }

      const response = await fetch(`/api/admin/venues/${venue._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: venue._id,
          title: formData.title,
          slug: formData.slug?.current,
          description: formData.description,
          address: formData.address,
          phone: formData.phone,
          website: formData.website,
          priceRange: formData.priceRange,
          city: formData.city?._id,
          categories: formData.categories?.map(cat => cat._id) || [],
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Local actualizado exitosamente');
        setIsEditModalOpen(false);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert(result.error || 'Error al actualizar el local');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el local');
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{venue.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    {venue.city?.title || 'Sin ciudad'}
                  </div>
                  <div className="flex items-center">
                    <Euro className="h-4 w-4 mr-1" />
                    {venue.priceRange || 'Sin precio'}
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    {venue.schemaType || 'Sin tipo'}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{venue.description || 'Sin descripción'}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{venue.address || 'Sin dirección'}</span>
                  </div>
                  {venue.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{venue.phone}</span>
                    </div>
                  )}
                  {venue.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {venue.website}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gestión de Imágenes */}
            <ImageManager
              entityId={venue._id}
              entityType="venue"
              currentImages={images}
              onImagesChange={setImages}
              maxImages={10}
              title="Imágenes del Local"
            />

            {/* Reseñas */}
            <Card>
              <CardHeader>
                <CardTitle>Reseñas ({venue.reviews?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {venue.reviews && venue.reviews.length > 0 ? (
                    venue.reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <Link href={`/dashboard/reviews/${review._id}`} className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{review.title}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(review._createdAt).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">
                                {((review.ratings.food + review.ratings.service + review.ratings.ambience + review.ratings.value) / 4).toFixed(1)}
                              </div>
                              <div className="text-xs text-gray-500">/ 5.0</div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay reseñas para este local</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Puntuación media:</span>
                  <span className="font-bold">{avgRating.toFixed(1)}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Total reseñas:</span>
                  <span className="font-bold">{venue.reviews?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Creado:</span>
                  <span className="text-sm">{new Date(venue._createdAt).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actualizado:</span>
                  <span className="text-sm">{new Date(venue._updatedAt).toLocaleDateString('es-ES')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Editar Local</h2>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

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
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug?.current || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        slug: { current: e.target.value }
                      })}
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Sitio Web</Label>
                    <Input
                      id="website"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { id } = await params;
  const venue = await adminSanityClient.fetch<VenueWithDetails>(venueByIdQuery, { id });
  
  if (!venue) {
    notFound();
  }

  return <VenueDetailClient venue={venue} />;
}
