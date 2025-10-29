# 📚 Documentación Técnica - Blog Reseñas Locales

## 🏗️ Arquitectura General

### Stack Tecnológico

- **Framework**: Next.js 15.1.0 (App Router)
- **CMS**: Sanity v4.4.1
- **Base de Datos**: Prisma (para usuarios y autenticación)
- **Autenticación**: NextAuth.js
- **Estilos**: Tailwind CSS
- **TypeScript**: Tipado fuerte en toda la aplicación
- **Testing**: Vitest + Playwright
- **Deployment**: Vercel

---

## 🗂️ Estructura de Carpetas

```
blog-resenas-locales/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación
│   ├── (marketing)/              # Páginas de marketing
│   ├── (public)/                 # Páginas públicas
│   │   ├── page.tsx              # Homepage con hero y secciones
│   │   ├── [citySlug]/           # Páginas de ciudad
│   │   │   ├── page.tsx          # Lista de venues por ciudad
│   │   │   ├── [venueSlug]/      # Detalle de venue
│   │   │   │   ├── page.tsx      # Página de venue
│   │   │   │   └── review/[reviewSlug]/
│   │   │   │       └── page.tsx  # Detalle de reseña
│   │   └── categorias/[slug]/    # Páginas de categorías
│   ├── dashboard/                # Admin Dashboard
│   │   ├── venues/               # Gestión de venues
│   │   ├── reviews/              # Gestión de reseñas
│   │   ├── cities/               # Gestión de ciudades
│   │   └── categories/           # Gestión de categorías
│   ├── api/                      # API Routes
│   │   ├── admin/                # Endpoints admin
│   │   ├── auth/                 # NextAuth endpoints
│   │   └── revalidate/           # Cache revalidation
│   └── studio/                   # Sanity Studio
├── components/                   # Componentes React
│   ├── ui/                       # Componentes UI base
│   └── dashboard/                # Componentes del dashboard
├── lib/                          # Utilidades y configuración
│   ├── sanity.ts                 # Cliente Sanity público
│   ├── sanity.client.ts          # Cliente Sanity avanzado
│   ├── admin-sanity.ts           # Cliente Sanity admin
│   └── auth.ts                   # Configuración NextAuth
├── sanity/                       # Configuración Sanity
│   ├── schemas/                  # Schemas de contenido
│   │   ├── venue.ts              # Schema de locales
│   │   ├── review.ts             # Schema de reseñas
│   │   ├── city.ts               # Schema de ciudades
│   │   └── category.ts           # Schema de categorías
│   ├── desk/                     # Estructura del Studio
│   │   └── structure.ts          # Organización del contenido
│   └── env.ts                    # Variables de entorno Sanity
├── prisma/                       # Base de datos
│   └── schema.prisma             # Schema Prisma (usuarios)
└── scripts/                      # Scripts de utilidad
    ├── check-sanity-data.ts      # Verificar datos
    └── debug-city-field.ts       # Debug de campos
```

---

## 🔌 Comunicación con Sanity

### Clientes Sanity

La aplicación utiliza **3 clientes diferentes** de Sanity según el contexto:

#### 1. **Cliente Público** (`lib/sanity.ts`)
```typescript
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true, // Usa CDN para mejor rendimiento
})
```

**Uso**: Consultas públicas (páginas de venue, reseñas, listados)

#### 2. **Cliente Admin** (`lib/admin-sanity.ts`)
```typescript
export const adminSanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false, // Sin CDN para datos frescos
  token: process.env.SANITY_API_TOKEN, // Token con permisos
})
```

**Uso**: Dashboard admin, operaciones CRUD

#### 3. **Cliente Write** (`lib/admin-sanity.ts`)
```typescript
export const adminSanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  ignoreBrowserTokenWarning: true, // Para escritura
})
```

**Uso**: Crear, actualizar y eliminar documentos

### Variables de Entorno Sanity

```env
# Públicas (accesibles en cliente)
NEXT_PUBLIC_SANITY_PROJECT_ID=xaenlpyp
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Privadas (solo servidor)
SANITY_API_TOKEN=sk_xxxxx  # Token con permisos de escritura
SANITY_AUTH_TOKEN=sk_xxxxx # Alias del token
```

### Queries GROQ Comunes

