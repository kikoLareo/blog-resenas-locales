"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterBarProps {
  initialFilters?: {
    category?: string;
    city?: string;
    priceRange?: string;
  };
}

const CATEGORIES = [
  { value: 'mediterranea', label: 'Mediterránea' },
  { value: 'italiana', label: 'Italiana' },
  { value: 'asiatica', label: 'Asiática' },
  { value: 'mexicana', label: 'Mexicana' },
  { value: 'india', label: 'India' },
  { value: 'japonesa', label: 'Japonesa' },
  { value: 'americana', label: 'Americana' },
  { value: 'francesa', label: 'Francesa' },
];

const CITIES = [
  { value: 'valencia', label: 'Valencia' },
  { value: 'madrid', label: 'Madrid' },
  { value: 'barcelona', label: 'Barcelona' },
  { value: 'sevilla', label: 'Sevilla' },
  { value: 'bilbao', label: 'Bilbao' },
];

const PRICE_RANGES = [
  { value: '€', label: '€ - Económico' },
  { value: '€€', label: '€€ - Moderado' },
  { value: '€€€', label: '€€€ - Caro' },
  { value: '€€€€', label: '€€€€ - Muy caro' },
];

export default function FilterBar({ initialFilters = {} }: FilterBarProps) {
  const [filters, setFilters] = useState(initialFilters);
  const router = useRouter();

  const handleFilterChange = (key: string, value: string | undefined) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[key as keyof typeof filters] = value;
    } else {
      delete newFilters[key as keyof typeof filters];
    }
    setFilters(newFilters);
  };

  const applyFilters = () => {
    const searchParams = new URLSearchParams(window.location.search);
    
    // Limpiar filtros anteriores
    searchParams.delete('category');
    searchParams.delete('city');
    searchParams.delete('priceRange');
    
    // Agregar nuevos filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });
    
    router.push(`/buscar?${searchParams.toString()}`);
  };

  const clearFilters = () => {
    setFilters({});
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete('category');
    searchParams.delete('city');
    searchParams.delete('priceRange');
    router.push(`/buscar?${searchParams.toString()}`);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto text-orange-600 hover:text-orange-700"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de cocina
          </label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ciudad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ciudad
          </label>
          <Select
            value={filters.city}
            onValueChange={(value) => handleFilterChange('city', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {CITIES.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rango de precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio
          </label>
          <Select
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange('priceRange', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {PRICE_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botón aplicar */}
        <div className="flex items-end">
          <Button 
            onClick={applyFilters} 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Aplicar filtros
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Filtros activos:</span>
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                {CATEGORIES.find(c => c.value === filters.category)?.label}
                <button
                  onClick={() => handleFilterChange('category', undefined)}
                  className="ml-1 hover:text-orange-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                {CITIES.find(c => c.value === filters.city)?.label}
                <button
                  onClick={() => handleFilterChange('city', undefined)}
                  className="ml-1 hover:text-orange-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.priceRange && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                {PRICE_RANGES.find(p => p.value === filters.priceRange)?.label}
                <button
                  onClick={() => handleFilterChange('priceRange', undefined)}
                  className="ml-1 hover:text-orange-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}