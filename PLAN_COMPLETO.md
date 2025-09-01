# Plan Completo - Blog de Reseñas Locales

## 🎯 ANÁLISIS DE LO QUE FALTA

### Páginas Públicas (Frontend)
#### ❌ Páginas de detalle que faltan:
1. **Página de detalle de local/venue** (`/[city]/[venue]/page.tsx`)
2. **Página de detalle de reseña** (`/[city]/[venue]/review/[reviewSlug]/page.tsx`) 
3. **Página de ciudad** (`/[city]/page.tsx`) - mejoras
4. **Página de categoría** (`/categorias/[category]/page.tsx`)
5. **Página de búsqueda** (`/buscar/page.tsx`)

#### ❌ Componentes de UI que faltan:
1. **VenueDetail** - Vista completa del local
2. **ReviewDetailPublic** - Vista pública de reseña (diferente al admin)
3. **CityDetail** - Vista pública de ciudad
4. **CategoryDetail** - Vista de categoría
5. **SearchResults** - Resultados de búsqueda
6. **VenueCard** - Tarjeta de local
7. **ReviewCard** - Tarjeta de reseña (mejorada)

### Dashboard (Gestión)
#### ❌ Funcionalidades que faltan:
1. **Crear/Editar Venues** (`/dashboard/venues/new` y `/dashboard/venues/[id]/edit`)
2. **Crear/Editar Cities** (`/dashboard/cities/new` y `/dashboard/cities/[id]/edit`)
3. **Crear/Editar Categories** (`/dashboard/categories/new` y `/dashboard/categories/[id]/edit`)
4. **Mejorar Reviews** - Formularios de crear/editar
5. **Gestión de imágenes** - Subida y manejo
6. **Persistencia de homepage sections** - Conectar con Sanity

#### ❌ Consultas y API que faltan:
1. **Mutations para crear/editar** en todas las entidades
2. **API routes** para operaciones CRUD
3. **Queries optimizadas** para páginas públicas
4. **Search API** para búsqueda

## 🚀 PLAN DE IMPLEMENTACIÓN

### Fase 1: Páginas Públicas Críticas (2-3 horas)
1. ✅ Página detalle de venue
2. ✅ Página detalle de reseña 
3. ✅ Componentes VenueDetail y ReviewDetailPublic
4. ✅ Queries GROQ necesarias

### Fase 2: Dashboard CRUD Completo (3-4 horas)
1. ✅ Formularios crear/editar venues
2. ✅ Formularios crear/editar cities
3. ✅ Formularios crear/editar categories
4. ✅ Mejorar formularios de reviews
5. ✅ API routes para todas las operaciones

### Fase 3: Funcionalidades Avanzadas (2-3 horas)
1. ✅ Búsqueda y filtros
2. ✅ Gestión de imágenes
3. ✅ Conectar homepage sections con Sanity
4. ✅ Optimizaciones de rendimiento

### Fase 4: Pulido y Testing (1-2 horas)
1. ✅ Loading states
2. ✅ Error handling
3. ✅ Validaciones
4. ✅ Testing básico

## 📋 CHECKLIST DETALLADO

### Páginas Públicas
- [ ] `/app/(public)/[city]/[venue]/page.tsx` - Detalle de venue
- [ ] `/app/(public)/[city]/[venue]/review/[reviewSlug]/page.tsx` - Detalle de reseña
- [ ] `/app/(public)/categorias/[category]/page.tsx` - Página de categoría
- [ ] `/app/(public)/buscar/page.tsx` - Página de búsqueda
- [ ] Mejorar `/app/(public)/[city]/page.tsx` - Lista de venues de ciudad

### Componentes UI
- [ ] `components/VenueDetail.tsx` - Vista completa del local
- [ ] `components/ReviewDetailPublic.tsx` - Vista pública de reseña
- [ ] `components/VenueCard.tsx` - Tarjeta de local
- [ ] `components/SearchForm.tsx` - Formulario de búsqueda
- [ ] `components/FilterBar.tsx` - Barra de filtros

### Dashboard CRUD
- [ ] `/app/dashboard/venues/new/page.tsx` - Crear venue
- [ ] `/app/dashboard/venues/[id]/edit/page.tsx` - Editar venue
- [ ] `/app/dashboard/cities/new/page.tsx` - Crear city
- [ ] `/app/dashboard/cities/[id]/edit/page.tsx` - Editar city
- [ ] `/app/dashboard/categories/new/page.tsx` - Crear category
- [ ] `/app/dashboard/categories/[id]/edit/page.tsx` - Editar category
- [ ] Mejorar `/app/dashboard/reviews/new/page.tsx` - Crear review
- [ ] Mejorar `/app/dashboard/reviews/[id]/edit/page.tsx` - Editar review

### API y Backend
- [ ] `/app/api/venues/route.ts` - CRUD venues
- [ ] `/app/api/cities/route.ts` - CRUD cities  
- [ ] `/app/api/categories/route.ts` - CRUD categories
- [ ] `/app/api/reviews/route.ts` - CRUD reviews
- [ ] `/app/api/search/route.ts` - Búsqueda
- [ ] `/app/api/upload/route.ts` - Subida de imágenes

### Queries GROQ
- [ ] Queries para páginas públicas de venue
- [ ] Queries para páginas públicas de reseña
- [ ] Queries de búsqueda con filtros
- [ ] Queries optimizadas para listas

### Funcionalidades Especiales
- [ ] Sistema de búsqueda con filtros
- [ ] Gestión de imágenes con Sanity
- [ ] Homepage sections persistencia en Sanity
- [ ] Loading states y error handling
- [ ] SEO y metadata para todas las páginas

## 🎯 PRIORIDADES INMEDIATAS

1. **CRÍTICO**: Página detalle de venue - sin esto no funcionan los enlaces
2. **CRÍTICO**: Página detalle de reseña - muchos 404s 
3. **ALTO**: Formularios de crear/editar en dashboard
4. **MEDIO**: Búsqueda y filtros
5. **BAJO**: Optimizaciones y pulido

## 📊 ESTIMACIÓN DE TIEMPO

- **Total estimado**: 8-12 horas
- **Mínimo viable**: 4-6 horas (solo críticos)
- **Completo**: 10-15 horas (con todas las funcionalidades)

## 🚧 ESTADO ACTUAL

- ✅ Dashboard básico funcional
- ✅ Autenticación configurada
- ✅ Sanity CMS configurado
- ✅ Schemas definidos
- ✅ Homepage sections management
- ❌ Páginas públicas de detalle
- ❌ CRUD completo en dashboard
- ❌ Búsqueda y filtros
- ❌ Gestión de imágenes

---

**Comenzamos con las páginas públicas críticas para resolver los 404s inmediatamente.**
