# 🍽️ Blog de Reseñas de Restaurantes

> **Un blog ultra-rápido y escalable para reseñas gastronómicas optimizado para SEO y AEO**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Sanity](https://img.shields.io/badge/Sanity-v3-red)](https://www.sanity.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)](https://tailwindcss.com/)

## 🚀 Características

- ⚡ **Next.js 14** con App Router y Server Components
- 🎨 **Sanity CMS** v3 para gestión de contenido
- 📱 **Responsive** y optimizado para móviles
- 🔍 **SEO/AEO** completo con JSON-LD schema.org
- 🚀 **ISR** (Incremental Static Regeneration) con webhooks
- 📊 **Zero CLS** en carga de anuncios
- ♿ **Accesibilidad** AA completa
- 🧪 **Testing** E2E y unitario
- 📈 **Analytics** y métricas de rendimiento

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 14    │────│   Sanity CMS    │────│    Vercel       │
│   (Frontend)    │    │   (Headless)    │    │   (Deploy)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  TailwindCSS    │    │   Webhooks      │    │   Analytics     │
│  (Styling)      │    │   (ISR)         │    │   (Tracking)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta en Sanity.io
- Cuenta en Vercel (opcional)

### 1. Clonar y configurar

```bash
# Clonar el repositorio
git clone <repository-url>
cd blog-restaurantes

# Instalar dependencias
npm install

# Copiar variables de entorno
cp env.example .env.local
```

### 2. Configurar Sanity

```bash
# Crear proyecto en Sanity
npx sanity init

# Configurar Studio
npm run studio
```

### 3. Configurar variables de entorno

Edita `.env.local` con tus valores:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_SITE_NAME="Tu Blog de Reseñas"

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=tu-read-token
SANITY_WEBHOOK_SECRET=tu-webhook-secret

# Opcional: Analytics, Maps, Ads
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_MAPS_KEY=tu-maps-key
```

### 4. Ejecutar en desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Sanity Studio (en otra terminal)
npm run studio
```

## 📝 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Next.js dev server
npm run studio       # Sanity Studio

# Build y producción
npm run build        # Build para producción
npm run start        # Servidor de producción

# Testing
npm run test         # Tests unitarios (Vitest)
npm run test:e2e     # Tests E2E (Playwright)
npm run test:e2e:ui  # Tests E2E con UI

# Utilidades
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## 📊 Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── (public)/          # Rutas públicas
│   │   └── [city]/        # Páginas dinámicas por ciudad
│   ├── api/               # API Routes
│   │   ├── revalidate/    # Webhook ISR
│   │   └── sitemap/       # Sitemaps dinámicos
│   ├── blog/              # Crónicas/artículos
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Homepage
├── components/            # Componentes React
│   ├── AdSlot.tsx         # Anuncios sin CLS
│   ├── FAQ.tsx            # Preguntas frecuentes
│   ├── TLDR.tsx           # Resúmenes AEO
│   ├── ScoreBar.tsx       # Puntuaciones visuales
│   └── Breadcrumbs.tsx    # Navegación + JSON-LD
├── lib/                   # Utilidades
│   ├── sanity.client.ts   # Cliente Sanity
│   ├── groq.ts            # Queries GROQ
│   ├── schema.ts          # Generadores JSON-LD
│   ├── seo.ts             # Helpers SEO
│   └── types.ts           # Tipos TypeScript
├── sanity/                # Configuración CMS
│   ├── schemas/           # Esquemas de contenido
│   └── desk/              # Estructura del Studio
├── tests/                 # Tests
│   ├── e2e/               # Playwright
│   └── unit/              # Vitest
└── styles/                # Estilos globales
```

## 🎯 Modelos de Contenido

### Venue (Local)
- Información NAP (Name, Address, Phone)
- Coordenadas GPS y horarios
- Imágenes con hotspot
- Categorías y rango de precios
- Redes sociales

### Review (Reseña)
- Puntuaciones (comida, servicio, ambiente, precio)
- TL;DR optimizado para AEO (50-75 caracteres)
- FAQ con respuestas de 40-55 caracteres
- Pros/contras y platos destacados
- Galería de imágenes

### Post (Crónica)
- Artículos largos estilo blog
- FAQ opcional
- Locales relacionados
- Categorización y tags

### City y Category
- Organización geográfica y temática
- Conteos automáticos
- Imágenes representativas

## ✍️ Guía Editorial

### Escribir Reseñas Efectivas

#### TL;DR (Resumen AEO)
- **Longitud**: 50-75 caracteres exactos
- **Estructura**: [Local] + [Destacado] + [Veredicto]
- **Ejemplo**: "Marisquería O Porto: pescado fresco, ambiente familiar. Imprescindible."

#### FAQ Optimizadas
- **3-5 preguntas** por reseña
- **Respuestas**: 40-55 caracteres
- **Enfoque**: Preguntas que la gente realmente hace
- **Ejemplo**:
  - P: "¿Aceptan reservas?"
  - R: "Sí, recomendable reservar fines de semana"

#### Puntuaciones
- **Comida** (0-10): Calidad, frescura, preparación
- **Servicio** (0-10): Atención, rapidez, profesionalidad  
- **Ambiente** (0-10): Decoración, música, comodidad
- **Calidad-Precio** (0-10): Relación coste-beneficio

### Workflow Editorial

1. **Crear Local** (si no existe)
   - Datos NAP completos
   - Categorías apropiadas
   - Imágenes de calidad

2. **Crear Reseña**
   - Fecha de visita real
   - Puntuaciones honestas
   - TL;DR impactante
   - FAQ útiles
   - Pros/contras equilibrados

3. **Publicar y Promocionar**
   - Revisar preview
   - Compartir en redes
   - Monitorear métricas

## 🔧 Configuración Avanzada

### Webhooks de Sanity

1. En tu proyecto Sanity, ve a **Settings > API > Webhooks**
2. Crea un nuevo webhook:
   - **URL**: `https://tu-dominio.com/api/revalidate`
   - **Dataset**: production
   - **Trigger on**: Create, Update, Delete
   - **Filter**: `_type in ["venue", "review", "post", "city", "category"]`
   - **Secret**: Tu `SANITY_WEBHOOK_SECRET`

### Analytics

#### Google Analytics 4
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Plausible (alternativa)
```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=tu-dominio.com
```

### Anuncios

#### Google Ad Manager
```env
ADS_PROVIDER=gam
ADS_SCRIPT_URL=https://securepubads.g.doubleclick.net/tag/js/gpt.js
```

#### AdSense
```env
ADS_PROVIDER=adsense
```

## 🧪 Testing

### Tests E2E (Playwright)

```bash
# Ejecutar todos los tests
npm run test:e2e

# Test específico
npx playwright test seo-validation

# Con interfaz visual
npm run test:e2e:ui
```

### Tests Unitarios (Vitest)

```bash
# Ejecutar tests
npm run test

# Modo watch
npm run test -- --watch

# Coverage
npm run test -- --coverage
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura variables de entorno
3. Deploy automático en cada push

### Variables de Entorno en Vercel

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://tu-app.vercel.app
NEXT_PUBLIC_SITE_NAME="Tu Blog"

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=sk...
SANITY_WEBHOOK_SECRET=super-secret-key

# Analytics (opcional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 📈 Monitoreo y Métricas

### Core Web Vitals
- **LCP** < 2.5s ✅
- **FID** < 100ms ✅  
- **CLS** < 0.1 ✅

### SEO Checklist
- ✅ Sitemaps dinámicos
- ✅ JSON-LD en todas las páginas
- ✅ Meta tags optimizados
- ✅ Breadcrumbs con schema
- ✅ Imágenes con alt text
- ✅ URLs semánticas

### AEO (Answer Engine Optimization)
- ✅ TL;DR optimizados
- ✅ FAQ con respuestas concisas
- ✅ Estructura de preguntas naturales
- ✅ Contenido escaneble

## 🐛 Troubleshooting

### Problemas Comunes

#### Build fails con errores de TypeScript
```bash
npm run type-check
# Revisar errores y corregir
```

#### Sanity Studio no carga
```bash
# Verificar variables de entorno
echo $NEXT_PUBLIC_SANITY_PROJECT_ID
echo $NEXT_PUBLIC_SANITY_DATASET

# Reinstalar Sanity
npm install sanity@latest
```

#### ISR no funciona
- Verificar webhook URL
- Comprobar secret de webhook
- Revisar logs en Vercel

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Add: nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Créditos

- **Next.js** - Framework React
- **Sanity** - Headless CMS
- **Tailwind CSS** - Framework CSS
- **Vercel** - Platform de deploy
- **Heroicons** - Iconos
- **Playwright** - Testing E2E

---

**¡Hecho con ❤️ para la comunidad gastronómica gallega!** 🥘