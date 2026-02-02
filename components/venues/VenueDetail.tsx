"use client";

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Globe, Clock, Euro, Star, ExternalLink, Calendar, Users, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { cleanContent, getReviewUrl, getVenueUrl } from '@/lib/utils';


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
    if (rating >= 8) return 'text-green-600 dark:text-green-400';
    if (rating >= 6) return 'text-yellow-600 dark:text-yellow-400';
    if (rating >= 4) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatOpeningHours = (hours?: string) => {
    if (!hours) return 'Horarios no disponibles';
    return hours;
  };

  const averageRating = venue.averageRating || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white dark:bg-gray-950">
      {/* Breadcrumbs with Schema.org markup */}
      <nav 
        aria-label="Navegación de ubicación"
        className="mb-6 text-sm text-gray-500 dark:text-gray-400"
        role="navigation"
      >
        <ol className="flex items-center" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link 
              href="/" 
              className="hover:text-gray-700 dark:hover:text-gray-200"
              itemProp="item"
            >
              <span itemProp="name">Inicio</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <span className="mx-2" aria-hidden="true">/</span>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link 
              href={`/${venue.city.slug}`} 
              className="hover:text-gray-700 dark:hover:text-gray-200"
              itemProp="item"
            >
              <span itemProp="name">{venue.city.title}</span>
            </Link>
            <meta itemProp="position" content="2" />
          </li>
          <span className="mx-2" aria-hidden="true">/</span>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span className="text-gray-900 dark:text-gray-100" itemProp="name">{venue.title}</span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      <main>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda - Imágenes */}
        <div className="lg:col-span-2">
          {/* Imagen principal */}
          {heroImage?.asset?.url && (
            <div className="relative aspect-[4/3] mb-4 rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800">
              <ImageWithFallback
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
            <div 
              className="grid grid-cols-4 gap-2 mb-8"
              role="group"
              aria-label={`Galería de imágenes de ${venue.title}`}
            >
              {venue.images.slice(0, 8).map((image, index) => (
                image?.asset?.url && (
                  <button
                    key={image.asset._id || index}
                    className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={`Ver imagen ${index + 1} de ${venue.title}`}
                    aria-pressed={selectedImageIndex === index}
                    type="button"
                  >
                    <ImageWithFallback
                      src={image.asset.url}
                      alt={image.alt || `${venue.title} - Imagen ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </button>
                )
              ))}
            </div>
          )}

          {/* Información principal */}
          <Card className="mb-8 dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2 dark:text-white">{venue.title}</CardTitle>
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
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
                        <Badge variant="secondary" className="hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                          {category.title}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                {venue.reviewCount > 0 && (
                  <div className="text-right" role="group" aria-labelledby="venue-rating">
                    <div 
                      id="venue-rating"
                      className={`text-3xl font-bold ${getRatingColor(averageRating)}`}
                      aria-label={`Calificación: ${formatRating(averageRating)} de 10`}
                    >
                      {formatRating(averageRating)}
                    </div>
                    <div 
                      className="flex items-center gap-1 mb-1"
                      role="img"
                      aria-label={`${Math.round(averageRating / 2)} de 5 estrellas`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(averageRating / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {venue.reviewCount} reseña{venue.reviewCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>

            {venue.description && (
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{venue.description}</p>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Columna derecha - Información de contacto */}
        <div>
          <Card className="sticky top-8 dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Empty State for Info */}
              {!venue.phone && !venue.website && !venue.openingHours && (!venue.social || Object.keys(venue.social).length === 0) && !venue.geo && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                  <p>No hay información de contacto disponible.</p>
                  <Link href="/contacto?subject=suggestion" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 block">
                    ¿Conoces este local? Ayúdanos a completar la información.
                  </Link>
                </div>
              )}

              {/* Teléfono */}
              {venue.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <a href={`tel:${venue.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {venue.phone}
                  </a>
                </div>
              )}

              {/* Website */}
              {venue.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <a 
                    href={venue.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Sitio web
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Horarios */}
              {venue.openingHours && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm dark:text-gray-200">Horarios</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {formatOpeningHours(venue.openingHours)}
                    </div>
                  </div>
                </div>
              )}

              {/* Redes sociales */}
              {venue.social && Object.keys(venue.social).length > 0 && (
                <div>
                  <div className="font-medium text-sm mb-2 dark:text-gray-200">Redes sociales</div>
                  <div className="flex gap-2 text-sm">
                    {venue.social.instagram && (
                      <a
                        href={venue.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 dark:text-pink-400 hover:underline"
                      >
                        Instagram
                      </a>
                    )}
                    {venue.social.facebook && (
                      <a
                        href={venue.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Facebook
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Ubicación */}
              {venue.geo && (
                <div className="pt-2">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2 dark:border-gray-700 dark:text-gray-200" asChild>
                    <a
                      href={`https://maps.google.com/?q=${venue.geo.lat},${venue.geo.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="h-4 w-4" />
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
            <h2 className="text-2xl font-bold dark:text-white">
              Reseñas ({venue.reviewCount})
            </h2>
            <div className="flex gap-3">
              {venue.reviewCount > venue.reviews.length && (
                <Link href={`/${venue.city.slug}/${venue.slug}/reviews`}>
                  <Button variant="outline" className="dark:border-gray-700 dark:text-gray-200">Ver todas</Button>
                </Link>
              )}
              <Link href="/contacto?subject=suggestion">
                <Button>Escribir reseña</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            {venue.reviews.map((review) => (
              <Card key={review._id} className="hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Link 
                        href={getReviewUrl(venue.city.slug, venue.slug, review.slug)}
                        className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {review.title}
                      </Link>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>Por {review.author}</span>
                        {review.visitDate && (
                          <span className="flex items-center gap-1" suppressHydrationWarning>
                            <Calendar className="h-3 w-3" />
                            {new Intl.DateTimeFormat('es-ES').format(new Date(review.visitDate))}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`text-2xl font-bold ${getRatingColor(review.ratings?.overall || 0)}`}>
                      {formatRating(review.ratings?.overall || 0)}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">{cleanContent(review.tldr)}</p>

                  {/* Tags */}
                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {review.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs dark:border-gray-700 dark:text-gray-400">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Comida</div>
                        <div className="font-medium dark:text-gray-200">{formatRating(review.ratings?.food || 0)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Servicio</div>
                        <div className="font-medium dark:text-gray-200">{formatRating(review.ratings?.service || 0)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Ambiente</div>
                        <div className="font-medium dark:text-gray-200">{formatRating(review.ratings?.ambience || 0)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">R.C.P.</div>
                        <div className="font-medium dark:text-gray-200">{formatRating(review.ratings?.value || 0)}</div>
                      </div>
                    </div>

                    <Link href={getReviewUrl(venue.city.slug, venue.slug, review.slug)}>
                      <Button variant="outline" size="sm" className="hidden sm:flex dark:border-gray-700 dark:text-gray-200">
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
        <div className="mt-12 text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aún no hay reseñas
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Sé el primero en escribir una reseña sobre {venue.title}
          </p>
          <Link href="/contacto?subject=suggestion">
            <Button>
              Escribir una reseña
            </Button>
          </Link>
        </div>
      )}
      </main>
    </div>
  );
}
