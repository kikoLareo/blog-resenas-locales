'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Image as ImageType } from '@/lib/types';
import { IMAGE_SIZES } from '@/lib/constants';

interface GalleryProps {
  images: ImageType[];
  title?: string;
  className?: string;
  columns?: 2 | 3 | 4;
  showThumbnails?: boolean;
  enableLightbox?: boolean;
  priority?: boolean;
}

export default function Gallery({
  images,
  title,
  className = '',
  columns = 3,
  showThumbnails = true,
  enableLightbox = true,
  priority = false,
}: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isLightboxOpen || selectedIndex === null) return;

    switch (event.key) {
      case 'Escape':
        setIsLightboxOpen(false);
        setSelectedIndex(null);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        setSelectedIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0);
        break;
    }
  }, [isLightboxOpen, selectedIndex, images.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  const openLightbox = (index: number) => {
    if (!enableLightbox) return;
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1);
    } else {
      setSelectedIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0);
    }
  };

  const getGridColumns = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className={`gallery ${className}`} aria-label={title || 'Galería de imágenes'}>
      {/* Gallery Title */}
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600">
            {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
          </p>
        </div>
      )}

      {/* Image Grid */}
      <div className={`grid gap-4 ${getGridColumns()}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100"
            onClick={() => openLightbox(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Ver imagen ${index + 1}: ${image.alt || 'Sin descripción'}`}
          >
            <div className="aspect-square relative">
              <Image
                src={image.asset.url}
                alt={image.alt || `Imagen ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${100 / columns}vw`}
                priority={priority && index < 4} // Prioritize first 4 images
                quality={85}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white bg-opacity-90 rounded-full p-2">
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Caption */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-white text-sm font-medium">
                  {image.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
            aria-label="Cerrar galería"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
                aria-label="Imagen anterior"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
                aria-label="Siguiente imagen"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div className="relative max-w-7xl max-h-full mx-4">
            <div className="relative">
              <Image
                src={images[selectedIndex].asset.url}
                alt={images[selectedIndex].alt || `Imagen ${selectedIndex + 1}`}
                width={IMAGE_SIZES.hero.width}
                height={IMAGE_SIZES.hero.height}
                className="max-w-full max-h-[90vh] object-contain"
                quality={95}
                priority
              />
            </div>
            
            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <div className="text-white">
                <p className="text-sm opacity-75 mb-1">
                  {selectedIndex + 1} de {images.length}
                </p>
                {images[selectedIndex].caption && (
                  <p className="text-lg font-medium">
                    {images[selectedIndex].caption}
                  </p>
                )}
                {images[selectedIndex].alt && !images[selectedIndex].caption && (
                  <p className="text-lg font-medium">
                    {images[selectedIndex].alt}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          {showThumbnails && images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === selectedIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <Image
                    src={image.asset.url}
                    alt={image.alt || `Miniatura ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    quality={60}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// Compact gallery variant for smaller spaces
export function CompactGallery({ 
  images, 
  maxImages = 4, 
  className = '' 
}: { 
  images: ImageType[]; 
  maxImages?: number; 
  className?: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayImages = showAll ? images : images.slice(0, maxImages);
  const remainingCount = images.length - maxImages;

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={`compact-gallery ${className}`}>
      <div className="grid grid-cols-2 gap-2">
        {displayImages.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-md bg-gray-100"
          >
            <Image
              src={image.asset.url}
              alt={image.alt || `Imagen ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 25vw"
              quality={75}
            />
            
            {/* Show remaining count on last image */}
            {!showAll && index === maxImages - 1 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {!showAll && remainingCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Ver todas las imágenes ({images.length})
        </button>
      )}
    </div>
  );
}