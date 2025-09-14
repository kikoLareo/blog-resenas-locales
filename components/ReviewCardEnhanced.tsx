"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Clock, Heart, Bookmark, Share2, ArrowRight } from 'lucide-react';

interface ReviewCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  location: string;
  readTime: string;
  tags: string[];
  href: string;
  badge?: 'nuevo' | 'popular' | 'cercano';
  authorName?: string;
  publishDate?: string;
  viewCount?: number;
  isFavorited?: boolean;
  isBookmarked?: boolean;
  className?: string;
  priority?: boolean;
}

const badgeStyles = {
  nuevo: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  popular: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  cercano: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

const badgeLabels = {
  nuevo: 'Nuevo',
  popular: 'Popular',
  cercano: 'Cerca de ti',
};

export function ReviewCardEnhanced({
  id,
  title,
  description,
  image,
  rating,
  location,
  readTime,
  tags,
  href,
  badge,
  authorName,
  publishDate,
  viewCount,
  isFavorited = false,
  isBookmarked = false,
  className = "",
  priority = false,
}: ReviewCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ));
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(!favorited);
    // Here you would typically call an API to update the favorite status
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
    // Here you would typically call an API to update the bookmark status
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: href,
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.origin + href);
    }
  };

  return (
    <Link href={href} className={`block group ${className}`}>
      <article className="review-card h-full animate-fade-in-up">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-xl">
          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3 z-10">
              <span className={`badge ${badgeStyles[badge]} shadow-sm`}>
                {badgeLabels[badge]}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleFavorite}
              className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'text-red-500 fill-current' : ''}`} />
            </button>
            <button
              onClick={handleBookmark}
              className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'text-blue-500 fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Image */}
          <div className="review-card-image aspect-video bg-muted">
            <Image
              src={image}
              alt={title}
              fill
              className={`review-card-image transition-all duration-700 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsImageLoaded(true)}
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {!isImageLoaded && (
              <div className="absolute inset-0 loading-skeleton" />
            )}
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Read More Button */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <div className="btn-primary btn-sm">
              <span className="sr-only">Leer más</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="review-card-content">
          {/* Rating and Meta */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="rating-stars flex">
                {renderStars(rating)}
              </div>
              <span className="text-sm font-medium text-foreground">
                {rating.toFixed(1)}
              </span>
            </div>
            {viewCount && (
              <span className="text-xs text-muted-foreground">
                {viewCount.toLocaleString()} views
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="review-card-title mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="review-card-description mb-4">
            {description}
          </p>

          {/* Location and Read Time */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Author and Date */}
          {(authorName || publishDate) && (
            <div className="review-card-meta pt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {authorName && (
                  <span>Por {authorName}</span>
                )}
                {publishDate && (
                  <span>{publishDate}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

// Grid container for review cards
interface ReviewGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function ReviewGrid({ 
  children, 
  columns = 3,
  className = ""
}: ReviewGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${gridClasses[columns]} ${className}`}>
      {children}
    </div>
  );
}

// Skeleton loader for review cards
export function ReviewCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-video bg-muted rounded-t-xl" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-muted rounded" />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded w-16" />
          <div className="h-6 bg-muted rounded w-20" />
          <div className="h-6 bg-muted rounded w-14" />
        </div>
      </div>
    </div>
  );
}