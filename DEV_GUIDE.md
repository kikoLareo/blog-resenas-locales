# 🍽️ Blog Reseñas Locales - Guía Rápida de Desarrollo

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Variables de entorno
cp .env.example .env.local
# Configurar variables de Sanity y Prisma

# Desarrollo
npm run dev          # Next.js en http://localhost:3000
npm run studio       # Sanity Studio en http://localhost:3333

# Base de datos
npx prisma generate
npx prisma migrate dev
```

---

## 📁 Arquitectura en 1 Minuto

```
Next.js 15 (App Router) + Sanity CMS + Prisma + NextAuth
├── Páginas Públicas: /[ciudad]/[local]/review/[reseña]
├── Dashboard Admin: /dashboard/*
└── Sanity Studio: /studio
```

---

## 🔑 Variables de Entorno Críticas

```env
# Sanity (CMS)
NEXT_PUBLIC_SANITY_PROJECT_ID=xaenlpyp
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk_xxxxx

# Prisma (Usuarios)
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=xxxxx
NEXTAUTH_URL=http://localhost:3000
```

---

## 📊 Clientes Sanity - Cuándo usar cada uno

| Cliente | Archivo | Uso | CDN |
|---------|---------|-----|-----|
| `sanityClient` | `lib/sanity.ts` | Páginas públicas | ✅ Sí |
| `adminSanityClient` | `lib/admin-sanity.ts` | Dashboard (lectura) | ❌ No |
| `adminSanityWriteClient` | `lib/admin-sanity.ts` | Crear/Editar/Eliminar | ❌ No |

**Regla de oro**: 
- Frontend público → `sanityClient`
- Dashboard → `adminSanityClient` o `adminSanityWriteClient`

---

## 🌐 Estructura de URLs

```
/                                          → Homepage
/a-coruna                                  → Locales de A Coruña
/a-coruna/sushi-ikigai                     → Detalle de Sushi Ikigai
/a-coruna/sushi-ikigai/review/omakase      → Reseña específica
/categorias/sushi                          → Todos los restaurantes de sushi
```

**Patrón SEO**: `/{ciudad}/{local}/review/{reseña}`

---

## 🗂️ Schemas Principales

### Venue (Local)
```typescript
{
  title: string              // "Sushi Ikigai"
  slug: { current: string }  // "sushi-ikigai"
  city: Reference            // → city document
  description: text
  address: string
  phone?: string
  website?: url
  priceRange: string         // €, €€, €€€, €€€€
  categories: Reference[]    // → category documents
}
```

### Review (Reseña)
```typescript
{
  title: string
  slug: { current: string }
  venue: Reference           // → venue document
  content: PortableText
  ratings: {
    food: number (1-5)
    service: number (1-5)
    ambience: number (1-5)
    value: number (1-5)
  }
  visitDate: date
}
```

### City (Ciudad)
```typescript
{
  title: string              // "A Coruña"
  slug: { current: string }  // "a-coruna"
  region: string
  country: string
  description: text
}
```

---

## 🔍 GROQ Queries Esenciales

### Obtener venues con ciudad
```groq
*[_type == "venue"] {
  _id,
  title,
  slug,
  "citySlug": city->slug.current,
  city-> {
    _id,
    title,
    slug
  }
}
```

### Filtrar por ciudad
```groq
*[_type == "venue" && city->slug.current == $citySlug]
```

### Reseñas con venue y ciudad
```groq
*[_type == "review"] {
  _id,
  title,
  slug,
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

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev                        # Next.js
npm run studio                     # Sanity Studio

# Testing
npm run test                       # Unit tests
npm run test:e2e                   # E2E tests

# Análisis
npm run type-check                 # TypeScript
npm run lint                       # ESLint

# Scripts
npx tsx scripts/check-sanity-data.ts     # Verificar datos
npx tsx scripts/debug-city-field.ts      # Debug ciudades
npm run create-admin                      # Crear usuario admin
```

---

## 📡 API Routes - Dashboard

```
GET    /api/admin/venues           # Listar venues
GET    /api/admin/venues/[id]      # Detalle venue
PUT    /api/admin/venues/[id]      # Actualizar venue
DELETE /api/admin/venues/[id]      # Eliminar venue

GET    /api/admin/cities           # Listar ciudades
GET    /api/admin/reviews          # Listar reseñas
```

**Autenticación**: Todas las rutas `/api/admin/*` requieren sesión de NextAuth

---

## 🎨 Dashboard - Editar Venue

El componente `VenueDetailClient.tsx` permite editar venues:

**Campos disponibles**:
- ✅ Nombre y slug
- ✅ Descripción
- ✅ Dirección, teléfono, web
- ✅ **Ciudad** (selector con todas las ciudades)
- ✅ Rango de precios
- ✅ Imágenes

**Flujo**:
1. Click "Editar Local" → Abre modal
2. Modal carga ciudades desde `/api/admin/cities`
3. Usuario modifica campos
4. Click "Guardar" → `PUT /api/admin/venues/[id]`
5. Actualiza Sanity + Revalida cache
6. Recarga página con datos actualizados

---

## 🐛 Troubleshooting Rápido

### ❌ Error: "Ciudad no aparece en modal"
**Solución**: Ya está implementado en `VenueDetailClient.tsx` líneas 492-521

### ❌ URLs sin prefijo de ciudad
**Problema**: `/cal-pep` en lugar de `/barcelona/cal-pep`
**Solución**: 
```bash
npx tsx scripts/debug-city-field.ts  # Verificar asignación de ciudades
```

### ❌ Datos no se actualizan
**Causa**: Cache de Next.js
**Solución**:
```typescript
import { revalidateTag } from 'next/cache';
revalidateTag('venues');  // Después de cambios
```

### ❌ Error de permisos en Sanity
**Causa**: Token sin permisos o expirado
**Solución**: Verificar `SANITY_API_TOKEN` en `.env.local`

---

## 🎯 Datos del Proyecto

| Concepto | Valor |
|----------|-------|
| **Sanity Project ID** | `xaenlpyp` |
| **Dataset** | `production` |
| **API Version** | `2024-01-01` |
| **Ciudad Principal** | A Coruña (90% contenido) |
| **Puerto Dev** | 3000 (Next.js), 3333 (Studio) |

---

## 📚 Documentación Completa

Para documentación técnica completa, ver: **[TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)**

Incluye:
- Arquitectura detallada
- Todos los schemas de Sanity
- API routes completos
- Patrones de código
- Debugging avanzado
- Deployment en Vercel

---

## 🤝 Flujo de Trabajo Típico

### Crear nuevo venue

1. **En Sanity Studio** (`/studio`):
   ```
   Venues → Nuevo Local
   - Completar campos
   - Seleccionar ciudad
   - Guardar
   ```

2. **En Dashboard** (`/dashboard/venues`):
   ```
   Venues → Nuevo
   - Formulario con selector de ciudad
   - Guardar → Actualiza Sanity
   ```

### Editar venue existente

1. **Dashboard** → `/dashboard/venues/[id]`
2. Click "Editar Local"
3. Modificar campos (incluida ciudad)
4. Guardar → Actualiza y revalida

### Crear reseña

1. **Sanity Studio** → Reviews → Nueva Reseña
2. Seleccionar venue (automáticamente hereda ciudad)
3. Completar ratings y contenido
4. Publicar

---

## 🔄 Actualización de Cache

```typescript
// Después de crear/editar/eliminar
import { revalidateTag, revalidatePath } from 'next/cache';

revalidateTag('venues');           // Todo lo relacionado con venues
revalidatePath('/a-coruna');       // Página específica
revalidatePath('/a-coruna/sushi-ikigai');  // Detalle específico
```

---

## 💡 Tips de Desarrollo

1. **Siempre verificar referencias**:
   ```typescript
   const citySlug = venue?.city?.slug?.current;
   if (!citySlug) return fallbackUrl;
   ```

2. **Usar tipado fuerte**:
   ```typescript
   interface Venue {
     city: { _id: string; title: string; slug: { current: string } };
   }
   ```

3. **Revalidar después de cambios**:
   ```typescript
   await adminSanityWriteClient.create(doc);
   revalidateTag('venues');
   ```

4. **Cliente correcto según contexto**:
   - Página pública → `sanityClient`
   - Dashboard → `adminSanityClient/WriteClient`

---

**Última actualización**: Octubre 2025  
**Stack**: Next.js 15 + Sanity v4 + Prisma + NextAuth  
**Proyecto**: Blog Reseñas Locales