#### Obtener Venues con Ciudad
```groq
*[_type == "venue" && defined(city._ref)] {
  _id,
  title,
  slug,
  description,
  address,
  phone,
  website,
  priceRange,
  "citySlug": city->slug.current,
  "cityTitle": city->title,
  city-> {
    _id,
    title,
    slug
  },
  categories[]-> {
    _id,
    title
  }
}
```

#### Obtener Reseñas con Venue y Ciudad
```groq
*[_type == "review"] {
  _id,
  title,
  slug,
  content,
  ratings {
    food,
    service,
    ambience,
    value
  },
  "venueSlug": venue->slug.current,
  "venueTitle": venue->title,
  "citySlug": venue->city->slug.current,
  venue-> {
    _id,
    title,
    slug,
    city-> {
      _id,
      title,
      slug
    }
  }
}
```

#### Filtrar por Ciudad
```groq
*[_type == "venue" && city->slug.current == $citySlug] | order(title asc) {
  _id,
  title,
  slug,
  description,
  priceRange
}
```

---

## 📊 Schemas de Sanity

### Venue (Local)
```typescript
{
  name: 'venue',
  title: 'Local/Venue',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'slug', type: 'slug', required: true },
    { name: 'city', type: 'reference', to: [{ type: 'city' }], required: true },
    { name: 'description', type: 'text' },
    { name: 'address', type: 'string', required: true },
    { name: 'phone', type: 'string' },
    { name: 'website', type: 'url' },
    { name: 'priceRange', type: 'string' }, // €, €€, €€€, €€€€
    { name: 'categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }] },
    { name: 'images', type: 'array', of: [{ type: 'image' }] }
  ]
}
```

### Review (Reseña)
```typescript
{
  name: 'review',
  title: 'Reseña',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'slug', type: 'slug', required: true },
    { name: 'venue', type: 'reference', to: [{ type: 'venue' }], required: true },
    { name: 'content', type: 'array', of: [{ type: 'block' }] },
    { 
      name: 'ratings', 
      type: 'object',
      fields: [
        { name: 'food', type: 'number', min: 1, max: 5 },
        { name: 'service', type: 'number', min: 1, max: 5 },
        { name: 'ambience', type: 'number', min: 1, max: 5 },
        { name: 'value', type: 'number', min: 1, max: 5 }
      ]
    },
    { name: 'visitDate', type: 'date' },
    { name: 'featured', type: 'boolean' }
  ]
}
```

### City (Ciudad)
```typescript
{
  name: 'city',
  title: 'Ciudad',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', required: true }, // Nombre de la ciudad
    { name: 'slug', type: 'slug', required: true },
    { name: 'region', type: 'string' }, // Región/Provincia
    { name: 'country', type: 'string', default: 'España' },
    { name: 'description', type: 'text' },
    { name: 'coordinates', type: 'geopoint' },
    { name: 'isActive', type: 'boolean', default: true }
  ]
}
```

### Category (Categoría)
```typescript
{
  name: 'category',
  title: 'Categoría',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'slug', type: 'slug', required: true },
    { name: 'description', type: 'text' },
    { name: 'featured', type: 'boolean' }
  ]
}
```

---

## 🌐 Estructura de URLs

### Patrón de URLs SEO-Optimizado

```
/                                    → Homepage
/{citySlug}                          → Lista de venues por ciudad
/{citySlug}/{venueSlug}              → Detalle de venue
/{citySlug}/{venueSlug}/review/{reviewSlug} → Detalle de reseña
/categorias/{categorySlug}           → Venues por categoría
```

### Ejemplos Reales
```
/                                    → Homepage
/a-coruna                            → Venues de A Coruña
/a-coruna/sushi-ikigai               → Detalle de Sushi Ikigai
/a-coruna/sushi-ikigai/review/omakase-barcelona → Reseña específica
/categorias/sushi                    → Todos los sushi
```

### Generación Dinámica de URLs

En el homepage (`app/(public)/page.tsx`):
```typescript
// URL robusta con validaciones
const venueUrl = citySlug && venueSlug 
  ? `/${citySlug}/${venueSlug}`
  : venueSlug 
    ? `/a-coruna/${venueSlug}` // Fallback a A Coruña
    : '#';
```

---

## 🔐 Autenticación y Autorización

### Sistema de Usuarios

- **Base de datos**: Prisma + PostgreSQL
- **Autenticación**: NextAuth.js
- **Roles**: Admin, Editor, User

### Schema Prisma
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String
  role          String    @default("user")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Protección de Rutas

```typescript
// En API Routes
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  
  // Lógica protegida
}
```

---

## 📡 API Routes

### Endpoints Admin

#### Venues
```
GET    /api/admin/venues           → Listar todos los venues
GET    /api/admin/venues/[id]      → Obtener venue por ID
POST   /api/admin/venues           → Crear nuevo venue
PUT    /api/admin/venues/[id]      → Actualizar venue
DELETE /api/admin/venues/[id]      → Eliminar venue
```

#### Reviews
```
GET    /api/admin/reviews          → Listar todas las reseñas
GET    /api/admin/reviews/[id]     → Obtener reseña por ID
POST   /api/admin/reviews          → Crear nueva reseña
PUT    /api/admin/reviews/[id]     → Actualizar reseña
DELETE /api/admin/reviews/[id]     → Eliminar reseña
```

#### Cities
```
GET    /api/admin/cities           → Listar todas las ciudades
GET    /api/admin/cities/[id]      → Obtener ciudad por ID
POST   /api/admin/cities           → Crear nueva ciudad
PUT    /api/admin/cities/[id]      → Actualizar ciudad
DELETE /api/admin/cities/[id]     → Eliminar ciudad
```

### Ejemplo de Actualización de Venue

```typescript
// PUT /api/admin/venues/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const data = await request.json();
  
  // Actualizar en Sanity
  const updated = await adminSanityWriteClient
    .patch(params.id)
    .set({
      title: data.title,
      slug: data.slug,
      description: data.description,
      address: data.address,
      phone: data.phone,
      website: data.website,
      priceRange: data.priceRange,
      city: {
        _type: 'reference',
        _ref: data.city
      },
      categories: data.categories.map((id: string) => ({
        _type: 'reference',
        _ref: id
      }))
    })
    .commit();

  // Revalidar caché
  revalidateTag('venues');
  
  return NextResponse.json(updated);
}
```

---

## 🎨 Dashboard Admin

### Estructura del Dashboard

```
/dashboard
├── /                        → Vista general
├── /venues                  → Gestión de locales
│   ├── /                    → Lista de venues
│   ├── /new                 → Crear venue
│   └── /[id]                → Editar venue (VenueDetailClient)
├── /reviews                 → Gestión de reseñas
├── /cities                  → Gestión de ciudades
└── /categories              → Gestión de categorías
```

### Componente VenueDetailClient

Este componente permite **editar venues** desde el dashboard:

**Características**:
- ✅ Editar información básica (nombre, slug, descripción)
- ✅ **Selector de ciudad** (nuevo campo agregado)
- ✅ Editar contacto (dirección, teléfono, web)
- ✅ Cambiar rango de precios
- ✅ Gestión de imágenes
- ✅ Ver reseñas asociadas

**Flujo de edición**:
1. Usuario abre modal de edición
2. Se cargan las ciudades disponibles desde `/api/admin/cities`
3. Usuario modifica campos (incluida la ciudad)
4. Al guardar, se envía PUT a `/api/admin/venues/[id]`
5. Se actualiza en Sanity y se revalida el caché
6. Se recarga la página para mostrar cambios

---

## 🚀 Deployment y Cache

### Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/sitemap/route.ts": { "maxDuration": 30 },
    "app/api/revalidate/route.ts": { "maxDuration": 10 }
  }
}
```

### Revalidación de Cache

#### On-Demand Revalidation
```typescript
import { revalidateTag, revalidatePath } from 'next/cache';

// Revalidar por tag
revalidateTag('venues');
revalidateTag('reviews');

// Revalidar path específico
revalidatePath('/a-coruna');
revalidatePath('/a-coruna/sushi-ikigai');
```

#### ISR (Incremental Static Regeneration)
```typescript
// En page.tsx
export const revalidate = 3600; // Revalidar cada hora
```

---

## 🛠️ Scripts de Utilidad

### Verificar Datos de Sanity
```bash
npx tsx scripts/check-sanity-data.ts
```

**Salida**:
- Cuenta de featured items, reviews, venues
- URLs generadas y su validez
- Estado de ciudades y categorías

### Debug de Campo Ciudad
```bash
npx tsx scripts/debug-city-field.ts
```

**Salida**:
- Lista de ciudades disponibles
- Venues y sus ciudades asignadas
- Diagnóstico de problemas de referencia

### Crear Usuario Admin
```bash
npm run create-admin
```

---

## 🐛 Debugging Common Issues

### Ciudad no aparece en modal de edición

**Problema**: El campo ciudad no se muestra en VenueDetailClient
**Causa**: No se agregó el selector de ciudad al modal
**Solución**: Ya está implementado en líneas 492-521 de `VenueDetailClient.tsx`

### URLs sin prefijo de ciudad

**Problema**: URLs como `/cal-pep-barcelona` en lugar de `/barcelona/cal-pep-barcelona`
**Causa**: Venues sin ciudad asignada o ciudad sin slug
**Solución**: 
1. Verificar en Sanity que el venue tiene ciudad
2. Verificar que la ciudad tiene slug válido
3. Usar script de debug: `npx tsx scripts/debug-city-field.ts`

### Datos no se actualizan

**Problema**: Cambios en Sanity no se reflejan en el sitio
**Causa**: Cache de Next.js o Sanity CDN
**Soluciones**:
- Revalidar tag: `revalidateTag('venues')`
- Usar `useCdn: false` en adminSanityClient
- Esperar tiempo de revalidación (si ISR está configurado)

---

## 📝 Buenas Prácticas

### 1. **Siempre usar el cliente correcto**
- `sanityClient` → Páginas públicas
- `adminSanityClient` → Dashboard (lectura)
- `adminSanityWriteClient` → Operaciones de escritura

### 2. **Validar referencias**
```typescript
// Siempre verificar que la referencia existe
const citySlug = venue?.city?.slug?.current;
if (!citySlug) {
  return fallbackUrl; // O manejar el error
}
```

### 3. **Revalidar después de cambios**
```typescript
// Después de crear/actualizar/eliminar
revalidateTag('venues');
revalidatePath(`/${citySlug}/${venueSlug}`);
```

### 4. **Tipado fuerte**
```typescript
interface Venue {
  _id: string;
  title: string;
  slug: { current: string };
  city: {
    _id: string;
    title: string;
    slug: { current: string };
  };
}
```

### 5. **Manejo de errores**
```typescript
try {
  const data = await sanityClient.fetch(query);
  return data;
} catch (error) {
  console.error('Error fetching data:', error);
  return null; // O throw error según contexto
}
```

---

## 📚 Recursos y Referencias

### Documentación
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Sanity v4 Docs](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/docs)

### Comandos Útiles
```bash
# Desarrollo
npm run dev                    # Next.js dev server
npm run studio                 # Sanity Studio

# Build
npm run build                  # Build producción
npm run start                  # Servidor producción

# Testing
npm run test                   # Vitest
npm run test:e2e              # Playwright E2E

# Utilidades
npm run type-check            # TypeScript check
npm run lint                  # ESLint
npx tsx scripts/[script].ts   # Ejecutar scripts
```

---

## 🎯 Datos Clave del Proyecto

### Ciudades Principales
- **A Coruña** (90% del contenido) - slug: `a-coruna`
- Barcelona - slug: `barcelona`
- Madrid - slug: `madrid`
- Valencia - slug: `valencia`
- Bilbao - slug: `bilbao`
- Sevilla - slug: `sevilla`

### Sanity Project
- **Project ID**: `xaenlpyp`
- **Dataset**: `production`
- **API Version**: `2024-01-01`

### Patrones de URL SEO
```
/{ciudad}/{local}                      → Detalle de local
/{ciudad}/{local}/review/{reseña}      → Detalle de reseña
```

---

## 🔄 Flujo de Datos Completo

```
Usuario → Next.js App Router
    ↓
Página Pública (ISR/SSR)
    ↓
sanityClient.fetch() → Sanity CMS
    ↓
Renderizar con datos
    ↓
Cache (ISR) → Servir desde cache


Admin → Dashboard
    ↓
VenueDetailClient (React)
    ↓
Editar datos → POST/PUT /api/admin/venues
    ↓
adminSanityWriteClient → Sanity CMS
    ↓
revalidateTag() → Limpiar cache
    ↓
Actualización completa
```

---

**Última actualización**: Octubre 2025
**Versión**: 1.0.0
**Mantenedor**: Kiko Lareo García
