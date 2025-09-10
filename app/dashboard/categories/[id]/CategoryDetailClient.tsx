"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageManager from "@/components/ImageManager";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Edit, Eye, Tag, Building2, FileText, X, Save, Coffee, Utensils, Pizza, IceCream, Cake, Wine } from "lucide-react";
import { useState } from "react";

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

export default function CategoryDetailClient({ category }: { category: CategoryWithDetails }) {
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

        {/* Header con información básica */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{category.title}</CardTitle>
                <p className="text-muted-foreground">/{category.slug?.current}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-muted-foreground">
                    {category.description || 'Sin descripción disponible'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Color</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {category.color && (
                        <div 
                          className="h-4 w-4 rounded border" 
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      <span className="text-sm">{category.color || 'No definido'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Destacado</span>
                    <p className="text-sm mt-1">
                      {category.featured ? 'Sí' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{category.venues?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Locales</div>
                </div>

                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{category.reviews?.length || 0}</div>
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

        {/* Locales Asociados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Locales en esta Categoría ({category.venues?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {category.venues && category.venues.length > 0 ? (
              <div className="space-y-4">
                {category.venues.map((venue) => (
                  <div key={venue._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{venue.title}</h4>
                        <span className="text-xs text-muted-foreground">/{venue.slug?.current}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{venue.address}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>Ciudad: {venue.city?.title}</span>
                        {venue.priceRange && <span>Precio: {venue.priceRange}</span>}
                        <span>{venue.reviewCount} reseñas</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Link href={`/dashboard/venues/${venue._id}`}>
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay locales asociados a esta categoría
              </p>
            )}
          </CardContent>
        </Card>

        {/* Reseñas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Reseñas de la Categoría ({category.reviews?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {category.reviews && category.reviews.length > 0 ? (
              <div className="space-y-4">
                {category.reviews.map((review) => (
                  <div key={review._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{review.title}</h4>
                        <span className="text-xs text-muted-foreground">/{review.slug?.current}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Local: {review.venue?.title}
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
                    <div className="text-right">
                      <Link href={`/dashboard/reviews/${review._id}`}>
                        <Button variant="outline" size="sm">
                          Ver Reseña
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay reseñas asociadas a esta categoría
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
                <p className="text-muted-foreground">{category._id}</p>
              </div>
              <div>
                <span className="font-medium">Creado:</span>
                <p className="text-muted-foreground">
                  {new Date(category._createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="font-medium">Última actualización:</span>
                <p className="text-muted-foreground">
                  {new Date(category._updatedAt).toLocaleString()}
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
                <CardTitle>Editar Categoría</CardTitle>
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
                  <Label htmlFor="title">Nombre de la Categoría</Label>
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
                <Label htmlFor="description">Descripción</Label>
                <Textarea 
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">Icono</Label>
                  <Select 
                    value={formData.icon || ''} 
                    onValueChange={(value) => setFormData({...formData, icon: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar icono" />
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
                    value={formData.color || '#000000'}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="featured">Categoría destacada</Label>
              </div>

              <div>
                <Label>Imágenes</Label>
                <ImageManager 
                  entityId={category._id}
                  entityType="category"
                  currentImages={images}
                  onImagesChange={setImages}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}