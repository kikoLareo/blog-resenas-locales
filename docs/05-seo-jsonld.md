## 05. SEO y JSON-LD

### Metadatos

- Base en `app/layout.tsx`: `Metadata` de Next, OpenGraph y Twitter.

### JSON-LD

- Helpers en `lib/schema.ts`:
  - `websiteJsonLd`, `organizationJsonLd`, `localBusinessJsonLd`, `reviewJsonLd`, `articleJsonLd`, `faqJsonLd`, `breadcrumbsJsonLd`, `combineJsonLd`.
- Inyección:
  - Layout: `@graph` con WebSite + Organization.
  - Páginas City/Venue/Review/Blog: script con JSON.stringify del schema correspondiente.

### Finalidad

- Maximizar rich results (LocalBusiness/Review/FAQ/BlogPosting) y AEO (respuestas claras y estructuradas).
- Evitar duplicidad de datos: los helpers centralizan las formas y validaciones (rangos de rating, URLs válidas, etc.).


