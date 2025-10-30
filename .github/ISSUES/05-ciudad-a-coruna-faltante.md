# Ciudad "A Coruña" faltante en funciones de display

**Tipo:** 🟡 Importante
**Componente:** Ciudades
**Archivos afectados:** `app/(public)/ciudades/page.tsx`

## Descripción

Las funciones `getCityDisplayName()` y `getCityIcon()` solo incluyen 5 ciudades hardcodeadas (Barcelona, Madrid, Valencia, Sevilla, Bilbao), pero **"A Coruña" es la ciudad principal del proyecto con ~90% de las reseñas**.

## Problema

### Función getCityDisplayName() (líneas 44-51)

```typescript
function getCityDisplayName(slug: string): string {
  const names: Record<string, string> = {
    'barcelona': 'Barcelona',
    'madrid': 'Madrid',
    'valencia': 'Valencia',
    'sevilla': 'Sevilla',
    'bilbao': 'Bilbao',
    // ❌ Falta: 'a-coruna': 'A Coruña'
  };
  return names[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}
```

**Resultado actual:** "A-coruna" (capitalizado incorrectamente)
**Resultado esperado:** "A Coruña"

### Función getCityIcon() (líneas 54-63)

```typescript
function getCityIcon(slug: string): string {
  const icons: Record<string, string> = {
    'barcelona': '🏖️',
    'madrid': '🏛️',
    'valencia': '🥘',
    'sevilla': '💃',
    'bilbao': '🎨',
    // ❌ Falta: 'a-coruna': '🌊' (o similar)
  };
  return icons[slug] || '🏙️';
}
```

**Resultado actual:** 🏙️ (emoji genérico)
**Resultado esperado:** 🌊 o 🦞 (relacionado con A Coruña)

## Evidencia de que A Coruña es la ciudad principal

### Del código fuente:

**En `app/(public)/page.tsx:272`:**
```typescript
// Si no tiene ciudad asignada, usar A Coruña como default (90% de reseñas)
const citySlug = venue.city?.slug?.current;
const venueSlug = venue.slug?.current;

href: item.customUrl || `/${citySlug || 'a-coruna'}/${venueSlug || 'local'}`,
```

**En múltiples archivos:**
- Se usa `'a-coruna'` como ciudad por defecto
- Comentarios indican "90% de reseñas en A Coruña"
- Aparece constantemente como fallback

## Impacto

- ❌ La ciudad PRINCIPAL se muestra incorrectamente como "A-coruna"
- ❌ Inconsistencia en presentación de datos
- ❌ Confusión para usuarios (especialmente gallegos)
- ❌ Emoji genérico en lugar de uno representativo
- ⚠️ Mala representación de la ciudad con más contenido

## Solución propuesta

### Actualizar getCityDisplayName()

```typescript
function getCityDisplayName(slug: string): string {
  const names: Record<string, string> = {
    'a-coruna': 'A Coruña',      // ✅ Agregar como PRIMERA
    'barcelona': 'Barcelona',
    'madrid': 'Madrid',
    'valencia': 'Valencia',
    'sevilla': 'Sevilla',
    'bilbao': 'Bilbao',
  };
  return names[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}
```

### Actualizar getCityIcon()

```typescript
function getCityIcon(slug: string): string {
  const icons: Record<string, string> = {
    'a-coruna': '🌊',            // ✅ Torre de Hércules / Costa
    // Alternativas: '🦞' (marisco), '⚓' (puerto), '🏖️' (playa)
    'barcelona': '🏖️',
    'madrid': '🏛️',
    'valencia': '🥘',
    'sevilla': '💃',
    'bilbao': '🎨',
  };
  return icons[slug] || '🏙️';
}
```

## Alternativas de emoji para A Coruña

- 🌊 - Océano Atlántico (Recomendado)
- 🦞 - Marisco (principal atractivo gastronómico)
- ⚓ - Puerto marítimo
- 🏖️ - Playas (pero ya usado para Barcelona)
- 🗼 - Torre de Hércules (muy específico)

## Recomendación adicional

Considerar hacer estas funciones **dinámicas** en el futuro, obteniendo los nombres y emojis desde Sanity CMS en lugar de hardcodearlos.

## Pasos para reproducir

1. Ir a `/ciudades`
2. Observar cómo se muestra "A Coruña" (probablemente como "A-coruna")
3. Comparar con otras ciudades

## Prioridad

**Media** - Afecta presentación de la ciudad principal

## Labels sugeridos

`bug`, `ux`, `cities`, `display`, `i18n`
