# TODOs

## Reintroducir anuncios sin afectar CI/CD

- Rehabilitar `AdSlot` en la UI (`app/page.tsx`).
- Implementar flag de entorno `NEXT_PUBLIC_ADS_ENABLED=true|false` para controlar renderizado.
- Añadir proveedor real (GAM/AdSense) detrás de un módulo cargado dinámicamente para evitar SSR.
- Restaurar tests de `AdSlot` y ajustarlos a la nueva estrategia de mocks (IntersectionObserver y googletag).
- Validar CLS con tests (mantener dimensiones fijas y `minHeight`).

## Rutas tipadas (Next.js typedRoutes)

- Si se desea reactivar `experimental.typedRoutes`, tipar los `Link` dinámicos en `app/page.tsx` usando `as Route`.
- Alternativamente, crear rutas reales para `"/categorias"` y `"/[city]"` para evitar casts.

## SEO (Twitter)

- Revisar si queremos volver a incluir `title/description/images` en `twitter` cuando usemos un wrapper propio; la interfaz de `next-seo` actual sólo acepta `cardType`.

## Vitest/Vite integración

- Valorar reintroducir `@vitejs/plugin-react` o `@vitejs/plugin-react-swc` en `vitest.config.ts` si no rompe el build de Next; alinear versiones para evitar conflictos de tipos.

## Sanity en build

- Configurar variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` y `SANITY_API_READ_TOKEN`.
- Ahora el cliente hace fallback seguro (devuelve vacío) si faltan vars; sustituir por comportamiento deseado en producción.

## E2E tests

- Ajustar pruebas que hacen click sobre elementos cubiertos por placeholders (ads o encabezados): añadir `force: true` o esperar a que los overlays no intercepten eventos si queremos ser estrictos.

## Consentimiento (CMP)

- Integrar CMP real para `hasConsent`.
- Cargar scripts publicitarios después de consentimiento.

## Documentación

- Actualizar `README.md` con la bandera `NEXT_PUBLIC_ADS_ENABLED` y pasos de configuración.


## Backlog ampliado (estado actual y tareas pendientes)

### ✅ Panel de Administración (COMPLETADO)
- ✅ Sistema de autenticación con Auth.js (JWT sin DB)
- ✅ OAuth social (Google, GitHub) + allowlist de emails
- ✅ Middleware de protección de rutas
- ✅ Dashboard principal con estadísticas reales de Sanity
- ✅ Páginas de gestión de contenido conectadas a Sanity
- ✅ Configuración del sitio
- ✅ Login/logout funcional
- ✅ Arquitectura simplificada para 2-10 administradores

### Rutas y páginas

- Alinear el esquema de rutas del sitio. Decidir entre `/{city}/{venue}` o `/ciudades/...` y unificar:
  - `components/Breadcrumbs.tsx` (especialmente `VenueBreadcrumbs`).
  - URLs de `productionUrl` en `sanity.config.tsx` para `review`, `venue`, `post`, `city`, `category`.
- Crear páginas faltantes según plan inicial:
  - `app/(public)/[city]/[venue]/review-[date]/page.tsx` (reseña completa).
  - `app/blog/page.tsx` y `app/blog/[slug]/page.tsx`.
  - `app/categorias/page.tsx` y `app/categorias/[slug]/page.tsx`.
  - Si se opta por prefijo `/ciudades`: `app/ciudades/page.tsx` y `app/ciudades/[slug]/page.tsx`.
  - Páginas estáticas enlazadas desde el layout: `/sobre`, `/contacto`, `/politica-privacidad`, `/terminos`, `/cookies`, `/buscar`, `/tags` (o eliminar enlaces/sitemap si no se implementan).
- Corregir los enlaces en `app/page.tsx` y `app/(public)/[city]/[venue]/page.tsx` para apuntar a rutas reales existentes.

### Datos (Sanity)

- Sustituir datos mock por `sanityFetch` + GROQ en:
  - Homepage (`app/page.tsx`): reseñas recientes, categorías/ciudades destacadas, posts destacados.
  - Ficha de local (`app/(public)/[city]/[venue]/page.tsx`): datos del local y sus reseñas.
- Endurecer `sanity.client.ts` cuando falten variables de entorno:
  - Evitar devolver `[]` silencioso en endpoints que esperan objeto; devolver 500 o early-return controlado donde aplique.

### Sitemaps y SEO

- Corregir URLs generadas en `app/api/sitemap/[type]/route.ts`:
  - Venues: incluir `city.slug` en la URL final (p. ej., `/{citySlug}/{venueSlug}`).
  - Reviews: usar la ruta real (por-venue o `/resenas/...`) de forma consistente con la web.
  - Revisar listado de páginas estáticas del sitemap y asegurar que existen para evitar 404.
- Unificar AEO de TL;DR:
  - Decidir unidad de validación: “caracteres” o “palabras”.
  - Alinear `README.md`, `sanity/schemas/review.ts`, `lib/constants.ts` (límites) y `components/TLDR.tsx`.
- Revisar `metadata` y `alternates.canonical` en nuevas páginas y comprobar JSON-LD en venue/review/post.

### Anuncios (ads)

- Respetar `ADS_CONFIG.enabled` al renderizar anuncios:
  - Gatear `HeaderAd`, `SidebarAd`, `InArticleAd` y/o la lógica de `components/AdSlot.tsx`.
  - Mantener contenedores con dimensiones fijas solo si están habilitados (evitar placeholders innecesarios).
- Integrar proveedor real (GAM/AdSense) con `dynamic import` sin SSR y controlado por consentimiento.
- Documentar la bandera `NEXT_PUBLIC_ADS_ENABLED` en `README.md` y completar `env.example`.

### Breadcrumbs y Studio

- Actualizar breadcrumbs a la estructura final de rutas (ciudad/local, categorías, blog).
- Corregir `productionUrl` en `sanity.config.tsx` para que apunte a las rutas reales tras la decisión de paths.

### Testing

- Restaurar/actualizar tests de `AdSlot` con mocks de `IntersectionObserver` y `googletag`; validar CLS=0.
- Ajustar E2E de Playwright para clicks sobre elementos potencialmente cubiertos por overlays/ads (usar `force: true` o esperar a no-intercepción).
- Ejecutar y estabilizar tests unitarios y E2E tras cambios de rutas/SEO.

### Documentación y configuración

- Completar `env.example` con:
  - `NEXT_PUBLIC_ADS_ENABLED`, `ADS_PROVIDER`, `ADS_SCRIPT_URL`.
  - `NEXT_PUBLIC_SANITY_API_VERSION`.
  - Claves de Maps/Analytics necesarias.
- Actualizar `README.md` con la bandera de anuncios, pasos de configuración y notas de consentimiento (CMP).
- Decidir estrategia de fail-safe del cliente Sanity en producción (loggear/romper vs. silencioso).

### Mejoras varias

- Valorar `experimental.typedRoutes` o crear rutas reales para evitar casts en `Link`.
- Revisar duplicidad de `urlFor` en `lib/images.ts` y `lib/sanity.client.ts` para evitar confusiones de import.
- Añadir endpoint top-level `/sitemap.xml` (si se quiere exponer además de `/api/sitemap`).

