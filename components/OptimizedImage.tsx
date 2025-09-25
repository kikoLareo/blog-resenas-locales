"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  
  // Propiedades específicas para UX mejorada
  showLoadingState?: boolean;
  fallbackSrc?: string;
  aspectRatio?: 'square' | '16/9' | '4/3' | '3/2' | '21/9' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  
  // Eventos
  onLoad?: () => void;
  onError?: () => void;
  
  // SEO
  itemProp?: string;
}

// Generar blur placeholder simple
const generateBlurPlaceholder = (width: number = 400, height: number = 300): string => {
  return `data:image/svg+xml;base64,${btoa(
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="20%" y="40%" width="60%" height="20%" rx="4" fill="#e5e7eb"/>
      <circle cx="30%" cy="25%" r="8%" fill="#d1d5db"/>
    </svg>`
  )}`;
};

const aspectRatioClasses = {
  'square': 'aspect-square',
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '21/9': 'aspect-[21/9]',
  'auto': '',
};

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  fill = false,
  priority = false,
  quality = 85,
  sizes,
  placeholder = 'blur',
  blurDataURL,
  showLoadingState = true,
  fallbackSrc,
  aspectRatio = 'auto',
  objectFit = 'cover',
  onLoad,
  onError,
  itemProp,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    }
    
    onError?.();
  }, [fallbackSrc, currentSrc, onError]);

  // Generar blur placeholder si no se proporciona uno
  const defaultBlurDataURL = blurDataURL || generateBlurPlaceholder(width, height);

  const imageClasses = cn(
    "transition-all duration-300",
    aspectRatio !== 'auto' && aspectRatioClasses[aspectRatio],
    {
      'opacity-0': isLoading && showLoadingState,
      'opacity-100': !isLoading || !showLoadingState,
      [`object-${objectFit}`]: true,
    },
    className
  );

  const containerClasses = cn(
    "relative overflow-hidden",
    aspectRatio !== 'auto' && aspectRatioClasses[aspectRatio],
    !fill && width && height && `w-[${width}px] h-[${height}px]`
  );

  if (hasError && !fallbackSrc) {
    return (
      <div className={cn(containerClasses, "bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center")}>
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Imagen no disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Loading skeleton */}
      {isLoading && showLoadingState && (
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-skeleton" />
      )}
      
      {/* Imagen optimizada */}
      <Image
        src={currentSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes || (fill ? "100vw" : undefined)}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? defaultBlurDataURL : undefined}
        className={imageClasses}
        onLoad={handleLoad}
        onError={handleError}
        itemProp={itemProp}
        
        // Optimizaciones adicionales
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      
      {/* Overlay de carga (opcional) */}
      {isLoading && showLoadingState && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80">
          <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
