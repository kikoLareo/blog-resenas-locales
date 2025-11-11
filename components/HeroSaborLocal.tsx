"use client";

import { ChevronLeft, ChevronRight, Star, MapPin, Clock, TrendingUp, Heart, Share2, Bookmark } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

// Tipos optimizados para SEO y performance
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
  isNew?: boolean;
  isPopular?: boolean;
  isFavorite?: boolean;
  shareCount?: number;
  viewCount?: number;
  author?: string;
  publishedDate?: string;
  cuisine?: string;
  neighborhood?: string;
  openNow?: boolean;
  deliveryAvailable?: boolean;
  reservationRequired?: boolean;
};

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
  href?: string;
  content: {
    summary: string;
    highlights: string[];
    atmosphere: string;
    recommendation: string;
  };
  // Nuevos campos para mobile-first y SEO
  isNew?: boolean;
  isPopular?: boolean;
  isFavorite?: boolean;
  shareCount?: number;
  viewCount?: number;
  author?: string;
  publishedDate?: string;
  cuisine?: string;
  neighborhood?: string;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  openNow?: boolean;
  deliveryAvailable?: boolean;
  reservationRequired?: boolean;
}

interface HeroSaborLocalProps {
  onReviewClick?: (reviewId: string) => void;
  featuredItems?: FeaturedItem[];
  fallbackItems?: FeaturedItem[];
  className?: string;
}

