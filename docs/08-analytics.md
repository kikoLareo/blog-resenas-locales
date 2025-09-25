## 08. Analítica (GA4)

### Cliente (ya integrado)

- `app/layout.tsx` usa `@next/third-parties/google` con `GA_MEASUREMENT_ID`.

### Data API (pendiente)

- Crear `lib/ga4.ts` (server) y endpoints `/api/admin/ga4/*` para métricas y top pages.
- Requiere `GCP_SA_KEY` y `GA4_PROPERTY_ID` en env.


