"use client";

import { ChevronLeft, ChevronRight, Star, MapPin, Clock, Users, TrendingUp } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Tipos para los diferentes elementos que pueden aparecer en el carrusel
export type FeaturedItemType = 'review' | 'venue' | 'category' | 'collection' | 'guide';

export type BaseFeaturedItem = {
  id: string;
  type: FeaturedItemType;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  customImage?: string; // Imagen personalizada por el admin
  href: string;
  ctaText?: string;
  customTitle?: string; // Título personalizado para el carrusel
  customDescription?: string; // Descripción personalizada
  isActive: boolean;
  order: number;
  seoKeywords?: string[];
  // SEO específico para el carrusel
  carouselSeo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export type ReviewFeaturedItem = BaseFeaturedItem & {
  type: 'review';
  rating: number;
  location: string;
  readTime: string;
  tags: string[];
  venue?: {
    name: string;
    slug: string;
  };
};

export type VenueFeaturedItem = BaseFeaturedItem & {
  type: 'venue';
  rating?: number;
  location: string;
  category: string;
  reviewCount: number;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  highlights?: string[];
};

export type CategoryFeaturedItem = BaseFeaturedItem & {
  type: 'category';
  reviewCount: number;
  venueCount: number;
  color?: string;
  icon?: string;
  trending?: boolean;
};

export type CollectionFeaturedItem = BaseFeaturedItem & {
  type: 'collection';
  itemCount: number;
  lastUpdated: string;
  theme: string;
};

export type GuideFeaturedItem = BaseFeaturedItem & {
  type: 'guide';
  readTime: string;
  stops: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

export type FeaturedItem = 
  | ReviewFeaturedItem 
  | VenueFeaturedItem 
  | CategoryFeaturedItem 
  | CollectionFeaturedItem 
  | GuideFeaturedItem;

type FeaturedCarouselProps = {
  items: FeaturedItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
};

export function FeaturedCarousel({ 
  items, 
  autoPlay = true, 
  autoPlayInterval = 7000,
  showDots = true,
  showArrows = true 
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Filtrar solo items activos y ordenarlos
  const activeItems = items.filter(item => item.isActive).sort((a, b) => a.order - b.order);

  const changeSlide = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex || activeItems.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 200);
    }, 200);
  }, [currentIndex, isTransitioning, activeItems.length]);

  useEffect(() => {
    if (!autoPlay || activeItems.length <= 1) return;
    
    const interval = setInterval(() => {
      if (!isTransitioning) {
        const newIndex = (currentIndex + 1) % activeItems.length;
        changeSlide(newIndex);
      }
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning, activeItems.length, changeSlide, autoPlay, autoPlayInterval]);

  const nextSlide = useCallback(() => {
    changeSlide((currentIndex + 1) % activeItems.length);
  }, [changeSlide, currentIndex, activeItems.length]);

  const prevSlide = useCallback(() => {
    changeSlide((currentIndex - 1 + activeItems.length) % activeItems.length);
  }, [changeSlide, currentIndex, activeItems.length]);

  const goToSlide = useCallback((index: number) => {
    changeSlide(index);
  }, [changeSlide]);

  if (activeItems.length === 0) {
    return null; // O un placeholder si no hay items
  }

  const currentItem = activeItems[currentIndex];
  const displayTitle = currentItem.customTitle || currentItem.title;
  const displayDescription = currentItem.customDescription || currentItem.description;
  const displayImage = currentItem.customImage || currentItem.image;

  // Función para renderizar las métricas específicas por tipo
  const renderItemMetrics = (item: FeaturedItem) => {
    const baseClasses = "bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2 text-sm transition-all duration-300 hover:bg-white/30";
    
    switch (item.type) {
      case 'review':
        return (
          <>
            <div className={baseClasses}>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{item.rating}</span>
            </div>
            <div className={baseClasses}>
              <MapPin className="h-4 w-4" />
              <span>{item.location}</span>
            </div>
            <div className={baseClasses}>
              <Clock className="h-4 w-4" />
              <span>{item.readTime}</span>
            </div>
          </>
        );
      
      case 'venue':
        return (
          <>
            {item.rating && (
              <div className={baseClasses}>
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{item.rating}</span>
              </div>
            )}
            <div className={baseClasses}>
              <MapPin className="h-4 w-4" />
              <span>{item.location}</span>
            </div>
            <div className={baseClasses}>
              <Users className="h-4 w-4" />
              <span>{item.reviewCount} reseñas</span>
            </div>
            {item.priceRange && (
              <div className={baseClasses}>
                <span className="font-medium">{item.priceRange}</span>
              </div>
            )}
          </>
        );
      
      case 'category':
        return (
          <>
            <div className={baseClasses}>
              <Users className="h-4 w-4" />
              <span>{item.reviewCount} reseñas</span>
            </div>
            <div className={baseClasses}>
              <MapPin className="h-4 w-4" />
              <span>{item.venueCount} locales</span>
            </div>
            {item.trending && (
              <div className={`${baseClasses} bg-red-500/30 text-red-100`}>
                <TrendingUp className="h-4 w-4" />
                <span>Trending</span>
              </div>
            )}
          </>
        );
      
      case 'collection':
        return (
          <>
            <div className={baseClasses}>
              <Users className="h-4 w-4" />
              <span>{item.itemCount} lugares</span>
            </div>
            <div className={baseClasses}>
              <Clock className="h-4 w-4" />
              <span>Actualizado {item.lastUpdated}</span>
            </div>
          </>
        );
      
      case 'guide':
        return (
          <>
            <div className={baseClasses}>
              <Clock className="h-4 w-4" />
              <span>{item.readTime}</span>
            </div>
            <div className={baseClasses}>
              <MapPin className="h-4 w-4" />
              <span>{item.stops} paradas</span>
            </div>
            <div className={baseClasses}>
              <span className="capitalize">{item.difficulty}</span>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  // Función para obtener el texto del CTA según el tipo
  const getCTAText = (item: FeaturedItem) => {
    if (item.ctaText) return item.ctaText;
    
    switch (item.type) {
      case 'review':
        return 'Leer reseña completa';
      case 'venue':
        return 'Ver local y reseñas';
      case 'category':
        return 'Explorar categoría';
      case 'collection':
        return 'Ver colección';
      case 'guide':
        return 'Seguir la guía';
      default:
        return 'Ver más';
    }
  };

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Fondo de imágenes */}
      <div className="absolute inset-0">
        {activeItems.map((item, index) => (
          <div 
            key={item.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback 
              src={displayImage} 
              alt={displayTitle} 
              fill
              priority={index === 0}
              sizes="100vw"
              quality={85}
              className="object-cover transition-transform duration-1000 scale-105" 
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40 transition-opacity duration-500" />
      </div>

      {/* Contenido */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className={`max-w-4xl text-white transition-all duration-600 ease-out transform ${
            isTransitioning ? 'opacity-0 translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100'
          }`}>
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4 font-medium transition-all duration-300">
              Destacado
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              {displayTitle}
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90 max-w-2xl">
              {displayDescription}
            </p>
            
            {/* Métricas específicas por tipo */}
            <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
              {renderItemMetrics(currentItem)}
            </div>
            
            <Link
              href={currentItem.href}
              className="inline-flex items-center justify-center bg-white text-black hover:bg-white/90 font-medium px-6 py-3 sm:px-8 sm:py-3 text-sm sm:text-base transition-all duration-300 hover:scale-105 transform rounded-md"
            >
              {getCTAText(currentItem)}
            </Link>
          </div>
        </div>
      </div>

      {/* Controles de navegación */}
      {showArrows && activeItems.length > 1 && (
        <>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100" 
            onClick={prevSlide} 
            disabled={isTransitioning}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100" 
            onClick={nextSlide} 
            disabled={isTransitioning}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Indicadores de puntos */}
      {showDots && activeItems.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {activeItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
