"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fill?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes = '100vw',
  className,
  fill = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  ...rest
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src || ERROR_IMG_SRC);
  const [hasError, setHasError] = useState(!src);

  React.useEffect(() => {
    if (!src) {
      setHasError(true);
      setCurrentSrc(ERROR_IMG_SRC);
    } else {
      setHasError(false);
      setCurrentSrc(src);
    }
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(ERROR_IMG_SRC);
    }
  };

  // Si es una imagen de error, usar next/image también
  if (hasError || currentSrc === ERROR_IMG_SRC) {
    return (
      <Image
        src={currentSrc}
        alt={alt}
        width={width || 88}
        height={height || 88}
        className={className}
        style={{ objectFit: 'cover' }}
        unoptimized={true}
        {...rest}
      />
    );
  }

  // Para imágenes de Sanity, usar next/image con optimización
  if (src.includes('cdn.sanity.io')) {
    return (
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={className}
        fill={fill}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
        {...rest}
      />
    );
  }

  // Para URLs externas (Unsplash, etc.), usar next/image con dominio configurado
  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={className}
      fill={fill}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={handleError}
      unoptimized={!src.includes('cdn.sanity.io')} // No optimizar URLs externas por ahora
      {...rest}
    />
  );
}


