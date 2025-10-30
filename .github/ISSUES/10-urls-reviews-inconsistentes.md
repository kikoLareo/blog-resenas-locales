# Inconsistencia en estructura de URLs de reviews

**Tipo:** 🔵 Menor
**Componente:** Routing / SEO
**Archivos afectados:**
- `app/(public)/[city]/[venue]/review/[reviewSlug]/page.tsx`
- `app/(public)/[city]/reviews/review/[slug]/page.tsx`

## Descripción

Existen dos estructuras diferentes de URLs para reviews en la aplicación, lo que puede causar confusión en el routing, inconsistencia en enlaces, y potencial duplicación de contenido.

## Problema

### Estructura 1: Review vinculada a venue específico
**Ruta:** `/[city]/[venue]/review/[reviewSlug]`
**Archivo:** `app/(public)/[city]/[venue]/review/[reviewSlug]/page.tsx`

**Ejemplo:** `/a-coruna/marisqueria-tradicion/review/mejor-marisco-centro`

**Características:**
- ✅ Review específica de un venue
- ✅ URL semántica y jerárquica
- ✅ Buena para SEO (breadcrumb lógico)
- ⚠️ Requiere conocer el venue slug

### Estructura 2: Review independiente por ciudad
**Ruta:** `/[city]/reviews/review/[slug]`
**Archivo:** `app/(public)/[city]/reviews/review/[slug]/page.tsx`

**Ejemplo:** `/a-coruna/reviews/review/mejor-marisco-centro`

**Características:**
- ✅ Review independiente
- ✅ Más corta
- ⚠️ Menos contexto en URL
- ⚠️ "reviews/review" es redundante

## Impacto potencial

### SEO
- ⚠️ Si una review es accesible por ambas URLs, puede haber contenido duplicado
- ⚠️ Google puede indexar ambas URLs, diluyendo el ranking
- ⚠️ Confusión en canonical URLs

### Desarrollo
- 🤔 No está claro cuándo usar una estructura vs otra
- 🤔 Posible confusión al crear enlaces internos
- 🤔 Mantenimiento más complejo con dos patrones

### Routing
- ⚠️ Dos páginas pueden responder para la misma review
- ⚠️ Posible conflicto si los slugs coinciden

## Casos de uso sugeridos

### Usar estructura 1 (`/[city]/[venue]/review/[reviewSlug]`)
**Cuándo:**
- Review está fuertemente asociada a un venue específico
- Usuario navega desde página del venue
- Queremos mantener contexto jerárquico

**Ventajas:**
- URL descriptiva y semántica
- Breadcrumb natural: Ciudad → Venue → Review
- Mejor para SEO local

### Usar estructura 2 (`/[city]/reviews/review/[slug]`)
**Cuándo:**
- Reviews independientes/editoriales
- Listados de reviews por ciudad
- Reviews que comparan múltiples venues

**Ventajas:**
- URL más corta
- Más flexible si review cambia de venue

## Soluciones propuestas

### Opción A: Unificar en una sola estructura (Recomendado)

**Usar solo estructura 1:**
```
/[city]/[venue]/review/[reviewSlug]
```

**Migración:**
1. Eliminar `app/(public)/[city]/reviews/review/[slug]/page.tsx`
2. Crear redirects permanentes (301) de estructura 2 → estructura 1
3. Actualizar todos los enlaces internos

**Ventajas:**
- ✅ Una sola fuente de verdad
- ✅ URLs más semánticas
- ✅ Evita duplicación

**Desventajas:**
- ⚠️ Requiere conocer venue para generar URL
- ⚠️ URLs más largas

### Opción B: Mantener ambas con redirects claros

**Estructura principal:**
```
/[city]/[venue]/review/[reviewSlug]  ← Canonical
```

**Estructura secundaria (redirect):**
```
/[city]/reviews/review/[slug]  → Redirect 301 a estructura 1
```

**Implementar redirect:**

