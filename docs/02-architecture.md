## 02. Arquitectura

### Stack

- Next.js 15 (App Router) + React 19
- TypeScript, Tailwind CSS
- Sanity (CMS) + next-sanity
- Tests con Vitest + Testing Library

### Finalidad y por qué este stack

- **Next.js (App Router)**: server components, routing basado en archivos, `generateMetadata`, RSC + streaming. Minimiza JS en cliente y facilita SEO.
- **React 19**: mejoras de rendimiento y compatibilidad con Next 15.
- **Sanity**: CMS headless con GROQ (consultas declarativas), modelo flexible y webhooks para ISR.
- **Tailwind**: velocidad de maquetación y consistencia visual (tokens vía CSS variables).
- **Vitest/RTL**: feedback rápido y pruebas aisladas de componentes/utilidades.

### Estructura de carpetas (alto nivel)

- `app/`: páginas y rutas (App Router)
  - `page.tsx`: home
  - `(public)/[city]/...`: rutas públicas dinámicas (ciudad, local, reseña)
  - `api/`: endpoints (sitemaps, revalidate)
  - `studio/[[...tool]]/page.tsx`: Studio embebido (solo dev)
- `components/`: UI y building blocks
- `lib/`: utilidades (constants, schema JSON-LD, sanity client, etc.)
- `sanity/`: esquemas, desk-structure y queries GROQ
- `public/`: estáticos (robots, pronto manifest e iconos)
- `tests/`: unitarios y E2E

### Flujo de datos

1. Páginas server components (e.g. `app/page.tsx`) usan `sanityFetch(query)` para obtener datos.
2. Los datos se transforman y pasan a componentes de UI (`HeroSection`, `FeaturedSections`).
3. JSON-LD se genera en `lib/schema.ts` y se inyecta con `<script type="application/ld+json" />`.
4. ISR y revalidación: endpoints en `app/api/revalidate` (integrable con webhooks de Sanity).

### Principios de diseño

- **Separation of concerns**: datos (Sanity/GROQ) aislados en `sanity/lib/queries.ts` y `lib/sanity.client.ts`.
- **Server-first**: obtener datos en el servidor y enviar HTML listo; sólo UI interactiva es client component.
- **SEO first**: metadatos + JSON-LD generados en servidor; sitemaps dinámicos.
- **Extensibilidad**: componentes UI reciben datos por props; fácil pasar del mock a real.

### Trade‑offs

- Sanity + GROQ evita ORMs en el FE, pero requiere aprender GROQ.
- App Router aporta mejoras, pero exige adaptar tipos (e.g., `params` prometidos en Next 15).


