'use client';

import { HomepageSection, SelectedItem } from '@/types/homepage';
import Image from 'next/image';
import Link from 'next/link';
import { getVenueUrl, getReviewUrl } from '@/lib/utils';

interface PosterSectionProps {
  section: HomepageSection;
}

export default function PosterSection({ section }: PosterSectionProps) {
  const { config } = section;

  if (!config.selectedItems.length) {
    return null;
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(config.displayTitle || config.subtitle) && (
          <div className="mb-8 text-center">
            {config.displayTitle && (
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {config.displayTitle}
              </h2>
            )}
            {config.subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {config.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.selectedItems.map((item) => (
            <PosterCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PosterCard({ item }: { item: SelectedItem }) {
  const getHref = () => {
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
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'venue':
        return 'Local';
      case 'review':
        return 'Reseña';
      case 'category':
        return 'Categoría';
      case 'city':
        return 'Ciudad';
      default:
        return item.type;
    }
  };

  return (
    <Link href={getHref()}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          )}
          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-full">
              {getTypeLabel()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {item.title}
          </h3>
          
          {/* Metadata */}
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            {item.venue && (
              <span className="truncate">{item.venue}</span>
            )}
            {item.city && (
              <>
                {item.venue && <span>•</span>}
                <span className="truncate">{item.city}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}