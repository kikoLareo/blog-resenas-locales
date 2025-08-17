## 13. Diagrama de flujo: publicación → SEO

1) Editor crea/actualiza un documento en Sanity (city/venue/review/post).
2) Publica el documento → Sanity emite un webhook (pendiente enganchar) hacia nuestra API `/api/revalidate`.
3) `/api/revalidate`:
   - Determina qué `tags` invalidar (e.g., `venues`, `reviews`).
   - Llama a `revalidateTag` para que ISR regenere rutas afectadas.
   - (Pendiente) Envía las URLs actualizadas a IndexNow usando `lib/indexnow.ts`.
4) Sitemaps dinámicos ya incluyen la URL (y `lastmod`), por lo que motores pueden redescubrirla.
5) En la siguiente visita, Next sirve la página regenerada con:
   - Metadatos actualizados (`generateMetadata`)
   - JSON-LD correcto (Review/LocalBusiness/FAQ/BlogPosting) generado por `lib/schema.ts`.
6) Motores de búsqueda rastrean:
   - Sitemaps para descubrir URLs y fechas.
   - IndexNow para recibir “push” de URLs.
   - Página renderizada SSR con datos consistentes y JSON-LD para rich results.

Resultado: tiempo de propagación SEO/AEO reducido y datos coherentes entre UI, metadatos y structured data.


