# 🍽️ Blog de Reseñas Locales

Un blog moderno y optimizado para SEO especializado en reseñas de restaurantes, cafés y locales gastronómicos, construido con **Next.js 14**, **Sanity CMS** y **Tailwind CSS**.

## ✨ Características Principales

- 🚀 **Next.js 14** con App Router y Server Components
- 📝 **Sanity CMS** para gestión de contenido flexible
- 🎨 **Tailwind CSS** con sistema de diseño personalizado
- 📱 **Diseño responsivo** optimizado para móviles
- ⚡ **Rendimiento optimizado** con ISR y caching inteligente
- 🔍 **SEO avanzado** con metadatos dinámicos y structured data
- ♿ **Accesibilidad** siguiendo estándares WCAG
- 🧪 **Testing** con Vitest y Playwright
- 📊 **Analytics** integrado con Google Analytics
- 🗺️ **Sitemap automático** y robots.txt optimizado

## 🏗️ Arquitectura del Proyecto

```
Blog/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Rutas públicas agrupadas
│   │   ├── blog/                 # Páginas de reseñas
│   │   ├── categorias/           # Páginas de categorías
│   │   └── tags/                 # Páginas de etiquetas
│   ├── api/                      # API Routes
│   │   └── revalidate/           # Webhook para revalidación
│   ├── components/               # Componentes de la aplicación
│   ├── lib/                      # Utilidades y configuración
│   └── sanity/                   # Configuración de Sanity
├── components/                   # Componentes reutilizables
├── lib/                          # Librerías y utilidades
├── public/                       # Assets estáticos
├── sanity/                       # Esquemas de Sanity
├── scripts/                      # Scripts de utilidad
├── styles/                       # Estilos globales
└── tests/                        # Tests unitarios y E2E
```

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm**, **yarn** o **pnpm**
- Cuenta en **Sanity.io**

### 1. Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd blog-resenas-locales

# Instalar dependencias
npm install
# o
yarn install
# o
pnpm install
```

### 2. Configuración del Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar variables de entorno
nano .env.local
```

**Variables esenciales:**
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=tu_read_token
SANITY_API_WRITE_TOKEN=tu_write_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Configurar Sanity

```bash
# Instalar Sanity CLI globalmente
npm install -g @sanity/cli

# Iniciar sesión en Sanity
sanity login

# Crear nuevo proyecto (si es necesario)
sanity init

# Desplegar esquemas
npm run studio:deploy
```

### 4. Poblar con Datos de Ejemplo

```bash
# Crear datos de ejemplo
npm run seed

# O limpiar y crear datos nuevos
npm run seed:clean
```

### 5. Ejecutar en Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar Sanity Studio (en otra terminal)
npm run studio
```

🎉 **¡Listo!** 
- **Sitio web:** http://localhost:3000
- **Sanity Studio:** http://localhost:3000/studio

## 📋 Scripts Disponibles

### Desarrollo
```bash
npm run dev              # Servidor de desarrollo
npm run studio           # Sanity Studio
npm run type-check       # Verificación de tipos TypeScript
npm run lint             # Linter ESLint
npm run lint:fix         # Corregir errores de lint automáticamente
npm run format           # Formatear código con Prettier
```

### Testing
```bash
npm run test             # Tests unitarios
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con coverage
npm run test:e2e         # Tests end-to-end
npm run test:e2e:ui      # Tests E2E con interfaz
```

### Construcción y Despliegue
```bash
npm run build            # Construir para producción
npm run start            # Iniciar servidor de producción
npm run build:all        # Verificar tipos, lint, tests y build
npm run deploy:prepare   # Preparar para despliegue
```

### Utilidades
```bash
npm run generate-sitemap # Generar sitemap.xml
npm run seed             # Poblar con datos de ejemplo
npm run clean            # Limpiar archivos generados
```

## 📝 Guía de Desarrollo

### Estructura de Componentes

```tsx
// Componente de ejemplo
import { FC } from 'react';

interface ComponentProps {
  title: string;
  description?: string;
}

