# TODOs

## Reintroducir anuncios sin afectar CI/CD

- Rehabilitar `AdSlot` en la UI (`app/page.tsx`).
- Implementar flag de entorno `NEXT_PUBLIC_ADS_ENABLED=true|false` para controlar renderizado.
- Añadir proveedor real (GAM/AdSense) detrás de un módulo cargado dinámicamente para evitar SSR.
- Restaurar tests de `AdSlot` y ajustarlos a la nueva estrategia de mocks (IntersectionObserver y googletag).
- Validar CLS con tests (mantener dimensiones fijas y `minHeight`).

## Consentimiento (CMP)

- Integrar CMP real para `hasConsent`.
- Cargar scripts publicitarios después de consentimiento.

## Documentación

- Actualizar `README.md` con la bandera `NEXT_PUBLIC_ADS_ENABLED` y pasos de configuración.

