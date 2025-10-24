# 🔴 PRIORIDAD ALTA - Cálculo Mock de Venues en Guides usando Math.random()

## 📋 Descripción del Problema

La página de gestión de guías (`/dashboard/content/guides`) usa **Math.random()** para mostrar el número de locales (venues) de cada guía, en lugar de calcular el número real desde la base de datos.

## 📍 Ubicación

**Archivo:** `app/dashboard/content/guides/page.tsx`
**Líneas:** 65-68

```typescript
const totalVenues = (guide: Guide) => {
  // Por ahora retornamos un número estimado, en el futuro se puede calcular desde las secciones
  return Math.floor(Math.random() * 20) + 5;  // ❌ MOCK DATA
};
```

## 🐛 Problema Actual

- ❌ Usa datos falsos generados aleatoriamente
- ❌ El número cambia en cada recarga de página
- ❌ No refleja la realidad de las guías
- ❌ Es el **único mock en producción** encontrado en el dashboard

## 💥 Impacto

**Severidad:** Alta
**Funcionalidad afectada:** Dashboard de Guías
**Datos afectados:** Estadística de venues por guía
**Experiencia de usuario:** Información engañosa e inconsistente

## 🔍 Pasos para Reproducir

1. Ir a `/dashboard/content/guides`
2. Observar el número de locales mostrado en cada guía (ej: "12 locales")
3. Recargar la página (F5)
4. **Resultado:** Los números cambian aleatoriamente

## ✅ Solución Propuesta

### Opción 1: Calcular desde las secciones de la guía (Recomendado)

Si las guías tienen un campo `sections` que contiene referencias a venues:

```typescript
const totalVenues = (guide: Guide) => {
  if (!guide.sections) return 0;

  // Contar venues únicos en todas las secciones
  const venueIds = new Set();
  guide.sections.forEach(section => {
    section.venues?.forEach(venue => {
      if (venue._id) venueIds.add(venue._id);
    });
  });

  return venueIds.size;
};
```

### Opción 2: Agregar campo calculado en la query GROQ

Modificar la query en `lib/seo-queries.ts`:

```typescript
export const getGuidesQuery = groq`
  *[_type == "guide" && published == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    type,
    city->{
      title,
      slug
    },
    neighborhood,
    theme,
    published,
    featured,
    publishedAt,
    lastUpdated,
    stats,
    seoTitle,
    seoDescription,
    seoKeywords,
    "venueCount": count(sections[].venues[]->_id)  // ✅ Calcular en la query
  }
`;
```

Luego usar en el componente:

```typescript
const totalVenues = (guide: Guide) => {
  return guide.venueCount || 0;
};
```

### Opción 3: Query separada para contar venues

Si el cálculo es complejo:

```typescript
async function getVenueCountForGuide(guideId: string): Promise<number> {
  const query = groq`
    count(*[_type == "guide" && _id == $guideId][0].sections[].venues[]->_id)
  `;

  return await adminSanityClient.fetch(query, { guideId });
}
```

## 🎯 Criterios de Aceptación

- [ ] Eliminado el uso de `Math.random()`
- [ ] El conteo de venues es real y proviene de Sanity
- [ ] El número es consistente entre recargas
- [ ] El conteo es preciso (sin duplicados si un venue aparece múltiples veces)
- [ ] Performance aceptable (no ralentiza la carga de la página)
- [ ] Si no hay venues, muestra "0 locales" en lugar de un número aleatorio

## 🔧 Pasos de Implementación

### 1. Revisar estructura del schema `guide` en Sanity

```bash
# Verificar cómo se almacenan los venues en las guías
```

### 2. Implementar el cálculo real

Dependiendo de la estructura, elegir entre Opción 1, 2 o 3.

### 3. Actualizar el componente

```typescript
// app/dashboard/content/guides/page.tsx

// ANTES (líneas 65-68)
const totalVenues = (guide: Guide) => {
  return Math.floor(Math.random() * 20) + 5;
};

// DESPUÉS (ejemplo con Opción 2)
const totalVenues = (guide: Guide) => {
  return guide.venueCount || 0;
};
```

### 4. Actualizar el tipo TypeScript

```typescript
interface Guide {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  type: 'neighborhood' | 'thematic' | 'budget' | 'occasion';
  // ... otros campos
  venueCount?: number;  // ✅ Añadir este campo
}
```

### 5. Probar con diferentes escenarios

- Guía sin venues: debe mostrar "0 locales"
- Guía con 1 venue: debe mostrar "1 locales"
- Guía con múltiples venues: debe contar correctamente
- Mismo venue en múltiples secciones: debe contar solo una vez

## ✅ Checklist Pre-Deploy

### Verificaciones de Código
- [ ] `npm run lint` - Sin errores
- [ ] `npm run test` - Todos los tests pasan
- [ ] `npm run build` - Build exitoso sin errores
- [ ] No hay warnings de TypeScript

### Verificaciones Funcionales
- [ ] Ir a `/dashboard/content/guides`
- [ ] Verificar que los números de venues son consistentes
- [ ] Recargar la página múltiples veces
- [ ] Confirmar que los números NO cambian
- [ ] Verificar que los números coinciden con la realidad

### Verificaciones de Performance
- [ ] La página carga en tiempo razonable (< 2s)
- [ ] No hay queries N+1
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en logs del servidor

### Verificaciones de Data Integrity
- [ ] Comparar manualmente el conteo con Sanity Studio
- [ ] Verificar que venues duplicados no se cuentan múltiples veces
- [ ] Confirmar que guías sin venues muestran "0"

## 📊 Datos de Prueba

Crear al menos 3 guías de prueba:
1. **Guía vacía:** Sin venues (debe mostrar 0)
2. **Guía pequeña:** 1-3 venues (debe contar exactamente)
3. **Guía grande:** 10+ venues (debe contar todos)

## 🔍 Búsqueda de Otros Mocks

Verificar que no hay otros usos de `Math.random()` en producción:

```bash
grep -r "Math.random" app/dashboard --exclude-dir=node_modules
```

## 📚 Referencias

- Schema de Guides: Revisar en Sanity Studio
- GROQ Query actual: `lib/seo-queries.ts:4-26`
- Componente afectado: `app/dashboard/content/guides/page.tsx:65-68`

## 🏷️ Labels

`priority:high` `bug` `data-integrity` `mock-data` `guides` `dashboard`

---

**Fecha de creación:** 2025-10-24
**Estado:** 🔴 Pendiente
**Asignado a:** Por asignar
**Estimación:** 1-2 horas
**Dependencias:** Ninguna
