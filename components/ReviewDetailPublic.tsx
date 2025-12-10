"use client";

import { calculateOverallRating } from '@/lib/rating';
import { cleanContent } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Globe, Clock, Euro, Star, Calendar, Users, Tag, ArrowLeft, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ReviewDetailPublicProps {
  review: {
    _id: string;
    title: string;
    slug: string;
    author: string;
    authorAvatar?: {
      asset: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
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
    content?: string;
    gallery?: Array<{
      asset: {
        _id: string;
        url: string;
      };
      alt?: string;
      caption?: string;
    }>;
    tags?: string[];
    faq?: Array<{
      question: string;
      answer: string;
    }>;
    venue: {
      _id: string;
      title: string;
      slug: string;
      description?: string;
      address: string;
      phone?: string;
      website?: string;
      geo?: {
        lat: number;
        lng: number;
      };
      priceRange?: string;
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
    };
  };
}

export default function ReviewDetailPublic({ review }: ReviewDetailPublicProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  const formatRating = (rating: number) => {
    return rating ? rating.toFixed(1) : '0.0';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    if (rating >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const averageRating = (
calculateOverallRating(review.ratings));

  const heroImage = review.gallery?.[selectedImageIndex] || review.venue.images?.[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href={`/${review.venue.city.slug}`} className="hover:text-gray-700">
          {review.venue.city.title}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${review.venue.city.slug}/${review.venue.slug}`} className="hover:text-gray-700">
          {review.venue.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{review.title}</span>
      </nav>

      {/* Botón volver */}
      <div className="mb-6">
        <Link href={`/${review.venue.city.slug}/${review.venue.slug}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al local
          </Button>
        </Link>
      </div>

      {/* Header de la reseña */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{review.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                {review.authorAvatar && (
                  <Image
                    src={review.authorAvatar.asset.url}
                    alt={review.authorAvatar.alt || review.author}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="font-medium">{review.author}</span>
              </div>
              {review.visitDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Visitado el {new Date(review.visitDate).toLocaleDateString('es-ES')}</span>
                </div>
              )}
              <span>•</span>
              <span>{new Date(review.publishedAt).toLocaleDateString('es-ES')}</span>
            </div>
            
            {/* Local info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    <Link 
                      href={`/${review.venue.city.slug}/${review.venue.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {review.venue.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{review.venue.address}</span>
                    {review.venue.priceRange && (
                      <>
                        <span>•</span>
                        <span>{review.venue.priceRange}</span>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {review.venue.categories.map((category) => (
                      <Badge key={category._id} variant="secondary" className="text-xs">
                        {category.title}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Link href={`/${review.venue.city.slug}/${review.venue.slug}`}>
                  <Button variant="outline" size="sm">
                    Ver local
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Rating principal */}
          <div className="text-right ml-8">
            <div className={`text-4xl font-bold ${getRatingColor(averageRating)} mb-2`}>
              {formatRating(averageRating)}
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(averageRating / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">
              Puntuación general
            </div>
          </div>
        </div>

        {/* TLDR */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <p className="text-lg text-blue-900 font-medium">{review.tldr}</p>
        </div>
      </div>

      {/* Imagen principal y galería */}
      {heroImage?.asset?.url && (
        <div className="mb-8">
          <div className="relative aspect-[16/10] mb-4 rounded-lg overflow-hidden">
            <Image
              src={heroImage.asset.url}
              alt={heroImage.alt || review.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Galería de imágenes */}
          {review.gallery && review.gallery.length > 1 && (
            <div className="grid grid-cols-6 gap-2">
              {review.gallery.slice(0, 6).map((image, index) => (
                <div
                  key={image.asset._id}
                  className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={image.asset.url}
                    alt={image.alt || `Imagen ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Puntuaciones detalladas */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Puntuaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getRatingColor(review.ratings.food)} mb-1`}>
                {formatRating(review.ratings.food)}
              </div>
              <div className="text-sm text-gray-600">Comida</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getRatingColor(review.ratings.service)} mb-1`}>
                {formatRating(review.ratings.service)}
              </div>
              <div className="text-sm text-gray-600">Servicio</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getRatingColor(review.ratings.ambience)} mb-1`}>
                {formatRating(review.ratings.ambience)}
              </div>
              <div className="text-sm text-gray-600">Ambiente</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getRatingColor(review.ratings.value)} mb-1`}>
                {formatRating(review.ratings.value)}
              </div>
              <div className="text-sm text-gray-600">Relación C/P</div>
            </div>
          </div>
          
          {review.avgTicket && (
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600">Ticket promedio</div>
              <div className="text-lg font-semibold">{review.avgTicket}€</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contenido de la reseña */}
      {review.content && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Reseña completa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">{cleanContent(review.content)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pros y Contras */}
      {(review.pros?.length || review.cons?.length) && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {review.pros && review.pros.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Lo que más me gustó</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {review.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {review.cons && review.cons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">Puntos de mejora</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {review.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">×</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Highlights */}
      {review.highlights && review.highlights.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Destacados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {review.highlights.map((highlight, index) => (
                <Badge key={index} variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                  <Star className="h-3 w-3 mr-1" />
                  {highlight}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Etiquetas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ */}
      {review.faq && review.faq.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Preguntas frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {review.faq.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <button
                    className="w-full text-left font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    {item.question}
                  </button>
                  {openFaqIndex === index && (
                    <div className="mt-2 text-gray-700">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información del local */}
      <Card>
        <CardHeader>
          <CardTitle>Información del local</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {review.venue.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <a href={`tel:${review.venue.phone}`} className="text-blue-600 hover:underline">
                {review.venue.phone}
              </a>
            </div>
          )}

          {review.venue.website && (
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-gray-500" />
              <a 
                href={review.venue.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                Sitio web
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {review.venue.geo && (
            <div>
              <Button variant="outline" className="w-full" asChild>
                <a
                  href={`https://maps.google.com/?q=${review.venue.geo.lat},${review.venue.geo.lng}`}
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
  );
}
