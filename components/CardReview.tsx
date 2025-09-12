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
      "group overflow-hidden transition-all duration-200 hover:shadow-lg",
      cardSizeClasses[size],
      className
    )}>
      <Link href={href} className="block">
        {/* Image */}
        <div className={cn(
          "relative overflow-hidden bg-gray-100",
          aspectRatioClasses[imageAspectRatio]
        )}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Rating overlay */}
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-1 text-sm font-medium shadow-sm">
              <RatingStars rating={rating} size="sm" showValue />
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className={cn(
            "font-serif text-gray-900 transition-colors group-hover:text-primary-600 line-clamp-2",
            titleSizeClasses[size]
          )}>
            {title}
          </h3>

          {/* Description */}
          {truncatedDescription && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {truncatedDescription}
            </p>
          )}

          {/* Meta info */}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
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