"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchFormProps {
  initialQuery?: string;
}

export default function SearchForm({ initialQuery = '' }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.set('q', query.trim());
      router.push(`/buscar?${searchParams.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar restaurantes, tipo de cocina, platos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
        <Button 
          type="submit" 
          className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white"
        >
          Buscar
        </Button>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>Ejemplos: &quot;paella valenciana&quot;, &quot;sushi&quot;, &quot;pizzería&quot;</p>
      </div>
    </form>
  );
}