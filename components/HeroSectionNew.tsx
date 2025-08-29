"use client";

import { FeaturedCarousel, FeaturedItem } from "./FeaturedCarousel";

type HeroSectionProps = {
  featuredItems?: FeaturedItem[];
  fallbackItems?: FeaturedItem[];
};

export function HeroSection({ featuredItems, fallbackItems }: HeroSectionProps) {
  // Si no hay items destacados, usar los de fallback (datos estáticos)
  const itemsToShow = featuredItems && featuredItems.length > 0 ? featuredItems : fallbackItems || [];

  if (itemsToShow.length === 0) {
    return (
      <div className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/40">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Descubre los mejores sabores de A Coruña
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Tu guía definitiva para la mejor gastronomía local
          </p>
        </div>
      </div>
    );
  }

  return (
    <FeaturedCarousel 
      items={itemsToShow}
      autoPlay={true}
      autoPlayInterval={7000}
      showDots={true}
      showArrows={true}
    />
  );
}
