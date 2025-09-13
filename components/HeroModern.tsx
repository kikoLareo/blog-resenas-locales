'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel } from '@/components/Carousel';
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
    <section className={cn("relative overflow-hidden bg-gradient-to-br from-primary-50 to-white", className)}>
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-primary-100 text-primary-800">
            <TrendingUp className="h-3 w-3 mr-1" />
            Blog de reseñas gastronómicas
          </Badge>
          
          <h1 className="font-serif text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Descubre sabores
            <br />
            <span className="text-primary-600">auténticos</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Reseñas honestas y detalladas de los mejores restaurantes, bares y locales gastronómicos de España.
            Tu guía confiable para experiencias culinarias inolvidables.
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
        </div>

        {/* Featured Carousel */}
        {heroItems.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
                Destacados de la semana
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
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
                  <HeroCard item={item} />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
              ¿Eres propietario de un restaurante?
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
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

      {/* Background decoration */}
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
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Rating badge */}
          {item.rating && (
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                <RatingStars rating={item.rating} size="sm" showValue />
              </div>
            </div>
          )}

          {/* Location badge */}
          {item.location && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                <MapPin className="h-3 w-3" />
                {item.location}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {item.title}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {item.description}
          </p>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{item.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Type indicator */}
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
  );
};

export default HeroModern;