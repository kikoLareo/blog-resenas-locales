## 03. Frontend y UI

### App Router

- Home: `app/page.tsx` (server) – hace `sanityFetch(homepageQuery)` y pasa datos a UI.
- Ciudad: `app/(public)/[city]/page.tsx` – conectado a consultas GROQ de Sanity.
- Local: `app/(public)/[city]/[venue]/page.tsx` – conectado a consultas GROQ de Sanity.
- Reseña: `app/(public)/[city]/[venue]/review/[slug]/page.tsx` – conectado a consultas GROQ de Sanity.

### Componentes clave

- `components/HeroSection.tsx`: slider/hero. Finalidad: captar atención con contenido destacado. Acepta `reviews` con `title, image, rating, location, readTime, description` para desacoplar datos de la UI.
- `components/FeaturedSections.tsx`: listas de reseñas destacadas; props `trending`, `topRated`.
- `components/NewsletterCTA.tsx`: captura de email.
- `components/Header.tsx` / `components/Footer.tsx`: layout.

### Estilos

- Tailwind (config en `tailwind.config.ts`).
- Variables CSS en `styles/globals.css` (capa design tokens: background, foreground, accent, etc.).

### Decisiones y finalidad

- La home se mantiene ligera: RSC + fetch en servidor; los componentes de hero/listas sólo reciben props.
- Las rutas de contenido están conectadas directamente con Sanity para mostrar datos reales.
- Evitamos acoplar los componentes al cliente de Sanity directamente para permitir SSR, caching y tests.


