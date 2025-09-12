'use client';

import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
  readonly?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  className,
  showValue = false,
  readonly = true,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = rating >= i;
      const isHalfFilled = rating >= i - 0.5 && rating < i;
      
      stars.push(
        <span
          key={i}
          className="relative inline-block"
        >
          {isHalfFilled ? (
            <>
              <Star
                className={cn(
                  sizeClasses[size],
                  "text-gray-300 fill-gray-300"
                )}
              />
              <StarHalf
                className={cn(
                  sizeClasses[size],
                  "absolute inset-0 text-primary-500 fill-primary-500"
                )}
              />
            </>
          ) : (
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? "text-primary-500 fill-primary-500"
                  : "text-gray-300 fill-gray-300"
              )}
            />
          )}
        </span>
      );
    }
    
    return stars;
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {renderStars()}
      </div>
      {showValue && (
        <span className={cn(
          "ml-2 font-medium text-gray-700",
          textSizeClasses[size]
        )}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;