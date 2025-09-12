'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  itemsPerView?: number | { sm: number; md: number; lg: number; xl: number };
  gap?: number;
  infinite?: boolean;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  className,
  autoPlay = false,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = false,
  itemsPerView = 1,
  gap = 16,
  infinite = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Get current items per view based on responsive settings
  const getCurrentItemsPerView = () => {
    if (typeof itemsPerView === 'number') {
      return itemsPerView;
    }

    if (typeof window === 'undefined') {
      return itemsPerView.md;
    }

    const width = window.innerWidth;
    if (width >= 1280) return itemsPerView.xl;
    if (width >= 1024) return itemsPerView.lg;
    if (width >= 768) return itemsPerView.md;
    return itemsPerView.sm;
  };

  const [currentItemsPerView, setCurrentItemsPerView] = useState(getCurrentItemsPerView());

  useEffect(() => {
    const handleResize = () => {
      setCurrentItemsPerView(getCurrentItemsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  const totalItems = children.length;
  const maxIndex = Math.max(0, totalItems - currentItemsPerView);

  const startAutoPlay = () => {
    if (autoPlay && !isHovered && totalItems > currentItemsPerView) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (infinite) {
            return prevIndex >= maxIndex ? 0 : prevIndex + 1;
          }
          return Math.min(prevIndex + 1, maxIndex);
        });
      }, autoPlayInterval);
    }
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [autoPlay, autoPlayInterval, isHovered, maxIndex, infinite]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      if (infinite && prevIndex === 0) {
        return maxIndex;
      }
      return Math.max(prevIndex - 1, 0);
    });
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      if (infinite && prevIndex >= maxIndex) {
        return 0;
      }
      return Math.min(prevIndex + 1, maxIndex);
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  // Handle touch/swipe events
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrevious();
    }
  };

  const itemWidth = `calc((100% - ${gap * (currentItemsPerView - 1)}px) / ${currentItemsPerView})`;
  const translateX = `calc(-${currentIndex} * (100% + ${gap}px))`;

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main carousel container */}
      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(${translateX})`,
            gap: `${gap}px`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: itemWidth }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Arrow controls */}
      {showArrows && totalItems > currentItemsPerView && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Anterior"
            disabled={!infinite && currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Siguiente"
            disabled={!infinite && currentIndex >= maxIndex}
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {showDots && totalItems > currentItemsPerView && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                index === currentIndex
                  ? "bg-primary-500"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;