"use client";

import { Star, MapPin, Clock, Heart, Share2, Bookmark, TrendingUp, Eye, MessageCircle, ChevronRight } from "lucide-react";
import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Tipos optimizados para SEO y mobile-first
interface ReviewCardSaborLocalProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  location: string;
  readTime: string;
  tags: string[];
  description: string;
  href: string;
  className?: string;
  
  // Tipo de contenido
  contentType?: 'review' | 'venue' | 'category' | 'collection' | 'guide';
  
  // Nuevos campos para UX mejorada
  isNew?: boolean;
  isPopular?: boolean;
  isTrending?: boolean;
  isFavorite?: boolean;
  author?: string;
  publishedDate?: string;
  viewCount?: number;
  shareCount?: number;
  commentCount?: number;
  cuisine?: string;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  neighborhood?: string;
  openNow?: boolean;
  deliveryAvailable?: boolean;
  reservationRequired?: boolean;
  averagePrice?: number;
  
  // Props de interacción
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  onShare?: (id: string) => void;
  onBookmark?: (id: string) => void;
  
  // Variantes de diseño
  variant?: 'default' | 'compact' | 'featured' | 'list';
  size?: 'sm' | 'md' | 'lg';
  
  // SEO
  seoKeywords?: string[];
  structuredData?: boolean;
}

