# Emoji genérico para A Coruña (ciudad principal)

**Tipo:** 🔵 Menor
**Componente:** Ciudades / UI
**Archivos afectados:** `app/(public)/ciudades/page.tsx`

## Descripción

La función `getCityIcon()` no incluye un emoji específico para "A Coruña", mostrando el emoji genérico 🏙️ en lugar de uno representativo de la ciudad.

Esto es especialmente notable porque A Coruña es la **ciudad principal del proyecto con ~90% de las reseñas**.

## Problema

```typescript
// app/(public)/ciudades/page.tsx líneas 54-63
function getCityIcon(slug: string): string {
  const icons: Record<string, string> = {
    'barcelona': '🏖️',
    'madrid': '🏛️',
    'valencia': '🥘',
    'sevilla': '💃',
    'bilbao': '🎨',
    // ❌ 'a-coruna' no está definido
  };
  return icons[slug] || '🏙️'; // ← Devuelve genérico para A Coruña
}
```

## Impacto

- 🎨 Inconsistencia visual - Todas las ciudades tienen emoji temático excepto la principal
- 📊 A Coruña es la ciudad con más contenido pero tiene el icono menos distintivo
- 🌊 Pérdida de oportunidad de representar la identidad costera/marinera
- ⚠️ Menor importancia visual en comparación con ciudades con menos contenido

## Comparación actual

| Ciudad | Emoji Actual | % Reseñas | Distintivo |
|--------|--------------|-----------|------------|
| A Coruña | 🏙️ (genérico) | ~90% | ❌ |
| Barcelona | 🏖️ | <5% | ✅ |
| Madrid | 🏛️ | <5% | ✅ |
| Valencia | 🥘 | <5% | ✅ |
| Sevilla | 💃 | <5% | ✅ |
| Bilbao | 🎨 | <5% | ✅ |

## Solución propuesta

Agregar emoji específico para A Coruña que represente sus características:

```typescript
function getCityIcon(slug: string): string {
  const icons: Record<string, string> = {
    'a-coruna': '🌊',        // ← AGREGAR (Recomendado: costa atlántica)
    'barcelona': '🏖️',
    'madrid': '🏛️',
    'valencia': '🥘',
    'sevilla': '💃',
    'bilbao': '🎨',
  };
  return icons[slug] || '🏙️';
}
```

## Opciones de emoji para A Coruña

Evaluadas según relevancia con la ciudad:

### ⭐ Muy Recomendadas
- **🌊 Olas del mar** - Costa atlántica, Océano (RECOMENDADO)
  - Pros: Universal, representa ubicación costera
  - Cons: Genérico para ciudades costeras

- **🦞 Marisco** - Principal atractivo gastronómico
  - Pros: Distintivo, relacionado con blog de comida
  - Cons: Muy específico, puede no ser inmediatamente reconocible

### ✅ Recomendadas
- **⚓ Ancla** - Ciudad portuaria
  - Pros: Representa puerto marítimo histórico
  - Cons: Menos visual que otros

- **🏖️ Playa** - Playas urbanas
  - Pros: Atractivo visual
  - Cons: Ya usado para Barcelona

### ⚠️ Opcionales
- **🗼 Torre** - Torre de Hércules (patrimonio UNESCO)
  - Pros: Monumento icónico único
  - Cons: Emoji genérico de torre, no específico

- **⛵ Velero** - Tradición marinera
  - Pros: Relacionado con el mar
  - Cons: Menos representativo

## Recomendación final

**Usar 🌊 (Olas del mar)**

Razones:
1. ✅ Representa ubicación costera atlántica
2. ✅ Distintivo y visual
3. ✅ No usado por otras ciudades
4. ✅ Coherente con identidad marinera
5. ✅ Funciona bien en todos los tamaños

## Contexto de A Coruña

Para información del equipo de desarrollo:

### Características de la ciudad
- **Ubicación:** Costa atlántica de Galicia
- **Conocida por:**
  - Torre de Hércules (faro romano, Patrimonio UNESCO)
  - Gastronomía marinera (marisco, pescado)
  - Playas urbanas (Riazor, Orzán)
  - Ciudad portuaria histórica
- **Gastronomía destacada:**
  - Marisco (nécoras, percebes, centollo)
  - Pulpo á feira
  - Empanada gallega
  - Lacón con grelos

## Implementación

```typescript
function getCityIcon(slug: string): string {
  const icons: Record<string, string> = {
    'a-coruna': '🌊',        // Costa atlántica de Galicia
    'barcelona': '🏖️',       // Playa mediterránea
    'madrid': '🏛️',         // Capital, patrimonio
    'valencia': '🥘',        // Paella, gastronomía
    'sevilla': '💃',        // Flamenco, cultura
    'bilbao': '🎨',         // Guggenheim, arte
  };
  return icons[slug] || '🏙️';
}
```

## Pasos para reproducir el problema

1. Ir a `/ciudades`
2. Observar que A Coruña muestra 🏙️
3. Comparar con otras ciudades que tienen emojis temáticos

## Prioridad

**Baja** - Mejora visual, no afecta funcionalidad

## Labels sugeridos

`enhancement`, `ui`, `cities`, `minor`, `visual`

## Relacionado con

- Issue #5 - Ciudad "A Coruña" faltante en getCityDisplayName()
