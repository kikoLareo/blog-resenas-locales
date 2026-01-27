'use client';

import { HomepageSection, SelectedItem } from '@/types/homepage';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { getVenueUrl, getReviewUrl } from '@/lib/utils';

interface HomepageHeroSectionProps {
  section: HomepageSection;
}

export default function HomepageHeroSection({ section }: HomepageHeroSectionProps) {
  const { config } = section;
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!config.selectedItems.length) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % config.selectedItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + config.selectedItems.length) % config.selectedItems.length);
  };

  const currentItem = config.selectedItems[currentIndex];

  return (
    <section className="relative h-screen max-h-[600px] overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        {currentItem.imageUrl && (
          <Image
            src={currentItem.imageUrl}
            alt={currentItem.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center text-white px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section titles */}
          {config.displayTitle && (
            <p className="text-lg md:text-xl font-medium mb-2 text-white/90">
              {config.displayTitle}
            </p>
          )}
          
          {/* Current item */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {currentItem.title}
          </h1>

          {config.subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {config.subtitle}
            </p>
          )}

          {/* CTA Button */}
          <Link href={getItemHref(currentItem)}>
            <button className="bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-200">
              Explorar {getTypeLabel(currentItem.type)}
            </button>
          </Link>

          {/* Metadata */}
          <div className="mt-6 text-sm text-white/80">
            {currentItem.venue && currentItem.city && (
              <p>{currentItem.venue} • {currentItem.city}</p>
            )}
            {!currentItem.venue && currentItem.city && (
              <p>{currentItem.city}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {config.selectedItems.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
            aria-label="Anterior"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
            aria-label="Siguiente"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {config.selectedItems.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {config.selectedItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function getItemHref(item: SelectedItem) {
  switch (item.type) {
    case 'venue':
      return getVenueUrl(item.city, item.slug);
    case 'review':
      return getReviewUrl(item.city, item.venueSlug, item.slug);
    case 'category':
      return `/categorias/${item.slug}`;
    case 'city':
      return `/${item.slug}`;
    default:
      return '#';
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'venue':
      return 'Local';
    case 'review':
      return 'Reseña';
    case 'category':
      return 'Categoría';
    case 'city':
      return 'Ciudad';
    default:
      return type;
  }
}