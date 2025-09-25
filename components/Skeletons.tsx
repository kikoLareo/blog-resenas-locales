'use client';

import React from 'react';
import { cn } from '@/components/ui/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Review Skeleton
export const ReviewCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("max-w-md overflow-hidden rounded-lg border bg-white shadow-sm", className)}>
      {/* Image skeleton */}
      <Skeleton className="aspect-video w-full" />
      
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Meta info skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Tags skeleton */}
        <div className="flex gap-1">
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Card Venue Skeleton
export const VenueCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("max-w-md overflow-hidden rounded-lg border bg-white shadow-sm", className)}>
      {/* Image skeleton */}
      <Skeleton className="aspect-video w-full" />
      
      <div className="p-4 space-y-3">
        {/* Name skeleton */}
        <Skeleton className="h-6 w-2/3" />
        
        {/* Cuisine skeleton */}
        <Skeleton className="h-4 w-1/2" />
        
        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-4" />
            ))}
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
        
        {/* Address skeleton */}
        <Skeleton className="h-4 w-4/5" />
        
        {/* Hours skeleton */}
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
};

// Hero Section Skeleton
export const HeroSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("relative", className)}>
      <Skeleton className="aspect-[16/9] w-full rounded-2xl lg:aspect-[21/9]" />
      
      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-4 px-6 text-center">
          <Skeleton className="mx-auto h-10 w-3/4 lg:h-12" />
          <Skeleton className="mx-auto h-6 w-1/2" />
          <Skeleton className="mx-auto h-10 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Post Header Skeleton
export const PostHeaderSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Cover image */}
      <Skeleton className="aspect-video w-full rounded-2xl" />
      
      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-6" />
            ))}
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-28" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-3/5" />
        </div>
      </div>
    </div>
  );
};

// Grid skeleton for multiple cards
export const CardGridSkeleton: React.FC<{ 
  count?: number; 
  type?: 'review' | 'venue';
  className?: string;
}> = ({ 
  count = 6, 
  type = 'review',
  className 
}) => {
  const SkeletonComponent = type === 'venue' ? VenueCardSkeleton : ReviewCardSkeleton;
  
  return (
    <div className={cn(
      "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      className
    )}>
      {[...Array(count)].map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};

// Text content skeleton
export const TextSkeleton: React.FC<{ 
  lines?: number;
  className?: string;
}> = ({ 
  lines = 3,
  className 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )} 
        />
      ))}
    </div>
  );
};

export { Skeleton };
export default Skeleton;