"use client";

import { TrendingUp, Star, MapPin, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { slugify } from "@/lib/slug";
import { ReviewCard } from "./ReviewCard";

type ReviewItem = {
  id: string;
  title: string;
  image: string;
  rating: number;
  location: string;
  readTime: string;
  tags: string[];
  description: string;
  href?: string;
};

const trendingReviews: ReviewItem[] = [
  {
    id: "4",
    title: "Sushi de alta calidad en un ambiente acogedor",
    image: "https://images.unsplash.com/photo-1717988732486-285ea23a6f88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGphcGFuZXNlJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NTUyOTM4ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.7,
    location: "Chamberí, Madrid",
    readTime: "6 min",
    tags: ["Sushi", "Japonés", "Fresh"],
    description: "Pescado fresco traído directamente de Japón y técnicas tradicionales en el corazón de Madrid."
  },
  {
    id: "5",
    title: "La hamburguesa gourmet que marca tendencia",
    image: "https://images.unsplash.com/photo-1637710847214-f91d99669e18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU1MzU1MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8,
    location: "Chueca, Madrid",
    readTime: "4 min",
    tags: ["Burger", "Gourmet", "American"],
    description: "Carne wagyu, pan brioche casero y combinaciones únicas que elevan la hamburguesa a otro nivel."
  }
];

const topRatedReviews: ReviewItem[] = [
  {
    id: "6",
    title: "Platos de autor que despiertan los sentidos",
    image: "https://images.unsplash.com/photo-1750943082020-4969b2a63084?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGxhdGluZyUyMGdvdXJtZXR8ZW58MXx8fHwxNzU1MzU1MDcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    location: "Salamanca, Madrid",
    readTime: "7 min",
    tags: ["Fine Dining", "Autor", "Innovación"],
    description: "Cada plato es una obra de arte que combina técnicas moleculares con sabores tradicionales."
  }
];

interface FeaturedSectionsProps {
  onReviewClick?: (reviewId: string) => void;
  trending?: ReviewItem[];
  topRated?: ReviewItem[];
}

export function FeaturedSections({ onReviewClick, trending, topRated }: FeaturedSectionsProps) {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 space-y-12 sm:space-y-16">
        <div>
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 letter-tight">Locales de moda</h2>
            </div>
            <Button variant="ghost" className="text-accent hover:text-accent/80 font-medium text-sm sm:text-base">
              Ver todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {(trending && trending.length > 0 ? trending : trendingReviews).map((review) => (
              <ReviewCard
                key={review.id}
                {...review}
                href={review.href || `/madrid/restaurant-x/review/${slugify(review.title)}`}
                onClick={() => onReviewClick?.(review.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 letter-tight">Mejor valorados</h2>
            </div>
            <Button variant="ghost" className="text-accent hover:text-accent/80 font-medium text-sm sm:text-base">
              Ver todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {(topRated && topRated.length > 0 ? topRated : topRatedReviews).map((review) => (
              <ReviewCard
                key={review.id}
                {...review}
                href={review.href || `/madrid/restaurant-x/review/${slugify(review.title)}`}
                onClick={() => onReviewClick?.(review.id)}
              />
            ))}
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6 sm:p-8 flex items-center justify-center min-h-[250px] sm:min-h-[300px]">
              <div className="text-center text-gray-400">
                <div className="text-sm mb-2 font-medium">Espacio publicitario</div>
                <div className="text-xs">300x250px</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 letter-tight">Cerca de ti</h2>
            </div>
            <Button variant="ghost" className="text-accent hover:text-accent/80 font-medium text-sm sm:text-base">
              Ver todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 sm:p-12 text-center">
            <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">Descubre locales cerca de ti</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
              Activa la geolocalización para encontrar las mejores reseñas de tu zona
            </p>
            <Button className="bg-accent hover:bg-accent/90 font-medium">Activar ubicación</Button>
          </div>
        </div>
      </div>
    </section>
  );
}


