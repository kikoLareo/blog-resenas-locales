"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Globe, Clock, Euro, Star, ExternalLink, Calendar, Users, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


interface VenueDetailProps {
  venue: {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    address: string;
    postalCode?: string;
    phone?: string;
    website?: string;
    geo?: {
      lat: number;
      lng: number;
    };
    openingHours?: string;
    priceRange?: string;
    schemaType?: string;
    social?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
    images?: Array<{
      asset: {
        _id: string;
        url: string;
      };
      alt?: string;
      caption?: string;
    }>;
    city: {
      _id: string;
      title: string;
      slug: string;
      region?: string;
    };
    categories: Array<{
      _id: string;
      title: string;
      slug: string;
      icon?: string;
      color?: string;
    }>;
    reviews: Array<{
      _id: string;
      title: string;
      slug: string;
      author: string;
      visitDate?: string;
      publishedAt: string;
      ratings: {
        food: number;
        service: number;
        ambience: number;
        value: number;
        overall: number;
      };
      avgTicket?: number;
      highlights?: string[];
      pros?: string[];
      cons?: string[];
      tldr: string;
      gallery?: Array<{
        asset: {
          _id: string;
          url: string;
        };
        alt?: string;
      }>;
      tags?: string[];
    }>;
    averageRating?: number;
    reviewCount: number;
  };
}

export default function VenueDetail({ venue }: VenueDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const heroImage = venue.images?.[selectedImageIndex];

  const formatRating = (rating: number) => {
    return rating ? rating.toFixed(1) : '0.0';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    if (rating >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatOpeningHours = (hours?: string) => {
    if (!hours) return 'Horarios no disponibles';
    return hours;
  };

  const averageRating = venue.averageRating || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href={`/${venue.city.slug}`} className="hover:text-gray-700">
          {venue.city.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{venue.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda - Imágenes */}
        <div className="lg:col-span-2">
          {/* Imagen principal */}
          {heroImage && (
            <div className="relative aspect-[4/3] mb-4 rounded-lg overflow-hidden">
              <Image
                src={heroImage.asset.url}
                alt={heroImage.alt || venue.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Galería de imágenes */}
          {venue.images && venue.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mb-8">
              {venue.images.slice(0, 8).map((image, index) => (
                <div
                  key={image.asset._id}
                  className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={image.asset.url}
                    alt={image.alt || `${venue.title} - Imagen ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Información principal */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{venue.title}</CardTitle>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{venue.address}</span>
                    </div>
                    {venue.priceRange && (
                      <div className="flex items-center gap-1">
                        <Euro className="h-4 w-4" />
                        <span>{venue.priceRange}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Categorías */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {venue.categories.map((category) => (
                      <Link key={category._id} href={`/categorias/${category.slug}`}>
                        <Badge variant="secondary" className="hover:bg-gray-300 transition-colors">
                          {category.title}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                {venue.reviewCount > 0 && (
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getRatingColor(averageRating)}`}>
                      {formatRating(averageRating)}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(averageRating / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      {venue.reviewCount} reseña{venue.reviewCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>

            {venue.description && (
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{venue.description}</p>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Columna derecha - Información de contacto */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Teléfono */}
              {venue.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <a href={`tel:${venue.phone}`} className="text-blue-600 hover:underline">
                    {venue.phone}
                  </a>
                </div>
              )}

              {/* Website */}
              {venue.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <a 
                    href={venue.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Sitio web
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Horarios */}
              {venue.openingHours && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Horarios</div>
                    <div className="text-sm text-gray-600 whitespace-pre-line">
                      {formatOpeningHours(venue.openingHours)}
                    </div>
                  </div>
                </div>
              )}

              {/* Redes sociales */}
              {venue.social && Object.keys(venue.social).length > 0 && (
                <div>
                  <div className="font-medium text-sm mb-2">Redes sociales</div>
                  <div className="flex gap-2">
                    {venue.social.instagram && (
                      <a
                        href={venue.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700"
                      >
                        Instagram
                      </a>
                    )}
                    {venue.social.facebook && (
                      <a
                        href={venue.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Facebook
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Ubicación */}
              {venue.geo && (
                <div>
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={`https://maps.google.com/?q=${venue.geo.lat},${venue.geo.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Ver en Google Maps
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reseñas */}
      {venue.reviews && venue.reviews.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              Reseñas ({venue.reviewCount})
            </h2>
            {venue.reviewCount > venue.reviews.length && (
              <Link href={`/${venue.city.slug}/${venue.slug}/reviews`}>
                <Button variant="outline">Ver todas las reseñas</Button>
              </Link>
            )}
          </div>

          <div className="grid gap-6">
            {venue.reviews.map((review) => (
              <Card key={review._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Link 
                        href={`/${venue.city.slug}/${venue.slug}/review/${review.slug}`}
                        className="text-xl font-semibold hover:text-blue-600 transition-colors"
                      >
                        {review.title}
                      </Link>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>Por {review.author}</span>
                        {review.visitDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(review.visitDate).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`text-2xl font-bold ${getRatingColor(review.ratings.overall)}`}>
                      {formatRating(review.ratings.overall)}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{review.tldr}</p>

                  {/* Tags */}
                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {review.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Comida</div>
                        <div className="font-medium">{formatRating(review.ratings.food)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Servicio</div>
                        <div className="font-medium">{formatRating(review.ratings.service)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Ambiente</div>
                        <div className="font-medium">{formatRating(review.ratings.ambience)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Relación C/P</div>
                        <div className="font-medium">{formatRating(review.ratings.value)}</div>
                      </div>
                    </div>

                    <Link href={`/${venue.city.slug}/${venue.slug}/review/${review.slug}`}>
                      <Button variant="outline" size="sm">
                        Leer más
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sin reseñas */}
      {(!venue.reviews || venue.reviews.length === 0) && (
        <div className="mt-12 text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aún no hay reseñas
          </h3>
          <p className="text-gray-500">
            Sé el primero en escribir una reseña sobre {venue.title}
          </p>
        </div>
      )}
    </div>
  );
}
