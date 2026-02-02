'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { RatingStars } from '@/components/RatingStars';
import { ShareButtons } from '@/components/ShareButtons';
import { cn } from '@/components/ui/utils';

interface PostHeaderProps {
  title: string;
  coverImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readTime: string;
  location?: string;
  rating?: number;
  url: string;
  description?: string;
  className?: string;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  title,
  coverImage,
  author,
  publishedAt,
  readTime,
  location,
  rating,
  url,
  description,
  className,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <header className={cn("space-y-6", className)}>
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Share buttons overlay */}
        <div className="absolute top-4 right-4">
          <ShareButtons
            url={url}
            title={title}
            description={description}
            variant="dropdown"
            size="md"
          />
        </div>
      </div>

      {/* Title and metadata */}
      <div className="space-y-4">
        {/* Title */}
        <h1 className="font-serif text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {/* Rating (if provided) */}
        {rating !== undefined && (
          <div className="flex items-center gap-2">
            <RatingStars rating={rating} size="lg" showValue />
            <span className="text-lg font-medium text-gray-700">
              Calificación general
            </span>
          </div>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          {/* Author */}
          <div className="flex items-center gap-2">
            {author.avatar && (
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
            )}
            <div className="flex items-center gap-1">
              {!author.avatar && <User className="h-4 w-4" />}
              <span className="font-medium">{author.name}</span>
            </div>
          </div>

          {/* Separator */}
          <span className="text-gray-300">•</span>

          {/* Published date */}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span suppressHydrationWarning>{formatDate(publishedAt)}</span>
          </div>

          {/* Separator */}
          <span className="text-gray-300">•</span>

          {/* Read time */}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readTime}</span>
          </div>

          {/* Location (if provided) */}
          {location && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            </>
          )}
        </div>

        {/* Description (if provided) */}
        {description && (
          <p className="text-lg leading-relaxed text-gray-700 sm:text-xl">
            {description}
          </p>
        )}
      </div>
    </header>
  );
};

export default PostHeader;