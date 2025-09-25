'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';
import type { Venue } from '@/lib/types';

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md overflow-hidden">
      {/* Image */}
      <div className="aspect-video bg-gray-100 relative">
        {venue.images?.[0] ? (
          <Image
            src={(venue.images[0] as any).asset?.url || (venue.images[0] as any).url}
            alt={(venue.images[0] as any).alt || venue.title}
            fill
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Rating Badge */}
        {venue.avgRating && (
          <div className="absolute top-4 right-4">
            <div className="bg-white rounded-full px-3 py-1 shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-gray-900">
                {venue.avgRating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          <Link 
            href={`/${venue.city.slug.current}/${venue.slug.current}`}
            className="hover:text-blue-600 transition-colors"
          >
            {venue.title}
          </Link>
        </h3>

        {/* Address */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{venue.address}</span>
        </div>

        {/* Description */}
        {venue.description && (
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
            {venue.description}
          </p>
        )}

        {/* Categories and Price Range */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {venue.categories.slice(0, 2).map((category) => (
              <span
                key={category._id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                {category.title}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {venue.priceRange && (
              <span className="text-sm font-medium text-gray-900">
                {venue.priceRange}
              </span>
            )}
            {venue.reviewCount && venue.reviewCount > 0 && (
              <span className="text-sm text-gray-500">
                ({venue.reviewCount} reseña{venue.reviewCount !== 1 ? 's' : ''})
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}