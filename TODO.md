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

