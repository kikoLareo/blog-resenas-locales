# Búsqueda en Header sin funcionalidad implementada

**Tipo:** 🔵 Menor
**Componente:** Header / Búsqueda
**Archivos afectados:** `components/Header.tsx`

## Descripción

El input de búsqueda está presente en el Header (versiones desktop y mobile) pero no tiene funcionalidad conectada. Los usuarios pueden escribir pero al presionar Enter o buscar, no pasa nada.

## Problema

### Desktop (líneas 79-88)

```tsx
<div className="hidden md:flex flex-1 max-w-md mx-8">
  <div className="relative w-full group">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
    <Input
      type="search"
      placeholder="Buscar restaurantes, comida, ubicación..."
      className="pl-10 pr-4 w-full bg-background/70 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
    />
  </div>
</div>
```

### Mobile (líneas 126-133)

```tsx
<div className="relative group">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
  <Input
    type="search"
    placeholder="Buscar restaurantes..."
    className="pl-10 pr-4 bg-muted border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
  />
</div>
```

**Problemas identificados:**
- ❌ No hay `onChange` handler
- ❌ No hay `onSubmit` o `onKeyDown` handler
- ❌ No redirige a página de búsqueda
- ❌ No hay búsqueda en tiempo real
- ❌ Input no tiene `name` attribute para forms

## Página de búsqueda existente

**✅ La página `/buscar` YA EXISTE** en `app/(public)/buscar/page.tsx`, pero el Header no la utiliza.

## Impacto

### UX
- ❌ Funcionalidad prominente que no funciona
- ❌ Frustración del usuario al intentar buscar
- ❌ Input de búsqueda es uno de los elementos más usados en sitios web
- ⚠️ Presente en desktop Y mobile pero ambos inoperativos

### Engagement
- ❌ Usuarios no pueden encontrar contenido fácilmente
- ❌ Pérdida de navegación por búsqueda
- ❌ Incremento en bounce rate si usuarios no encuentran lo que buscan

### SEO
- ⚠️ Búsqueda interna es señal de engagement para Google
- ⚠️ Pérdida de datos sobre qué buscan usuarios

## Solución propuesta

### Opción 1: Redirección a página de búsqueda (Más simple)

```tsx
// components/SearchInput.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  isMobile?: boolean;
}

export function SearchInput({
  placeholder = "Buscar restaurantes, comida, ubicación...",
  className = "",
  isMobile = false
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
      if (isMobile) {
        // Cerrar menú móvil si está abierto
        document.getElementById("mobile-menu-close")?.click();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full group ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 w-full"
      />
    </form>
  );
}
```

**Usar en Header:**

```tsx
// components/Header.tsx
import { SearchInput } from "./SearchInput";

// Desktop
<div className="hidden md:flex flex-1 max-w-md mx-8">
  <SearchInput />
</div>

// Mobile
<SearchInput
  placeholder="Buscar restaurantes..."
  isMobile={true}
/>
```

### Opción 2: Búsqueda instantánea con dropdown (Más avanzado)

```tsx
// components/InstantSearch.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

export function InstantSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchContent(debouncedQuery);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const searchContent = async (q: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=5`);
      const data = await res.json();
      setResults(data.results);
      setIsOpen(true);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
        placeholder="Buscar restaurantes, comida, ubicación..."
        className="pl-10"
      />

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <Link
              key={result.id}
              href={result.url}
              onClick={() => setIsOpen(false)}
              className="block p-3 hover:bg-muted"
            >
              <div className="font-medium">{result.title}</div>
              <div className="text-sm text-muted-foreground">{result.type}</div>
            </Link>
          ))}
          <Link
            href={`/buscar?q=${encodeURIComponent(query)}`}
            className="block p-3 border-t text-center text-sm text-primary hover:bg-muted"
          >
            Ver todos los resultados →
          </Link>
        </div>
      )}
    </div>
  );
}
```

Requiere crear endpoint `/api/search`:

```typescript
// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Buscar en venues, reviews, y posts
    const results = await client.fetch(`
      {
        "venues": *[_type == "venue" && (
          title match $query + "*" ||
          description match $query + "*"
        )][0...${Math.floor(limit / 3)}] {
          _id,
          "type": "venue",
          "title": title,
          "url": "/" + city->slug.current + "/" + slug.current,
          "description": description
        },
        "reviews": *[_type == "review" && (
          title match $query + "*" ||
          tldr match $query + "*"
        )][0...${Math.floor(limit / 3)}] {
          _id,
          "type": "review",
          "title": title,
          "url": "/" + venue->city->slug.current + "/" + venue->slug.current + "/review/" + slug.current,
          "description": tldr
        },
        "posts": *[_type == "post" && (
          title match $query + "*" ||
          excerpt match $query + "*"
        )][0...${Math.floor(limit / 3)}] {
          _id,
          "type": "post",
          "title": title,
          "url": "/blog/" + slug.current,
          "description": excerpt
        }
      }
    `, { query });

    const allResults = [
      ...results.venues,
      ...results.reviews,
      ...results.posts
    ].slice(0, limit);

    return NextResponse.json({ results: allResults });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
```

### Opción 3: Algolia/MeiliSearch (Búsqueda enterprise)

Para proyectos grandes, considerar servicio dedicado de búsqueda:

- **Algolia** - Más popular, UI components listos
- **MeiliSearch** - Open source, self-hosted
- **Typesense** - Alternativa open source

## Página /buscar existente

Verificar que `app/(public)/buscar/page.tsx` esté implementada correctamente para recibir query params:

```typescript
// app/(public)/buscar/page.tsx
type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams;

  // Implementar lógica de búsqueda...
}
```

## Funcionalidades deseables

- [ ] Búsqueda por nombre de restaurante
- [ ] Búsqueda por tipo de comida
- [ ] Búsqueda por ubicación/ciudad
- [ ] Sugerencias mientras escribes
- [ ] Historial de búsquedas
- [ ] Búsquedas populares
- [ ] Filtros avanzados
- [ ] Ordenamiento de resultados

## Analytics

Implementar tracking de búsquedas:

```typescript
// Cuando se realiza una búsqueda
gtag('event', 'search', {
  search_term: query,
  results_count: results.length
});
```

Datos útiles a trackear:
- Términos más buscados
- Búsquedas sin resultados (oportunidades de contenido)
- Tiempo desde búsqueda hasta click

## Prioridad

**Media** - Funcionalidad esperada pero no crítica

## Labels sugeridos

`enhancement`, `feature`, `search`, `ux`, `header`

## Estimación de esfuerzo

- **Opción 1 (Redirección simple):** 1-2 horas
- **Opción 2 (Búsqueda instantánea):** 4-6 horas
- **Opción 3 (Algolia/MeiliSearch):** 8-12 horas

## Relacionado con

- Página `/buscar` existente en `app/(public)/buscar/page.tsx`
- Posible integración con analytics para tracking

## Decisiones necesarias

- [ ] ¿Qué nivel de búsqueda implementar? (simple vs. instantánea vs. enterprise)
- [ ] ¿Qué contenido buscar? (venues, reviews, posts, todos)
- [ ] ¿Implementar sugerencias/autocomplete?
- [ ] ¿Usar servicio externo o búsqueda interna?
