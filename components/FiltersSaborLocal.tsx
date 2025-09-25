"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, SlidersHorizontal, MapPin, Star, DollarSign, Clock, Filter, X, ChevronDown, Utensils, Coffee, Pizza, Salad, IceCream, Wine } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

// Tipos para filtros
interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterCategory {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'toggle';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterState {
  search: string;
  location: string;
  rating: number[];
  priceRange: string[];
  cuisine: string[];
  distance: number;
  openNow: boolean;
  delivery: boolean;
  reservation: boolean;
  sortBy: string;
}

interface FiltersSaborLocalProps {
  onFiltersChange?: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  className?: string;
  sticky?: boolean;
  compact?: boolean;
  showSearch?: boolean;
  showLocation?: boolean;
  resultCount?: number;
}

// Datos de configuración de filtros
const cuisineOptions: FilterOption[] = [
  { id: 'spanish', label: 'Española', value: 'spanish', count: 156, icon: Utensils },
  { id: 'italian', label: 'Italiana', value: 'italian', count: 89, icon: Pizza },
  { id: 'japanese', label: 'Japonesa', value: 'japanese', count: 67, icon: Utensils },
  { id: 'mexican', label: 'Mexicana', value: 'mexican', count: 45, icon: Utensils },
  { id: 'mediterranean', label: 'Mediterránea', value: 'mediterranean', count: 78, icon: Salad },
  { id: 'asian', label: 'Asiática', value: 'asian', count: 92, icon: Utensils },
  { id: 'french', label: 'Francesa', value: 'french', count: 34, icon: Wine },
  { id: 'american', label: 'Americana', value: 'american', count: 56, icon: Utensils },
  { id: 'vegetarian', label: 'Vegetariana', value: 'vegetarian', count: 43, icon: Salad },
  { id: 'desserts', label: 'Postres', value: 'desserts', count: 29, icon: IceCream },
  { id: 'coffee', label: 'Café', value: 'coffee', count: 71, icon: Coffee },
];

const priceRangeOptions: FilterOption[] = [
  { id: 'budget', label: 'Económico (€)', value: '$', count: 234 },
  { id: 'moderate', label: 'Moderado (€€)', value: '$$', count: 189 },
  { id: 'expensive', label: 'Caro (€€€)', value: '$$$', count: 97 },
  { id: 'luxury', label: 'Lujo (€€€€)', value: '$$$$', count: 23 },
];

const sortOptions: FilterOption[] = [
  { id: 'relevance', label: 'Relevancia', value: 'relevance' },
  { id: 'rating', label: 'Mejor valorados', value: 'rating' },
  { id: 'distance', label: 'Más cercanos', value: 'distance' },
  { id: 'newest', label: 'Más recientes', value: 'newest' },
  { id: 'popular', label: 'Más populares', value: 'popular' },
];

const defaultFilters: FilterState = {
  search: '',
  location: '',
  rating: [0, 5],
  priceRange: [],
  cuisine: [],
  distance: 10,
  openNow: false,
  delivery: false,
  reservation: false,
  sortBy: 'relevance',
};

export function FiltersSaborLocal({
  onFiltersChange,
  initialFilters = {},
  className = "",
  sticky = false,
  compact = false,
  showSearch = true,
  showLocation = true,
  resultCount,
}: FiltersSaborLocalProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Calcular filtros activos
  useEffect(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.location) count++;
    if (filters.rating[0] > 0 || filters.rating[1] < 5) count++;
    if (filters.priceRange.length > 0) count++;
    if (filters.cuisine.length > 0) count++;
    if (filters.distance < 10) count++;
    if (filters.openNow) count++;
    if (filters.delivery) count++;
    if (filters.reservation) count++;
    if (filters.sortBy !== 'relevance') count++;
    
    setActiveFiltersCount(count);
  }, [filters]);

  // Notificar cambios de filtros
  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleCuisine = useCallback((cuisine: string) => {
    setFilters(prev => ({
      ...prev,
      cuisine: prev.cuisine.includes(cuisine)
        ? prev.cuisine.filter(c => c !== cuisine)
        : [...prev.cuisine, cuisine]
    }));
  }, []);

  const togglePriceRange = useCallback((price: string) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange.includes(price)
        ? prev.priceRange.filter(p => p !== price)
        : [...prev.priceRange, price]
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const clearFilter = useCallback((filterKey: keyof FilterState) => {
    switch (filterKey) {
      case 'search':
      case 'location':
      case 'sortBy':
        updateFilter(filterKey, filterKey === 'sortBy' ? 'relevance' : '');
        break;
      case 'rating':
        updateFilter(filterKey, [0, 5]);
        break;
      case 'priceRange':
      case 'cuisine':
        updateFilter(filterKey, []);
        break;
      case 'distance':
        updateFilter(filterKey, 10);
        break;
      case 'openNow':
      case 'delivery':
      case 'reservation':
        updateFilter(filterKey, false);
        break;
    }
  }, [updateFilter]);

  // Sugerencias de ubicación (mock)
  const locationSuggestions = [
    'Madrid Centro',
    'Barcelona Eixample', 
    'Valencia Centro',
    'Sevilla Triana',
    'Bilbao Casco Viejo'
  ];

  const containerClasses = cn(
    "bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800",
    "transition-all duration-300 ease-out",
    sticky && "sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-neutral-900/95",
    className
  );

  const contentClasses = cn(
    "container mx-auto px-4 py-4",
    compact && "py-2"
  );

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        {/* Header con búsqueda principal */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Búsqueda principal */}
          {showSearch && (
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Buscar restaurantes, cocinas, platos..."
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Ubicación */}
          {showLocation && (
            <div className="lg:w-80 relative">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="¿Dónde quieres comer?"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                />
                
                {/* Sugerencias de ubicación */}
                {showLocationSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50">
                    {locationSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        className="w-full px-4 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                        onClick={() => {
                          updateFilter('location', suggestion);
                          setShowLocationSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botón de filtros móvil */}
          <Button
            variant="outline"
            className="lg:hidden flex items-center gap-2 px-4 py-3 border-neutral-300 dark:border-neutral-600"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="bg-saffron-500 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filtros expandibles */}
        <div className={cn(
          "space-y-4 transition-all duration-300 ease-out",
          "lg:block",
          isExpanded ? "block" : "hidden lg:block"
        )}>
          {/* Filtros rápidos */}
          <div className="flex flex-wrap gap-3">
            {/* Rating */}
            <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 rounded-lg">
              <Star className="h-4 w-4 text-saffron-500" />
              <span className="text-sm font-medium">Rating</span>
              <select
                className="bg-transparent text-sm focus:outline-none"
                value={filters.rating[0]}
                onChange={(e) => updateFilter('rating', [parseInt(e.target.value), 5])}
              >
                <option value="0">Cualquiera</option>
                <option value="3">3+ estrellas</option>
                <option value="4">4+ estrellas</option>
                <option value="4.5">4.5+ estrellas</option>
              </select>
            </div>

            {/* Toggles rápidos */}
            <button
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                filters.openNow 
                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              )}
              onClick={() => updateFilter('openNow', !filters.openNow)}
            >
              <Clock className="h-4 w-4" />
              Abierto ahora
            </button>

            <button
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                filters.delivery 
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              )}
              onClick={() => updateFilter('delivery', !filters.delivery)}
            >
              Delivery
            </button>

            <button
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                filters.reservation 
                  ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              )}
              onClick={() => updateFilter('reservation', !filters.reservation)}
            >
              Reserva
            </button>
          </div>

          {/* Filtros detallados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Rango de precios */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Precio
              </label>
              <div className="space-y-2">
                {priceRangeOptions.map((option) => (
                  <button
                    key={option.id}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors",
                      filters.priceRange.includes(option.value)
                        ? "bg-saffron-100 dark:bg-saffron-900 text-saffron-700 dark:text-saffron-300"
                        : "bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    )}
                    onClick={() => togglePriceRange(option.value)}
                  >
                    <span>{option.label}</span>
                    <span className="text-xs text-neutral-500">{option.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo de cocina */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Cocina
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {cuisineOptions.map((option) => {
                  const IconComponent = option.icon || Utensils;
                  return (
                    <button
                      key={option.id}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors",
                        filters.cuisine.includes(option.value)
                          ? "bg-saffron-100 dark:bg-saffron-900 text-saffron-700 dark:text-saffron-300"
                          : "bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      )}
                      onClick={() => toggleCuisine(option.value)}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                      <span className="text-xs text-neutral-500">{option.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Distancia */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Distancia: {filters.distance}km
              </label>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={filters.distance}
                onChange={(e) => updateFilter('distance', parseFloat(e.target.value))}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>0.5km</span>
                <span>25km</span>
              </div>
            </div>

            {/* Ordenar por */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Ordenar por
              </label>
              <select
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filtros activos y resultados */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          {/* Filtros activos */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Filtros activos:
              </span>
              
              {filters.search && (
                <span className="inline-flex items-center gap-1 bg-saffron-100 dark:bg-saffron-900 text-saffron-700 dark:text-saffron-300 px-2 py-1 rounded-full text-xs">
                  &quot;{filters.search}&quot;
                  <button onClick={() => clearFilter('search')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.location && (
                <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                  {filters.location}
                  <button onClick={() => clearFilter('location')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.cuisine.map((cuisine) => (
                <span key={cuisine} className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                  {cuisineOptions.find(c => c.value === cuisine)?.label}
                  <button onClick={() => toggleCuisine(cuisine)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              
              <button
                onClick={clearFilters}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 underline"
              >
                Limpiar todo
              </button>
            </div>
          )}

          {/* Contador de resultados */}
          {resultCount !== undefined && (
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'} encontrados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
