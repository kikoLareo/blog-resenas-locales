/**
 * ItemPickerList Component
 * Lista de items disponibles con buscador y checkboxes
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { ContentType, AvailableItem } from '@/types/homepage';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ItemPickerListProps {
  contentType: ContentType;
  selectedItemIds: string[];
  onToggleItem: (item: AvailableItem) => void;
}

const TYPE_LABELS: Record<ContentType, string> = {
  venue: 'Locales',
  review: 'Reseñas',
  category: 'Categorías',
  city: 'Ciudades',
};

export default function ItemPickerList({
  contentType,
  selectedItemIds,
  onToggleItem,
}: ItemPickerListProps) {
  const [items, setItems] = useState<AvailableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch items desde API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: '1',
          pageSize: '100',
        });
        
        if (debouncedSearch) {
          params.append('search', debouncedSearch);
        }

        const response = await fetch(`/api/admin/content/${contentType}?${params}`);
        const data = await response.json();
        
        if (data.items) {
          setItems(data.items);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [contentType, debouncedSearch]);

  // Filtrar items que ya están seleccionados para mostrarlos primero
  const sortedItems = useMemo(() => {
    const selected = items.filter(item => selectedItemIds.includes(item._id));
    const unselected = items.filter(item => !selectedItemIds.includes(item._id));
    return [...selected, ...unselected];
  }, [items, selectedItemIds]);

  return (
    <div className="space-y-3">
      {/* Header con búsqueda */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">
          {TYPE_LABELS[contentType]} ({items.length})
        </Label>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={`Buscar ${TYPE_LABELS[contentType].toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Lista de items */}
      <div className="border rounded-lg max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Cargando...</span>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            {search ? 'No se encontraron resultados' : `No hay ${TYPE_LABELS[contentType].toLowerCase()} disponibles`}
          </div>
        ) : (
          <div className="divide-y">
            {sortedItems.map((item) => {
              const isSelected = selectedItemIds.includes(item._id);
              
              return (
                <div
                  key={item._id}
                  className={`
                    flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors
                    ${isSelected ? 'bg-primary/5' : ''}
                  `}
                  onClick={() => onToggleItem(item)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleItem(item)}
                  />

                  {/* Imagen */}
                  {item.imageUrl && (
                    <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-200">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.title}
                    </p>
                    {(item.city || item.venue || item.category) && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.venue || item.city || item.category}
                      </p>
                    )}
                  </div>

                  {/* Badge de seleccionado */}
                  {isSelected && (
                    <span className="text-xs font-medium text-primary">
                      ✓ Seleccionado
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contador de seleccionados */}
      {selectedItemIds.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {selectedItemIds.length} {selectedItemIds.length === 1 ? 'item seleccionado' : 'items seleccionados'}
        </p>
      )}
    </div>
  );
}
