'use client';

import { useState, FormEvent, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchFormProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  showClearButton?: boolean;
  onSearch?: (term: string) => void;
}

export default function SearchForm({ 
  placeholder = "Buscar restaurantes, reseñas...",
  className = "",
  autoFocus = false,
  showClearButton = true,
  onSearch
}: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim();
    
    if (term) {
      // Call custom handler if provided
      if (onSearch) {
        onSearch(term);
      } else {
        // Default behavior: navigate to search page
        router.push(`/buscar?q=${encodeURIComponent(term)}`);
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative flex items-center ${className}`}
      role="search"
      aria-label="Buscar contenido"
    >
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        
        <input
          ref={inputRef}
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={placeholder}
          autoComplete="off"
          autoFocus={autoFocus}
          aria-label="Término de búsqueda"
        />
        
        {showClearButton && searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>
      
      <button
        type="submit"
        disabled={!searchTerm.trim()}
        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Ejecutar búsqueda"
      >
        <Search className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Buscar</span>
      </button>
    </form>
  );
}