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

### Seed de contenido (opcional)

1. Crea un token con permisos de Editor en Sanity.
2. Ejecuta:

```
export SANITY_AUTH_TOKEN=tu_token
npx sanity exec sanity/seed.ts --with-user-token
```

Esto crea ciudades, categorías, locales, reseñas y posts de ejemplo con imágenes.


