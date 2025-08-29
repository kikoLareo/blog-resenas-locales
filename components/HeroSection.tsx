"use client";

import { ChevronLeft, ChevronRight, Star, MapPin, Clock, Users, TrendingUp } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";    
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import Link from "next/link";

// Tipos para FeaturedItem (simplificados para este componente)
type FeaturedItem = {
  id: string;
  type: 'review' | 'venue' | 'category' | 'collection' | 'guide';
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  customImage?: string;
  href: string;
  ctaText?: string;
  customTitle?: string;
  customDescription?: string;
  isActive: boolean;
  order: number;
  seoKeywords?: string[];
  rating?: number;
  location?: string;
  readTime?: string;
  tags?: string[];
  reviewCount?: number;
  venueCount?: number;
  trending?: boolean;
  category?: string;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  highlights?: string[];
  itemCount?: number;
  lastUpdated?: string;
  theme?: string;
  stops?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
};

// Definiciones CSS para animaciones personalizadas
import './hero-swipe-animations.css';

// Datos de fallback para cuando no hay FeaturedItems
const fallbackHeroReviews = [
  {
    id: "fallback-1",
    title: "El mejor marisco de A Coruña",
    subtitle: "Una experiencia gastronómica única en el corazón de la ciudad",
    image: "https://images.unsplash.com/photo-1559847844-d678f809758b?w=1920&h=1080&fit=crop",
    rating: 4.8,
    location: "Centro, A Coruña",
    readTime: "5 min",
    tags: ["Marisco", "Tradicional", "Familiar"],
    description: "Una experiencia gastronómica única en el corazón de A Coruña. Mariscos frescos y un ambiente acogedor.",
    ctaText: "Ver reseña completa",
    seoKeywords: "mejor marisco A Coruña, restaurante marisco tradicional",
    href: "/blog/mejor-marisco-coruna", // Añadir href
    content: {
      summary: "Después de múltiples visitas, puedo confirmar que este lugar representa lo mejor del marisco gallego.",
      highlights: [
        "Marisco fresco traído diariamente de las rías gallegas",
        "Ambiente familiar con tradición de tres generaciones",
        "Precio justo para la calidad ofrecida",
        "Ubicación privilegiada en el centro histórico"
      ],
      atmosphere: "Un ambiente acogedor que te transporta a las mejores tradiciones gallegas.",
      recommendation: "Ideal para cenas familiares o para impresionar a visitantes. Reserva especialmente en fin de semana."
    }
  }
];

// Función para convertir FeaturedItem a formato HeroReview
function adaptFeaturedItemToHeroReview(item: FeaturedItem): HeroReview {
  return {
    id: item.id,
    title: item.customTitle || item.title,
    subtitle: item.subtitle,
    image: item.customImage || item.image,
    rating: ('rating' in item && typeof item.rating === 'number') ? item.rating : 4.5,
    location: ('location' in item && item.location) ? item.location : 'A Coruña',
    readTime: ('readTime' in item && item.readTime) ? item.readTime : '5 min',
    tags: ('tags' in item && item.tags) ? item.tags : [],
    description: item.customDescription || item.description,
    ctaText: item.ctaText,
    seoKeywords: item.seoKeywords?.join(', '),
    href: item.href, // Conservar el href del FeaturedItem
    content: {
      summary: item.description,
      highlights: [],
      atmosphere: "Un lugar destacado en nuestra selección.",
      recommendation: "Recomendado por nuestro equipo editorial."
    }
  };
}

interface HeroReview {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  rating: number;
  location: string;
  readTime: string;
  tags: string[];
  description: string;
  ctaText?: string;
  seoKeywords?: string;
  href?: string; // Añadir href para enlace
  content: {
    summary: string;
    highlights: string[];
    atmosphere: string;
    recommendation: string;
  }
}

interface HeroSectionProps {
  onReviewClick?: (reviewId: string) => void;
  featuredItems?: FeaturedItem[];
  fallbackItems?: FeaturedItem[];
}

