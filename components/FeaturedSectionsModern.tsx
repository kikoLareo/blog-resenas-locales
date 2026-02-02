'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReviewCard } from '@/components/CardReview';
import { VenueCard } from '@/components/CardVenue';
import { TagChips } from '@/components/TagChips';
import { cn } from '@/components/ui/utils';

interface FeaturedSectionsModernProps {
  trending?: any[];
  topRated?: any[];
  categories?: any[];
  venues?: any[];
  className?: string;
}

export const FeaturedSectionsModern: React.FC<FeaturedSectionsModernProps> = ({
  trending = [],
  topRated = [],
  categories = [],
  venues = [],
  className,
}) => {
  // Mock data for categories if not provided
  const defaultCategories = [
    { id: 'mediterranea', label: 'Mediterránea', value: 'mediterranea', count: 24, color: 'primary' as const },
    { id: 'asiatica', label: 'Asiática', value: 'asiatica', count: 18, color: 'success' as const },
    { id: 'italiana', label: 'Italiana', value: 'italiana', count: 32, color: 'warning' as const },
    { id: 'mariscos', label: 'Mariscos', value: 'mariscos', count: 15, color: 'default' as const },
    { id: 'vegano', label: 'Vegano', value: 'vegano', count: 12, color: 'secondary' as const },
    { id: 'fine-dining', label: 'Fine Dining', value: 'fine-dining', count: 8, color: 'danger' as const },
  ];

  const categoryChips = categories.length > 0 
    ? categories.map((cat: any) => ({
        id: cat.slug || cat.id,
        label: cat.name || cat.title,
        value: cat.slug || cat.id,
        count: cat.reviewCount || cat.count,
        color: 'default' as const,
      }))
    : defaultCategories;

  return (
    <div className={cn("max-w-7xl mx-auto px-4 py-16 space-y-16", className)}>
      {/* Trending Reviews Section */}
      {trending.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                <Badge variant="secondary" className="bg-primary-100 text-primary-800">
                  Tendencia
                </Badge>
              </div>
              <h2 className="font-serif text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                Lo más popular esta semana
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                Las reseñas que más están disfrutando nuestros lectores y las experiencias gastronómicas del momento
              </p>
            </div>
            <Button variant="outline" asChild className="hidden lg:flex">
              <Link href="/reviews?filter=trending">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {trending.slice(0, 6).map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                title={review.title}
                image={review.image}
                rating={review.rating}
                location={review.location}
                readTime={review.readTime}
                tags={review.tags}
                description={review.description}
                href={review.href}
                size="md"
              />
            ))}
          </div>

          <div className="text-center lg:hidden">
            <Button variant="outline" asChild>
              <Link href="/reviews?filter=trending">
                Ver todas las tendencias
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Top Rated Section */}
      {topRated.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Mejor puntuados
                </Badge>
              </div>
              <h2 className="font-serif text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                Experiencias excepcionales
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                Los restaurantes y experiencias gastronómicas con las mejores valoraciones de nuestros críticos
              </p>
            </div>
            <Button variant="outline" asChild className="hidden lg:flex">
              <Link href="/reviews?filter=top-rated">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {topRated.slice(0, 6).map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                title={review.title}
                image={review.image}
                rating={review.rating}
                location={review.location}
                readTime={review.readTime}
                tags={review.tags}
                description={review.description}
                href={review.href}
                size="md"
              />
            ))}
          </div>

          <div className="text-center lg:hidden">
            <Button variant="outline" asChild>
              <Link href="/reviews?filter=top-rated">
                Ver todos los mejor puntuados
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-semibold text-gray-900 dark:text-white mb-4">
            Explora por categorías
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Descubre nuevos sabores navegando por tipos de cocina, estilos gastronómicos y especialidades culinarias
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <TagChips
            chips={categoryChips}
            onChipToggle={(chipId) => {
              // Handle category selection - could navigate to category page
              window.location.href = `/topics/${chipId}`;
            }}
            variant="default"
            size="md"
            showCount={true}
            className="max-w-4xl"
          />
        </div>

        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/topics">
              Ver todas las categorías
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Venues Section */}
      {venues.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900/40 rounded-3xl p-8 lg:p-12 border dark:border-gray-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Locales destacados
                </Badge>
              </div>
              <h2 className="font-serif text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                Descubre lugares únicos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                Una selección especial de restaurantes, bares y locales gastronómicos que no te puedes perder
              </p>
            </div>
            <Button variant="outline" asChild className="hidden lg:flex">
              <Link href="/venues">
                Explorar locales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {venues.slice(0, 6).map((venue) => (
              <VenueCard
                key={venue.id}
                id={venue.id}
                name={venue.name}
                image={venue.image}
                averageRating={venue.averageRating}
                reviewCount={venue.reviewCount}
                address={venue.address}
                neighborhood={venue.neighborhood}
                priceLevel={venue.priceLevel}
                cuisine={venue.cuisine}
                href={venue.href}
                size="md"
                isOpen={venue.isOpen}
                openingHours={venue.openingHours}
              />
            ))}
          </div>

          <div className="text-center lg:hidden">
            <Button variant="outline" asChild>
              <Link href="/venues">
                Explorar todos los locales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="text-center bg-primary-900 text-white rounded-3xl p-8 lg:p-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold mb-4">
            No te pierdas ni un bocado
          </h2>
          <p className="text-primary-100 mb-8 leading-relaxed">
            Recibe nuestras mejores reseñas, descubrimientos gastronómicos y ofertas exclusivas 
            directamente en tu bandeja de entrada
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-300"
            />
            <Button size="lg" className="bg-white text-primary-900 hover:bg-gray-100">
              Suscribirse
            </Button>
          </div>
          <p className="text-xs text-primary-200 mt-4">
            Sin spam. Solo las mejores recomendaciones gastronómicas.
          </p>
        </div>
      </section>
    </div>
  );
};

export default FeaturedSectionsModern;