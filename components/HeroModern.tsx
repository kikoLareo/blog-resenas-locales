'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TrendingUp, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel } from '@/components/Carousel';
import CarouselFullScreen from '@/components/CarouselFullScreen';
import { ReviewCard } from '@/components/CardReview';
import { VenueCard } from '@/components/CardVenue';
import { RatingStars } from '@/components/RatingStars';
import { cn } from '@/components/ui/utils';

interface HeroModernProps {
  featuredItems?: any[];
  className?: string;
}

export const HeroModern: React.FC<HeroModernProps> = ({
  featuredItems = [],
  className,
}) => {
  // Convert featured items to our format
  const heroItems = featuredItems.length > 0 ? featuredItems.map(item => ({
    id: item.id,
    title: item.customTitle || item.title,
    description: item.customDescription || item.description,
    image: item.customImage || item.image,
    href: item.href,
    rating: item.rating,
    location: item.location,
    tags: item.tags || [],
    type: item.type,
  })) : [
    {
      id: '1',
      title: 'Los mejores restaurantes de España',
      description: 'Descubre lugares únicos con reseñas auténticas y recomendaciones de expertos',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
      href: '/reviews',
      type: 'collection',
    },
    {
      id: '2', 
      title: 'Cocina mediterránea excepcional',
      description: 'Sabores auténticos del Mediterráneo que despiertan todos los sentidos',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&q=80',
      href: '/topics/cocina-mediterranea',
      rating: 4.8,
      location: 'Barcelona',
      type: 'review',
    },
    {
      id: '3',
      title: 'Guía gastronómica por ciudades',
      description: 'Explora las mejores propuestas culinarias ciudad por ciudad',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80',
      href: '/cities',
      type: 'guide',
    },
  ];

  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* Fullscreen image carousel hero */}
      <CarouselFullScreen
        images={heroItems.map((h) => ({ src: h.image, alt: h.title }))}
        autoPlay
        intervalMs={6000}
        showArrows
        showDots
      >
        {/* Overlay content: same hero copy, centered */}
        <Badge variant="secondary" className="mb-4 bg-primary-100 text-primary-800 inline-flex items-center gap-2">
          <TrendingUp className="h-3 w-3" />
          Blog de reseñas gastronómicas
        </Badge>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          Descubre sabores
          <br />
          <span className="text-primary-300">auténticos</span>
        </h1>

        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-6">
          Reseñas honestas y detalladas de los mejores restaurantes, bares y locales gastronómicos de España.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="gap-2">
            <Link href="/reviews">
              Explorar reseñas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="/venues">
              Buscar locales
            </Link>
          </Button>
        </div>
      </CarouselFullScreen>

      {/* After the fullscreen hero, keep the featured carousel section (unchanged) */}
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 bg-white dark:bg-gray-950">
        {/* Featured Carousel */}
        {heroItems.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
                Destacados de la semana
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Una selección especial de nuestras mejores reseñas y descubrimientos gastronómicos más recientes
              </p>
            </div>

            <Carousel
              showArrows={true}
              showDots={true}
              autoPlay={true}
              autoPlayInterval={5000}
              itemsPerView={{
                sm: 1,
                md: 2,
                lg: 3,
                xl: 3,
              }}
              gap={24}
              infinite={true}
              className="max-w-6xl mx-auto"
            >
              {heroItems.map((item) => (
                <div key={item.id} className="h-full">
                  <Link href={item.href} className="block group h-full">
                    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                      <div className="relative aspect-video overflow-hidden">
                        <div className="w-full h-full relative">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        {item.rating && (
                          <div className="absolute top-4 left-4">
                            <div className="flex items-center gap-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                              <RatingStars rating={item.rating} size="sm" showValue />
                            </div>
                          </div>
                        )}
                        {item.location && (
                          <div className="absolute top-4 right-4">
                            <div className="flex items-center gap-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium dark:text-white">
                              {item.location}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="font-serif text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                          {item.description}
                        </p>
                      </div>

                      <div className="absolute bottom-4 right-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-medium",
                            item.type === 'review' && "bg-blue-50 text-blue-700 border-blue-200",
                            item.type === 'venue' && "bg-green-50 text-green-700 border-green-200",
                            item.type === 'guide' && "bg-purple-50 text-purple-700 border-purple-200",
                            item.type === 'collection' && "bg-orange-50 text-orange-700 border-orange-200",
                          )}
                        >
                          {item.type === 'review' && 'Reseña'}
                          {item.type === 'venue' && 'Local'}
                          {item.type === 'guide' && 'Guía'}
                          {item.type === 'collection' && 'Colección'}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center bg-white dark:bg-gray-900 rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100 dark:border-gray-800">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white mb-4">
              ¿Eres propietario de un restaurante?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Únete a nuestra comunidad gastronómica y comparte tu pasión por la buena cocina.
              Conecta con foodielovers que buscan experiencias auténticas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                Registrar mi local
              </Button>
              <Button variant="ghost" size="lg">
                Más información
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration (kept for visual cadence below hero) */}
      <div className="absolute top-0 right-0 -z-10 opacity-5">
        <svg width="404" height="404" fill="none" viewBox="0 0 404 404" className="text-primary-600">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="404" fill="url(#hero-pattern)" />
        </svg>
      </div>
    </section>
  );
};

// Individual hero card component
const HeroCard: React.FC<{ item: any }> = ({ item }) => {
  return (
    <Link href={item.href} className="block group h-full">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <div className="w-full h-full relative">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
            />
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Rating badge */}
          {item.rating && (
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                <RatingStars rating={item.rating} size="sm" showValue />
              </div>
            </div>
          )}

          {/* Location badge */}
          {item.location && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium dark:text-white">
                <MapPin className="h-3 w-3" />
                {item.location}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-serif text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
              <Clock className="h-3.5 w-3.5" />
              <span>{item.readTime || '5 min'}</span>
            </div>
            
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs font-medium",
                item.type === 'review' && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
                item.type === 'venue' && "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
                item.type === 'guide' && "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
                item.type === 'collection' && "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
              )}
            >
              {item.type === 'review' && 'Reseña'}
              {item.type === 'venue' && 'Local'}
              {item.type === 'guide' && 'Guía'}
              {item.type === 'collection' && 'Colección'}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HeroModern;