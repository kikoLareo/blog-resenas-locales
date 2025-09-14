"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Filter, Grid3X3, List } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  color?: string;
  emoji?: string;
  description?: string;
  trending?: boolean;
}

interface CategorySectionProps {
  categories: Category[];
  title?: string;
  description?: string;
  showAll?: boolean;
  maxDisplay?: number;
  layout?: 'grid' | 'list';
  className?: string;
}

export function CategorySectionEnhanced({
  categories,
  title = "Explora por categorías",
  description = "Descubre nuevos sabores navegando por tipos de cocina, estilos gastronómicos y especialidades culinarias",
  showAll = true,
  maxDisplay = 10,
  layout = 'grid',
  className = "",
}: CategorySectionProps) {
  const [selectedLayout, setSelectedLayout] = useState<'grid' | 'list'>(layout);
  const [visibleCategories, setVisibleCategories] = useState(maxDisplay);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayedCategories = categories.slice(0, visibleCategories);
  const hasMore = categories.length > visibleCategories;

  const loadMore = () => {
    const newVisible = Math.min(visibleCategories + maxDisplay, categories.length);
    setVisibleCategories(newVisible);
    setIsExpanded(newVisible >= categories.length);
  };

  const showLess = () => {
    setVisibleCategories(maxDisplay);
    setIsExpanded(false);
    // Scroll back to top of section
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sort categories by count (trending first, then by count)
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.trending && !b.trending) return -1;
    if (!a.trending && b.trending) return 1;
    return b.count - a.count;
  });

  return (
    <section ref={scrollRef} className={`section-padding ${className}`}>
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gradient">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Layout Toggle */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up stagger-1">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {categories.length} categorías disponibles
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedLayout('grid')}
              className={`p-2 rounded-lg transition-colors ${
                selectedLayout === 'grid'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedLayout('list')}
              className={`p-2 rounded-lg transition-colors ${
                selectedLayout === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Grid/List */}
        <div
          className={`
            animate-fade-in-up stagger-2
            ${selectedLayout === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
              : 'space-y-3'
            }
          `}
        >
          {displayedCategories.map((category, index) => (
            <CategoryItem
              key={category.id}
              category={category}
              layout={selectedLayout}
              index={index}
            />
          ))}
        </div>

        {/* Load More / Show Less */}
        {categories.length > maxDisplay && (
          <div className="text-center mt-8 animate-fade-in-up stagger-3">
            {hasMore && !isExpanded ? (
              <button
                onClick={loadMore}
                className="btn-outline group"
              >
                <span>Ver más categorías</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            ) : isExpanded ? (
              <button
                onClick={showLess}
                className="btn-outline"
              >
                Mostrar menos
              </button>
            ) : null}
          </div>
        )}

        {/* View All Link */}
        {showAll && (
          <div className="text-center mt-8 animate-fade-in-up stagger-4">
            <Link href="/categorias" className="btn-primary group">
              <span>Ver todas las categorías</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

interface CategoryItemProps {
  category: Category;
  layout: 'grid' | 'list';
  index: number;
}

function CategoryItem({ category, layout, index }: CategoryItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (layout === 'list') {
    return (
      <Link
        href={`/categorias/${category.slug}`}
        className="category-button justify-between group animate-fade-in-left"
        style={{ animationDelay: `${index * 0.05}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-3">
          {category.emoji && (
            <span className="text-2xl">{category.emoji}</span>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">
                {category.name}
              </span>
              {category.trending && (
                <span className="badge-popular text-xs">
                  Trending
                </span>
              )}
            </div>
            {category.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                {category.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="category-count">
            {category.count}
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/categorias/${category.slug}`}
      className="category-button flex-col items-center text-center group animate-scale-in"
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon/Emoji */}
      <div className="relative mb-3">
        {category.emoji ? (
          <span className="text-3xl transition-transform group-hover:scale-110">
            {category.emoji}
          </span>
        ) : (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: category.color || '#ef6820' }}
          >
            {category.name.charAt(0)}
          </div>
        )}
        
        {/* Trending Badge */}
        {category.trending && (
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
          </div>
        )}
      </div>

      {/* Category Name */}
      <h3 className="font-medium text-foreground mb-1 line-clamp-1">
        {category.name}
      </h3>

      {/* Description */}
      {category.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {category.description}
        </p>
      )}

      {/* Count */}
      <div className="category-count mt-auto">
        {category.count}
      </div>
    </Link>
  );
}

// Skeleton loader for categories
export function CategorySectionSkeleton() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-12">
          <div className="h-10 bg-muted rounded w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-muted rounded w-96 mx-auto animate-pulse" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="card p-4 text-center animate-pulse">
              <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3" />
              <div className="h-5 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded w-2/3 mx-auto mb-2" />
              <div className="h-6 bg-muted rounded w-8 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}