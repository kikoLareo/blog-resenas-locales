'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RatingStars } from '@/components/RatingStars';
import { cn } from '@/components/ui/utils';

interface ReviewCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  location: string;
  readTime: string;
  tags: string[];
  description?: string;
  href: string;
  className?: string;
  imageAspectRatio?: 'square' | 'video' | 'wide';
  size?: 'sm' | 'md' | 'lg';
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  title,
  image,
  rating,
  location,
  readTime,
  tags,
  description,
  href,
  className,
  imageAspectRatio = 'video',
  size = 'md',
}) => {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/9]',
  };

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

  const truncatedDescription = description 
    ? description.length > 120 
      ? description.slice(0, 120) + '...' 
      : description
    : '';

  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-300 hover:shadow-2xl dark:hover:shadow-primary/5 dark:bg-[#111111] dark:border-white/10",
      cardSizeClasses[size],
      className
    )}>
      <Link href={href} className="block">
        {/* Image */}
        <div className={cn(
          "relative overflow-hidden bg-gray-100 dark:bg-white/5",
          aspectRatioClasses[imageAspectRatio]
        )}>
          <Image
            src={image || '/placeholder-venue.jpg'}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Rating overlay */}
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2.5 py-1 text-sm font-bold shadow-sm dark:text-white dark:border dark:border-white/10">
              <RatingStars rating={rating} size="sm" showValue />
            </div>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Title */}
          <h3 className={cn(
            "font-serif text-gray-900 dark:text-white transition-colors group-hover:text-primary line-clamp-2",
            titleSizeClasses[size]
          )}>
            {title}
          </h3>

          {/* Description */}
          {truncatedDescription && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {truncatedDescription}
            </p>
          )}

          {/* Meta info */}
          <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="truncate max-w-[100px]">{location}</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};

export default ReviewCard;