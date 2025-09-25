'use client';

import React from 'react';
import { ReviewCard } from '@/components/CardReview';
import { VenueCard } from '@/components/CardVenue';
import { Carousel } from '@/components/Carousel';
import { cn } from '@/components/ui/utils';

interface SuggestionItem {
  id: string;
  type: 'review' | 'venue';
  title: string;
  name?: string; // for venues
  image: string;
  rating: number;
  location: string;
  href: string;
  // Review specific
  readTime?: string;
  tags?: string[];
  description?: string;
  // Venue specific
  averageRating?: number;
  reviewCount?: number;
  address?: string;
  neighborhood?: string;
  priceLevel?: number;
  cuisine?: string;
  isOpen?: boolean;
  openingHours?: string;
}

interface SuggestionsRailProps {
  title: string;
  items: SuggestionItem[];
  className?: string;
  showArrows?: boolean;
  autoPlay?: boolean;
}

export const SuggestionsRail: React.FC<SuggestionsRailProps> = ({
  title,
  items,
  className,
  showArrows = true,
  autoPlay = false,
}) => {
  if (items.length === 0) {
    return null;
  }

  const renderItem = (item: SuggestionItem) => {
    if (item.type === 'venue') {
      return (
        <VenueCard
          key={item.id}
          id={item.id}
          name={item.name || item.title}
          image={item.image}
          averageRating={item.averageRating || item.rating}
          reviewCount={item.reviewCount || 0}
          address={item.address || item.location}
          neighborhood={item.neighborhood}
          priceLevel={item.priceLevel || 2}
          cuisine={item.cuisine}
          href={item.href}
          size="md"
          isOpen={item.isOpen}
          openingHours={item.openingHours}
        />
      );
    }

    return (
      <ReviewCard
        key={item.id}
        id={item.id}
        title={item.title}
        image={item.image}
        rating={item.rating}
        location={item.location}
        readTime={item.readTime || '5 min'}
        tags={item.tags || []}
        description={item.description}
        href={item.href}
        size="md"
        imageAspectRatio="video"
      />
    );
  };

  return (
    <section className={cn("space-y-6", className)}>
      {/* Section title */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold text-gray-900 sm:text-3xl">
          {title}
        </h2>
      </div>

      {/* Carousel */}
      <Carousel
        showArrows={showArrows}
        showDots={false}
        autoPlay={autoPlay}
        autoPlayInterval={5000}
        itemsPerView={{
          sm: 1,
          md: 2,
          lg: 3,
          xl: 4,
        }}
        gap={24}
        infinite={true}
        className="w-full"
      >
        {items.map((item) => renderItem(item))}
      </Carousel>
    </section>
  );
};

export default SuggestionsRail;