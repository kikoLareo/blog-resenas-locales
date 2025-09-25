"use client";

import { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Trophy, ChefHat, Utensils, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { getInternalLinkSuggestions, generateRelatedContentModule } from '@/lib/internal-linking';

interface LinkSuggestion {
  type: 'guide' | 'list' | 'recipe' | 'dish-guide' | 'venue' | 'review';
  title: string;
  url: string;
  relevanceScore: number;
  reason: string;
}

interface RelatedContentProps {
  contentType: string;
  contentId: string;
  contentData: any;
  className?: string;
  maxItems?: number;
  showReasons?: boolean;
}

const typeConfig = {
  guide: { icon: MapPin, label: 'Guía', color: 'text-blue-600' },
  list: { icon: Trophy, label: 'Ranking', color: 'text-yellow-600' },
  recipe: { icon: ChefHat, label: 'Receta', color: 'text-green-600' },
  'dish-guide': { icon: Utensils, label: 'Guía de Plato', color: 'text-purple-600' },
  venue: { icon: MapPin, label: 'Local', color: 'text-red-600' },
  review: { icon: ExternalLink, label: 'Reseña', color: 'text-indigo-600' },
};

export function RelatedContent({ 
  contentType, 
  contentId, 
  contentData, 
  className = "",
  maxItems = 6,
  showReasons = false
}: RelatedContentProps) {
  const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSuggestions() {
      try {
        setLoading(true);
        const results = await getInternalLinkSuggestions(contentType, contentId, contentData);
        setSuggestions(results.slice(0, maxItems));
      } catch (err) {
        setError('Error loading related content');
        console.error('Error loading related content:', err);
      } finally {
        setLoading(false);
      }
    }

    if (contentType && contentId && contentData) {
      loadSuggestions();
    }
  }, [contentType, contentId, contentData, maxItems]);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-2xl font-serif font-bold">También te puede interesar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || suggestions.length === 0) {
    return null;
  }

  const relatedModule = generateRelatedContentModule(suggestions);

  return (
    <section className={`space-y-6 ${className}`}>
      <h2 className="text-2xl font-serif font-bold">También te puede interesar</h2>
      
      {/* Guides Section */}
      {relatedModule.guides.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Guías Gastronómicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedModule.guides.map((suggestion, index) => (
              <RelatedContentCard 
                key={index} 
                suggestion={suggestion} 
                showReason={showReasons}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lists Section */}
      {relatedModule.lists.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Rankings y Listas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedModule.lists.map((suggestion, index) => (
              <RelatedContentCard 
                key={index} 
                suggestion={suggestion} 
                showReason={showReasons}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recipes Section */}
      {relatedModule.recipes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-green-600" />
            Recetas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedModule.recipes.map((suggestion, index) => (
              <RelatedContentCard 
                key={index} 
                suggestion={suggestion} 
                showReason={showReasons}
              />
            ))}
          </div>
        </div>
      )}

      {/* Venues Section */}
      {relatedModule.venues.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-600" />
            Locales Recomendados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {relatedModule.venues.map((suggestion, index) => (
              <RelatedContentCard 
                key={index} 
                suggestion={suggestion} 
                showReason={showReasons}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* Mixed Section for smaller lists */}
      {relatedModule.guides.length === 0 && relatedModule.lists.length === 0 && suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.slice(0, maxItems).map((suggestion, index) => (
            <RelatedContentCard 
              key={index} 
              suggestion={suggestion} 
              showReason={showReasons}
              showIcon
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface RelatedContentCardProps {
  suggestion: LinkSuggestion;
  showReason?: boolean;
  compact?: boolean;
  showIcon?: boolean;
}

function RelatedContentCard({ suggestion, showReason = false, compact = false, showIcon = false }: RelatedContentCardProps) {
  const config = typeConfig[suggestion.type];
  const IconComponent = config.icon;

  return (
    <Link href={suggestion.url} className="block group">
      <div className={`bg-card border rounded-xl p-4 hover:shadow-md transition-all group-hover:border-saffron-300 ${
        compact ? 'p-3' : 'p-4'
      }`}>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-medium line-clamp-2 group-hover:text-saffron-600 transition-colors ${
              compact ? 'text-sm' : 'text-base'
            }`}>
              {suggestion.title}
            </h4>
            {showIcon && (
              <IconComponent className={`h-4 w-4 flex-shrink-0 ${config.color}`} />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              config.color === 'text-blue-600' ? 'bg-blue-100 text-blue-700' :
              config.color === 'text-yellow-600' ? 'bg-yellow-100 text-yellow-700' :
              config.color === 'text-green-600' ? 'bg-green-100 text-green-700' :
              config.color === 'text-purple-600' ? 'bg-purple-100 text-purple-700' :
              config.color === 'text-red-600' ? 'bg-red-100 text-red-700' :
              'bg-indigo-100 text-indigo-700'
            }`}>
              {config.label}
            </span>
            
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-saffron-600 transition-colors" />
          </div>
          
          {showReason && (
            <p className="text-xs text-muted-foreground italic">
              {suggestion.reason}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// Componente simplificado para usar en sidebars
export function RelatedContentSidebar({ 
  contentType, 
  contentId, 
  contentData,
  title = "Relacionado",
  maxItems = 4 
}: RelatedContentProps & { title?: string }) {
  const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const results = await getInternalLinkSuggestions(contentType, contentId, contentData);
        setSuggestions(results.slice(0, maxItems));
      } catch (err) {
        console.error('Error loading related content:', err);
      } finally {
        setLoading(false);
      }
    }

    if (contentType && contentId && contentData) {
      loadSuggestions();
    }
  }, [contentType, contentId, contentData, maxItems]);

  if (loading || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border rounded-xl p-4 space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <Link key={index} href={suggestion.url} className="block group">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-2 h-2 bg-saffron-500 rounded-full flex-shrink-0 group-hover:bg-saffron-600"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2 group-hover:text-saffron-600 transition-colors">
                  {suggestion.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {typeConfig[suggestion.type].label}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
