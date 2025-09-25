"use client";

import { useState } from 'react';
import { MapPin, ChevronRight, Star, Clock, Utensils } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';
import VenueCard from './VenueCard';
import EnhancedFAQ from './EnhancedFAQ';

interface DishVariation {
  region: string;
  name: string;
  description: string;
  image?: {
    asset: { url: string };
    alt?: string;
  };
}

interface BestVenue {
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
  position: number;
  specialNote?: string;
  price?: string;
}

interface DishGuideDetailProps {
  dishGuide: {
    _id: string;
    title: string;
    slug: { current: string };
    dishName: string;
    excerpt: string;
    heroImage: {
      asset: { url: string };
      alt: string;
    };
    origin: any[];
    description: any[];
    howToEat: any[];
    variations: DishVariation[];
    ingredients: string[];
    seasonality?: {
      hasSeason: boolean;
      season?: string;
      months?: string[];
      note?: string;
    };
    bestVenues: BestVenue[];
    relatedRecipes?: Array<{
      title: string;
      slug: { current: string };
    }>;
    relatedLists?: Array<{
      title: string;
      slug: { current: string };
    }>;
    faq: Array<{
      question: string;
      answer: string;
    }>;
    publishedAt: string;
  };
  className?: string;
}

export function DishGuideDetail({ dishGuide, className = "" }: DishGuideDetailProps) {
  const [activeTab, setActiveTab] = useState<'origin' | 'variations' | 'venues'>('origin');

  const seasonLabels = {
    spring: '🌸 Primavera',
    summer: '☀️ Verano', 
    autumn: '🍂 Otoño',
    winter: '❄️ Invierno',
  };

  return (
    <article className={`max-w-4xl mx-auto ${className}`}>
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-foreground">Inicio</Link></li>
          <ChevronRight className="h-4 w-4" />
          <li><Link href="/platos" className="hover:text-foreground">Guías de Platos</Link></li>
          <ChevronRight className="h-4 w-4" />
          <li className="text-foreground font-medium">{dishGuide.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            <Utensils className="h-3 w-3 mr-1" />
            Guía de Plato
          </span>
          {dishGuide.seasonality?.hasSeason && dishGuide.seasonality.season && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {seasonLabels[dishGuide.seasonality.season as keyof typeof seasonLabels]}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
          {dishGuide.title}
        </h1>

        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          {dishGuide.excerpt}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{dishGuide.bestVenues.length} sitios recomendados</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{dishGuide.variations.length} variantes regionales</span>
          </div>
          {dishGuide.seasonality?.hasSeason && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Temporada específica</span>
            </div>
          )}
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8">
          <OptimizedImage
            src={dishGuide.heroImage.asset.url}
            alt={dishGuide.heroImage.alt}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
            <h2 className="font-serif font-bold text-lg">{dishGuide.dishName}</h2>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 mb-8 bg-muted rounded-lg p-1">
        <Button
          variant={activeTab === 'origin' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('origin')}
          className="flex-1"
        >
          Origen e Historia
        </Button>
        <Button
          variant={activeTab === 'variations' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('variations')}
          className="flex-1"
        >
          Variantes
        </Button>
        <Button
          variant={activeTab === 'venues' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('venues')}
          className="flex-1"
        >
          Dónde probarlo
        </Button>
      </div>

      {/* Content Sections */}
      <div className="space-y-12 mb-12">
        {/* Origin and History */}
        {activeTab === 'origin' && (
          <section className="space-y-8">
            {/* Origin */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">Origen e Historia</h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: dishGuide.origin }} />
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">¿Qué es {dishGuide.dishName}?</h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: dishGuide.description }} />
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">Ingredientes Principales</h2>
              <div className="bg-card border rounded-2xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {dishGuide.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-saffron-500 rounded-full flex-shrink-0" />
                      <span>{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How to Eat */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">Cómo se come</h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-8">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: dishGuide.howToEat }} />
                </div>
              </div>
            </div>

            {/* Seasonality */}
            {dishGuide.seasonality?.hasSeason && (
              <div>
                <h2 className="text-2xl font-serif font-bold mb-6">Temporalidad</h2>
                <div className="bg-card border rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-6 w-6 text-saffron-500" />
                    <div>
                      <h3 className="font-semibold">Mejor época</h3>
                      <p className="text-sm text-muted-foreground">
                        {dishGuide.seasonality.season && seasonLabels[dishGuide.seasonality.season as keyof typeof seasonLabels]}
                      </p>
                    </div>
                  </div>
                  
                  {dishGuide.seasonality.months && dishGuide.seasonality.months.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Meses recomendados:</h4>
                      <div className="flex flex-wrap gap-2">
                        {dishGuide.seasonality.months.map((month) => (
                          <span 
                            key={month}
                            className="px-2 py-1 bg-muted rounded-lg text-xs"
                          >
                            {month}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {dishGuide.seasonality.note && (
                    <p className="text-sm text-muted-foreground italic">
                      {dishGuide.seasonality.note}
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Variations */}
        {activeTab === 'variations' && dishGuide.variations && dishGuide.variations.length > 0 && (
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6">Variantes Regionales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dishGuide.variations.map((variation, index) => (
                <div key={index} className="bg-card border rounded-2xl overflow-hidden">
                  {variation.image && (
                    <div className="relative aspect-[4/3]">
                      <OptimizedImage
                        src={variation.image.asset.url}
                        alt={variation.image.alt || variation.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">{variation.region}</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg mb-3">{variation.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {variation.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Best Venues */}
        {activeTab === 'venues' && (
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6">Los Mejores Sitios para Probarlo</h2>
            <p className="text-muted-foreground mb-8">
              Estos son los locales donde podrás disfrutar de la mejor versión de {dishGuide.dishName}:
            </p>
            
            <div className="space-y-6">
              {dishGuide.bestVenues
                .sort((a, b) => a.position - b.position)
                .map((venueItem, index) => (
                  <div key={venueItem.venue._id} className="relative">
                    {/* Position Badge */}
                    <div className="absolute -top-2 -left-2 z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        venueItem.position <= 3 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
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
                                href={`/locales/${venueItem.venue.slug.current}`}
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

                          {venueItem.specialNote && (
                            <div className="bg-saffron-50 dark:bg-saffron-950 border border-saffron-200 dark:border-saffron-800 rounded-lg p-4">
                              <p className="text-sm font-medium text-saffron-800 dark:text-saffron-200">
                                ⭐ {venueItem.specialNote}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Precio:</span>
                              <div className="font-semibold">{venueItem.price || venueItem.venue.priceRange}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Categoría:</span>
                              <div className="font-semibold">
                                {venueItem.venue.categories[0]?.title || 'Restaurante'}
                              </div>
                            </div>
                          </div>

                          <Link href={`/locales/${venueItem.venue.slug.current}`}>
                            <Button size="sm">
                              Ver local
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>

      {/* FAQ */}
      {dishGuide.faq && dishGuide.faq.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6">Preguntas Frecuentes</h2>
          <EnhancedFAQ 
            faqs={dishGuide.faq}
            className="bg-card border rounded-2xl"
          />
        </section>
      )}

      {/* Related Content */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-6">Contenido Relacionado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dishGuide.relatedRecipes && dishGuide.relatedRecipes.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-2xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="font-semibold mb-3">Recetas de {dishGuide.dishName}</h3>
              <div className="space-y-2">
                {dishGuide.relatedRecipes.map((recipe) => (
                  <Link 
                    key={recipe.slug.current}
                    href={`/recetas/${recipe.slug.current}`}
                    className="block text-sm text-green-700 dark:text-green-300 hover:underline"
                  >
                    {recipe.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {dishGuide.relatedLists && dishGuide.relatedLists.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold mb-3">Rankings relacionados</h3>
              <div className="space-y-2">
                {dishGuide.relatedLists.map((list) => (
                  <Link 
                    key={list.slug.current}
                    href={`/rankings/${list.slug.current}`}
                    className="block text-sm text-purple-700 dark:text-purple-300 hover:underline"
                  >
                    {list.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t pt-6 text-sm text-muted-foreground">
        <p>
          Guía publicada: {new Date(dishGuide.publishedAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </footer>
    </article>
  );
}
