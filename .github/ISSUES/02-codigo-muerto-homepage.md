# ~300 líneas de código muerto en Homepage

**Tipo:** 🔴 Crítico
**Componente:** Homepage
**Archivos afectados:** `app/(public)/page.tsx`

## Descripción

La página principal contiene aproximadamente 300 líneas de código que nunca se ejecutan o utilizan. Se preparan datos complejos de Sanity, se transforman, se procesan, pero luego simplemente se descartan.

## Problema

El componente `HomePage` realiza:
1. Fetching de datos de Sanity (reviews, venues, categories, featured items)
2. Transformación compleja de datos con 3 funciones dedicadas
3. Preparación de múltiples variables (`heroFeaturedItems`, `finalHeroItems`, `sanityData`)

**Pero luego:**
```typescript
export default async function HomePage() {
  // ... 300 líneas de lógica compleja ...

  return (
    <HomeSaborLocalServer /> // ❌ No recibe ninguna prop!
  );
}
```

## Código sin usar

### Funciones definidas pero nunca ejecutadas:
- `transformSanityReviews()` (líneas 36-62)
- `transformSanityVenues()` (líneas 64-79)
- `transformSanityCategories()` (líneas 81-92)
- `renderSection()` (líneas 147-179)

### Imports sin usar:
- `FeaturedSectionsModern`
- `HeroModern`
- `getAllFeaturedItems`
- `defaultHomepageConfig`

### Variables preparadas pero descartadas:
- `heroFeaturedItems` (líneas 228-306)
- `finalHeroItems` (líneas 309-329)
- `sanityData` (líneas 332-337)

## Impacto

- ❌ **Bundle size:** Código innecesario aumenta el tamaño del bundle
- ❌ **Performance:** Queries a Sanity que se ejecutan pero se descartan
- ❌ **Mantenimiento:** Confusión sobre qué código está activo
- ❌ **Deuda técnica:** Código "zombie" que nadie se atreve a tocar
- ⚠️ **Costo:** Queries innecesarias a Sanity API

## Solución propuesta

**Opción A - Limpiar (Recomendado si la funcionalidad no se necesita):**
```typescript
export default async function HomePage() {
  return <HomeSaborLocalServer />;
}
```

**Opción B - Implementar (Si la funcionalidad estaba planeada):**
```typescript
export default async function HomePage() {
  const [data, homepageConfig, allFeaturedItems] = await Promise.all([
    // ... fetching ...
  ]);

  // ... transformaciones ...

  return (
    <HomeSaborLocalServer
      featuredItems={heroFeaturedItems}
      trendingReviews={sanityData.trendingReviews}
      topRatedReviews={sanityData.topReviews}
      categories={sanityData.categories}
      venues={sanityData.venues}
    />
  );
}
```

## Pregunta para el equipo

**¿Cuál era la intención original?**
- ¿Se planeaba pasar estos datos pero se olvidó implementar?
- ¿Es código legacy que se puede eliminar?
- ¿Hay alguna razón para mantenerlo?

## Prioridad

**Alta** - Afecta performance y mantenibilidad

## Labels sugeridos

`bug`, `critical`, `performance`, `technical-debt`, `needs-decision`
