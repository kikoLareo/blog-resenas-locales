"use client";

import { useState } from 'react';
import { Trophy, MapPin, Star, TrendingUp, ChevronRight, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';
import EnhancedFAQ from './EnhancedFAQ';

interface RankedVenue {
  position: number;
  venue: {
    _id: string;
    title: string;
    slug: { current: string };
    address: string;
    priceRange: string;
    images: Array<{
      asset: { url: string };
      alt: string;
    }>;
    categories: Array<{
      title: string;
      slug: { current: string };
    }>;
  };
  score?: number;
  highlight?: string;
  bestDish?: string;
  priceNote?: string;
  specialNote?: string;
}

interface ComparisonColumn {
  key: string;
  label: string;
  type: 'text' | 'price' | 'rating' | 'boolean';
}

interface ListDetailProps {
  list: {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt: string;
    listType: 'top-dish' | 'neighborhood-comparison' | 'price-range' | 'occasion' | 'city-best';
    dish?: string;
    city: {
      title: string;
      slug: { current: string };
    };
    neighborhoods?: string[];
    priceRange?: string;
    occasion?: string;
    heroImage: {
      asset: { url: string };
      alt: string;
    };
    introduction: any[];
    criteria: string[];
    rankedVenues: RankedVenue[];
    comparisonTable?: {
      enabled: boolean;
      columns: ComparisonColumn[];
    };
    verdict: any[];
    faq: Array<{
      question: string;
      answer: string;
    }>;
    relatedGuides?: Array<{
      title: string;
      slug: { current: string };
    }>;
    lastUpdated: string;
    publishedAt: string;
  };
  className?: string;
}

export function ListDetail({ list, className = "" }: ListDetailProps) {
  const [sortBy, setSortBy] = useState<'position' | 'score' | 'price'>('position');
  const [showComparison, setShowComparison] = useState(false);

  const typeLabels = {
    'top-dish': '🍽️ Top por Plato',
    'neighborhood-comparison': '📍 Comparativa de Barrios',
    'price-range': '💰 Por Rango de Precio',
    'occasion': '🎉 Por Ocasión',
    'city-best': '⭐ Mejores de la Ciudad',
  };

  const sortedVenues = [...list.rankedVenues].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return (b.score || 0) - (a.score || 0);
      case 'price':
        const priceOrder = { '€': 1, '€€': 2, '€€€': 3, '€€€€': 4 };
        return (priceOrder[a.venue.priceRange as keyof typeof priceOrder] || 0) - 
               (priceOrder[b.venue.priceRange as keyof typeof priceOrder] || 0);
      default:
        return a.position - b.position;
    }
  });

  return (
    <article className={`max-w-4xl mx-auto ${className}`}>
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-foreground">Inicio</Link></li>
          <ChevronRight className="h-4 w-4" />
          <li><Link href={`/${list.city.slug.current}`} className="hover:text-foreground">{list.city.title}</Link></li>
          <ChevronRight className="h-4 w-4" />
          <li><Link href={`/${list.city.slug.current}/rankings`} className="hover:text-foreground">Rankings</Link></li>
          <ChevronRight className="h-4 w-4" />
          <li className="text-foreground font-medium">{list.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            {typeLabels[list.listType]}
          </span>
          {list.dish && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {list.dish}
            </span>
          )}
          {list.priceRange && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {list.priceRange}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
          {list.title}
        </h1>

        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          {list.excerpt}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span>{list.rankedVenues.length} locales</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>Top {list.city.title}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>Actualizado {new Date(list.lastUpdated).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long' 
            })}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8">
          <OptimizedImage
            src={list.heroImage.asset.url}
            alt={list.heroImage.alt}
            fill
            className="object-cover"
          />
        </div>
      </header>

      {/* Introduction */}
      <section className="mb-12">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {/* Aquí renderizarías el contenido de introduction */}
          <div dangerouslySetInnerHTML={{ __html: list.introduction }} />
        </div>
      </section>

      {/* Criteria */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-6">Criterios de Selección</h2>
        <div className="bg-card border rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.criteria.map((criterion, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-saffron-500 rounded-full flex-shrink-0" />
                <span className="text-sm">{criterion}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Controls */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif font-bold">El Ranking</h2>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showComparison ? 'Ocultar' : 'Mostrar'} Comparativa
          </Button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border rounded-lg text-sm bg-background"
          >
            <option value="position">Por posición</option>
            <option value="score">Por puntuación</option>
            <option value="price">Por precio</option>
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      {showComparison && list.comparisonTable?.enabled && (
        <section className="mb-12">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-card border rounded-2xl">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Local</th>
                  {list.comparisonTable.columns.map((col) => (
                    <th key={col.key} className="text-center p-4 font-semibold">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedVenues.slice(0, 10).map((venueItem) => (
                  <tr key={venueItem.venue._id} className="border-b last:border-b-0 hover:bg-muted/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-saffron-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {venueItem.position}
                        </div>
                        <div>
                          <div className="font-semibold">{venueItem.venue.title}</div>
                          <div className="text-xs text-muted-foreground">{venueItem.venue.address}</div>
                        </div>
                      </div>
                    </td>
                    {list.comparisonTable?.columns.map((col) => (
                      <td key={col.key} className="text-center p-4">
                        {col.key === 'price' && venueItem.priceNote ? venueItem.priceNote :
                         col.key === 'rating' && venueItem.score ? `${venueItem.score}/10` :
                         col.type === 'boolean' ? '✓' : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Ranking Cards */}
      <section className="mb-12">
        <div className="space-y-6">
          {sortedVenues.map((venueItem, index) => (
            <div key={venueItem.venue._id} className="relative">
              {/* Position Badge */}
              <div className="absolute -top-2 -left-2 z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                  venueItem.position <= 3 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                    : venueItem.position <= 5
                    ? 'bg-gradient-to-r from-gray-400 to-gray-600'
                    : 'bg-gradient-to-r from-orange-600 to-red-600'
                }`}>
                  {venueItem.position}
                </div>
              </div>

              <div className="bg-card border rounded-2xl p-6 ml-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Venue Image */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <OptimizedImage
                      src={venueItem.venue.images[0]?.asset.url || ''}
                      alt={venueItem.venue.images[0]?.alt || venueItem.venue.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Venue Info */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-2">
                        <Link 
                          href={`/${list.city.slug.current}/${venueItem.venue.slug.current}`}
                          className="hover:text-saffron-600 transition-colors"
                        >
                          {venueItem.venue.title}
                        </Link>
                      </h3>
                      <p className="text-muted-foreground text-sm flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {venueItem.venue.address}
                      </p>
                    </div>

                    {venueItem.highlight && (
                      <div className="bg-saffron-50 dark:bg-saffron-950 border border-saffron-200 dark:border-saffron-800 rounded-lg p-3">
                        <p className="text-sm font-medium text-saffron-800 dark:text-saffron-200">
                          💡 {venueItem.highlight}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {venueItem.score && (
                        <div>
                          <span className="text-muted-foreground">Puntuación:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{venueItem.score}/10</span>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-muted-foreground">Precio:</span>
                        <div className="font-semibold">{venueItem.priceNote || venueItem.venue.priceRange}</div>
                      </div>

                      {venueItem.bestDish && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Recomendación:</span>
                          <div className="font-semibold">{venueItem.bestDish}</div>
                        </div>
                      )}
                    </div>

                    {venueItem.specialNote && (
                      <p className="text-sm text-muted-foreground italic">
                        &quot;{venueItem.specialNote}&quot;
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <Link href={`/${list.city.slug.current}/${venueItem.venue.slug.current}`}>
                        <Button size="sm">
                          Ver detalles
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                      {venueItem.venue.categories.map((category) => (
                        <span 
                          key={category.slug.current}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground"
                        >
                          {category.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verdict */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-6">Veredicto Final</h2>
        <div className="bg-gradient-to-r from-saffron-50 to-orange-50 dark:from-saffron-950 dark:to-orange-950 border border-saffron-200 dark:border-saffron-800 rounded-2xl p-8">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: list.verdict }} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      {list.faq && list.faq.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6">Preguntas Frecuentes</h2>
          <EnhancedFAQ 
            faqs={list.faq}
            className="bg-card border rounded-2xl"
          />
        </section>
      )}

      {/* Related Content */}
      {list.relatedGuides && list.relatedGuides.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6">Guías Relacionadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {list.relatedGuides.map((guide) => (
              <Link 
                key={guide.slug.current}
                href={`/${list.city.slug.current}/guias/${guide.slug.current}`}
                className="block bg-card border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold mb-2">{guide.title}</h3>
                <div className="flex items-center text-sm text-saffron-600">
                  Ver guía
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Update Info */}
      <footer className="border-t pt-6 text-sm text-muted-foreground">
        <p>
          Última actualización: {new Date(list.lastUpdated).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p className="mt-1">
          Ranking publicado: {new Date(list.publishedAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </footer>
    </article>
  );
}