const Component: FC<ComponentProps> = ({ title, description }) => {
  return (
    <div className="card">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
};

export default Component;
```

### Fetching de Datos con Sanity

```tsx
import { sanityClient } from '@/lib/sanity';

// Server Component
async function getReviews() {
  return await sanityClient.fetch(`
    *[_type == "review"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      venue -> {
        name,
        city -> { name, slug }
      }
    }
  `);
}

export default async function ReviewsPage() {
  const reviews = await getReviews();
  
  return (
    <div>
      {reviews.map(review => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
}
```

### Estilos con Tailwind CSS

El proyecto incluye un sistema de diseño personalizado:

```css
/* Variables CSS personalizadas disponibles */
:root {
  --color-brand-orange: #f3761b;
  --spacing-md: 1.5rem;
  --radius-lg: 0.5rem;
  --transition-normal: 300ms ease-in-out;
}

/* Clases de utilidad personalizadas */
.btn-primary      /* Botón principal */
.card             /* Tarjeta base */
.container-blog   /* Contenedor para blog */
.prose-blog       /* Prosa optimizada */
.tldr             /* Componente TL;DR */
.fade-in          /* Animación de entrada */
```

### SEO y Metadatos

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Título de la página',
  description: 'Descripción SEO optimizada',
  openGraph: {
    title: 'Título para redes sociales',
    description: 'Descripción para compartir',
    images: ['/og/imagen.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Título para Twitter',
    description: 'Descripción para Twitter',
    images: ['/og/imagen.jpg'],
  },
};
```

## 🎯 Guía de Contenido

### Estructura de una Reseña

Cada reseña debe incluir:

1. **Título llamativo** (50-60 caracteres)
2. **Excerpt/Resumen** (150-160 caracteres)
3. **Contenido principal** con estructura clara
4. **TL;DR** con puntos clave
5. **Puntuaciones** en diferentes aspectos
6. **Etiquetas** relevantes
7. **Metadatos SEO** optimizados

### Componentes Especiales

#### TL;DR (Too Long; Didn't Read)
```tsx
<TLDR
  summary="Resumen ejecutivo del local"
  highlights={[
    "Punto destacado 1",
    "Punto destacado 2",
    "Punto destacado 3"
  ]}
  verdict="Veredicto final conciso"
/>
```

#### FAQ (Preguntas Frecuentes)
```tsx
<FAQ
  questions={[
    {
      question: "¿Aceptan reservas?",
      answer: "Sí, recomendamos reservar especialmente los fines de semana."
    }
  ]}
/>
```

#### Puntuaciones
```tsx
<ScoreBar
  label="Comida"
  score={8.5}
  maxScore={10}
  variant="food"
/>
```

## 🔧 Configuración Avanzada

### Variables de Entorno

Ver `.env.example` para la lista completa. Las más importantes:

```env
# Sanity (Requerido)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=

# SEO y Analytics
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA_ID=

# Redes Sociales
NEXT_PUBLIC_TWITTER_HANDLE=
NEXT_PUBLIC_FACEBOOK_PAGE=
```

### Personalización del Tema

Edita `tailwind.config.ts` para personalizar:

```ts
theme: {
  extend: {
    colors: {
      primary: {
        // Tu paleta de colores
      }
    },
    fontFamily: {
      // Tus fuentes personalizadas
    }
  }
}
```

### Configuración de Sanity

Los esquemas están en `sanity/schemas/`:

- `review.ts` - Esquema de reseñas
- `venue.ts` - Esquema de locales
- `category.ts` - Esquema de categorías
- `city.ts` - Esquema de ciudades

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio** en Vercel
2. **Configurar variables de entorno** en el dashboard
3. **Desplegar automáticamente** con cada push

### Variables de Entorno para Producción

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=tu_read_token
SANITY_API_WRITE_TOKEN=tu_write_token
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
SANITY_REVALIDATE_SECRET=tu_webhook_secret
```

### Configurar Webhooks

1. **En Sanity Studio:** Configuración → API → Webhooks
2. **URL:** `https://tu-dominio.com/api/revalidate`
3. **Secret:** El valor de `SANITY_REVALIDATE_SECRET`
4. **Eventos:** Crear, Actualizar, Eliminar

### Post-Despliegue

```bash
# Generar sitemap para producción
npm run generate-sitemap

# Verificar en Google Search Console
# Subir sitemap: https://tu-dominio.com/sitemap.xml
```

## 🧪 Testing

### Tests Unitarios

```bash
# Ejecutar todos los tests
npm run test

# Tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

### Tests E2E

```bash
# Ejecutar tests end-to-end
npm run test:e2e

# Con interfaz gráfica
npm run test:e2e:ui
```

### Estructura de Tests

```
tests/
├── unit/                    # Tests unitarios
│   └── components/          # Tests de componentes
├── e2e/                     # Tests end-to-end
│   └── seo-validation.spec.ts
└── setup.ts                 # Configuración de tests
```

## 📈 Monitoreo y Analytics

### Google Analytics

Configurado automáticamente con `NEXT_PUBLIC_GA_ID`.

### Core Web Vitals

Monitoreado automáticamente por Next.js y reportado a Analytics.

### Error Tracking

Opcional: Configurar Sentry con las variables correspondientes.

## 🔒 Seguridad

### Headers de Seguridad

Configurados en `next.config.mjs`:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Validación de Datos

Todos los datos de Sanity son validados y sanitizados.

### Rate Limiting

Implementado en las API routes para prevenir abuso.

## 🛠️ Troubleshooting

### Problemas Comunes

#### Error de conexión con Sanity
```bash
# Verificar credenciales
sanity projects list

# Verificar tokens en .env.local
```

#### Problemas de build
```bash
# Limpiar cache
npm run clean
rm -rf node_modules package-lock.json
npm install
```

#### Problemas de tipos TypeScript
```bash
# Verificar tipos
npm run type-check

# Regenerar tipos de Sanity
npx sanity typegen generate
```

### Logs y Debugging

```bash
# Habilitar debug en desarrollo
DEBUG=true npm run dev

# Revisar logs de Vercel
vercel logs
```

## 🤝 Contribución

### Workflow de Desarrollo

1. **Fork** del repositorio
2. **Crear rama** para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. **Hacer cambios** siguiendo las convenciones de código
4. **Ejecutar tests:** `npm run test`
5. **Verificar lint:** `npm run lint`
6. **Commit** con mensaje descriptivo
7. **Push** y crear **Pull Request**

### Convenciones de Código

- **ESLint** y **Prettier** configurados
- **Conventional Commits** para mensajes
- **TypeScript** estricto habilitado
- **Tests** requeridos para nuevas funcionalidades

### Code Review

Todos los PRs requieren:
- ✅ Tests pasando
- ✅ Lint sin errores
- ✅ TypeScript sin errores
- ✅ Revisión de código

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

### Documentación

- [Next.js Docs](https://nextjs.org/docs)
- [Sanity Docs](https://www.sanity.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Comunidad

- **Issues:** Para reportar bugs o solicitar features
- **Discussions:** Para preguntas y discusiones generales
- **Wiki:** Para documentación adicional

---

## 📊 Estado del Proyecto

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-green)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

**Última actualización:** Enero 2024

---

¡Gracias por usar nuestro Blog de Reseñas Locales! 🎉