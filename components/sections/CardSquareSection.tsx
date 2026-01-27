'use client';

import { HomepageSection, SelectedItem } from '@/types/homepage';
import Image from 'next/image';
import Link from 'next/link';
import { getVenueUrl, getReviewUrl } from '@/lib/utils';

interface CardSquareSectionProps {
  section: HomepageSection;
}

export default function CardSquareSection({ section }: CardSquareSectionProps) {
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

        {/* Items Grid - Square cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {config.selectedItems.map((item) => (
            <SquareCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SquareCard({ item }: { item: SelectedItem }) {
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
        {/* Square Image - 1:1 aspect ratio */}
        <div className="relative aspect-square overflow-hidden">
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          )}
          
          {/* Type badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-full">
              {getTypeLabel()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
            {item.title}
          </h3>
          
          {/* Metadata */}
          <div className="text-xs text-gray-500">
            {item.city && (
              <span className="truncate">{item.city}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}