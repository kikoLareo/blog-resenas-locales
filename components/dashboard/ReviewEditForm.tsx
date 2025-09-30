'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Save, ArrowLeft, Star } from 'lucide-react';

interface Review {
  _id: string;
  title: string;
  slug: { current: string };
  content: string;
  excerpt?: string;
  published: boolean;
  publishedAt?: string;
  venue?: {
    _id: string;
    title: string;
    slug: { current: string };
    city?: { title: string; slug: { current: string } };
  };
  ratings: {
    overall: number;
    food: number;
    service: number;
    atmosphere: number;
    value: number;
  };
  images?: Array<{
    asset: { _id: string; url: string };
    alt?: string;
    caption?: string;
  }>;
  tags?: string[];
  seoTitle?: string;
  metaDescription?: string;
  author?: {
    _id: string;
    name: string;
  };
  _createdAt: string;
  _updatedAt: string;
}

interface Venue {
  _id: string;
  title: string;
  slug: { current: string };
  city?: { title: string; slug: { current: string } };
}

interface ReviewEditFormProps {
  review: Review;
  venues: Venue[];
}

export function ReviewEditForm({ review, venues }: ReviewEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: review.title,
    slug: review.slug.current,
    content: review.content,
    excerpt: review.excerpt || '',
    published: review.published,
    venueId: review.venue?._id || '',
    ratings: {
      overall: review.ratings.overall,
      food: review.ratings.food,
      service: review.ratings.service,
      atmosphere: review.ratings.atmosphere,
      value: review.ratings.value,
    },
    tags: review.tags || [],
    seoTitle: review.seoTitle || '',
    metaDescription: review.metaDescription || '',
  });

  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRatingChange = (ratingType: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [ratingType]: value
      }
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (title: string) => {
    handleInputChange('title', title);
    handleInputChange('slug', generateSlug(title));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/reviews/${review._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la reseña');
      }

      alert('Reseña actualizada correctamente');
      
      startTransition(() => {
        router.push('/dashboard/reviews');
        router.refresh();
      });
    } catch (error) {
      alert('Error al actualizar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, label }: { rating: number; onRatingChange: (rating: number) => void; label: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {rating}/5
        </span>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || isPending}
          className="flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{isSubmitting ? 'Guardando...' : 'Guardar cambios'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información básica */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Título de la reseña"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="url-de-la-resena"
                />
              </div>

              <div>
                <Label htmlFor="venue">Restaurante/Local *</Label>
                <Select
                  value={formData.venueId}
                  onValueChange={(value) => handleInputChange('venueId', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar restaurante" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue._id} value={venue._id}>
                        {venue.title} {venue.city && `- ${venue.city.title}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="excerpt">Resumen</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Breve descripción de la reseña"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Contenido *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Contenido completo de la reseña"
                  rows={12}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Calificaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Calificaciones</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StarRating
                rating={formData.ratings.overall}
                onRatingChange={(rating) => handleRatingChange('overall', rating)}
                label="Calificación General"
              />
              <StarRating
                rating={formData.ratings.food}
                onRatingChange={(rating) => handleRatingChange('food', rating)}
                label="Comida"
              />
              <StarRating
                rating={formData.ratings.service}
                onRatingChange={(rating) => handleRatingChange('service', rating)}
                label="Servicio"
              />
              <StarRating
                rating={formData.ratings.atmosphere}
                onRatingChange={(rating) => handleRatingChange('atmosphere', rating)}
                label="Ambiente"
              />
              <StarRating
                rating={formData.ratings.value}
                onRatingChange={(rating) => handleRatingChange('value', rating)}
                label="Relación Calidad-Precio"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Estado */}
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => handleInputChange('published', checked)}
                />
                <Label htmlFor="published">Publicada</Label>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Creada: {new Date(review._createdAt).toLocaleDateString()}</p>
                <p>Actualizada: {new Date(review._updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Etiquetas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nueva etiqueta"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  Añadir
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">Título SEO</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  placeholder="Título para motores de búsqueda"
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Descripción</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  placeholder="Descripción para motores de búsqueda"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}