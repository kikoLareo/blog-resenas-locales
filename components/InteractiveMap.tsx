"use client";

import { useState, useEffect, useRef } from 'react';
import { MapPin, Filter, Navigation, Maximize2, Minimize2, Search } from 'lucide-react';
import { Button } from './ui/button';

interface MapVenue {
  _id: string;
  title: string;
  slug: { current: string };
  address: string;
  geo: {
    lat: number;
    lng: number;
  };
  priceRange: string;
  categories: Array<{
    title: string;
    slug: { current: string };
  }>;
  image?: string;
  rating?: number;
  highlight?: boolean;
}

interface MapFilter {
  priceRanges: string[];
  categories: string[];
  services: string[];
  openNow: boolean;
}

interface InteractiveMapProps {
  venues: MapVenue[];
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  height?: string;
  showFilters?: boolean;
  className?: string;
  onVenueClick?: (venue: MapVenue) => void;
}

export function InteractiveMap({
  venues,
  center,
  zoom = 14,
  height = "400px",
  showFilters = true,
  className = "",
  onVenueClick
}: InteractiveMapProps) {
  const [filteredVenues, setFilteredVenues] = useState<MapVenue[]>(venues);
  const [filters, setFilters] = useState<MapFilter>({
    priceRanges: [],
    categories: [],
    services: [],
    openNow: false
  });
  const [selectedVenue, setSelectedVenue] = useState<MapVenue | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);

  // Filter venues based on current filters
  useEffect(() => {
    let filtered = venues;

    // Filter by price range
    if (filters.priceRanges.length > 0) {
      filtered = filtered.filter(venue => 
        filters.priceRanges.includes(venue.priceRange)
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(venue =>
        venue.categories.some(cat => filters.categories.includes(cat.slug.current))
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(venue =>
        venue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVenues(filtered);
  }, [venues, filters, searchTerm]);

  const togglePriceFilter = (priceRange: string) => {
    setFilters(prev => ({
      ...prev,
      priceRanges: prev.priceRanges.includes(priceRange)
        ? prev.priceRanges.filter(p => p !== priceRange)
        : [...prev.priceRanges, priceRange]
    }));
  };

  const toggleCategoryFilter = (categorySlug: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categorySlug)
        ? prev.categories.filter(c => c !== categorySlug)
        : [...prev.categories, categorySlug]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRanges: [],
      categories: [],
      services: [],
      openNow: false
    });
    setSearchTerm('');
  };

  const handleVenueSelect = (venue: MapVenue) => {
    setSelectedVenue(venue);
    onVenueClick?.(venue);
  };

  // Get unique categories for filters
  const availableCategories = Array.from(
    new Set(venues.flatMap(venue => venue.categories.map(cat => cat.slug.current)))
  ).map(slug => {
    const category = venues.flatMap(v => v.categories).find(c => c.slug.current === slug);
    return { slug, title: category?.title || slug };
  });

  const priceRangeOptions = [
    { value: '€', label: 'Económico (€)', count: venues.filter(v => v.priceRange === '€').length },
    { value: '€€', label: 'Moderado (€€)', count: venues.filter(v => v.priceRange === '€€').length },
    { value: '€€€', label: 'Caro (€€€)', count: venues.filter(v => v.priceRange === '€€€').length },
    { value: '€€€€', label: 'Lujo (€€€€)', count: venues.filter(v => v.priceRange === '€€€€').length },
  ].filter(option => option.count > 0);

  return (
    <div className={`relative ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Map Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-saffron-600" />
          <div>
            <h3 className="font-semibold">Mapa Interactivo</h3>
            <p className="text-sm text-muted-foreground">
              {filteredVenues.length} de {venues.length} locales
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 bg-card border-r p-4 space-y-4 overflow-y-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar locales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              />
            </div>

            {/* Price Range Filter */}
            <div>
              <h4 className="font-medium mb-3">Precio</h4>
              <div className="space-y-2">
                {priceRangeOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.priceRanges.includes(option.value)}
                      onChange={() => togglePriceFilter(option.value)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm flex-1">{option.label}</span>
                    <span className="text-xs text-muted-foreground">({option.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="font-medium mb-3">Categorías</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableCategories.map((category) => (
                  <label key={category.slug} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.slug)}
                      onChange={() => toggleCategoryFilter(category.slug)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{category.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full"
              disabled={filters.priceRanges.length === 0 && filters.categories.length === 0 && !searchTerm}
            >
              Limpiar filtros
            </Button>

            {/* Venues List */}
            <div className="space-y-2">
              <h4 className="font-medium">Locales ({filteredVenues.length})</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredVenues.map((venue) => (
                  <div
                    key={venue._id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedVenue?._id === venue._id ? 'border-saffron-500 bg-saffron-50' : ''
                    }`}
                    onClick={() => handleVenueSelect(venue)}
                  >
                    <h5 className="font-medium text-sm line-clamp-1">{venue.title}</h5>
                    <p className="text-xs text-muted-foreground line-clamp-1">{venue.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        {venue.priceRange}
                      </span>
                      {venue.highlight && (
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          Destacado
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          <div
            ref={mapRef}
            style={{ height: isFullscreen ? 'calc(100vh - 80px)' : height }}
            className="w-full bg-gray-100 rounded-lg flex items-center justify-center"
          >
            {/* Placeholder for actual map implementation */}
            <div className="text-center space-y-4">
              <Navigation className="h-16 w-16 mx-auto text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-600">Mapa Interactivo</h3>
                <p className="text-sm text-gray-500">
                  Aquí se mostraría el mapa con {filteredVenues.length} locales marcados
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Integración con Google Maps, Mapbox o similar
                </p>
              </div>
              
              {/* Mock pins for demonstration */}
              <div className="flex items-center justify-center gap-4 mt-8">
                {filteredVenues.slice(0, 5).map((venue, index) => (
                  <div
                    key={venue._id}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer ${
                      venue.highlight ? 'bg-yellow-500' : 'bg-red-500'
                    } ${selectedVenue?._id === venue._id ? 'ring-2 ring-saffron-500' : ''}`}
                    onClick={() => handleVenueSelect(venue)}
                    title={venue.title}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Venue Info */}
          {selectedVenue && (
            <div className="absolute bottom-4 left-4 right-4 bg-white border rounded-lg p-4 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{selectedVenue.title}</h4>
                  <p className="text-sm text-muted-foreground">{selectedVenue.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">
                      {selectedVenue.priceRange}
                    </span>
                    {selectedVenue.categories.map((cat) => (
                      <span key={cat.slug.current} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {cat.title}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setSelectedVenue(null)}
                  variant="ghost"
                >
                  ✕
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente más simple para usar en guías
export function SimpleMap({ 
  venues, 
  center, 
  height = "300px",
  className = "" 
}: {
  venues: MapVenue[];
  center: { lat: number; lng: number };
  height?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        style={{ height }}
        className="w-full bg-gray-100 rounded-lg flex items-center justify-center border"
      >
        <div className="text-center space-y-2">
          <MapPin className="h-8 w-8 mx-auto text-gray-400" />
          <p className="text-sm text-gray-600">
            Mapa con {venues.length} locales
          </p>
          <p className="text-xs text-gray-400">
            Centro: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
}
