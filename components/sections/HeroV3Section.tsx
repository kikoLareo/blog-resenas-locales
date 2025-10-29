import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionConfig } from "@/types/homepage";

interface HeroV3SectionProps {
  config: SectionConfig;
}

export function HeroV3Section({ config }: HeroV3SectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = config.selectedItems || [];

  // Auto-rotate slides
  useEffect(() => {
    if (items.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  if (!items.length) {
    return (
      <section className="relative h-screen min-h-[600px] flex items-center justify-center bg-gradient-to-br from-saffron-900 to-saffron-700">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
            {config.displayTitle || "Descubre Sabor Local"}
          </h1>
          {config.subtitle && (
            <p className="text-xl md:text-2xl text-white/90 font-light">
              {config.subtitle}
            </p>
          )}
        </div>
      </section>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Fondo con imágenes */}
      <div className="absolute inset-0">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={item.imageUrl || '/placeholder-image.jpg'}
              alt={`${item.title} - ${item.city}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              quality={85}
            />
            {/* Overlay gradient optimizado */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 md:from-black/70 md:via-black/30 md:to-black/10" />
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </>
      )}

      {/* Contenido principal */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Badges y metadatos */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center bg-saffron-500/90 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                {currentItem.type === 'venue' ? 'Restaurante' : 
                 currentItem.type === 'category' ? 'Categoría' : 
                 currentItem.type === 'city' ? 'Ciudad' : 'Reseña'}
              </span>
              {currentItem.city && (
                <span className="inline-flex items-center bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  {currentItem.city}
                </span>
              )}
            </div>

            {/* Título principal */}
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-3 leading-tight font-serif text-white">
              {config.displayTitle || currentItem.title}
            </h1>

            {/* Subtítulo */}
            {config.subtitle && (
              <p className="text-lg md:text-xl text-white/90 mb-6 font-light max-w-2xl">
                {config.subtitle}
              </p>
            )}

            {/* Información del item actual */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-1 text-white">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 md:h-5 md:w-5 ${
                        i < 4 ? 'text-saffron-400 fill-saffron-400' : 'text-white/30'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm md:text-base font-medium ml-1">4.8</span>
              </div>

              <div className="flex items-center gap-1 text-sm md:text-base text-white/80">
                <Clock className="h-4 w-4" />
                <span>Abierto ahora</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${currentItem.slug}`}
                className="inline-flex items-center justify-center px-8 py-4 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Ver detalles
              </Link>
              <Link
                href="#secciones"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 border border-white/30"
              >
                Explorar más
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores de slides */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <div className="flex space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-saffron-400 scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Overlay inferior con información adicional */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent p-6">
        <div className="container mx-auto">
          <div className="flex items-end justify-between">
            <div className="text-white">
              <h3 className="text-xl font-semibold mb-1">{currentItem.title}</h3>
              <p className="text-white/80 text-sm">
                {currentItem.venue && `${currentItem.venue} • `}{currentItem.city}
              </p>
            </div>
            {items.length > 1 && (
              <div className="text-white/60 text-sm">
                {currentIndex + 1} / {items.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}