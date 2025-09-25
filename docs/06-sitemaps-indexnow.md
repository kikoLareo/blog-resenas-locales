## 06. Sitemaps e IndexNow

### Sitemaps dinámicos

- Endpoints:
  - `/api/sitemap` (índice general)
  - `/api/sitemap/[type]` (static, venues, reviews, posts, cities, categories)
- Utilidades: `lib/sitemap.ts` (`generateSitemapXML`, fechas y URLs absolutas).

### IndexNow

- Verificación: `scripts/indexnow-verify.ts` (crea `public/<INDEXNOW_KEY>.txt`).
- Envío: utilidades en `lib/indexnow.ts` (testeadas). Pendiente integrar en el webhook de revalidación.

### Finalidad

- Sitemaps: descubrir URLs y sus `lastmod` para mejorar crawling y cobertura.
- IndexNow: notificar nuevas/actualizadas URLs casi en tiempo real (Bing y motores compatibles), útil para AEO veloz.