export function ReviewCardSaborLocal({
  id,
  title,
  image,
  rating,
  location,
  readTime,
  tags,
  description,
  href,
  className = "",
  contentType = 'review',
  isNew = false,
  isPopular = false,
  isTrending = false,
  isFavorite = false,
  author,
  publishedDate,
  viewCount,
  shareCount,
  commentCount,
  cuisine,
  priceRange,
  neighborhood,
  openNow,
  deliveryAvailable,
  reservationRequired,
  averagePrice,
  onFavoriteToggle,
  onShare,
  onBookmark,
  variant = 'default',
  size = 'md',
  seoKeywords = [],
  structuredData = true,
}: ReviewCardSaborLocalProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  const [isHovered, setIsHovered] = useState(false);

  // Manejadores de eventos optimizados
  const handleFavoriteToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    onFavoriteToggle?.(id, newFavoriteState);
  }, [favorite, id, onFavoriteToggle]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(id);
  }, [id, onShare]);

  const handleBookmark = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmark?.(id);
  }, [id, onBookmark]);

  // Clases dinámicas basadas en variante y tamaño
  const cardClasses = cn(
    // Base classes - mobile-first
    "group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden",
    "border border-neutral-200 dark:border-neutral-800",
    "transition-all duration-300 ease-out",
    "hover:shadow-food-card-hover hover:-translate-y-1",
    "focus-within:ring-2 focus-within:ring-saffron-500 focus-within:ring-offset-2",
    "motion-safe:hover:scale-[1.02]",
    
    // Variant styles
    {
      'shadow-food-card': variant === 'default',
      'shadow-md': variant === 'compact',
      'shadow-floating': variant === 'featured',
      'shadow-sm border-l-4 border-l-saffron-500': variant === 'list',
    },
    
    // Size styles
    {
      'max-w-sm': size === 'sm',
      'max-w-md': size === 'md', 
      'max-w-lg': size === 'lg',
    },
    
    className
  );

  const imageClasses = cn(
    "w-full object-cover transition-transform duration-500 group-hover:scale-110",
    {
      'h-48': size === 'sm' && variant !== 'list',
      'h-56': size === 'md' && variant !== 'list',
      'h-64': size === 'lg' && variant !== 'list',
      'h-32': variant === 'list',
      'aspect-[16/10]': variant !== 'list',
      'aspect-[16/9]': variant === 'list',
    }
  );

  return (
    <article 
      className={cardClasses}
      itemScope={structuredData}
      itemType={structuredData ? "https://schema.org/Review" : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Structured Data para SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Review",
              "name": title,
              "description": description,
              "author": {
                "@type": "Person",
                "name": author || "Equipo SaborLocal"
              },
              "datePublished": publishedDate || new Date().toISOString().split('T')[0],
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": rating,
                "bestRating": 5,
                "worstRating": 1
              },
              "itemReviewed": {
                "@type": "Restaurant",
                "name": title,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": location.split(',')[0] || location,
                  "addressCountry": "ES"
                },
                "servesCuisine": cuisine,
                "priceRange": priceRange
              },
              "url": href,
              "keywords": seoKeywords.join(', ')
            })
          }}
        />
      )}

      <Link href={href} className="block focus:outline-none">
        {/* Contenedor de imagen con badges */}
        <div className="relative overflow-hidden">
          {/* Imagen principal */}
          <div className="relative">
            <Image
              src={image}
              alt={`${title} - ${location}`}
              width={400}
              height={300}
              className={cn(imageClasses, !isImageLoaded && 'opacity-0')}
              onLoad={() => setIsImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              itemProp={structuredData ? "image" : undefined}
            />
            
            {/* Skeleton loader */}
            {!isImageLoaded && (
              <div className={cn(imageClasses, "absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-skeleton")} />
            )}
          </div>

          {/* Badges superiores */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* Badge de tipo de contenido */}
            {(() => {
              const typeConfig = {
                review: { label: 'Reseña', icon: '📝', color: 'bg-accent/95' },
                venue: { label: 'Local', icon: '🏪', color: 'bg-primary/95' },
                category: { label: 'Categoría', icon: '🏷️', color: 'bg-purple-600/95' },
                collection: { label: 'Colección', icon: '📚', color: 'bg-blue-600/95' },
                guide: { label: 'Guía', icon: '🗺️', color: 'bg-green-600/95' },
              };
              
              const config = typeConfig[contentType] || typeConfig.review;
              
              return (
                <span className={`inline-flex items-center gap-1 ${config.color} text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm`}>
                  <span className="text-xs">{config.icon}</span>
                  {config.label}
                </span>
              );
            })()}
            
            {isNew && (
              <span className="badge badge-new text-xs px-2 py-1 font-medium">
                Nuevo
              </span>
            )}
            {isPopular && (
              <span className="badge badge-popular text-xs px-2 py-1 font-medium">
                Popular
              </span>
            )}
            {isTrending && (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                <TrendingUp className="w-3 h-3" />
                Trending
              </span>
            )}
          </div>

          {/* Status badges superiores derecha */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            {openNow && (
              <span className="inline-flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                Abierto
              </span>
            )}
            {deliveryAvailable && (
              <span className="bg-blue-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                Delivery
              </span>
            )}
          </div>

          {/* Overlay con acciones - Aparece en hover */}
          <div className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center",
            "transition-all duration-300 ease-out",
            "opacity-0 group-hover:opacity-100",
            "md:opacity-0 md:group-hover:opacity-100"
          )}>
            <div className="flex items-center gap-3">
              <button
                onClick={handleFavoriteToggle}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                <Heart className={cn("h-5 w-5", favorite && "fill-current text-red-400")} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                aria-label="Compartir reseña"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={handleBookmark}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                aria-label="Guardar para más tarde"
              >
                <Bookmark className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-4 md:p-5">
          {/* Header con rating y metadata */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(rating) 
                          ? 'text-saffron-400 fill-saffron-400' 
                          : 'text-neutral-300 dark:text-neutral-600'
                      )} 
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">
                  {rating}
                </span>
              </div>
              
              {/* Price range */}
              {priceRange && (
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {priceRange}
                </span>
              )}
            </div>

            {/* Engagement stats */}
            <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
              {viewCount && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{viewCount > 1000 ? `${Math.floor(viewCount/1000)}k` : viewCount}</span>
                </div>
              )}
              {commentCount && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{commentCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Título */}
          <h3 
            className="font-serif font-semibold text-lg md:text-xl text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors"
            itemProp={structuredData ? "name" : undefined}
          >
            {title}
          </h3>

          {/* Ubicación y tiempo de lectura */}
          <div className="flex items-center gap-4 mb-3 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Descripción */}
          <p 
            className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 line-clamp-3 mb-4 leading-relaxed"
            itemProp={structuredData ? "description" : undefined}
          >
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 px-2 py-1">
                +{tags.length - 3} más
              </span>
            )}
          </div>

          {/* Footer con autor y CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              {author && (
                <span itemProp={structuredData ? "author" : undefined}>
                  Por {author}
                </span>
              )}
              {publishedDate && author && <span>•</span>}
              {publishedDate && (
                <span itemProp={structuredData ? "datePublished" : undefined}>
                  {new Date(publishedDate).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </span>
              )}
            </div>

            {/* CTA sutil */}
            <div className="flex items-center gap-1 text-saffron-600 dark:text-saffron-400 text-sm font-medium group-hover:gap-2 transition-all">
              <span>Leer más</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>

      {/* Metadatos ocultos para SEO */}
      {structuredData && (
        <div className="hidden">
          <span itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
            <span itemProp="ratingValue">{rating}</span>
            <span itemProp="bestRating">5</span>
            <span itemProp="worstRating">1</span>
          </span>
          {seoKeywords.length > 0 && (
            <span itemProp="keywords">{seoKeywords.join(', ')}</span>
          )}
          <span itemProp="url">{href}</span>
        </div>
      )}
    </article>
  );
}
