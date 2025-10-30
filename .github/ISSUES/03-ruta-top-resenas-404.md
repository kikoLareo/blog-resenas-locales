# Ruta /top-resenas no existe (404)

**Tipo:** 🟡 Importante
**Componente:** Navegación
**Archivos afectados:** `components/Header.tsx`

## Descripción

El Header incluye enlaces a `/top-resenas` en navegación desktop y mobile, pero esta ruta no existe en la aplicación, resultando en error 404.

## Problema

**En Header.tsx:**

**Desktop (línea 99):**
```tsx
<Link href="/top-resenas" className="nav-link group">
  <Star className="h-4 w-4 transition-transform group-hover:scale-110" />
  <span>Top Reseñas</span>
</Link>
```

**Mobile (línea 144):**
```tsx
<Link href="/top-resenas" className="mobile-nav-link">
  <Star className="h-4 w-4" />
  <span>Top Reseñas</span>
</Link>
```

**Verificación realizada:**
- ❌ No existe `app/(public)/top-resenas/page.tsx`
- ❌ No existe ningún archivo en `app/(public)/top-resenas/**`

## Impacto

- ❌ Usuarios ven error 404 al hacer clic en "Top Reseñas"
- ❌ Mala experiencia de usuario
- ❌ Pérdida de credibilidad del sitio
- ❌ Navegación rota en desktop Y mobile
- ⚠️ Elemento destacado en la navegación principal que no funciona

## Solución propuesta

**Opción A - Crear la página (Recomendado):**

Crear `app/(public)/top-resenas/page.tsx` que muestre:
- Reviews mejor valoradas (ordenadas por rating)
- Filtros por ciudad/categoría
- Ordenamiento por diferentes criterios

**Opción B - Redirigir a ruta existente:**

Si la funcionalidad ya existe en otra ruta, cambiar el enlace:
```tsx
// Cambiar a blog o a filtro de reviews
<Link href="/blog?filter=top" className="nav-link group">
  <Star className="h-4 w-4" />
  <span>Top Reseñas</span>
</Link>
```

**Opción C - Eliminar temporalmente:**

Si la página no se va a implementar pronto:
```tsx
{/* Temporalmente deshabilitado
<Link href="/top-resenas" className="nav-link group">
  <Star className="h-4 w-4" />
  <span>Top Reseñas</span>
</Link>
*/}
```

## Pasos para reproducir

1. Abrir la aplicación
2. Hacer clic en "Top Reseñas" en el header
3. Observar error 404

## Rutas alternativas sugeridas

Si no se crea la página, considerar usar:
- `/blog` (ya existe)
- `/` con filtro de top reviews
- Crear `/reviews` con filtros

## Prioridad

**Media** - Funcionalidad visible pero no crítica para el sitio

## Labels sugeridos

`bug`, `navigation`, `404`, `ux`, `needs-implementation`
