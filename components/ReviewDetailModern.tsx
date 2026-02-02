'use client';

import { calculateOverallRating } from '@/lib/rating';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Globe, Clock, ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { PostHeader } from '@/components/PostHeader';
import { RatingStars } from '@/components/RatingStars';
import { ShareButtons } from '@/components/ShareButtons';
import { SuggestionsRail } from '@/components/SuggestionsRail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { getVenueUrl, getReviewUrl, cleanContent } from '@/lib/utils';
import { PortableText } from '@portabletext/react';

interface ReviewDetailModernProps {
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
      food?: number;
      service?: number;
      ambience?: number;
      value?: number;
      valueForMoney?: number;
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
  relatedReviews?: any[];
}

export const ReviewDetailModern: React.FC<ReviewDetailModernProps> = ({
  review,
  relatedReviews = [],
}) => {
  // Use overall rating if available, otherwise calculate average
  const averageRating = review.ratings?.overall || calculateOverallRating(review.ratings || {} as any);

  const fallbackVenueImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'
  const heroImage = review.gallery?.[0]?.asset?.url || review.venue.images?.[0]?.asset?.url || fallbackVenueImage;
  
  const [currentUrl, setCurrentUrl] = React.useState('');

  React.useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // Use the canonical URL as fallback during SSR to avoid hydration mismatch
  const citySlug = review.venue.city?.slug || 'ciudad';
  const displayUrl = currentUrl || getReviewUrl(citySlug, review.venue.slug, review.slug);

  const calculateReadTime = (content: any) => {
    const text = cleanContent(content);
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  };

  const readTime = review.content ? calculateReadTime(review.content) : '5 min';

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 bg-white dark:bg-gray-950">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              Inicio
            </Link>
          </li>
          {review.venue.city && (
            <li>
              <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
              <Link 
                href={`/${review.venue.city.slug}`} 
                className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {review.venue.city.title}
              </Link>
            </li>
          )}
          <li>
            <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
            <Link 
              href={getVenueUrl(review.venue.city?.slug || '', review.venue.slug)} 
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {review.venue.title}
            </Link>
          </li>
          <li>
            <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-gray-100" aria-current="page">
              {review.title}
            </span>
          </li>
        </ol>
      </nav>

      {/* Back button */}
      <div className="mb-8">
        <Link href={getVenueUrl(review.venue.city?.slug || '', review.venue.slug)}>
          <Button variant="outline" size="sm" className="group dark:border-gray-700 dark:text-gray-200">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Volver al local
          </Button>
        </Link>
      </div>

      {/* Post Header */}
      <PostHeader
        title={review.title}
        coverImage={heroImage}
        author={{
          name: review.author,
          avatar: review.authorAvatar?.asset?.url,
        }}
        publishedAt={review.publishedAt}
        readTime={readTime}
        location={`${review.venue.title}${review.venue.city ? `, ${review.venue.city.title}` : ''}`}
        rating={averageRating}
        url={displayUrl}
        description={review.tldr}
        className="mb-12"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* TLDR Summary */}
          <Card className="border-l-4 border-l-primary-500 bg-primary-50/50 dark:bg-primary-950/20 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary-800 dark:text-primary-400">
                Resumen rápido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.tldr}</p>
            </CardContent>
          </Card>

          {/* Detailed ratings */}
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Calificaciones detalladas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium dark:text-gray-300">Comida</span>
                  <RatingStars rating={(review.ratings?.food || 0) / 2} size="sm" showValue={false} />
                  <span className="ml-2 font-semibold text-primary dark:text-primary-400">
                    {(review.ratings?.food || 0).toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium dark:text-gray-300">Servicio</span>
                  <RatingStars rating={(review.ratings?.service || 0) / 2} size="sm" showValue={false} />
                  <span className="ml-2 font-semibold text-primary dark:text-primary-400">
                    {(review.ratings?.service || 0).toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium dark:text-gray-300">Ambiente</span>
                  <RatingStars rating={(review.ratings?.ambience || 0) / 2} size="sm" showValue={false} />
                  <span className="ml-2 font-semibold text-primary dark:text-primary-400">
                    {(review.ratings?.ambience || 0).toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium dark:text-gray-300">Precio</span>
                  <RatingStars rating={(review.ratings?.value || review.ratings?.valueForMoney || 0) / 2} size="sm" showValue={false} />
                  <span className="ml-2 font-semibold text-primary dark:text-primary-400">
                    {(review.ratings?.value || review.ratings?.valueForMoney || 0).toFixed(1)}
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Calificación general</span>
                  <div className="flex items-center gap-3">
                    <RatingStars rating={averageRating / 2} size="md" showValue={false} />
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          {review.highlights && review.highlights.length > 0 && (
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Platos recomendados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {review.highlights.map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pros and Cons */}
          {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {review.pros && review.pros.length > 0 && (
                <Card className="border-green-200 dark:border-green-900/50 dark:bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-green-800 dark:text-green-400">Lo que nos gustó</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {review.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 font-bold">+</span>
                          <span className="text-gray-700 dark:text-gray-300">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {review.cons && review.cons.length > 0 && (
                <Card className="border-red-200 dark:border-red-900/50 dark:bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-red-800 dark:text-red-400">A mejorar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {review.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-600 dark:text-red-400 font-bold">-</span>
                          <span className="text-gray-700 dark:text-gray-300">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Review Content */}
          {review.content && (
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Reseña completa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {typeof review.content === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: review.content }} />
                  ) : (
                    <PortableText value={review.content as any} />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gallery */}
          {review.gallery && review.gallery.length > 1 && (
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Galería de fotos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {review.gallery.slice(1).map((image, index) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5">
                      {image?.asset?.url && (
                        <Image
                          src={image.asset.url}
                          alt={image.alt || `Foto ${index + 1} de ${review.venue.title}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform cursor-pointer"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {review.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="dark:border-gray-700 dark:text-gray-400">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Venue Info Card */}
          <Card className="sticky top-8 dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between dark:text-white">
                <span>Información del local</span>
                {review.venue.website && (
                  <a
                    href={review.venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Link 
                  href={getVenueUrl(review.venue.city.slug, review.venue.slug)}
                  className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {review.venue.title}
                </Link>
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mt-1">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{review.venue.address}</span>
                </div>
              </div>

              {review.venue.phone && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${review.venue.phone}`} className="hover:text-gray-900 dark:hover:text-gray-200 text-sm">
                    {review.venue.phone}
                  </a>
                </div>
              )}

              {review.venue.website && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={review.venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 dark:hover:text-gray-200 text-sm truncate"
                  >
                    {review.venue.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              {review.avgTicket && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-400">Ticket promedio: </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-200">{review.avgTicket}€</span>
                </div>
              )}

              {review.venue.categories.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Categorías:</p>
                  <div className="flex flex-wrap gap-1">
                    {review.venue.categories.map((category) => (
                      <Badge key={category._id} variant="secondary" className="text-xs dark:bg-gray-800 dark:text-gray-300">
                        {category.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t dark:border-gray-800">
                <ShareButtons
                  url={currentUrl}
                  title={review.title}
                  description={review.tldr}
                  variant="horizontal"
                  size="sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related reviews */}
      {relatedReviews.length > 0 && (
        <div className="mt-16">
          <SuggestionsRail
            title="Reseñas relacionadas"
            items={relatedReviews}
            showArrows
            autoPlay={false}
          />
        </div>
      )}
    </article>
  );
};

export default ReviewDetailModern;