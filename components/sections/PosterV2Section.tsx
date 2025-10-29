'use client';

import { HomepageSection, SelectedItem } from '@/types/homepage';
import Image from 'next/image';
import Link from 'next/link';

interface PosterV2SectionProps {
  section: HomepageSection;
}

export default function PosterV2Section({ section }: PosterV2SectionProps) {
  const { config } = section;

  if (!config.selectedItems.length) {
    return null;
  }

  return (
    <section className="py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(config.displayTitle || config.subtitle) && (
          <div className="mb-6 text-center">
            {config.displayTitle && (
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {config.displayTitle}
              </h2>
            )}
            {config.subtitle && (
              <p className="text-gray-600">
                {config.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Items Grid - More compact version */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {config.selectedItems.map((item) => (
            <PosterV2Card key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PosterV2Card({ item }: { item: SelectedItem }) {
  const getHref = () => {
    switch (item.type) {
      case 'venue':
        return `/${item.city}/${item.slug}`;
      case 'review':
        return `/${item.city}/reviews/review/${item.slug}`;
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
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
        {/* Image - Shorter aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
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

        {/* Content - More compact */}
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