export function HeroSection({ onReviewClick, featuredItems, fallbackItems }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedTextIndex, setDisplayedTextIndex] = useState(0); // Índice separado para el texto
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailsRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  
  // Procesar los featured items o usar fallback
  const processedItems = featuredItems && featuredItems.length > 0 
    ? featuredItems.map(adaptFeaturedItemToHeroReview)
    : fallbackItems && fallbackItems.length > 0
    ? fallbackItems.map(adaptFeaturedItemToHeroReview)
    : fallbackHeroReviews;
  
  const displayReviews = processedItems;

  const changeSlide = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return;
    
    setIsTransitioning(true);
    
    // Primero hacemos una transición a opacidad 0 del texto actual
    setTimeout(() => {
      // Una vez que el texto está invisible, actualizamos la imagen y el índice
      setCurrentIndex(newIndex);
      setDisplayedTextIndex(newIndex);
      
      // Esperamos un poco para que el DOM se actualice
      setTimeout(() => {
        // Finalmente terminamos la transición
        setIsTransitioning(false);
        
        // Asegurarnos de centrar la miniatura después de que la transición ha terminado
        centerThumbnail(newIndex);
      }, 150);
    }, 300);
    
    // Centramos inmediatamente también para mejor respuesta
    centerThumbnail(newIndex);
  }, [currentIndex, isTransitioning]);
  
  // Función separada para centrar la miniatura por índice
  const centerThumbnail = useCallback((index: number) => {
    // Centra automáticamente la miniatura seleccionada
    if (thumbnailsContainerRef.current && thumbnailsRefs.current[index]) {
      const container = thumbnailsContainerRef.current;
      const thumbnail = thumbnailsRefs.current[index];
      const containerWidth = container.offsetWidth;
      const thumbnailLeft = thumbnail.offsetLeft;
      const thumbnailWidth = thumbnail.offsetWidth;
      
      // Calcula la posición para centrar la miniatura
      const scrollLeft = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, []);

  const nextSlide = useCallback(() => {
    const newIndex = (currentIndex + 1) % displayReviews.length;
    changeSlide(newIndex);
  }, [currentIndex, displayReviews.length, changeSlide]);

  const prevSlide = useCallback(() => {
    const newIndex = (currentIndex - 1 + displayReviews.length) % displayReviews.length;
    changeSlide(newIndex);
  }, [currentIndex, displayReviews.length, changeSlide]);

  const goToSlide = useCallback((index: number) => {
    changeSlide(index);
  }, [changeSlide]);
  
  // Manejadores de eventos táctiles para swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    setTouchStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX || isTransitioning) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    
    // Definir umbral para cambio de slide (20% del ancho de la pantalla o 80px mínimo)
    const threshold = Math.max(80, window.innerWidth * 0.2);
    
    if (diffX > threshold) {
      // Swipe derecha -> slide anterior
      prevSlide();
    } else if (diffX < -threshold) {
      // Swipe izquierda -> slide siguiente
      nextSlide();
    }
    
    setTouchStartX(null);
  };
  
  // Efecto para manejar eventos de teclado (accesibilidad)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      else if (e.key === 'ArrowRight') nextSlide();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, prevSlide]);

  // Efecto para sincronizar el índice de texto cuando el componente se monta inicialmente
  useEffect(() => {
    setDisplayedTextIndex(currentIndex);
  }, [currentIndex]);
  
  // Efecto para centrar la miniatura activa cuando se monta el componente
  useEffect(() => {
    // Pequeño timeout para asegurar que los elementos se han renderizado correctamente
    const timer = setTimeout(() => {
      centerThumbnail(currentIndex);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentIndex, centerThumbnail]);

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        const newIndex = (currentIndex + 1) % displayReviews.length;
        changeSlide(newIndex);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning, changeSlide, displayReviews.length]);

  return (
    <section className="relative" itemScope itemType="https://schema.org/ItemList">
      <meta itemProp="itemListOrder" content="https://schema.org/ItemListOrderDescending" />
      <meta itemProp="numberOfItems" content={`${displayReviews.length}`} />
      
      {/* Enhanced SEO: Open Graph datos para redes sociales */}
      <meta property="og:title" content={`${displayReviews[displayedTextIndex].title} - Blog Reseñas Locales`} />
      <meta property="og:description" content={displayReviews[displayedTextIndex].subtitle || displayReviews[displayedTextIndex].description} />
      <meta property="og:image" content={displayReviews[currentIndex].image} />
      <meta property="og:type" content="article" />
      <meta property="og:locale" content="es_ES" />
      <meta name="twitter:card" content="summary_large_image" />
      
      {/* Anuncio para lectores de pantalla cuando cambia el slide */}
      <div className="sr-only" aria-live="polite">
        {`Mostrando reseña ${currentIndex + 1} de ${displayReviews.length}: ${displayReviews[displayedTextIndex].title}`}
      </div>
      
      {/* Full Width Hero Banner */}
      <div className="relative h-screen w-full overflow-hidden" role="banner">
        {/* Background Images with smooth transitions */}
        <div className="absolute inset-0">
          {displayReviews.map((review, index) => (
            <div
              key={review.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ImageWithFallback
                src={review.image}
                alt={review.title}
                className="w-full h-full object-cover transition-transform duration-1500 scale-110"
                fill
                priority={index === 0}
                sizes="100vw"
                quality={90}
              />
            </div>
          ))}
          {/* Enhanced gradient overlay for better text contrast on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 transition-opacity duration-500" />
        </div>

        {/* Content Overlay with simplified design similar to reference */}
        <div className="relative h-full flex flex-col justify-end">
          <div className="container mx-auto px-6 mb-28 md:mb-36">
            {/* Simplified content similar to reference image */}
            <div className={`max-w-xl text-white transition-all duration-300 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}>
              <div itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <meta itemProp="position" content={`${currentIndex + 1}`} />
                <div itemProp="item" itemScope itemType="https://schema.org/Review">
                  <div itemScope itemType="https://schema.org/LocalBusiness" itemProp="itemReviewed">
                    {/* Title - larger and more prominent */}
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight" itemProp="name">
                      {displayReviews[displayedTextIndex].title}
                    </h2>
                    <meta itemProp="image" content={displayReviews[currentIndex].image} />
                    
                    {/* Star rating inline with title */}
                    <div className="flex items-center mb-3">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-6 w-6 ${i < Math.floor(displayReviews[displayedTextIndex].rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-base text-white/80">{displayReviews[displayedTextIndex].rating}</span>
                    </div>
                    
                    {/* Description - simpler and cleaner */}
                    <p className="text-lg text-white/90 mb-8 line-clamp-3" itemProp="description">
                      {displayReviews[displayedTextIndex].description}
                    </p>
                    
                    {/* Hidden SEO keywords for search engines */}
                    {displayReviews[displayedTextIndex].seoKeywords && (
                      <span className="hidden" aria-hidden="true">
                        {displayReviews[displayedTextIndex].seoKeywords}
                      </span>
                    )}
                    
                    <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                      <meta itemProp="ratingValue" content={`${displayReviews[displayedTextIndex].rating}`} />
                      <meta itemProp="reviewCount" content="1" />
                      <meta itemProp="bestRating" content="5" />
                      <meta itemProp="worstRating" content="1" />
                    </div>
                    
                    <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                      <meta itemProp="addressLocality" content={displayReviews[displayedTextIndex].location} />
                      <meta itemProp="addressRegion" content={displayReviews[displayedTextIndex].location.split(',')[1]?.trim() || "Madrid"} />
                      <meta itemProp="addressCountry" content="ES" />
                    </div>
                    
                    {/* Add schema.org type based on review tags */}
                    {displayReviews[displayedTextIndex].tags.includes("Café") && (
                      <meta itemProp="@type" content="CafeOrCoffeeShop" />
                    )}
                    {displayReviews[displayedTextIndex].tags.includes("Pizza") && (
                      <meta itemProp="@type" content="FastFoodRestaurant" />
                    )}
                    {displayReviews[displayedTextIndex].tags.includes("Fine Dining") && (
                      <meta itemProp="@type" content="Restaurant" />
                    )}
                    
                    {/* Add meta for opening hours if available */}
                    <meta itemProp="openingHours" content="Mo-Su 09:00-23:00" />
                    <meta itemProp="priceRange" content="€€" />
                  </div>
                  
                  <meta itemProp="author" content="Blog Reseñas Locales" />
                  <meta itemProp="datePublished" content={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              
              {/* Mobile-optimized badges - max 2 lines */}
              <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2 text-base transition-all duration-300 hover:bg-white/30">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{displayReviews[displayedTextIndex].rating}</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2 text-base transition-all duration-300 hover:bg-white/30">
                  <MapPin className="h-5 w-5" />
                  <span>{displayReviews[displayedTextIndex].location}</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2 text-base transition-all duration-300 hover:bg-white/30">
                  <Clock className="h-5 w-5" />
                  <span>{displayReviews[displayedTextIndex].readTime}</span>
                </div>
              </div>
              
              {/* Simplified CTA Button */}
              <Link 
                href={displayReviews[displayedTextIndex].href || '#'}
                className="inline-flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 font-medium px-8 py-4 text-lg transition-all duration-300 hover:scale-105 transform rounded-lg shadow-lg"
                aria-label={`Ver reseña de ${displayReviews[displayedTextIndex].title}`}
              >
                {displayReviews[displayedTextIndex].ctaText || "Ver reseña completa"}
              </Link>
            </div>
          </div>
        </div>

        {/* Thumbnail container with scroll - showing only 3 visible items */}
        <div className="absolute bottom-24 sm:bottom-4 md:bottom-20 right-1/2 transform translate-x-1/2 md:right-8 md:translate-x-0 z-20">
          <div className="relative">
            {/* Container for thumbnails with dynamic width based on number of items (max 3) */}
            <div 
                className={`relative overflow-hidden bg-black/20 backdrop-blur-sm rounded-lg p-1 ${
                  displayReviews.length > 3 ? 'w-72 md:w-80' : ''
                }`}
                style={{ 
                  maxWidth: 'calc(100vw - 30px)',
                  // Si hay 3 o menos elementos, ajustar el ancho exacto para esos elementos
                  width: displayReviews.length <= 3 
                    ? `calc(${displayReviews.length} * (var(--thumbnail-width) + 12px) + 32px)` // thumbnail + espacio + padding
                    : undefined,
                  // Variables CSS para responsive
                  '--thumbnail-width': 'clamp(80px, 5vw, 88px)'
                } as React.CSSProperties}>
              {/* Scrollable container */}
              <div 
                ref={thumbnailsContainerRef}
                className="flex space-x-3 px-4 py-2 hide-scrollbar"
                style={{
                  scrollBehavior: 'smooth',
                  paddingBottom: '12px', // Space for progress bar
                  // Deshabilitar scroll si hay 3 o menos elementos
                  overflowX: displayReviews.length <= 3 ? 'hidden' : 'auto'
                }}
              >
                {displayReviews.map((review, index) => (
                  <button 
                    key={index}
                    ref={el => {
                      thumbnailsRefs.current[index] = el;
                    }}
                    onClick={() => goToSlide(index)}
                    className={`rounded-md overflow-hidden transition-all duration-300 flex-shrink-0 ${
                      currentIndex === index ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      width: 'var(--thumbnail-width)',
                      height: 'calc(var(--thumbnail-width) * 0.7)' // Proporción de aspecto
                    }}
                    aria-label={`Ver reseña de ${review.title}`}
                  >
                    <div className="w-full h-full relative">
                      <ImageWithFallback 
                        src={review.image} 
                        alt={review.title}
                        fill
                        sizes="(max-width: 768px) 80px, 96px"
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Progress indicator bar below thumbnails - más fina */}
              <div className="absolute bottom-1 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentIndex + 1) / displayReviews.length) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Navigation indicators for thumbnails - only if more than 3 items */}
            {displayReviews.length > 3 && (
              <>
                <button 
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transform -translate-x-1/2 backdrop-blur-sm border border-white/10"
                  aria-label="Ver miniaturas anteriores"
                  onClick={() => {
                    // Ir a la miniatura anterior
                    const newIndex = currentIndex > 0 ? currentIndex - 1 : displayReviews.length - 1;
                    // Usar goToSlide en lugar de setCurrentIndex para aprovechar la lógica de centrado
                    goToSlide(newIndex);
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <button 
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transform translate-x-1/2 backdrop-blur-sm border border-white/10"
                  aria-label="Ver miniaturas siguientes"
                  onClick={() => {
                    // Ir a la miniatura siguiente
                    const newIndex = currentIndex < displayReviews.length - 1 ? currentIndex + 1 : 0;
                    // Usar goToSlide en lugar de setCurrentIndex para aprovechar la lógica de centrado
                    goToSlide(newIndex);
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Large, touch-friendly navigation buttons (only on tablet/desktop) */}
        <div className="hidden md:block">
          <button 
            className="nav-button prev-button"
            onClick={prevSlide} 
            aria-label="Reseña anterior"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button 
            className="nav-button next-button"
            onClick={nextSlide}
            aria-label="Reseña siguiente"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      </div>
    </section>
  );
}