```typescript
// app/(public)/[city]/reviews/review/[slug]/page.tsx
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";

export default async function ReviewRedirectPage({ params }: any) {
  const { city, slug } = await params;

  // Obtener venue slug desde Sanity
  const review = await client.fetch(`
    *[_type == "review" && slug.current == $slug][0] {
      venue->{
        slug
      }
    }
  `, { slug });

  if (!review?.venue?.slug) {
    notFound();
  }

  // Redirect permanente a estructura principal
  redirect(`/${city}/${review.venue.slug.current}/review/${slug}`);
}
```

**Ventajas:**
- ✅ Backward compatibility
- ✅ SEO preservado con 301
- ✅ Una URL canonical clara

### Opción C: Documentar uso de cada estructura

Si se mantienen ambas por razones de negocio:

**Crear documentación clara:**

```markdown
# URL Structure for Reviews

## Venue-specific reviews
Use when review is tied to a specific venue:
`/[city]/[venue]/review/[reviewSlug]`

Example: `/a-coruna/marisqueria-tradicion/review/mejor-marisco`

## Editorial/Multi-venue reviews
Use for editorial content or comparisons:
`/[city]/reviews/review/[slug]`

Example: `/a-coruna/reviews/review/top-10-marisquerias`
```

**Implementar canonical URLs:**

```tsx
// En cada página, especificar canonical
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ...
  return {
    alternates: {
      canonical: `/${city}/${venue}/review/${reviewSlug}`, // URL preferida
    },
  };
}
```

## Recomendación

**Opción A - Unificar en estructura 1**

Razones:
1. ✅ **Simplicidad:** Un solo patrón de URL para reviews
2. ✅ **SEO:** URLs semánticas con jerarquía clara
3. ✅ **Mantenibilidad:** Menos código, menos confusión
4. ✅ **Best practices:** Estructura RESTful clara

## Plan de implementación

Si se elige Opción A:

### Fase 1: Auditoría
- [ ] Listar todas las reviews existentes
- [ ] Verificar qué estructura usan actualmente
- [ ] Identificar enlaces internos que usan estructura 2

### Fase 2: Migración
- [ ] Actualizar todos los enlaces en código
- [ ] Actualizar datos en Sanity si es necesario
- [ ] Crear redirects 301

### Fase 3: Limpieza
- [ ] Eliminar `app/(public)/[city]/reviews/review/[slug]/page.tsx`
- [ ] Verificar que no haya enlaces rotos
- [ ] Actualizar sitemap.xml

### Fase 4: Verificación
- [ ] Probar que reviews siguen siendo accesibles
- [ ] Verificar redirects funcionan
- [ ] Revisar Google Search Console

## Análisis de URLs actuales

**Verificar en producción:**
```bash
# Buscar todos los enlaces a reviews en el código
grep -r "href.*review" components/ app/
```

**Verificar en Sanity:**
```groq
*[_type == "review"] {
  title,
  slug,
  venue->{
    slug,
    city->{
      slug
    }
  }
}
```

## Impacto en otros componentes

**Componentes que generan URLs de reviews:**
- `ReviewCard.tsx`
- `ReviewCardSaborLocal.tsx`
- `HomeSaborLocal.tsx`
- `FeaturedSections.tsx`
- Breadcrumbs
- Sitemaps

Todos deben actualizarse para usar estructura consistente.

## Prioridad

**Baja** - No afecta funcionalidad inmediata pero importante para consistencia

## Labels sugeridos

`enhancement`, `seo`, `routing`, `technical-debt`, `documentation`

## Decisiones necesarias

- [ ] ¿Cuál estructura usar como principal?
- [ ] ¿Eliminar una estructura o mantener ambas con redirects?
- [ ] ¿Hay reviews que NECESITEN estructura 2 por alguna razón?
- [ ] ¿Cuándo hacer la migración?

## Recursos

- [Next.js Routing Docs](https://nextjs.org/docs/app/building-your-application/routing)
- [Google SEO: URL Structure](https://developers.google.com/search/docs/crawling-indexing/url-structure)
- [Redirects in Next.js](https://nextjs.org/docs/app/api-reference/functions/redirect)
