'use client';

import { HomepageSection, SelectedItem } from '@/types/homepage';
import Image from 'next/image';
import Link from 'next/link';

interface BannerSectionProps {
  section: HomepageSection;
}

export default function BannerSection({ section }: BannerSectionProps) {
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
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {config.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Items Grid - Panoramic banners */}
        <div className="space-y-6">
          {config.selectedItems.map((item) => (
            <BannerCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BannerCard({ item }: { item: SelectedItem }) {
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
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden group">
        {/* Banner Image - 16:9 aspect ratio */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          )}
          
          {/* Overlay content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Type badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 text-gray-900 text-sm font-medium px-3 py-1 rounded-full">
              {getTypeLabel()}
            </span>
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2 line-clamp-2">
              {item.title}
            </h3>
            
            {/* Metadata */}
            <div className="flex items-center text-sm text-white/80 space-x-3">
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
      </div>
    </Link>
  );
}