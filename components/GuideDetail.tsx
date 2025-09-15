"use client";

import { useState } from 'react';
import { MapPin, Clock, Star, Users, ChevronRight, Filter, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';
import { VenueCard } from './VenueCard';
import { EnhancedFAQ } from './EnhancedFAQ';

interface GuideVenue {
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
  position?: number;
  highlight: boolean;
  note?: string;
}

interface GuideSection {
  sectionTitle: string;
  description?: string;
  venues: GuideVenue[];
}

interface GuideDetailProps {
  guide: {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt: string;
    type: 'neighborhood' | 'thematic' | 'budget' | 'occasion';
    city: {
      title: string;
      slug: { current: string };
    };
    neighborhood?: string;
    theme?: string;
    heroImage: {
      asset: { url: string };
      alt: string;
      caption?: string;
    };
    introduction: any[];
    sections: GuideSection[];
    mapData: {
      center: {
        lat: number;
        lng: number;
      };
      zoom: number;
      showFilters: boolean;
    };
    faq: Array<{
      question: string;
      answer: string;
    }>;
    lastUpdated: string;
    publishedAt: string;
  };
  className?: string;
}

export function GuideDetail({ guide, className = "" }: GuideDetailProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [mapView, setMapView] = useState<'list' | 'map'>('list');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const typeLabels = {
    neighborhood: 'Guía de Barrio',
    thematic: 'Ruta Temática',
    budget: 'Por Presupuesto',
    occasion: 'Por Ocasión',
  };

  const totalVenues = guide.sections.reduce((acc, section) => acc + section.venues.length, 0);
  const highlightedVenues = guide.sections.reduce((acc, section) => 
    acc + section.venues.filter(v => v.highlight).length, 0
  );

  return (
    <article className={`max-w-4xl mx-auto ${className}`}>
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-foreground">Inicio</Link></li>
          <ChevronRight className="h-4 w-4" />
          <li><Link href={`/${guide.city.slug.current}`} className="hover:text-foreground">{guide.city.title}</Link></li>
          <ChevronRight className="h-4 w-4" />
          <li><Link href={`/${guide.city.slug.current}/guias`} className="hover:text-foreground">Guías</Link></li>
          <ChevronRight className="h-4 w-4" />
          <li className="text-foreground font-medium">{guide.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-saffron-100 text-saffron-800 dark:bg-saffron-900 dark:text-saffron-200">
            {typeLabels[guide.type]}
          </span>
          {guide.neighborhood && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <MapPin className="h-3 w-3 mr-1" />
              {guide.neighborhood}
            </span>
          )}
          {guide.theme && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {guide.theme}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
          {guide.title}
        </h1>

        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          {guide.excerpt}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{totalVenues} locales</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{highlightedVenues} destacados</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Actualizada {new Date(guide.lastUpdated).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long' 
            })}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8">
          <OptimizedImage
            src={guide.heroImage.asset.url}
            alt={guide.heroImage.alt}
            fill
            className="object-cover"
          />
          {guide.heroImage.caption && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
              {guide.heroImage.caption}
            </div>
          )}
        </div>
      </header>

      {/* Introduction */}
      <section className="mb-12">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {/* Aquí renderizarías el contenido de introduction usando un componente de rich text */}
          <div dangerouslySetInnerHTML={{ __html: guide.introduction }} />
        </div>
      </section>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif font-bold">Locales Recomendados</h2>
        
        <div className="flex items-center gap-2">
          {guide.mapData.showFilters && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          )}
          
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={mapView === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMapView('list')}
              className="text-xs"
            >
              Lista
            </Button>
            <Button
              variant={mapView === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMapView('map')}
              className="text-xs"
            >
              <Navigation className="h-4 w-4 mr-1" />
              Mapa
            </Button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-12 mb-12">
        {guide.sections.map((section, index) => (
          <section key={index} className="space-y-6">
            <div className="border-l-4 border-saffron-500 pl-6">
              <h3 className="text-xl font-serif font-semibold mb-2">
                {section.sectionTitle}
              </h3>
              {section.description && (
                <p className="text-muted-foreground">{section.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.venues.map((venueItem, venueIndex) => (
                <div key={venueItem.venue._id} className="relative">
                  {venueItem.position && (
                    <div className="absolute -top-2 -left-2 z-10 bg-saffron-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {venueItem.position}
                    </div>
                  )}
                  
                  <VenueCard
                    venue={{
                      _id: venueItem.venue._id,
                      title: venueItem.venue.title,
                      slug: venueItem.venue.slug,
                      address: venueItem.venue.address,
                      priceRange: venueItem.venue.priceRange,
                      images: venueItem.venue.images,
                      categories: venueItem.venue.categories,
                    }}
                    highlight={venueItem.highlight}
                    note={venueItem.note}
                    citySlug={guide.city.slug.current}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Map Section (when map view is selected) */}
      {mapView === 'map' && (
        <section className="mb-12">
          <div className="bg-muted rounded-2xl p-8 text-center">
            <Navigation className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Mapa Interactivo</h3>
            <p className="text-muted-foreground mb-4">
              Aquí se mostraría el mapa interactivo con todos los locales marcados
            </p>
            <Button variant="outline">
              Ver en Google Maps
            </Button>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {guide.faq && guide.faq.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6">Preguntas Frecuentes</h2>
          <EnhancedFAQ 
            faqs={guide.faq}
            className="bg-card border rounded-2xl"
          />
        </section>
      )}

      {/* Related Content */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-6">También te puede interesar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-saffron-50 to-orange-50 dark:from-saffron-950 dark:to-orange-950 rounded-2xl p-6 border border-saffron-200 dark:border-saffron-800">
            <h3 className="font-semibold mb-2">Más guías de {guide.city.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Descubre otras rutas gastronómicas por la ciudad
            </p>
            <Link href={`/${guide.city.slug.current}/guias`}>
              <Button variant="outline" size="sm">
                Ver todas las guías
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-2">Rankings por plato</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Los mejores sitios para cada especialidad
            </p>
            <Link href={`/${guide.city.slug.current}/rankings`}>
              <Button variant="outline" size="sm">
                Ver rankings
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Update Info */}
      <footer className="border-t pt-6 text-sm text-muted-foreground">
        <p>
          Última actualización: {new Date(guide.lastUpdated).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p className="mt-1">
          Publicado originalmente: {new Date(guide.publishedAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </footer>
    </article>
  );
}
