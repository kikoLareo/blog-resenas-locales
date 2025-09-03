"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageManager from "@/components/ImageManager";
import Link from "next/link";
import { ArrowLeft, Edit, Eye, FileText, Star, Calendar, User, X, Save, CheckCircle } from "lucide-react";
import { useState } from "react";
import type { Review } from "@/types/sanity";

interface ReviewWithDetails {
  _id: string;
  title: string;
  slug: { current: string };
  content?: string;
  tldr?: string;
  visitDate?: string;
  publishedAt: string | null;
  ratings: {
    food: number;
    service: number;
    ambience: number;
    value: number;
  };
  avgTicket?: number;
  pros?: string[];
  cons?: string[];
  author?: string;
  tags?: string[];
  _createdAt: string;
  _updatedAt: string;
  venue: {
    _id: string;
    title: string;
    slug: { current: string };
    city: {
      title: string;
      slug: { current: string };
    };
  };
}

export default function ReviewDetailClient({ review }: { review: ReviewWithDetails }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(review);
  const [images, setImages] = useState<any[]>([]);

  const publicReviewUrl = review.venue?.city?.slug?.current && review.slug?.current
    ? `/${review.venue.city.slug.current}/review/${review.slug.current}`
    : '#';

  const handleSave = () => {
    // Aquí iría la lógica para guardar en Sanity
    console.log('Guardando cambios:', formData);
    setIsEditModalOpen(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
              ? 'text-yellow-400 fill-current opacity-50' 
              : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/reviews">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Reseñas
            </Button>
          </Link>
          <div className="flex space-x-2">
            {publicReviewUrl !== '#' && (
              <a href={publicReviewUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Público
                </Button>
              </a>
            )}
            <Button onClick={() => setIsEditModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Reseña
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{review.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {review.venue?.title || 'Sin local'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {review.visitDate ? new Date(review.visitDate).toLocaleDateString('es-ES') : 'Sin fecha'}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {review.author || 'Sin autor'}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {review.tldr && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Resumen</h4>
                    <p className="text-gray-600">{review.tldr}</p>
                  </div>
                )}
                
                {review.content && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Contenido</h4>
                    <p className="text-gray-600">{review.content}</p>
                  </div>
                )}
                
                {!review.tldr && !review.content && (
                  <div className="mb-4">
                    <p className="text-gray-500 italic">Sin contenido disponible</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {review.pros && review.pros.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Pros</h4>
                      <ul className="space-y-1">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {review.cons && review.cons.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Contras</h4>
                      <ul className="space-y-1">
                        {review.cons.map((con, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <X className="h-4 w-4 text-red-500 mr-2" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {(!review.pros || review.pros.length === 0) && (!review.cons || review.cons.length === 0) && (
                    <div className="col-span-2">
                      <p className="text-gray-500 italic text-center">Sin pros y contras definidos</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Puntuaciones */}
            <Card>
              <CardHeader>
                <CardTitle>Puntuaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Puntuación General</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars((review.ratings.food + review.ratings.service + review.ratings.ambience + review.ratings.value) / 4)}</div>
                      <span className="font-bold">{((review.ratings.food + review.ratings.service + review.ratings.ambience + review.ratings.value) / 4).toFixed(1)}/5.0</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Comida</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(review.ratings.food)}</div>
                      <span>{review.ratings.food.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Servicio</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(review.ratings.service)}</div>
                      <span>{review.ratings.service.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Ambiente</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(review.ratings.ambience)}</div>
                      <span>{review.ratings.ambience.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Relación Calidad-Precio</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(review.ratings.value)}</div>
                      <span>{review.ratings.value.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gestión de Imágenes */}
            <ImageManager
              entityId={review._id}
              entityType="review"
              currentImages={images}
              onImagesChange={setImages}
              maxImages={20}
              title="Galería de Fotos"
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Estado:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    review.publishedAt 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {review.publishedAt ? "Publicado" : "Borrador"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Creado:</span>
                  <span className="text-sm">{new Date(review._createdAt).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actualizado:</span>
                  <span className="text-sm">{new Date(review._updatedAt).toLocaleDateString('es-ES')}</span>
                </div>
                {review.publishedAt && (
                  <div className="flex justify-between">
                    <span>Publicado:</span>
                    <span className="text-sm">{new Date(review.publishedAt).toLocaleDateString('es-ES')}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Local</CardTitle>
              </CardHeader>
              <CardContent>
                <Link 
                  href={`/dashboard/venues/${review.venue._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {review.venue?.title || 'Sin título'}
                </Link>
                <p className="text-sm text-gray-600 mt-1">{review.venue?.city?.title || 'Sin ciudad'}</p>
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
              <h2 className="text-2xl font-bold">Editar Reseña</h2>
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
                    <Label htmlFor="title">Título *</Label>
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
                  <Label htmlFor="tldr">Resumen (TL;DR)</Label>
                  <Input
                    id="tldr"
                    value={formData.tldr || ''}
                    onChange={(e) => setFormData({...formData, tldr: e.target.value})}
                  />
                </div>
                <div className="mt-4">
                  <Label htmlFor="content">Contenido</Label>
                  <Textarea
                    id="content"
                    value={formData.content || ''}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={6}
                  />
                </div>
              </div>

              {/* Puntuaciones */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Puntuaciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="overall">Puntuación General (Calculada)</Label>
                    <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
                      {((formData.ratings.food + formData.ratings.service + formData.ratings.ambience + formData.ratings.value) / 4).toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="food">Comida</Label>
                    <Select value={formData.ratings.food.toString()} onValueChange={(value) => setFormData({
                      ...formData, 
                      ratings: { ...formData.ratings, food: parseFloat(value) }
                    })}>
                      <SelectTrigger aria-label="Valoración de comida, escala del 1 al 5" aria-describedby="edit-food-rating-desc">
                        <SelectValue placeholder="Selecciona puntuación" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating.toFixed(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div id="edit-food-rating-desc" className="sr-only">Selecciona una puntuación del 1 al 5 para la calidad de la comida</div>
                  </div>
                  <div>
                    <Label htmlFor="service">Servicio</Label>
                    <Select value={formData.ratings.service.toString()} onValueChange={(value) => setFormData({
                      ...formData, 
                      ratings: { ...formData.ratings, service: parseFloat(value) }
                    })}>
                      <SelectTrigger aria-label="Valoración de servicio, escala del 1 al 5" aria-describedby="edit-service-rating-desc">
                        <SelectValue placeholder="Selecciona puntuación" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating.toFixed(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div id="edit-service-rating-desc" className="sr-only">Selecciona una puntuación del 1 al 5 para la calidad del servicio</div>
                  </div>
                  <div>
                    <Label htmlFor="ambience">Ambiente</Label>
                    <Select value={formData.ratings.ambience.toString()} onValueChange={(value) => setFormData({
                      ...formData, 
                      ratings: { ...formData.ratings, ambience: parseFloat(value) }
                    })}>
                      <SelectTrigger aria-label="Valoración de ambiente, escala del 1 al 5" aria-describedby="edit-ambience-rating-desc">
                        <SelectValue placeholder="Selecciona puntuación" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating.toFixed(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div id="edit-ambience-rating-desc" className="sr-only">Selecciona una puntuación del 1 al 5 para la calidad del ambiente</div>
                  </div>
                  <div>
                    <Label htmlFor="value">Relación Calidad-Precio</Label>
                    <Select value={formData.ratings.value.toString()} onValueChange={(value) => setFormData({
                      ...formData, 
                      ratings: { ...formData.ratings, value: parseFloat(value) }
                    })}>
                      <SelectTrigger aria-label="Valoración de relación calidad-precio, escala del 1 al 5" aria-describedby="edit-value-rating-desc">
                        <SelectValue placeholder="Selecciona puntuación" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating.toFixed(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div id="edit-value-rating-desc" className="sr-only">Selecciona una puntuación del 1 al 5 para la relación calidad-precio</div>
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
