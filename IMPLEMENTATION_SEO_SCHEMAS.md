# Implementación de Schemas SEO en Sanity - Completado ✅

## 📋 Resumen de Cambios

Este documento detalla la implementación de los schemas de contenido SEO en Sanity Studio para el proyecto Blog de Reseñas Locales.

## 🎯 Estado del Proyecto

### ✅ Schemas Creados y Completados

Todos los 6 tipos de contenido SEO están **completamente implementados** en Sanity:

1. **Guide (Guías & Rutas)** - `sanity/schemas/guide.ts`
2. **List (Listas & Rankings)** - `sanity/schemas/list.ts`
3. **Recipe (Recetas)** - `sanity/schemas/recipe.ts`
4. **Dish Guide (Guías de Plato)** - `sanity/schemas/dish-guide.ts`
5. **News (Novedades & Tendencias)** - `sanity/schemas/news.ts`
6. **Offer (Ofertas & Menús)** - `sanity/schemas/offer.ts`

### ✅ Queries GROQ

Todas las queries están definidas en `lib/seo-queries.ts`:
- `getGuidesQuery`
- `getListsQuery`
- `getRecipesQuery`
- `getDishGuidesQuery`
- `getNewsQuery`
- `getOffersQuery`
- Queries de estadísticas, actividad reciente y calendario editorial

### ✅ Registro en Sanity

Todos los schemas están registrados en `sanity/schemas/index.ts` y aparecerán automáticamente en Sanity Studio.

## 🔧 Cambios Implementados

### 1. Campo `stats` (Estadísticas)

Añadido a todos los schemas con la siguiente estructura:

```typescript
stats: {
  views: number;      // Visualizaciones
  shares: number;     // Compartidos
  bookmarks: number;  // Guardados (para guide, list, recipe, dish-guide, news)
  clicks: number;     // Clicks (para offer)
}
```

**Archivos modificados:**
- `sanity/schemas/guide.ts` ✅
- `sanity/schemas/list.ts` ✅
- `sanity/schemas/recipe.ts` ✅
- `sanity/schemas/dish-guide.ts` ✅
- `sanity/schemas/news.ts` ✅
- `sanity/schemas/offer.ts` ✅

### 2. Campo `lastUpdated` (Última Actualización)

Añadido campo `lastUpdated` (tipo datetime) a los schemas que no lo tenían:

**Archivos modificados:**
- `sanity/schemas/recipe.ts` ✅
- `sanity/schemas/dish-guide.ts` ✅
- `sanity/schemas/news.ts` ✅
- `sanity/schemas/offer.ts` ✅

**Nota:** Los schemas `guide.ts` y `list.ts` ya tenían este campo implementado.

### 3. Correcciones en News Schema

Para alinear el schema de News con las queries GROQ:

#### a) Campo `category` (antes `newsType`)
- **Cambio:** Renombrado de `newsType` a `category`
- **Valores actualizados:**
  - `aperturas` → `opening`
  - `cierres` → `closing`
  - `eventos` → `event`
  - Añadido: `award` (premios)
  - `tendencias` → `trend`
- **Motivo:** Alineación con las queries en `lib/seo-queries.ts`

#### b) Campo `expiryDate` (antes `expiresAt`)
- **Cambio:** Renombrado de `expiresAt` (tipo date) a `expiryDate` (tipo datetime)
- **Motivo:** Las queries GROQ esperan `expiryDate` con comparaciones temporales

#### c) Actualización del Preview
- Actualizado para usar `category` en lugar de `newsType`
- Iconos emoji actualizados para los nuevos valores de category

**Archivo modificado:**
- `sanity/schemas/news.ts` ✅

## 📊 Estructura de Campos por Schema

### Guide (Guías & Rutas)
```typescript
{
  title, slug, excerpt, type, city, neighborhood, theme,
  heroImage, introduction, sections, mapData, faq,
  seoTitle, seoDescription, keywords,
  stats, lastUpdated, featured, published, publishedAt
}
```

### List (Listas & Rankings)
```typescript
{
  title, slug, excerpt, listType, dish, city, neighborhoods,
  priceRange, occasion, heroImage, introduction, criteria,
  rankedVenues, comparisonTable, verdict, faq, relatedGuides,
  seoTitle, seoDescription, keywords,
  stats, lastUpdated, featured, published, publishedAt
}
```