// Datos de fallback optimizados para SEO local
const fallbackHeroReviews: HeroReview[] = [
  {
    id: "hero-1",
    title: "Los Mejores Mariscos de A Coruña",
    subtitle: "Tradición familiar desde 1987",
    image: "https://images.unsplash.com/photo-1559847844-d678f809758b?w=1920&h=1080&fit=crop&q=85",
    rating: 4.8,
    location: "Centro Histórico, A Coruña",
    readTime: "5 min lectura",
    tags: ["Marisco", "Tradicional", "Familiar", "Centollo"],
    description: "Descubre el auténtico sabor del mar gallego en este restaurante familiar que lleva tres generaciones perfeccionando sus recetas tradicionales.",
    ctaText: "Leer reseña completa",
    seoKeywords: "mejor marisco A Coruña, restaurante marisco tradicional, centollo A Coruña, marisquería familiar Galicia",
    href: "/a-coruna/marisqueria-tradicion/review/mejores-mariscos-centro-historico",
    isNew: false,
    isPopular: true,
    isFavorite: false,
    shareCount: 245,
    viewCount: 3420,
    author: "María González",
    publishedDate: "2024-01-15",
    cuisine: "Mariscos",
    neighborhood: "Centro Histórico",
    priceRange: "$$$",
    openNow: true,
    deliveryAvailable: false,
    reservationRequired: true,
    content: {
      summary: "Una experiencia gastronómica auténtica que representa lo mejor de la cocina marinera gallega con ingredientes frescos traídos diariamente del puerto.",
      highlights: [
        "Centollo fresco de las Rías Gallegas",
        "Ambiente familiar con tres generaciones de tradición",
        "Ubicación privilegiada en el centro histórico",
        "Relación calidad-precio excepcional para marisco fresco"
      ],
      atmosphere: "Acogedor restaurante familiar con decoración marinera auténtica y vistas al puerto histórico.",
      recommendation: "Perfecto para cenas especiales y para mostrar a visitantes la auténtica gastronomía gallega. Reserva imprescindible los fines de semana."
    }
  },
  {
    id: "hero-2",
    title: "Ruta Gastronómica por Chueca",
    subtitle: "Los 5 locales imprescindibles del barrio",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop&q=85",
    rating: 4.7,
    location: "Chueca, Madrid",
    readTime: "8 min lectura",
    tags: ["Ruta", "Madrid", "Tapas", "Cocktails"],
    description: "Una guía completa por los rincones gastronómicos más auténticos de uno de los barrios más vibrantes de Madrid.",
    ctaText: "Ver ruta completa",
    seoKeywords: "ruta gastronómica Chueca Madrid, mejores restaurantes Chueca, tapas Chueca, cocktails Madrid centro",
    href: "/madrid/guias/ruta-gastronomica-chueca-imprescindibles",
    isNew: true,
    isPopular: true,
    isFavorite: true,
    shareCount: 189,
    viewCount: 2890,
    author: "Carlos Ruiz",
    publishedDate: "2024-01-20",
    cuisine: "Variada",
    neighborhood: "Chueca",
    priceRange: "$$",
    openNow: true,
    deliveryAvailable: true,
    reservationRequired: false,
    content: {
      summary: "Recorrido por cinco establecimientos únicos que definen la esencia gastronómica de Chueca, desde tapas tradicionales hasta coctelería de autor.",
      highlights: [
        "5 paradas gastronómicas cuidadosamente seleccionadas",
        "Mezcla perfecta entre tradición y modernidad",
        "Precios accesibles para todos los bolsillos",
        "Horarios flexibles para cualquier momento del día"
      ],
      atmosphere: "Barrio vibrante con una mezcla ecléctica de locales tradicionales y modernos, perfecto para explorar a pie.",
      recommendation: "Ideal para una tarde de sábado explorando con amigos o una cita diferente. La ruta se puede hacer completa o por partes."
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
    rating: item.rating || 4.5,
    location: item.location || 'Madrid, España',
    readTime: item.readTime || '5 min lectura',
    tags: item.tags || [],
    description: item.customDescription || item.description,
    ctaText: item.ctaText || 'Leer más',
    seoKeywords: item.seoKeywords?.join(', '),
    href: item.href,
    isNew: item.isNew,
    isPopular: item.isPopular,
    isFavorite: item.isFavorite,
    shareCount: item.shareCount,
    viewCount: item.viewCount,
    author: item.author,
    publishedDate: item.publishedDate,
    cuisine: item.cuisine,
    neighborhood: item.neighborhood,
    priceRange: item.priceRange,
    openNow: item.openNow,
    deliveryAvailable: item.deliveryAvailable,
    reservationRequired: item.reservationRequired,
    content: {
      summary: item.description,
      highlights: item.highlights || [],
      atmosphere: "Un lugar destacado en nuestra selección gastronómica.",
      recommendation: "Recomendado por nuestro equipo editorial especializado."
    }
  };
}

export function HeroSaborLocal({ 
  onReviewClick, 
  featuredItems, 
  fallbackItems, 
  className = "" 
}: HeroSaborLocalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const autoplayRef = useRef<any>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Procesar los featured items o usar fallback
  const processedItems = featuredItems && featuredItems.length > 0 
    ? featuredItems.map(adaptFeaturedItemToHeroReview)
    : fallbackItems && fallbackItems.length > 0
    ? fallbackItems.map(adaptFeaturedItemToHeroReview)
    : fallbackHeroReviews;
  
  const currentReview = processedItems[currentIndex];

  // Función para cambiar slide con optimizaciones
  const changeSlide = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    // Optimización: precargar la siguiente imagen
    if (processedItems[newIndex + 1]) {
      const img = new window.Image();
      img.src = processedItems[newIndex + 1].image;
    }
    
    setTimeout(() => setIsTransitioning(false), 300);
  }, [currentIndex, isTransitioning, processedItems]);

  const nextSlide = useCallback(() => {
    const newIndex = (currentIndex + 1) % processedItems.length;
    changeSlide(newIndex);
  }, [currentIndex, processedItems.length, changeSlide]);

  const prevSlide = useCallback(() => {
    const newIndex = (currentIndex - 1 + processedItems.length) % processedItems.length;
    changeSlide(newIndex);
  }, [currentIndex, processedItems.length, changeSlide]);

  // Autoplay con pausa en hover/focus
  useEffect(() => {
    if (!isAutoplayPaused && !isTransitioning) {
      autoplayRef.current = setInterval(nextSlide, 6000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [nextSlide, isAutoplayPaused, isTransitioning]);

  // Manejadores de eventos táctiles mejorados
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsAutoplayPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // Solo procesar swipe horizontal si es más prominente que el vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setTouchStartX(null);
    setTouchStartY(null);
    setTimeout(() => setIsAutoplayPaused(false), 1000);
  };

  // Eventos de teclado para accesibilidad
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section 
      ref={heroRef}
      className={`relative h-screen w-full overflow-hidden bg-neutral-900 ${className}`}
      role="banner"
      aria-label="Reseñas gastronómicas destacadas"
      itemScope 
      itemType="https://schema.org/ItemList"
      onMouseEnter={() => setIsAutoplayPaused(true)}
      onMouseLeave={() => setIsAutoplayPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Metadatos SEO estructurados */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Reseñas Gastronómicas Destacadas - SaborLocal",
            "description": "Las mejores reseñas de restaurantes y locales gastronómicos seleccionadas por nuestros expertos",
            "numberOfItems": processedItems.length,
            "itemListElement": processedItems.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Review",
                "name": item.title,
                "description": item.description,
                "author": {
                  "@type": "Person",
                  "name": item.author || "Equipo SaborLocal"
                },
                "datePublished": item.publishedDate || new Date().toISOString().split('T')[0],
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": item.rating,
                  "bestRating": 5,
                  "worstRating": 1
                },
                "itemReviewed": {
                  "@type": "Restaurant",
                  "name": item.title,
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": item.location.split(',')[0] || item.location,
                    "addressCountry": "ES"
                  },
                  "servesCuisine": item.cuisine,
                  "priceRange": item.priceRange
                }
              }
            }))
          })
        }}
      />

      {/* Fondo con imágenes */}
      <div className="absolute inset-0">
        {processedItems.map((review, index) => (
          <div
            key={review.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={review.image}
              alt={`${review.title} - ${review.location}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            {/* Overlay gradient optimizado para legibilidad mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 md:from-black/70 md:via-black/30 md:to-black/10" />
          </div>
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative h-full flex flex-col justify-end">
        <div className="container mx-auto px-4 pb-20 md:pb-24 lg:pb-32">
          <div 
            className={`max-w-2xl text-white transition-all duration-500 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
            itemProp="mainEntity"
            itemScope
            itemType="https://schema.org/Review"
          >
            {/* Badges superiores - Mobile optimizado */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {/* Badge de tipo de contenido */}
              {(() => {
                const item = featuredItems?.[currentIndex] || fallbackItems?.[currentIndex];
                if (!item) return null;
                
                const typeConfig = {
                  review: { label: 'Reseña', icon: '📝', color: 'bg-accent/90' },
                  venue: { label: 'Local', icon: '🏪', color: 'bg-primary/90' },
                  category: { label: 'Categoría', icon: '🏷️', color: 'bg-purple-500/90' },
                  collection: { label: 'Colección', icon: '📚', color: 'bg-blue-500/90' },
                  guide: { label: 'Guía', icon: '🗺️', color: 'bg-green-500/90' },
                };
                
                const config = typeConfig[item.type] || typeConfig.review;
                
                return (
                  <span className={`inline-flex items-center gap-1.5 ${config.color} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg`}>
                    <span className="text-sm">{config.icon}</span>
                    {config.label}
                  </span>
                );
              })()}
              
              {currentReview.isNew && (
                <span className="badge badge-new text-xs px-2 py-1">
                  Nuevo
                </span>
              )}
              {currentReview.isPopular && (
                <span className="badge badge-popular text-xs px-2 py-1">
                  Popular
                </span>
              )}
              {currentReview.openNow && (
                <span className="inline-flex items-center gap-1 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  Abierto ahora
                </span>
              )}
            </div>

            {/* Título principal - Optimizado para mobile */}
            <h1 
              className="text-3xl md:text-4xl lg:text-6xl font-bold mb-3 leading-tight font-serif"
              itemProp="name"
            >
              {currentReview.title}
            </h1>

            {/* Subtítulo */}
            {currentReview.subtitle && (
              <p className="text-lg md:text-xl text-white/90 mb-4 font-light">
                {currentReview.subtitle}
              </p>
            )}

            {/* Rating y metadata - Layout mobile-first */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 md:h-5 md:w-5 ${
                        i < Math.floor(currentReview.rating) 
                          ? 'text-saffron-400 fill-saffron-400' 
                          : 'text-white/30'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm md:text-base font-medium ml-1">
                  {currentReview.rating}
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm md:text-base text-white/80">
                <MapPin className="h-4 w-4" />
                <span>{currentReview.location}</span>
              </div>

              <div className="flex items-center gap-1 text-sm md:text-base text-white/80">
                <Clock className="h-4 w-4" />
                <span>{currentReview.readTime}</span>
              </div>
            </div>

            {/* Descripción */}
            <p 
              className="text-base md:text-lg text-white/90 mb-6 line-clamp-3 leading-relaxed"
              itemProp="description"
            >
              {currentReview.description}
            </p>

            {/* Tags - Mobile optimizado */}
            <div className="flex flex-wrap gap-2 mb-6">
              {currentReview.tags.slice(0, 4).map((tag) => (
                <span 
                  key={tag}
                  className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA y acciones - Mobile-first */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link 
                href={currentReview.href || '#'}
                className="btn btn-primary inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-300 hover:scale-105 transform"
                aria-label={`Leer reseña completa de ${currentReview.title}`}
              >
                {currentReview.ctaText || "Leer reseña completa"}
              </Link>

              {/* Acciones secundarias */}
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  aria-label="Guardar en favoritos"
                >
                  <Heart className={`h-5 w-5 ${currentReview.isFavorite ? 'fill-current text-red-400' : ''}`} />
                </button>
                <button 
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  aria-label="Compartir reseña"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <button 
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  aria-label="Guardar para más tarde"
                >
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Metadatos adicionales para SEO */}
            <div className="hidden">
              <span itemProp="author">{currentReview.author || "Equipo SaborLocal"}</span>
              <span itemProp="datePublished">{currentReview.publishedDate}</span>
              <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <span itemProp="ratingValue">{currentReview.rating}</span>
                <span itemProp="bestRating">5</span>
                <span itemProp="worstRating">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación - Adaptada para mobile */}
      {processedItems.length > 1 && (
        <>
          {/* Botones de navegación - Solo desktop */}
          <div className="hidden md:block">
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-all duration-300 z-10"
              onClick={prevSlide}
              aria-label="Reseña anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-all duration-300 z-10"
              onClick={nextSlide}
              aria-label="Reseña siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Indicadores de progreso - Mobile optimizado */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {processedItems.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                onClick={() => changeSlide(index)}
                aria-label={`Ir a reseña ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Indicador de swipe para mobile */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 md:hidden">
        <div className="flex items-center gap-2 text-white/60 text-xs">
          <ChevronLeft className="w-4 h-4" />
          <span>Desliza para navegar</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}
