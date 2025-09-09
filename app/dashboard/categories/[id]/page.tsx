"use client";
import { adminSanityClient } from "@/lib/admin-sanity";
import { categoryByIdQuery } from "@/lib/admin-queries";
import type { Category } from "@/types/sanity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageManager from "@/components/ImageManager";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Edit, Eye, Tag, Building2, FileText, X, Save, Coffee, Utensils, Pizza, IceCream, Cake, Wine } from "lucide-react";
import { notFound } from "next/navigation";
import { useState } from "react";

interface CategoryDetailPageProps {
  params: Promise<{ id: string }>;
}

interface CategoryWithDetails {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  icon?: string;
  color?: string;
  featured?: boolean;
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
    city: {
      title: string;
      slug: { current: string };
    };
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
      city: {
        title: string;
        slug: { current: string };
      };
    };
    ratings: {
      overall: number;
    };
    _createdAt: string;
  }[];
}

const iconOptions = [
  { value: 'coffee', label: 'Café', icon: Coffee },
  { value: 'utensils', label: 'Restaurante', icon: Utensils },
  { value: 'pizza', label: 'Pizzería', icon: Pizza },
  { value: 'ice-cream', label: 'Heladería', icon: IceCream },
  { value: 'cake', label: 'Pastelería', icon: Cake },
  { value: 'wine', label: 'Bar/Vinos', icon: Wine },
];

function CategoryDetailClient({ category }: { category: CategoryWithDetails }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(category);
  const [images, setImages] = useState<any[]>([]);

  const publicCategoryUrl = category.slug?.current ? `/category/${category.slug.current}` : '#';

  const avgRating = category.reviews && category.reviews.length > 0
    ? category.reviews.reduce((acc, review) => acc + review.ratings.overall, 0) / category.reviews.length
    : 0;

  const handleSave = () => {
    // Aquí iría la lógica para guardar en Sanity
    setIsEditModalOpen(false);
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    return iconOption ? iconOption.icon : Tag;
  };

  const IconComponent = getIconComponent(category.icon || 'tag');

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/categories">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Categorías
            </Button>
          </Link>
          <div className="flex space-x-2">
            {publicCategoryUrl !== '#' && (
              <a href={publicCategoryUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Público
                </Button>
              </a>
            )}
            <Button onClick={() => setIsEditModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Categoría
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: category.color || '#6B7280' }}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">{category.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        {category.venues?.length || 0} locales
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {category.reviews?.length || 0} reseñas
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{category.description || 'Sin descripción'}</p>
              </CardContent>
            </Card>

            {/* Gestión de Imágenes */}
            <ImageManager
              entityId={category._id}
              entityType="category"
              currentImages={images}
              onImagesChange={setImages}
              maxImages={5}
              title="Imágenes de la Categoría"
            />

            {/* Locales */}
            <Card>
              <CardHeader>
                <CardTitle>Locales ({category.venues?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.venues && category.venues.length > 0 ? (
                    category.venues.map((venue) => (
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
                            <span className="text-xs text-gray-500">{venue.city?.title || 'Sin ciudad'}</span>
                            {venue.phone && (
                              <span className="text-xs text-gray-500">{venue.phone}</span>
                            )}
                            {venue.priceRange && (
                              <span className="text-xs text-gray-500">{venue.priceRange}</span>
                            )}
                            <span className="text-xs text-gray-500">{venue.reviewCount || 0} reseñas</span>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(venue._createdAt).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay locales en esta categoría</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reseñas */}
            <Card>
              <CardHeader>
                <CardTitle>Reseñas ({category.reviews?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                                    {category.reviews && category.reviews.length > 0 ? (
                    category.reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <Link href={`/dashboard/reviews/${review._id}`} className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{review.title}</h4>
                              <p className="text-sm text-gray-600">
                                En {review.venue?.title || 'Sin local'} • {review.venue?.city?.title || 'Sin ciudad'}
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
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay reseñas en esta categoría</p>
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
                  <span>Total locales:</span>
                  <span className="font-bold">{category.venues?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total reseñas:</span>
                  <span className="font-bold">{category.reviews?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Creado:</span>
                  <span className="text-sm">{new Date(category._createdAt).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actualizado:</span>
                  <span className="text-sm">{new Date(category._updatedAt).toLocaleDateString('es-ES')}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: category.color || '#6B7280' }}
                  ></div>
                  <span className="text-sm text-gray-600">Color: {category.color}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Icono: {category.icon}</span>
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
              <h2 className="text-2xl font-bold">Editar Categoría</h2>
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
                    <Label htmlFor="title">Nombre de la Categoría *</Label>
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
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                  />
                </div>
              </div>

              {/* Configuración Visual */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Configuración Visual</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="icon">Icono</Label>
                    <Select value={formData.icon || ''} onValueChange={(value) => setFormData({...formData, icon: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un icono" />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-2">
                              <option.icon className="h-4 w-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      type="color"
                      value={formData.color || '#6B7280'}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="h-10"
                    />
                  </div>
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

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const resolvedParams = await params;
  const category = await adminSanityClient.fetch<CategoryWithDetails>(categoryByIdQuery, { id: resolvedParams.id });
  
  if (!category) {
    notFound();
  }

  return <CategoryDetailClient category={category} />;
}
