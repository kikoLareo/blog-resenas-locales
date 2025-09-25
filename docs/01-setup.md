## 01. Setup y requisitos

### Requisitos

- Node.js 18+ (LTS recomendado)
- npm 9+
- Cuenta de Sanity con proyecto creado

### Variables de entorno

Crear `.env.local` con:

```
SANITY_PROJECT_ID=...
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01

SANITY_API_READ_TOKEN=... # opcional si necesitas leer drafts/preview

GA_MEASUREMENT_ID=G-XXXXXXX # GA4 (opcional)

SITE_URL=https://tu-dominio.com
```

Para el Studio/CLI, puedes usar también prefijos `SANITY_STUDIO_*`.

### Instalación

```
npm install
npm run dev
```

### Contenido

La aplicación funciona únicamente con datos reales ingresados a través del Studio de Sanity. Asegúrate de crear contenido real (ciudades, categorías, locales, reseñas y posts) directamente en el Studio.


