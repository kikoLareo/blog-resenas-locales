import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Euro } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VenueCardProps {
  venue: {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    address: string;
    priceRange?: string;
    images?: Array<{
      asset: {
        _id: string;
        url: string;
      };
      alt?: string;
    }>;
    city: {
      _id: string;
      title: string;
      slug: string;
    };
    categories: Array<{
      _id: string;
      title: string;
      slug: string;
      color?: string;
    }>;
    averageRating?: number;
    reviewCount?: number;
  };
}

export default function VenueCard({ venue }: VenueCardProps) {
  const venueUrl = `/${venue.city.slug}/${venue.slug}`;
  const mainImage = venue.images?.[0];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={venueUrl}>
        <div className="relative h-48 bg-gray-200">
          {mainImage ? (
            <Image
              src={mainImage.asset.url}
              alt={mainImage.alt || venue.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
          
          {/* Precio */}
          {venue.priceRange && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-800">
                {venue.priceRange}
              </Badge>
            </div>
          )}

          {/* Rating */}
          {venue.averageRating && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-500 text-white">
                <Star className="h-3 w-3 mr-1 fill-current" />
                {venue.averageRating.toFixed(1)}
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Título */}
          <div>
            <Link href={venueUrl}>
              <h3 className="font-semibold text-lg text-gray-900 hover:text-orange-600 transition-colors">
                {venue.title}
              </h3>
            </Link>
          </div>

          {/* Descripción */}
          {venue.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {venue.description}
            </p>
          )}

          {/* Dirección */}
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{venue.address}</span>
          </div>

          {/* Categorías */}
          {venue.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {venue.categories.slice(0, 3).map((category) => (
                <Link
                  key={category._id}
                  href={`/categorias/${category.slug}`}
                >
                  <Badge 
                    variant="outline" 
                    className="text-xs hover:bg-gray-100 transition-colors"
                    style={{ 
                      borderColor: category.color, 
                      color: category.color 
                    }}
                  >
                    {category.title}
                  </Badge>
                </Link>
              ))}
              {venue.categories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{venue.categories.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Info adicional */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <span>{venue.city.title}</span>
            </div>
            {venue.reviewCount && (
              <span>
                {venue.reviewCount} reseña{venue.reviewCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}