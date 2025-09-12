'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Star, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReviewCard } from '@/components/CardReview';
import { VenueCard } from '@/components/CardVenue';
import { TagChips } from '@/components/TagChips';
import { CardGridSkeleton } from '@/components/Skeletons';
import { cn } from '@/components/ui/utils';

interface TopicPageModernProps {
  topic: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    emoji?: string;
    color?: string;
    reviewCount?: number;
    featured?: boolean;
  };
  reviews?: any[];
  venues?: any[];
  loading?: boolean;
}

const FILTER_OPTIONS = {
  sortBy: [
    { id: 'newest', label: 'Más recientes', value: 'newest' },
    { id: 'oldest', label: 'Más antiguos', value: 'oldest' },
    { id: 'rating', label: 'Mejor puntuados', value: 'rating' },
    { id: 'popular', label: 'Más populares', value: 'popular' },
  ],
  priceRange: [
    { id: 'all', label: 'Todos los precios', value: 'all' },
    { id: 'budget', label: 'Económico (€)', value: '1' },
    { id: 'mid', label: 'Moderado (€€)', value: '2' },
    { id: 'high', label: 'Caro (€€€)', value: '3' },
    { id: 'luxury', label: 'Muy caro (€€€€)', value: '4' },
  ],
  rating: [
    { id: 'all', label: 'Todas las puntuaciones', value: 'all' },
    { id: 'excellent', label: '4.5+ Excelente', value: '4.5' },
    { id: 'very-good', label: '4.0+ Muy bueno', value: '4.0' },
    { id: 'good', label: '3.5+ Bueno', value: '3.5' },
  ],
};

export const TopicPageModern: React.FC<TopicPageModernProps> = ({
  topic,
  reviews = [],
  venues = [],
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    sortBy: 'newest',
    priceRange: 'all',
    rating: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'venues'>('reviews');

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleChipToggle = (chipId: string, filterType: string) => {
    const isSelected = selectedFilters[filterType as keyof typeof selectedFilters] === chipId;
    handleFilterChange(filterType, isSelected ? 'all' : chipId);
  };

  const filteredReviews = reviews.filter(review =>
    review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.tldr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (venue.description && venue.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Inicio
            </Link>
          </li>
          <li>
            <span className="mx-2 text-gray-300">/</span>
            <Link href="/topics" className="hover:text-gray-700 transition-colors">
              Temas
            </Link>
          </li>
          <li>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-900" aria-current="page">
              {topic.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* Topic Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          {topic.emoji && (
            <span className="text-4xl">{topic.emoji}</span>
          )}
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900">
            {topic.name}
          </h1>
        </div>
        
        {topic.description && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            {topic.description}
          </p>
        )}

        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          {topic.reviewCount && (
            <span>
              {topic.reviewCount} {topic.reviewCount === 1 ? 'reseña' : 'reseñas'}
            </span>
          )}
          {topic.featured && (
            <Badge variant="secondary" className="bg-primary-100 text-primary-800">
              Destacado
            </Badge>
          )}
        </div>
      </header>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar reseñas y locales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveTab('reviews')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === 'reviews'
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Reseñas ({filteredReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('venues')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === 'venues'
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Locales ({filteredVenues.length})
            </button>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Filtrar resultados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por:
                </label>
                <TagChips
                  chips={FILTER_OPTIONS.sortBy}
                  selectedChips={[selectedFilters.sortBy]}
                  onChipToggle={(chipId) => handleChipToggle(chipId, 'sortBy')}
                  variant="filter"
                  multiSelect={false}
                  size="sm"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de precios:
                </label>
                <TagChips
                  chips={FILTER_OPTIONS.priceRange}
                  selectedChips={[selectedFilters.priceRange]}
                  onChipToggle={(chipId) => handleChipToggle(chipId, 'priceRange')}
                  variant="filter"
                  multiSelect={false}
                  size="sm"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntuación mínima:
                </label>
                <TagChips
                  chips={FILTER_OPTIONS.rating}
                  selectedChips={[selectedFilters.rating]}
                  onChipToggle={(chipId) => handleChipToggle(chipId, 'rating')}
                  variant="filter"
                  multiSelect={false}
                  size="sm"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results */}
      <main>
        {loading ? (
          <CardGridSkeleton 
            count={6} 
            type={activeTab === 'venues' ? 'venue' : 'review'} 
          />
        ) : (
          <>
            {activeTab === 'reviews' && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Reseñas de {topic.name}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredReviews.length} resultados
                  </span>
                </div>

                {filteredReviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReviews.map((review) => (
                      <ReviewCard
                        key={review._id}
                        id={review._id}
                        title={review.title}
                        image={review.gallery?.asset.url || ''}
                        rating={review.ratings.food / 2}
                        location={review.venue.city}
                        readTime={review.readTime || '5 min'}
                        tags={review.tags || []}
                        description={review.tldr}
                        href={review.href || `/${review.venue.citySlug}/${review.venue.slug.current}/review/${review.slug.current}`}
                        size="md"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No se encontraron reseñas que coincidan con tu búsqueda.</p>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'venues' && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Locales de {topic.name}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredVenues.length} resultados
                  </span>
                </div>

                {filteredVenues.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVenues.map((venue) => (
                      <VenueCard
                        key={venue._id}
                        id={venue._id}
                        name={venue.name}
                        image={venue.gallery?.[0]?.asset.url || ''}
                        averageRating={venue.averageRating || 4.0}
                        reviewCount={venue.reviewCount || 0}
                        address={venue.address}
                        neighborhood={venue.neighborhood}
                        priceLevel={venue.priceLevel || 2}
                        cuisine={venue.cuisine}
                        href={venue.href || `/${venue.citySlug}/${venue.slug.current}`}
                        size="md"
                        isOpen={venue.isOpen}
                        openingHours={venue.openingHours}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No se encontraron locales que coincidan con tu búsqueda.</p>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default TopicPageModern;