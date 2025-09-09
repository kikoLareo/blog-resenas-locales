'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchFormProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
  onSubmit?: (searchTerm: string) => void;
}

export default function SearchForm({ 
  initialValue = '', 
  placeholder = 'Buscar reseñas, locales, artículos...',
  className = '',
  onSubmit
}: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    
    try {
      // Si se proporciona un callback personalizado, usarlo
      if (onSubmit) {
        onSubmit(searchTerm.trim());
      } else {
        // Por defecto, navegar a la página de búsqueda
        router.push(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    // Si estamos en la página de búsqueda, navegar a buscar sin query
    if (typeof window !== 'undefined' && window.location.pathname === '/buscar') {
      router.push('/buscar');
    }
  };

  return (
    <form role="form" onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        {/* Icono de búsqueda */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search 
            className={`h-5 w-5 transition-colors ${
              isLoading ? 'text-primary-500 animate-pulse' : 'text-gray-400'
            }`}
            aria-hidden="true"
          />
        </div>

        {/* Campo de entrada */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className={`
            block w-full pl-12 pr-12 py-4 text-lg
            border border-gray-300 rounded-lg
            placeholder-gray-500 text-gray-900
            bg-white shadow-sm
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            hover:border-gray-400 focus:hover:border-primary-500
          `}
          aria-label="Campo de búsqueda"
          autoComplete="off"
        />

        {/* Botón de limpiar */}
        {searchTerm && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-14 flex items-center pr-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Botón de enviar */}
        <button
          type="submit"
          disabled={isLoading || !searchTerm.trim()}
          className={`
            absolute inset-y-0 right-0 flex items-center pr-4
            text-primary-600 hover:text-primary-700
            disabled:text-gray-400 disabled:cursor-not-allowed
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            rounded-r-lg
          `}
          aria-label="Buscar"
        >
          <Search className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
          <span className="sr-only">Buscar</span>
        </button>
      </div>

      {/* Indicador de carga */}
      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2">
          <div className="text-center text-sm text-gray-500">
            Buscando...
          </div>
        </div>
      )}

      {/* Sugerencias rápidas (opcional) */}
      {!searchTerm && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 z-10">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md mx-auto">
            <p className="text-xs text-gray-500 mb-2">Búsquedas populares:</p>
            <div className="flex flex-wrap gap-1">
              {['Restaurantes', 'Cafeterías', 'Bares', 'Tapas'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchTerm(term);
                    // Auto-submit después de un pequeño delay
                    setTimeout(() => {
                      if (onSubmit) {
                        onSubmit(term);
                      } else {
                        router.push(`/buscar?q=${encodeURIComponent(term)}`);
                      }
                    }, 100);
                  }}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-primary-100 hover:text-primary-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

// Componente SearchForm compacto para header/navbar
export function CompactSearchForm({ className = '' }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
        aria-label="Abrir búsqueda"
      >
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <form role="form" onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar..."
          autoFocus
          className="block w-full pl-8 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          onBlur={() => !searchTerm && setIsOpen(false)}
        />
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}