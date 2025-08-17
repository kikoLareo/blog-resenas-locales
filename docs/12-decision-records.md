## 12. Mapa de decisiones (archivos críticos)

Para cada archivo clave: qué hace, por qué existe y cómo validarlo.

### app/layout.tsx
- Qué: layout raíz, metadatos, GA4 cliente, JSON-LD (WebSite + Organization).
- Por qué: centralizar SEO base y dependencias globales.
- Validación: `npm run build` (sin errores), inspeccionar `<head>`, validar JSON-LD en Rich Results.

### app/page.tsx (Home)
- Qué: RSC que hace `sanityFetch(homepageQuery)` y pasa datos a UI.
- Por qué: SSR para SEO y performance; desacople datos/UI.
- Validación: ver `GET /` en dev, y que lista contenido de Sanity tras el seed.

### app/(public)/[city] / [venue] / review/[slug]
- Qué: páginas de ciudad/local/reseña (actualmente con mocks de transición).
- Por qué: scaffold estable mientras conectamos GROQ por partes.
- Validación: build OK; al conectar, sustituir mocks por consultas de `sanity/lib/queries.ts`.

### app/studio/[[...tool]]/page.tsx
- Qué: montaje del Studio (dev only), dinámico (sin SSR) para evitar conflictos de build.
- Por qué: en Next 15, dependencias cliente (framer-motion) no pueden entrar en RSC/edge.
- Validación: `NODE_ENV=development` → `/studio` operativo; en prod, no renderiza.

### app/api/sitemap/*.ts
- Qué: generación de sitemaps dinámicos (índice y por tipo) desde Sanity.
- Por qué: cobertura de crawling; fechas `lastmod` correctas.
- Validación: abrir `/api/sitemap` y `/api/sitemap/venues` (XML válido), comprobar URLs absolutas.

### app/api/revalidate/route.ts
- Qué: endpoint para revalidar ISR (y enganchar IndexNow).
- Por qué: contenidos de Sanity visibles en minutos.
- Validación: llamar con payload de prueba, observar `revalidateTag` y logs.

### components/HeroSection.tsx
- Qué: hero/slider; props `reviews` para UI desacoplada; fallback local.
- Por qué: reutilizable con datos reales o mocks.
- Validación: pasar arreglo con 1–3 items, verificar transición y enlaces.

### components/FeaturedSections.tsx
- Qué: listas “Locales de moda” y “Mejor valorados”; props `trending`/`topRated`.
- Por qué: presentar highlights con mínima lógica.
- Validación: renderiza `ReviewCard` con enlaces a detalle.

### lib/sanity.client.ts
- Qué: configuración del cliente y helper `sanityFetch` con tags/revalidate.
- Por qué: una única superficie para caching/preview y errores de envs.
- Validación: romper `NEXT_PUBLIC_SANITY_*` y ver error controlado; probar con/ sin token.

### sanity/lib/queries.ts
- Qué: todas las GROQ reutilizables (home, listados, detalle, SEO, sitemaps).
- Por qué: compartir queries tipadas y testeables.
- Validación: unit tests (`tests/unit/lib/groq.test.ts`) y correr manualmente en Vision.

### sanity.config.tsx
- Qué: configuración del Studio (plugins, structure, templates) y API.
- Por qué: experiencia editorial simple y consistente.
- Validación: abrir `/studio`, crear/editar docs; publicar y ver reflejo con ISR.

### sanity/desk/structure.ts
- Qué: estructura del panel (secciones, filtros, atajos de creación).
- Por qué: acelerar la edición y evitar errores.
- Validación: navegar por el desk y comprobar listas/queries.

### lib/schema.ts (JSON-LD)
- Qué: generadores de schemas (LocalBusiness, Review, FAQ, BlogPosting, etc.).
- Por qué: centralizar validaciones y evitar repetición.
- Validación: tests unitarios (`tests/unit/lib/schema.test.ts`).

### lib/sitemap.ts
- Qué: helpers para URLs completas, fechas y XML.
- Por qué: coherencia entre endpoints de sitemaps.
- Validación: tests unitarios (`tests/unit/lib/sitemap.test.ts`).

### scripts/indexnow-verify.ts
- Qué: crea archivo `<INDEXNOW_KEY>.txt` en `public/` para verificación.
- Por qué: activar IndexNow sin tocar el repo.
- Validación: ejecutar script, desplegar y acceder a `/<KEY>.txt`.

### next.config.mjs
- Qué: imágenes remotas (sanity cdn), rewrites (sitemaps), headers y opciones.
- Por qué: seguridad básica y soporte de imágenes.
- Validación: `npm run build`, comprobar avisos; imágenes remotas cargan.