### Recipe (Recetas)
```typescript
{
  title, slug, description, recipeType, difficulty,
  prepTime, cookTime, totalTime, servings, heroImage,
  ingredients, instructions, tips, variations, substitutions,
  nutritionalInfo, dietaryInfo, relatedVenues, relatedDishGuides,
  seoTitle, seoDescription, keywords,
  stats, lastUpdated, featured, published, publishedAt
}
```

### Dish Guide (Guías de Plato)
```typescript
{
  title, slug, dishName, excerpt, heroImage,
  origin, description, howToEat, variations, ingredients,
  seasonality, bestVenues, relatedRecipes, relatedLists, faq,
  seoTitle, seoDescription, keywords,
  stats, lastUpdated, featured, published, publishedAt
}
```

### News (Novedades & Tendencias)
```typescript
{
  title, slug, excerpt, category, city, heroImage,
  content, venues, eventDate, eventTime, location, tags,
  relatedNews,
  seoTitle, seoDescription, keywords,
  stats, lastUpdated, featured, urgent, published, publishedAt, expiryDate
}
```

### Offer (Ofertas & Menús)
```typescript
{
  title, slug, excerpt, offerType, city, neighborhood,
  priceRange, heroImage, introduction, venuesWithOffers,
  validFrom, validUntil, recurring, generalConditions, conclusion,
  seoTitle, seoDescription, keywords,
  stats, lastUpdated, featured, published, publishedAt
}
```

## ✅ Validación

### TypeScript
Todos los schemas compilan correctamente sin errores:
```bash
✓ sanity/schemas/guide.ts - OK
✓ sanity/schemas/list.ts - OK
✓ sanity/schemas/recipe.ts - OK
✓ sanity/schemas/dish-guide.ts - OK
✓ sanity/schemas/news.ts - OK
✓ sanity/schemas/offer.ts - OK
```

### ESLint
No se encontraron errores de linting relacionados con los cambios.

## 🚀 Próximos Pasos (Fuera del alcance de este issue)

Para completar la implementación funcional de estos schemas se necesitaría:

### 1. Dashboard Pages (No implementadas)
- `/dashboard/guides` - Listado y gestión de guías
- `/dashboard/lists` - Listado y gestión de listas
- `/dashboard/recipes` - Listado y gestión de recetas
- `/dashboard/dish-guides` - Listado y gestión de guías de plato
- `/dashboard/news` - Listado y gestión de noticias
- `/dashboard/offers` - Listado y gestión de ofertas

### 2. API Routes (No implementadas)
- `/api/admin/guides/...` - CRUD de guías
- `/api/admin/lists/...` - CRUD de listas
- `/api/admin/recipes/...` - CRUD de recetas
- `/api/admin/dish-guides/...` - CRUD de guías de plato
- `/api/admin/news/...` - CRUD de noticias
- `/api/admin/offers/...` - CRUD de ofertas

### 3. Páginas Públicas (No implementadas)
- `app/[city]/guides/[slug]/page.tsx` - Vista pública de guías
- `app/[city]/lists/[slug]/page.tsx` - Vista pública de listas
- `app/[city]/recipes/[slug]/page.tsx` - Vista pública de recetas
- Y similares para los demás tipos

### 4. SEO & Metadata (No implementado)
- Generación de JSON-LD schemas
- Open Graph metadata
- Twitter Cards
- Sitemaps dinámicos

## 📝 Notas Importantes

### Compatibilidad con Queries
Los campos añadidos son exactamente los que las queries GROQ en `lib/seo-queries.ts` esperan encontrar. No hay discrepancias entre schemas y queries.

### Valores por Defecto
- `stats`: Todos los contadores inician en 0
- `lastUpdated`: Se inicializa con la fecha/hora actual
- `featured`: false por defecto
- `published`: false por defecto

### Diferencias de Implementación
El schema de **Offer** está implementado con una estructura más sofisticada (`venuesWithOffers` array) que la descrita en el issue original. Esta implementación permite gestionar múltiples venues con diferentes ofertas en un solo documento, lo cual es más flexible y escalable.

### Migración de Datos
Si ya existen documentos de tipo `news` con los campos antiguos (`newsType`, `expiresAt`), será necesario migrar los datos o mantener compatibilidad temporal.

## 📚 Referencias

- **Issue original:** kikoLareo/blog-resenas-locales#[número]
- **Queries:** `lib/seo-queries.ts`
- **Schemas:** `sanity/schemas/index.ts`
- **Documentación Sanity:** https://www.sanity.io/docs/schema-types

---

**Fecha de implementación:** 2025-10-24
**Estado:** ✅ Completado
**Autor:** GitHub Copilot Agent
