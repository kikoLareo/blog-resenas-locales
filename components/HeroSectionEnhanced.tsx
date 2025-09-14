"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface HeroItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  rating?: number;
  location?: string;
  readTime?: string;
  tags?: string[];
  ctaText?: string;
  ctaUrl?: string;
  badge?: 'nuevo' | 'popular' | 'cercano' | 'destacado';
}

interface HeroSectionEnhancedProps {
  items: HeroItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

const badgeStyles = {
  nuevo: 'badge-new',
  popular: 'badge-popular',
  cercano: 'badge-nearby',
  destacado: 'badge-featured',
};

const badgeLabels = {
  nuevo: 'Nuevo',
  popular: 'Popular',
  cercano: 'Cerca de ti',
  destacado: 'Destacado',
};

export function HeroSectionEnhanced({
  items,
  autoPlay = true,
  autoPlayInterval = 8000,
  showDots = true,
  showArrows = true,
  className = "",
}: HeroSectionEnhancedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isHovered && items.length > 1) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, isHovered, autoPlayInterval, items.length]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`rating-star ${i < rating ? 'filled' : 'empty'}`}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  if (!items || items.length === 0) {
    return (
      <section className={`relative min-h-[70vh] flex items-center justify-center bg-gradient-warm ${className}`}>
        <div className="text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-gradient">
            Descubre los mejores sabores
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tu guía definitiva para la mejor gastronomía local
          </p>
        </div>
      </section>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <section
      className={`relative min-h-[80vh] lg:min-h-[90vh] overflow-hidden bg-gradient-to-br from-background via-background to-muted ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Hero carousel"
    >
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-110'
            }`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide h-full min-h-[80vh] lg:min-h-[90vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Text Content */}
          <div className="space-y-6 text-white">
            {/* Badge */}
            {currentItem.badge && (
              <div className="animate-fade-in-down">
                <span className={`badge ${badgeStyles[currentItem.badge]}`}>
                  {badgeLabels[currentItem.badge]}
                </span>
              </div>
            )}

            {/* Subtitle */}
            {currentItem.subtitle && (
              <p className="text-lg text-white/80 animate-fade-in-down stagger-1">
                {currentItem.subtitle}
              </p>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-tight animate-fade-in-up stagger-2">
              <span className="text-shadow-soft">
                {currentItem.title}
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl animate-fade-in-up stagger-3">
              {currentItem.description}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/80 animate-fade-in-up stagger-4">
              {currentItem.rating && (
                <div className="flex items-center gap-2">
                  <div className="rating-stars">
                    {renderStars(currentItem.rating)}
                  </div>
                  <span className="font-medium">{currentItem.rating}</span>
                </div>
              )}
              {currentItem.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{currentItem.location}</span>
                </div>
              )}
              {currentItem.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{currentItem.readTime}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {currentItem.tags && currentItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 animate-fade-in-up stagger-5">
                {currentItem.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Call-to-Action */}
            <div className="flex gap-4 pt-2 animate-fade-in-up stagger-6">
              <button className="btn-primary group">
                <span>{currentItem.ctaText || 'Explorar'}</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="btn-outline text-white border-white/30 hover:bg-white/10 hover:border-white/50">
                <Play className="w-4 h-4 mr-2" />
                Ver video
              </button>
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="hidden lg:block">
            <div className="space-y-4">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => goToSlide(index)}
                  className={`group flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 w-full text-left ${
                    index === currentIndex
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/10 border-white/10 text-white/70 hover:bg-white/15 hover:border-white/20 hover:text-white/90'
                  }`}
                  disabled={isAnimating}
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs opacity-80 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 text-white hover:bg-white/30 hover:border-white/20 transition-all duration-200 disabled:opacity-50 z-20 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 mx-auto group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 text-white hover:bg-white/30 hover:border-white/20 transition-all duration-200 disabled:opacity-50 z-20 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 mx-auto group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20 lg:hidden">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white border-white'
                  : 'bg-transparent border-white/50 hover:border-white hover:bg-white/20'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {autoPlay && !isHovered && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
          <div
            className="h-full bg-white transition-all duration-300 ease-linear"
            style={{
              width: `${((currentIndex + 1) / items.length) * 100}%`,
            }}
          />
        </div>
      )}
    </section>
  );
}