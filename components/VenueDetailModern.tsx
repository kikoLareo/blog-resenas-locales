'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Globe, Clock, Star, ExternalLink, Calendar, Users, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReviewCard } from '@/components/CardReview';
import { RatingStars } from '@/components/RatingStars';
import { ShareButtons } from '@/components/ShareButtons';
import { Carousel } from '@/components/Carousel';
import { cn } from '@/components/ui/utils';

interface VenueDetailModernProps {
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
    reviews?: Array<{
      _id: string;
      title: string;
      slug: string;
      author: string;
      authorAvatar?: {
        asset: {
          _id: string;
          url: string;
        };
      };
      publishedAt: string;
      ratings: {
        food: number;
        service: number;
        ambience: number;
        value: number;
        overall: number;
      };
      tldr: string;
      gallery?: Array<{
        asset: {
          _id: string;
          url: string;
        };
      }>;
      tags?: string[];
    }>;
    avgRating?: number;
    reviewCount?: number;
  };
}

export const VenueDetailModern: React.FC<VenueDetailModernProps> = ({ venue }) => {
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `/${venue.city.slug}/${venue.slug}`;

  const averageRating = venue.avgRating || 
    (venue.reviews?.length ? 
      venue.reviews.reduce((acc, review) => acc + (
        (review.ratings.food + review.ratings.service + review.ratings.ambience + review.ratings.value) / 4
      ), 0) / venue.reviews.length : 0);

  const reviewCount = venue.reviewCount || venue.reviews?.length || 0;

  const heroImage = venue.images?.[0]?.asset.url || '';

  const getPriceLevelDisplay = (priceRange?: string) => {
    if (!priceRange) return null;
    const level = priceRange.length;
    return {
      display: priceRange,
      description: level === 1 ? 'Económico' : 
                   level === 2 ? 'Moderado' : 
                   level === 3 ? 'Caro' : 'Muy caro'
    };
  };

  const priceInfo = getPriceLevelDisplay(venue.priceRange);

  const mapUrl = venue.geo 
    ? `https://maps.google.com/?q=${venue.geo.lat},${venue.geo.lng}`
    : `https://maps.google.com/?q=${encodeURIComponent(venue.address)}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Inicio
            </Link>
          </li>
          <li>
            <span className="mx-2 text-gray-300">/</span>
            <Link 
              href={`/${venue.city.slug}`} 
              className="hover:text-gray-700 transition-colors"
            >
              {venue.city.title}
            </Link>
          </li>
          <li>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-900" aria-current="page">
              {venue.title}
            </span>
          </li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        {/* Gallery */}
        {venue.images && venue.images.length > 0 && (
          <div className="mb-6">
            {venue.images.length === 1 ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                <Image
                  src={venue.images[0].asset.url}
                  alt={venue.images[0].alt || venue.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {venue.images.slice(0, 6).map((image, index) => (
                  <div
                    key={image.asset._id}
                    className={cn(
                      "relative overflow-hidden rounded-xl cursor-pointer group",
                      index === 0 ? "md:col-span-2 md:row-span-2 aspect-video" : "aspect-video"
                    )}
                  >
                    <Image
                      src={image.asset.url}
                      alt={image.alt || `${venue.title} - Foto ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                      priority={index === 0}
                    />
                  </div>
                ))}
                {venue.images.length > 6 && (
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      +{venue.images.length - 6} más
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Venue Header */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {venue.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-3">
                {averageRating > 0 && (
                  <div className="flex items-center gap-2">
                    <RatingStars rating={averageRating / 2} size="md" showValue />
                    <span className="text-gray-600">
                      ({reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'})
                    </span>
                  </div>
                )}
                {priceInfo && (
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-primary-600">{priceInfo.display}</span>
                    <span className="text-gray-500">• {priceInfo.description}</span>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{venue.address}</span>
              </div>

              {venue.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {venue.categories.map((category) => (
                    <Badge key={category._id} variant="secondary">
                      {category.title}
                    </Badge>
                  ))}
                </div>
              )}

              {venue.description && (
                <p className="text-gray-700 leading-relaxed">{venue.description}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <ShareButtons
                url={currentUrl}
                title={venue.title}
                description={venue.description}
                variant="horizontal"
                size="md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Reviews Section */}
          {venue.reviews && venue.reviews.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-semibold text-gray-900">
                  Reseñas ({venue.reviews.length})
                </h2>
              </div>

              <div className="space-y-6">
                {venue.reviews.slice(0, 3).map((review) => {
                  const reviewAvgRating = (
                    review.ratings.food + 
                    review.ratings.service + 
                    review.ratings.ambience + 
                    review.ratings.value
                  ) / 4;

                  return (
                    <ReviewCard
                      key={review._id}
                      id={review._id}
                      title={review.title}
                      image={review.gallery?.[0]?.asset.url || heroImage}
                      rating={reviewAvgRating / 2}
                      location={venue.city.title}
                      readTime="5 min"
                      tags={review.tags || []}
                      description={review.tldr}
                      href={`/${venue.city.slug}/${venue.slug}/review/${review.slug}`}
                      size="lg"
                      className="w-full"
                    />
                  );
                })}

                {venue.reviews.length > 3 && (
                  <div className="text-center">
                    <Button variant="outline">
                      Ver todas las reseñas ({venue.reviews.length})
                    </Button>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Información de contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-900">{venue.address}</p>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1 mt-1"
                  >
                    <Navigation className="h-3 w-3" />
                    Cómo llegar
                  </a>
                </div>
              </div>

              {venue.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <a 
                    href={`tel:${venue.phone}`}
                    className="text-gray-900 hover:text-primary-600"
                  >
                    {venue.phone}
                  </a>
                </div>
              )}

              {venue.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <a
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 hover:text-primary-600 truncate"
                  >
                    {venue.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              {venue.openingHours && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                  <p className="text-gray-900">{venue.openingHours}</p>
                </div>
              )}

              {/* Social Media */}
              {venue.social && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Redes sociales:</p>
                  <div className="flex gap-2">
                    {venue.social.instagram && (
                      <a
                        href={venue.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <span className="sr-only">Instagram</span>
                        📷
                      </a>
                    )}
                    {venue.social.facebook && (
                      <a
                        href={venue.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <span className="sr-only">Facebook</span>
                        📘
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailModern;