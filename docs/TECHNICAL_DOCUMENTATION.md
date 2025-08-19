# Documentación Técnica - Blog de Reseñas de Locales

## 📋 Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [APIs y Endpoints](#apis-y-endpoints)
5. [Componentes UI](#componentes-ui)
6. [Sistema de Autenticación](#sistema-de-autenticación)
7. [Gestión de Contenido (Sanity)](#gestión-de-contenido-sanity)
8. [Sistema QR](#sistema-qr)
9. [Gestión de Imágenes](#gestión-de-imágenes)
10. [SEO y Rendimiento](#seo-y-rendimiento)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Guías de Desarrollo](#guías-de-desarrollo)

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (Sanity CMS)  │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth.js       │    │   GROQ Queries  │    │   Analytics     │
│   (OAuth)       │    │   (Sanity)      │    │   (GA4)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Patrones de Diseño

- **App Router**: Next.js 15 con App Router
- **Server Components**: Componentes servidor por defecto
- **Client Components**: Solo donde es necesario interactividad
- **API Routes**: Endpoints para funcionalidades específicas
- **Middleware**: Autenticación y redirecciones

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 15.0.0
- **Lenguaje**: TypeScript 5.3.3
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 3.4.0
- **Icons**: Lucide React
- **Forms**: React Hook Form (implícito en componentes UI)

### Backend & CMS
- **CMS**: Sanity v3
- **Database**: Sanity Dataset
- **Query Language**: GROQ
- **Image CDN**: Sanity Image CDN

### Autenticación
- **Provider**: Auth.js (NextAuth) v5
- **Strategies**: OAuth social, Magic Links, TOTP
- **Database**: Prisma + PostgreSQL

### Herramientas de Desarrollo
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Vitest + Playwright
- **Type Checking**: TypeScript

---

## 📁 Estructura del Proyecto

```
blog-resenas-locales/
├── app/                          # App Router (Next.js 15)
│   ├── (auth)/                   # Rutas de autenticación
│   ├── (public)/                 # Rutas públicas
│   ├── admin/                    # Dashboard administrativo
│   ├── api/                      # API Routes
│   ├── dashboard/                # Dashboard principal
│   ├── qr/                       # Sistema QR
│   └── studio/                   # Sanity Studio
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base (shadcn/ui)
│   ├── admin/                    # Componentes del dashboard
│   └── providers/                # Providers de contexto
├── lib/                          # Utilidades y configuraciones
├── sanity/                       # Configuración de Sanity
│   ├── schemas/                  # Esquemas de contenido
│   └── lib/                      # Utilidades de Sanity
├── types/                        # Definiciones de tipos TypeScript
├── tests/                        # Tests automatizados
└── docs/                         # Documentación
```

---

## 🔌 APIs y Endpoints

### API Routes Principales

#### Autenticación
```typescript
// app/api/auth/[...nextauth]/route.ts
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/session
```

#### Gestión de Contenido
```typescript
// app/api/revalidate/route.ts
POST /api/revalidate
```

#### Sistema QR
```typescript
// app/api/qr/feedback/route.ts
POST /api/qr/feedback
  Body: {
    venueId: string
    qrCode: string
    name: string
    email?: string
    phone?: string
    visitDate: string
    partySize: number
    // ... otros campos
  }
```

#### Gestión de Imágenes
```typescript
// app/api/upload-image/route.ts
POST /api/upload-image
  Body: FormData
  Response: {
    _id: string
    url: string
    filename: string
    size: number
    contentType: string
  }
```

#### Sitemaps
```typescript
// app/api/sitemap/route.ts
GET /api/sitemap
GET /api/sitemap/[type]
```

### Sanity Queries (GROQ)

#### Queries Básicas
```groq
// Obtener todas las ciudades
*[_type == "city"] | order(order asc, title asc) {
  _id, title, slug, region, description, heroImage
}

// Obtener local con detalles
*[_type == "venue" && slug.current == $slug][0] {
  _id, title, slug, description, address, phone, website,
  "city": city->{title, slug},
  "categories": categories[]->{title, slug},
  "reviews": *[_type == "review" && venue._ref == ^._id] {
    _id, title, ratings, publishedAt
  }
}
```

#### Queries Avanzadas
```groq
// Homepage con datos destacados
{
  "featuredReviews": *[_type == "review"] | order(ratings.food desc)[0...3] {
    _id, title, slug, ratings,
    "venue": venue->{title, slug, "city": city->title}
  },
  "featuredCities": *[_type == "city" && featured == true] | order(order asc)[0...4] {
    _id, title, slug, description, heroImage,
    "venueCount": count(*[_type == "venue" && city._ref == ^._id])
  }
}
```

---

## 🎨 Componentes UI

### Componentes Base (shadcn/ui)

```typescript
// components/ui/button.tsx
interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
}

// components/ui/card.tsx
interface CardProps {
  children: React.ReactNode
  className?: string
}
```

### Componentes Especializados

#### ImageManager
```typescript
// components/ImageManager.tsx
interface ImageManagerProps {
  entityId: string
  entityType: 'venue' | 'review' | 'city' | 'category' | 'post'
  currentImages?: ImageAsset[]
  onImagesChange: (images: ImageAsset[]) => void
  maxImages?: number
  title?: string
}
```

#### QRVenueForm
```typescript
// components/QRVenueForm.tsx
interface QRVenueFormProps {
  venueId: string
  venueName: string
  qrCode: string
}
```

### Patrones de Componentes

#### Server Components
```typescript
// Componente servidor (por defecto)
export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const venue = await sanityFetch(venueQuery, { slug });
  
  return <VenueDetail venue={venue} />;
}
```

#### Client Components
```typescript
// Componente cliente (cuando se necesita interactividad)
"use client";
export default function VenueForm({ venue }: { venue: Venue }) {
  const [formData, setFormData] = useState(venue);
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## 🔐 Sistema de Autenticación

### Configuración Auth.js

```typescript
// lib/auth.ts
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      
      return true;
    },
  },
};
```

### Roles y Permisos

```typescript
// Tipos de usuario
type UserRole = 'guest' | 'member' | 'editor' | 'admin';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
}
```

### Middleware de Protección

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas protegidas
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('authjs.session-token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }
  
  return NextResponse.next();
}
```

---

## 📝 Gestión de Contenido (Sanity)

### Esquemas de Contenido

#### Venue (Local)
```typescript
// sanity/schemas/venue.ts
export default defineType({
  name: 'venue',
  title: 'Local',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
    }),
    defineField({
      name: 'address',
      title: 'Dirección',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
    }),
    defineField({
      name: 'website',
      title: 'Sitio web',
      type: 'url',
    }),
    defineField({
      name: 'priceRange',
      title: 'Rango de precios',
      type: 'string',
      options: {
        list: ['€', '€€', '€€€', '€€€€'],
      },
    }),
    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'reference',
      to: [{ type: 'city' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'images',
      title: 'Imágenes',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'geo',
      title: 'Ubicación',
      type: 'geopoint',
    }),
  ],
});
```

#### Review (Reseña)
```typescript
// sanity/schemas/review.ts
export default defineType({
  name: 'review',
  title: 'Reseña',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Local',
      type: 'reference',
      to: [{ type: 'venue' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ratings',
      title: 'Puntuaciones',
      type: 'object',
      fields: [
        { name: 'food', title: 'Comida', type: 'number', validation: Rule => Rule.min(1).max(5) },
        { name: 'service', title: 'Servicio', type: 'number', validation: Rule => Rule.min(1).max(5) },
        { name: 'ambience', title: 'Ambiente', type: 'number', validation: Rule => Rule.min(1).max(5) },
        { name: 'value', title: 'Relación calidad-precio', type: 'number', validation: Rule => Rule.min(1).max(5) },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Contenido',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
    }),
  ],
});
```

### Queries GROQ Optimizadas

#### Query de Local con Detalles
```groq
*[_type == "venue" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  address,
  phone,
  website,
  priceRange,
  geo,
  images,
  "city": city->{
    _id,
    title,
    slug
  },
  "categories": categories[]->{
    _id,
    title,
    slug,
    icon,
    color
  },
  "reviews": *[_type == "review" && venue._ref == ^._id && publishedAt != null] | order(publishedAt desc) {
    _id,
    title,
    slug,
    ratings,
    publishedAt,
    "author": author->name
  },
  "reviewCount": count(*[_type == "review" && venue._ref == ^._id && publishedAt != null]),
  "avgRating": avg(*[_type == "review" && venue._ref == ^._id && publishedAt != null].ratings.overall)
}
```

---

## 📱 Sistema QR

### Arquitectura del Sistema QR

```typescript
// lib/qr-utils.ts
interface QRCodeData {
  id: string;
  venueId: string;
  venueSlug: string;
  citySlug: string;
  code: string;
  expiresAt?: string;
  maxUses?: number;
}

interface QRCodeUsage {
  id: string;
  code: string;
  venueId: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}
```

### Flujo de Funcionamiento

1. **Generación**: Admin crea código QR para un local
2. **Validación**: Sistema valida código al acceder
3. **Registro**: Se registra el uso del código
4. **Formulario**: Usuario completa información
5. **Feedback**: Se almacena feedback en Sanity

### Endpoints QR

```typescript
// app/api/qr/feedback/route.ts
POST /api/qr/feedback
{
  venueId: string,
  qrCode: string,
  name: string,
  email?: string,
  phone?: string,
  visitDate: string,
  visitTime?: string,
  partySize: number,
  occasion?: string,
  specialRequests?: string,
  rating?: string,
  feedback?: string
}
```

### Validaciones QR

```typescript
// lib/qr-utils.ts
export function isQRCodeValid(qrCode: {
  isActive: boolean;
  expiresAt?: string;
  maxUses?: number;
  currentUses: number;
}): { valid: boolean; reason?: string } {
  // Verificar si está activo
  if (!qrCode.isActive) {
    return { valid: false, reason: 'Código QR inactivo' };
  }

  // Verificar fecha de expiración
  if (qrCode.expiresAt) {
    const expirationDate = new Date(qrCode.expiresAt);
    const now = new Date();
    
    if (now > expirationDate) {
      return { valid: false, reason: 'Código QR expirado' };
    }
  }

  // Verificar límite de usos
  if (qrCode.maxUses && qrCode.currentUses >= qrCode.maxUses) {
    return { valid: false, reason: 'Límite de usos alcanzado' };
  }

  return { valid: true };
}
```

---

## 🖼️ Gestión de Imágenes

### Componente ImageManager

```typescript
// components/ImageManager.tsx
interface ImageManagerProps {
  entityId: string;
  entityType: 'venue' | 'review' | 'city' | 'category' | 'post';
  currentImages?: ImageAsset[];
  onImagesChange: (images: ImageAsset[]) => void;
  maxImages?: number;
  title?: string;
}
```

### Funcionalidades

- **Subida múltiple**: Drag & drop o selección múltiple
- **Validación**: Tipos de archivo y tamaño máximo
- **Reordenamiento**: Botones ↑↓ para cambiar orden
- **Edición**: Modal para editar alt y caption
- **Imagen destacada**: Primera imagen automáticamente destacada
- **Eliminación**: Eliminar imágenes individuales

### Endpoint de Subida

```typescript
// app/api/upload-image/route.ts
POST /api/upload-image
Content-Type: multipart/form-data

Response:
{
  _id: string,
  url: string,
  filename: string,
  size: number,
  contentType: string
}
```

### Optimización de Imágenes

```typescript
// Sanity Image CDN
const imageUrl = sanityClient.image(imageAsset)
  .width(800)
  .height(600)
  .fit('crop')
  .crop('focalpoint')
  .focalPoint(0.5, 0.5)
  .url();
```

---

## 🔍 SEO y Rendimiento

### Metadatos Dinámicos

```typescript
// app/venues/[slug]/page.tsx
export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { slug } = await params;
  const venue = await sanityFetch(venueQuery, { slug });
  
  return {
    title: `${venue.title} | ${SITE_CONFIG.name}`,
    description: venue.description,
    openGraph: {
      title: venue.title,
      description: venue.description,
      images: venue.images?.map(img => ({
        url: img.url,
        width: 1200,
        height: 630,
        alt: img.alt || venue.title,
      })),
    },
  };
}
```

### JSON-LD Schema

```typescript
// lib/schema.ts
export function venueJsonLd(venue: Venue) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": venue.title,
    "description": venue.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": venue.address,
    },
    "telephone": venue.phone,
    "url": venue.website,
    "priceRange": venue.priceRange,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": venue.avgRating,
      "reviewCount": venue.reviewCount,
    },
  };
}
```

### Sitemaps Dinámicos

```typescript
// app/api/sitemap/route.ts
export async function GET() {
  const venues = await sanityClient.fetch(venuesSitemapQuery);
  const reviews = await sanityClient.fetch(reviewsSitemapQuery);
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${venues.map(venue => `
        <url>
          <loc>${SITE_CONFIG.url}/venues/${venue.slug}</loc>
          <lastmod>${venue._updatedAt}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>`;
  
  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

### Optimizaciones de Rendimiento

- **Server Components**: Reducción de JavaScript en cliente
- **Image Optimization**: Next.js Image con Sanity CDN
- **Caching**: Revalidación ISR para contenido dinámico
- **Code Splitting**: Lazy loading automático
- **Bundle Analysis**: Optimización de dependencias

---

## 🧪 Testing

### Configuración de Tests

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
```

### Tests Unitarios

```typescript
// tests/unit/lib/groq.test.ts
import { describe, it, expect } from 'vitest';
import { venueQuery } from '@/sanity/lib/queries';

describe('GROQ Queries', () => {
  it('should generate valid venue query', () => {
    expect(venueQuery).toContain('_type == "venue"');
    expect(venueQuery).toContain('slug.current == $slug');
  });
});
```

### Tests E2E

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test('should navigate to venue page', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Ver Local');
  await expect(page).toHaveURL(/\/venues\/.+/);
});
```

### Tests de Rendimiento

```typescript
// tests/e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test('should load homepage within 3 seconds', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(3000);
});
```

---

## 🚀 Deployment

### Configuración de Vercel

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SANITY_PROJECT_ID": "@sanity-project-id",
    "NEXT_PUBLIC_SANITY_DATASET": "@sanity-dataset",
    "SANITY_API_TOKEN": "@sanity-api-token"
  }
}
```

### Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=tu-api-token

# Auth.js
AUTH_SECRET=tu-auth-secret
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Database
DATABASE_URL=tu-database-url
```

### Scripts de Build

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test",
    "sanity:deploy": "sanity deploy"
  }
}
```

---

## 👨‍💻 Guías de Desarrollo

### Configuración del Entorno

1. **Clonar repositorio**
```bash
git clone https://github.com/tu-usuario/blog-resenas-locales.git
cd blog-resenas-locales
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

4. **Configurar Sanity**
```bash
npm run sanity:init
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

### Flujo de Desarrollo

1. **Crear feature branch**
```bash
git checkout -b feature/nueva-funcionalidad
```

2. **Desarrollar funcionalidad**
```bash
# Hacer cambios en el código
npm run type-check
npm run lint
```

3. **Ejecutar tests**
```bash
npm run test
npm run test:e2e
```

4. **Crear Pull Request**
```bash
git add .
git commit -m "feat: añadir nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

### Convenciones de Código

#### Nomenclatura
- **Archivos**: kebab-case (`venue-detail.tsx`)
- **Componentes**: PascalCase (`VenueDetail`)
- **Funciones**: camelCase (`getVenueData`)
- **Constantes**: UPPER_SNAKE_CASE (`SITE_CONFIG`)

#### Estructura de Componentes
```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  children: React.ReactNode;
}

// 3. Component
export default function Component({ title, children }: ComponentProps) {
  // 4. State
  const [isOpen, setIsOpen] = useState(false);
  
  // 5. Handlers
  const handleClick = () => setIsOpen(!isOpen);
  
  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

#### Comentarios
```typescript
/**
 * Obtiene los datos de un local desde Sanity
 * @param slug - Slug del local
 * @returns Promise<Venue | null>
 */
export async function getVenue(slug: string): Promise<Venue | null> {
  // Query GROQ optimizada para obtener local con relaciones
  const venue = await sanityClient.fetch(venueQuery, { slug });
  return venue;
}
```

### Debugging

#### Logs de Desarrollo
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
};
```

#### Debug de Sanity
```typescript
// lib/sanity.client.ts
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  logger: process.env.NODE_ENV === 'development' ? console : undefined,
});
```

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Auth.js Documentation](https://authjs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Herramientas Útiles
- [GROQ Query Builder](https://www.sanity.io/docs/groq)
- [Sanity Vision](https://www.sanity.io/docs/sanity-vision)
- [Next.js Analytics](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)

### Comunidad
- [Next.js Discord](https://discord.gg/nextjs)
- [Sanity Community](https://www.sanity.io/community)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

*Última actualización: Enero 2025*

