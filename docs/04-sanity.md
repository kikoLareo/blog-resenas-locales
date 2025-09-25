## 04. Sanity CMS

### Studio embebido

- Ruta: `app/studio/[[...tool]]/page.tsx` (carga dinámica solo en desarrollo para evitar conflictos de build).
- Configuración: `sanity.config.tsx` (plugins, structureTool, vision, color-input).

### Esquemas

- Ubicación: `sanity/schemas/*` (city, venue, review, post, category).
- Desk structure personalizada: `sanity/desk/structure.ts`.

### Cliente y consultas

- Cliente: `lib/sanity.client.ts` – helpers `sanityFetch`, `preview` y tags ISR.
- GROQ: `sanity/lib/queries.ts` – `homepageQuery`, `venuesByCityQuery`, etc.

### Contenido

El sistema trabaja únicamente con datos reales ingresados a través del Studio de Sanity. No se utilizan datos de prueba o mockeados.

### Finalidad y por qué Sanity

- Modelo de contenido flexible (documents/refs) ideal para relaciones ciudad→local→reseña.
- GROQ permite consultas expresivas y optimizadas sin gateways adicionales.
- Studio personalizable para facilitar a editores la creación simple (un único panel).
- Webhooks para ISR/IndexNow (SEO en minutos tras publicar).


