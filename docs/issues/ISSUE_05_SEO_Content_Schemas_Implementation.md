# 🟢 PRIORIDAD BAJA - Implementar Schemas de Contenido SEO en Sanity

## 📋 Descripción del Problema

El código tiene queries GROQ para 6 tipos de contenido SEO que **pueden no tener schemas creados** en Sanity Studio. Estos schemas están definidos en las queries pero falta verificar/crear su implementación.

## 📍 Ubicación

**Archivo:** `lib/seo-queries.ts`

**Tipos de contenido con queries:**
1. ✅ `guide` - Guías gastronómicas (parcialmente implementado)
2. ❓ `list` - Listas y rankings (ej: "Top 10 mejores pizzas")
3. ❓ `recipe` - Recetas de cocina
4. ❓ `dish-guide` - Guías de platos específicos
5. ❓ `news` - Noticias del sector gastronómico
6. ❓ `offer` - Ofertas y promociones de venues

## 🎯 Objetivo

Determinar si estos schemas son necesarios para el proyecto y, si lo son, implementarlos completamente en Sanity Studio con sus respectivas páginas en el dashboard.

## 📊 Análisis de Cada Tipo

### 1. Guide (Guías Gastronómicas) ⚠️
**Estado:** Parcialmente implementado
- ✅ Query definida (`getGuidesQuery`)
- ✅ Página de listado (`/dashboard/content/guides`)
- ❌ Schema puede estar incompleto
- ❌ CRUD incompleto (ver Issue #03)

**Uso:** Guías como "Mejores restaurantes en Malasaña", "Ruta de tapas por Barcelona"

### 2. List (Listas y Rankings) ❓
**Estado:** Solo query definida
- ✅ Query definida (`getListsQuery`)
- ❌ Schema no verificado
- ❌ Sin páginas de dashboard
- ❌ Sin API routes

**Uso:** Listas como "Top 10 mejores hamburguesas", "5 restaurantes románticos"

**Campos esperados:**
```typescript
interface List {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  listType: 'top' | 'best' | 'recommendation';
  dish?: string;                    // Plato específico
  city: Reference<City>;
  published: boolean;
  featured: boolean;
  publishedAt: string;
  lastUpdated: string;
  venues: Reference<Venue>[];       // Venues en la lista
  criteria: string;                 // Criterios de selección
  stats: {
    views: number;
    shares: number;
    bookmarks: number;
  };
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}
```

### 3. Recipe (Recetas) ❓
**Estado:** Solo query definida
- ✅ Query definida (`getRecipesQuery`)
- ❌ Schema no verificado
- ❌ Sin páginas de dashboard
- ❌ Sin API routes

**Uso:** Recetas de platos para reproducir en casa

**Campos esperados:**
```typescript
interface Recipe {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  recipeType: 'appetizer' | 'main' | 'dessert' | 'drink';
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;                 // minutos
  cookTime: number;                 // minutos
  servings: number;
  ingredients: Array<{
    item: string;
    quantity: string;
    notes?: string;
  }>;
  instructions: Array<{
    step: number;
    description: string;
    image?: Reference<Image>;
  }>;
  tips?: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  published: boolean;
  featured: boolean;
  publishedAt: string;
  lastUpdated: string;
  stats: {
    views: number;
    shares: number;
    bookmarks: number;
  };
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}
```

### 4. Dish Guide (Guías de Platos) ❓
**Estado:** Solo query definida
- ✅ Query definida (`getDishGuidesQuery`)
- ❌ Schema no verificado
- ❌ Sin páginas de dashboard
- ❌ Sin API routes

**Uso:** Guías sobre platos específicos: "Todo sobre la paella", "Qué es el ceviche"

**Campos esperados:**
```typescript
interface DishGuide {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  dish: string;                     // Nombre del plato
  origin: string;                   // Origen geográfico
  history: string;                  // Historia del plato
  ingredients: string[];            // Ingredientes típicos
  variations: Array<{
    name: string;
    description: string;
  }>;
  bestPlaces: Reference<Venue>[];   // Mejores lugares para probarlo
  tips: string[];
  published: boolean;
  featured: boolean;
  publishedAt: string;
  lastUpdated: string;
  stats: {
    views: number;
    shares: number;
    bookmarks: number;
  };
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}
```

### 5. News (Noticias) ❓
**Estado:** Solo query definida
- ✅ Query definida (`getNewsQuery`)
- ❌ Schema no verificado
- ❌ Sin páginas de dashboard
- ❌ Sin API routes

**Uso:** Noticias del sector: "Nuevo restaurante abre", "Festival gastronómico"

**Campos esperados:**
```typescript
interface News {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  category: 'opening' | 'closing' | 'event' | 'award' | 'trend';
  city?: Reference<City>;
  published: boolean;
  featured: boolean;
  publishedAt: string;
  expiryDate: string;               // Fecha de expiración
  content: Array<Block>;            // Contenido rich text
  tags: string[];
  stats: {
    views: number;
    shares: number;
    bookmarks: number;
  };
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}
```

### 6. Offer (Ofertas) ❓
**Estado:** Solo query definida
- ✅ Query definida (`getOffersQuery`)
- ❌ Schema no verificado
- ❌ Sin páginas de dashboard
- ❌ Sin API routes

**Uso:** Ofertas y descuentos: "2x1 en menú", "20% descuento"

**Campos esperados:**
```typescript
interface Offer {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  venue: Reference<Venue>;
  offerType: 'discount' | '2x1' | 'special-menu' | 'happy-hour';
  discount?: number;                // Porcentaje
  originalPrice?: number;
  offerPrice?: number;
  validFrom: string;
  validUntil: string;
  conditions: string;               // Términos y condiciones
  published: boolean;
  featured: boolean;
  publishedAt: string;
  stats: {
    views: number;
    shares: number;
    clicks: number;
  };
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}
```

## 🎯 Decisiones a Tomar

### Pregunta 1: ¿Qué tipos de contenido se van a usar?

**Opciones:**
- [ ] **Opción A:** Implementar todos los 6 tipos
- [ ] **Opción B:** Solo implementar los necesarios (ej: Guide + List)
- [ ] **Opción C:** Empezar con 2-3 tipos y expandir después
- [ ] **Opción D:** Eliminar queries no utilizadas

**Recomendación:** Opción C - Empezar con `guide` y `list`, que son los más útiles para un blog de reseñas.

### Pregunta 2: ¿Prioridad de implementación?

**Sugerencia de prioridad:**
1. 🟢 **Guide** - Ya parcialmente implementado, completar
2. 🟢 **List** - Muy útil para SEO ("Top 10...")
3. 🟡 **Recipe** - Si se quiere expandir el contenido
4. 🟡 **News** - Para mantener el sitio actualizado
5. 🔴 **Dish Guide** - Nicho, solo si hay recursos
6. 🔴 **Offer** - Solo si se va a monetizar con afiliados

## ✅ Tareas por Tipo de Contenido

Para cada tipo que se decida implementar:

### 1. Crear Schema en Sanity
- [ ] Crear archivo `sanity/schemas/{tipo}.ts`
- [ ] Definir todos los campos
- [ ] Configurar validaciones
- [ ] Configurar previews
- [ ] Registrar en `schema.ts`

### 2. Crear Páginas de Dashboard
- [ ] `/dashboard/{tipo}/page.tsx` - Listado
- [ ] `/dashboard/{tipo}/new/page.tsx` - Crear
- [ ] `/dashboard/{tipo}/[id]/page.tsx` - Editar
- [ ] Formularios con validación
- [ ] Estados de carga y error

### 3. Crear API Routes
- [ ] `/api/admin/{tipo}/route.ts` - GET, POST
- [ ] `/api/admin/{tipo}/[id]/route.ts` - GET, PUT, DELETE
- [ ] Validaciones
- [ ] Autenticación
- [ ] Revalidación de cache

### 4. Crear Páginas Públicas
- [ ] `app/[city]/{tipo}/page.tsx` - Listado público
- [ ] `app/[city]/{tipo}/[slug]/page.tsx` - Detalle
- [ ] SEO completo (metadata, JSON-LD)
- [ ] Diseño responsive

### 5. Testing
- [ ] Tests unitarios de componentes
- [ ] Tests de API routes
- [ ] Tests E2E de flujos completos

## ✅ Criterios de Aceptación

Por cada tipo implementado:

### Schema
- [ ] Schema creado y registrado
- [ ] Todos los campos definidos
- [ ] Validaciones funcionando
- [ ] Preview configurado
- [ ] Documentación en comentarios

### Dashboard
- [ ] Listado muestra todos los items
- [ ] Crear funciona correctamente
- [ ] Editar carga y guarda datos
- [ ] Eliminar funciona con confirmación
- [ ] Búsqueda y filtros operativos

### API
- [ ] CRUD completo funcional
- [ ] Validaciones de datos
- [ ] Autenticación implementada
- [ ] Manejo de errores apropiado
- [ ] Cache revalidation

### Frontend Público
- [ ] Páginas renderizan correctamente
- [ ] SEO optimizado
- [ ] Performance adecuada
- [ ] Responsive design
- [ ] Accesibilidad (a11y)

## ✅ Checklist Pre-Deploy

### Verificaciones de Código
- [ ] `npm run lint` - Sin errores
- [ ] `npm run test` - Todos los tests pasan
- [ ] `npm run build` - Build exitoso sin errores
- [ ] TypeScript sin errores de tipos

### Verificaciones de Sanity
- [ ] Schemas aparecen en Sanity Studio
- [ ] Se pueden crear documentos
- [ ] Se pueden editar documentos
- [ ] Se pueden eliminar documentos
- [ ] Validaciones funcionan

### Verificaciones de Dashboard
- [ ] Todas las páginas cargan sin error
- [ ] CRUD completo funciona
- [ ] Mensajes de éxito/error apropiados
- [ ] No hay errores en consola

### Verificaciones de Frontend
- [ ] Páginas públicas renderizan
- [ ] SEO metadata correcto
- [ ] JSON-LD schema válido
- [ ] Lighthouse score > 90

## 📚 Referencias

- Queries existentes: `lib/seo-queries.ts`
- Ejemplo de implementación: Reviews/Venues (ya implementados)
- Sanity Schema Types: https://www.sanity.io/docs/schema-types
- Next.js Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata

## 🏷️ Labels

`priority:low` `feature` `seo` `content-types` `sanity` `enhancement` `future`

---

**Fecha de creación:** 2025-10-24
**Estado:** 🟢 Pendiente (Prioridad Baja)
**Asignado a:** Por asignar
**Estimación:** Variable según tipos implementados
- Guide: 4-6 horas (completar)
- List: 8-10 horas
- Recipe: 10-12 horas
- News: 6-8 horas
- Dish Guide: 8-10 horas
- Offer: 6-8 horas

**Dependencias:**
- Issue #03 (Completar CRUD de Guides) debe resolverse primero
- Decisión de product/negocio sobre qué tipos implementar

**Notas:**
- Este issue es de baja prioridad porque no afecta la funcionalidad actual
- Se puede implementar de forma incremental
- Requiere decisión estratégica sobre contenidos a crear
