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
  const fallbackImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';
  const displayImage = image && image !== '' ? image : fallbackImage;

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
      "group overflow-hidden transition-all duration-300 hover:shadow-2xl dark:hover:shadow-primary/5 dark:bg-[#111111] dark:border-white/10",
      cardSizeClasses[size],
      className
    )}>
      <Link href={href} className="block">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-white/5">
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Status indicator */}
          {typeof isOpen !== 'undefined' && (
            <div className="absolute top-3 left-3">
              <div className={cn(
                "flex items-center gap-1 rounded-full backdrop-blur-sm px-2 py-1 text-xs font-bold shadow-sm",
                isOpen 
                  ? "bg-green-100/90 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                  : "bg-red-100/90 text-red-700 dark:bg-red-500/20 dark:text-red-400"
              )}>
                <div className={cn(
                  "h-2 w-2 rounded-full animate-pulse",
                  isOpen ? "bg-green-500" : "bg-red-500"
                )} />
                {isOpen ? 'Abierto' : 'Cerrado'}
              </div>
            </div>
          )}

          {/* Price level */}
          <div className="absolute top-3 right-3">
            <div className="rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2.5 py-1 text-sm font-bold shadow-sm dark:text-white dark:border dark:border-white/10">
              <span className={cn("tracking-wider", priceLevelColors[priceLevel as keyof typeof priceLevelColors] || "text-gray-600 dark:text-gray-300")}>
                {getPriceLevelDisplay(priceLevel)}
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Name and cuisine */}
          <div className="mb-3">
            <h3 className={cn(
              "font-serif text-gray-900 dark:text-white transition-colors group-hover:text-primary line-clamp-1",
              titleSizeClasses[size]
            )}>
              {name}
            </h3>
            {cuisine && (
              <p className="text-sm font-semibold text-primary/80 uppercase tracking-wide mt-1">
                {cuisine}
              </p>
            )}
          </div>

          {/* Location and rating */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="truncate max-w-[150px]">{neighborhood || address || ""}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
            <RatingStars rating={averageRating} size="sm" showValue />
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
              {reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default VenueCard;