"use client";

import { Clock, MapPin, Euro, Star, AlertTriangle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';

interface OfferCardProps {
  offer: {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt: string;
    offerType: 'menu-dia' | 'brunch' | 'degustacion' | 'happy-hour' | 'descuento' | 'promocion';
    city: {
      title: string;
      slug: { current: string };
    };
    neighborhood?: string;
    priceRange: {
      min: number;
      max: number;
      currency: string;
    };
    heroImage: {
      asset: { url: string };
      alt: string;
    };
    venuesWithOffers: Array<{
      venue: {
        title: string;
      };
      price: number;
      highlight: boolean;
    }>;
    validFrom: string;
    validUntil: string;
    featured: boolean;
    publishedAt: string;
  };
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function OfferCard({ offer, variant = 'default', className = "" }: OfferCardProps) {
  const typeConfig = {
    'menu-dia': { label: 'Menú del día', icon: '🍽️', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    'brunch': { label: 'Brunch', icon: '🥐', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    'degustacion': { label: 'Degustación', icon: '👨‍🍳', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    'happy-hour': { label: 'Happy Hour', icon: '🍻', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    'descuento': { label: 'Descuento', icon: '💸', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    'promocion': { label: 'Promoción', icon: '🎯', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  };

  const config = typeConfig[offer.offerType];
  const isExpiringSoon = new Date(offer.validUntil) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const isExpired = new Date(offer.validUntil) < new Date();
  const daysLeft = Math.ceil((new Date(offer.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  if (variant === 'compact') {
    return (
      <Link href={`/ofertas/${offer.slug.current}`} className={`block ${className}`}>
        <article className={`flex gap-4 p-4 bg-card border rounded-xl hover:shadow-md transition-all ${isExpired ? 'opacity-60' : ''}`}>
          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <OptimizedImage
              src={offer.heroImage.asset.url}
              alt={offer.heroImage.alt}
              fill
              className="object-cover"
            />
            {isExpiringSoon && !isExpired && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {config.label}
              </span>
              {isExpiringSoon && !isExpired && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  {daysLeft}d
                </span>
              )}
            </div>
            
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">
              {offer.title}
            </h3>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Euro className="h-3 w-3" />
                <span>{offer.priceRange.min}-{offer.priceRange.max}€</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{offer.city.title}</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {offer.venuesWithOffers.length} locales disponibles
            </p>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/ofertas/${offer.slug.current}`} className={`block ${className}`}>
        <article className={`bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-all ${isExpired ? 'opacity-60' : ''}`}>
          <div className="relative aspect-[16/9]">
            <OptimizedImage
              src={offer.heroImage.asset.url}
              alt={offer.heroImage.alt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color} bg-opacity-90 backdrop-blur-sm`}>
                {config.icon} {config.label}
              </span>
              {offer.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white bg-opacity-90 backdrop-blur-sm">
                  ⭐ Destacada
                </span>
              )}
            </div>
            
            {/* Price Badge */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                  <Euro className="h-5 w-5" />
                  <span>{offer.priceRange.min}-{offer.priceRange.max}</span>
                </div>
              </div>
            </div>
            
            {/* Expiry Warning */}
            {isExpiringSoon && !isExpired && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500 text-white bg-opacity-90 backdrop-blur-sm">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {daysLeft} días
                </span>
              </div>
            )}
            
            {isExpired && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full">
                  Oferta Expirada
                </span>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{offer.city.title}</span>
                {offer.neighborhood && <span>• {offer.neighborhood}</span>}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Hasta {new Date(offer.validUntil).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
            
            <h2 className="text-xl font-serif font-bold mb-3 line-clamp-2">
              {offer.title}
            </h2>
            
            <p className="text-muted-foreground line-clamp-3 mb-4">
              {offer.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{offer.venuesWithOffers.length} locales</span>
                {offer.venuesWithOffers.filter(v => v.highlight).length > 0 && (
                  <span className="ml-2">• {offer.venuesWithOffers.filter(v => v.highlight).length} destacados</span>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-sm font-medium text-saffron-600">
                <Star className="h-4 w-4" />
                <span>Ver ofertas</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/ofertas/${offer.slug.current}`} className={`block ${className}`}>
      <article className={`bg-card border rounded-2xl overflow-hidden hover:shadow-md transition-all ${isExpired ? 'opacity-60' : ''}`}>
        <div className="relative aspect-[4/3]">
          <OptimizedImage
            src={offer.heroImage.asset.url}
            alt={offer.heroImage.alt}
            fill
            className="object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} bg-opacity-90 backdrop-blur-sm`}>
              {config.icon} {config.label}
            </span>
          </div>
          
          {/* Price */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
              <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                <Euro className="h-3 w-3" />
                <span>{offer.priceRange.min}-{offer.priceRange.max}</span>
              </div>
            </div>
          </div>
          
          {/* Expiry Warning */}
          {isExpiringSoon && !isExpired && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500 text-white bg-opacity-90 backdrop-blur-sm">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {daysLeft}d
              </span>
            </div>
          )}
          
          {isExpired && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                Expirada
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{offer.city.title}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Hasta {new Date(offer.validUntil).toLocaleDateString('es-ES')}</span>
            </div>
          </div>
          
          <h3 className="font-semibold line-clamp-2 mb-2">
            {offer.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {offer.excerpt}
          </p>
          
          <div className="text-xs text-muted-foreground">
            {offer.venuesWithOffers.length} locales disponibles
          </div>
        </div>
      </article>
    </Link>
  );
}
