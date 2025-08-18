"use client";
import { adminSanityClient } from "@/lib/admin-sanity";
import { cityByIdQuery } from "@/lib/admin-queries";
import type { City } from "@/types/sanity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, Edit, Eye, MapPin, Building2, FileText, X, Save } from "lucide-react";
import { notFound } from "next/navigation";
import { useState } from "react";

interface CityDetailPageProps {
  params: Promise<{ id: string }>;
}

interface CityWithDetails extends City {
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

function CityDetailClient({ city }: { city: CityWithDetails }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(city);

  const publicCityUrl = city.slug?.current ? `/${city.slug.current}` : '#';

  const avgRating = city.reviews.length > 0
    ? city.reviews.reduce((acc, review) => acc + review.ratings.overall, 0) / city.reviews.length
    : 0;

  const handleSave = () => {
    // Aquí iría la lógica para guardar en Sanity
    console.log('Guardando cambios:', formData);
    setIsEditModalOpen(false);
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{city.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    {city.region}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {city.venues.length} locales
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {city.reviews.length} reseñas
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{city.description}</p>
              </CardContent>
            </Card>

            {/* Locales */}
            <Card>
              <CardHeader>
                <CardTitle>Locales ({city.venues.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {city.venues.map((venue) => (
                    <div key={venue._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Link 
                            href={`/dashboard/venues/${venue._id}`}
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            {venue.title}
                          </Link>
                          <p className="text-sm text-gray-600">{venue.address}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            {venue.phone && (
                              <span className="text-xs text-gray-500">{venue.phone}</span>
                            )}
                            {venue.priceRange && (
                              <span className="text-xs text-gray-500">{venue.priceRange}</span>
                            )}
                            <span className="text-xs text-gray-500">{venue.reviewCount} reseñas</span>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(venue._createdAt).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reseñas */}
            <Card>
              <CardHeader>
                <CardTitle>Reseñas ({city.reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {city.reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{review.title}</h4>
                          <p className="text-sm text-gray-600">
                            En {review.venue.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(review._createdAt).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {review.ratings.overall.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">/ 5.0</div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  <span>Total locales:</span>
                  <span className="font-bold">{city.venues.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total reseñas:</span>
                  <span className="font-bold">{city.reviews.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Creado:</span>
                  <span className="text-sm">{new Date(city._createdAt).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actualizado:</span>
                  <span className="text-sm">{new Date(city._updatedAt).toLocaleDateString('es-ES')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Editar Ciudad</h2>
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
                    <Label htmlFor="title">Nombre de la Ciudad *</Label>
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
                      value={formData.slug?.current}
                      onChange={(e) => setFormData({
                        ...formData, 
                        slug: { ...formData.slug, current: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="region">Región</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                  />
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

              {/* Botones */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default async function CityDetailPage({ params }: CityDetailPageProps) {
  const resolvedParams = await params;
  const city = await adminSanityClient.fetch<CityWithDetails>(cityByIdQuery, { id: resolvedParams.id });
  
  if (!city) {
    notFound();
  }

  return <CityDetailClient city={city} />;
}
