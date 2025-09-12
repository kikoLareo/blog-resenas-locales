'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, DollarSign, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RatingStars } from '@/components/RatingStars';
import { cn } from '@/components/ui/utils';

interface VenueCardProps {
  id: string;
  name: string;
  image: string;
  averageRating: number;
  reviewCount: number;
  address: string;
  neighborhood?: string;
  priceLevel: number; // 1-4 scale
  cuisine?: string;
  href: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isOpen?: boolean;
  openingHours?: string;
}

export const VenueCard: React.FC<VenueCardProps> = ({
  id,
  name,
  image,
  averageRating,
  reviewCount,
  address,
  neighborhood,
  priceLevel,
  cuisine,
  href,
  className,
  size = 'md',
  isOpen,
  openingHours,
}) => {
  const cardSizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const titleSizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-semibold', 
    lg: 'text-2xl font-semibold',
  };

  const getPriceLevelDisplay = (level: number) => {
    return '$'.repeat(Math.max(1, Math.min(4, level))) + 
           '$'.repeat(Math.max(0, 4 - level)).split('').map(() => '$').join('').replace(/\$/g, '$');
  };

  const priceLevelColors = {
    1: 'text-green-600',
    2: 'text-yellow-600',
    3: 'text-orange-600',
    4: 'text-red-600',
  };

  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-200 hover:shadow-lg",
      cardSizeClasses[size],
      className
    )}>
      <Link href={href} className="block">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Status indicator */}
          {typeof isOpen !== 'undefined' && (
            <div className="absolute top-3 left-3">
              <div className={cn(
                "flex items-center gap-1 rounded-full backdrop-blur-sm px-2 py-1 text-xs font-medium shadow-sm",
                isOpen 
                  ? "bg-green-100/90 text-green-700"
                  : "bg-red-100/90 text-red-700"
              )}>
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  isOpen ? "bg-green-500" : "bg-red-500"
                )} />
                {isOpen ? 'Abierto' : 'Cerrado'}
              </div>
            </div>
          )}

          {/* Price level */}
          <div className="absolute top-3 right-3">
            <div className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-1 text-sm font-bold shadow-sm">
              <span className={priceLevelColors[priceLevel as keyof typeof priceLevelColors]}>
                {getPriceLevelDisplay(priceLevel)}
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Name and cuisine */}
          <div className="mb-2">
            <h3 className={cn(
              "font-serif text-gray-900 transition-colors group-hover:text-primary-600 line-clamp-1",
              titleSizeClasses[size]
            )}>
              {name}
            </h3>
            {cuisine && (
              <p className="text-sm text-gray-600">{cuisine}</p>
            )}
          </div>

          {/* Rating */}
          <div className="mb-3 flex items-center gap-2">
            <RatingStars rating={averageRating} size="sm" showValue />
            <span className="text-sm text-gray-500">
              ({reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>

          {/* Location */}
          <div className="mb-2 flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div>
              <div>{neighborhood || address}</div>
              {neighborhood && address && (
                <div className="text-xs text-gray-500">{address}</div>
              )}
            </div>
          </div>

          {/* Opening hours */}
          {openingHours && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{openingHours}</span>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};

export default VenueCard;