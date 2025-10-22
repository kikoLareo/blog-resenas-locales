# Análisis del Dashboard y Sección de Destacados

## 📊 Resumen del Análisis

He analizado el dashboard y la sección de destacados del proyecto. Aquí están mis hallazgos:

## ✅ Funcionamiento del Dashboard - Reseñas y Locales

### Arquitectura de Comunicación con Sanity

El dashboard utiliza un patrón bien estructurado para comunicarse con Sanity:

#### 1. **Queries GROQ** (`lib/admin-queries.ts`)
Define las consultas GROQ para obtener datos de Sanity:
```groq
*[_type == "review"] | order(_createdAt desc) {
  _id, title, slug, _createdAt, _updatedAt, published,
  "venue": venue->{title, "city": city->{title, slug}},
  ratings
}
```

#### 2. **Cliente de Sanity** (`lib/admin-sanity.ts`)
```typescript
export const adminSanityClient = createClient({
  projectId, dataset, apiVersion,
  token: readToken,
  useCdn: false  // Datos frescos para admin
});
```

#### 3. **APIs de Admin** (`app/api/admin/`)
- `/api/admin/reviews/route.ts`
- `/api/admin/venues/route.ts`
- `/api/admin/categories/route.ts`
- Etc.

**NOTA IMPORTANTE**: Los archivos de ruta están vacíos actualmente, lo que sugiere que pueden estar en proceso de implementación.

### Ejemplo: Cómo funciona la creación de un nuevo local

```typescript
// 1. Frontend (app/dashboard/venues/new/page.tsx)
const response = await fetch('/api/admin/venues', {
  method: 'POST',
  body: JSON.stringify(formData)
});

// 2. API llama a Sanity
// 3. Sanity guarda el documento
// 4. Revalidación de cache
```

## ⚠️ HALLAZGOS CRÍTICOS - Sección de Destacados

### 1. **Schema de Sanity VACÍO**
El archivo `sanity/schemas/featured-item.ts` está completamente vacío.
- ❌ No hay definición del tipo `featuredItem` en Sanity
- ❌ No se puede crear contenido destacado desde Sanity Studio

### 2. **Uso de Mocks/Fallback**

El sistema tiene datos de fallback hardcodeados en `lib/featured-data.ts`:

```typescript
const fallbackFeaturedItems: FeaturedItem[] = [
  {
    id: "fallback-1",
    type: "review",
    title: "El mejor marisco de la ciudad",
    image: "https://images.unsplash.com/photo-...",
    // ... datos mock
  },
  // 2 items más de fallback
];
```

### 3. **Función `getFeaturedItemsData()`**

```typescript
export async function getFeaturedItemsData() {
  try {
    const sanityItems = await client.fetch(getFeaturedItems);
    
    if (sanityItems && sanityItems.length > 0) {
      return { items: transformedItems, hasCustomItems: true };
    }
    
    // ⚠️ Si no hay items en Sanity, usa fallback
    return { items: fallbackFeaturedItems, hasCustomItems: false };
  } catch (error) {
    // ⚠️ En error, usa fallback
    return { items: fallbackFeaturedItems, hasCustomItems: false };
  }
}
```

### 4. **Donde se usa Featured Items**

**Página Principal** (`app/(public)/page.tsx`):
```typescript
const [data, homepageConfig, featuredItems] = await Promise.all([
  // ...
  getAllFeaturedItems().catch(() => [])  // ⚠️ Fallback a array vacío
]);
```

**Componentes**:
- `FeaturedCarousel.tsx` - Carrusel de elementos destacados
- `HeroModern.tsx` - Hero con featured items
- `FeaturedSectionsModern.tsx` - Secciones destacadas

### 5. **Dashboard de Destacados**

El archivo `app/dashboard/featured/page.tsx` está **VACÍO**.
- ❌ No hay interfaz de admin para gestionar destacados
- ❌ Aunque existen funciones en `lib/featured-admin.ts` para CRUD

## 🔍 Estado Actual del Sistema de Destacados

### ✅ Lo que ESTÁ implementado:

1. **Queries GROQ completas** (`lib/featured-queries.ts`)
   - `getFeaturedItems` - Para frontend
   - `getAllFeaturedItemsAdmin` - Para dashboard
   - `getFeaturedItemsStats` - Para estadísticas

2. **Funciones de Admin** (`lib/featured-admin.ts`)
   - `getAllFeaturedItems()`
   - `getFeaturedItemById()`
   - `createFeaturedItem()`
   - `updateFeaturedItem()`
   - `deleteFeaturedItem()`
   - `updateFeaturedItemOrder()`

3. **Adapter/Transformador** (`lib/featured-adapter.ts`)
   - Transforma datos de Sanity a formato del componente
   - Soporte para 5 tipos: review, venue, category, collection, guide

4. **Componente de Carrusel** (`components/FeaturedCarousel.tsx`)
   - Componente visual completo y funcional
   - Soporte para todos los tipos de items
   - Auto-play, navegación, etc.

### ❌ Lo que FALTA:

1. **Schema de Sanity** - `sanity/schemas/featured-item.ts` está vacío
2. **Dashboard UI** - `app/dashboard/featured/page.tsx` está vacío
3. **APIs de Admin** - `app/api/admin/featured-items/route.ts` está vacío

## 🎯 Conclusión

### Estado del Sistema de Destacados:

**🔴 ACTUALMENTE USA MOCKS**

El sistema está preparado con toda la lógica necesaria, pero:
- No tiene schema en Sanity
- No tiene interfaz de administración
- Usa exclusivamente datos de fallback hardcodeados

### Para que funcione realmente con Sanity se necesita:

1. ✏️ Definir el schema `featured-item.ts` en Sanity
2. 🖥️ Crear la página de admin en `app/dashboard/featured/page.tsx`
3. 🔌 Implementar las rutas API en `app/api/admin/featured-items/`
4. ✅ Verificar que el schema esté registrado en `sanity/schemas/index.ts`

## 📝 Recomendaciones

1. **Prioridad Alta**: Crear el schema de Sanity para `featuredItem`
2. **Prioridad Alta**: Implementar dashboard UI para gestionar destacados
3. **Prioridad Media**: Implementar APIs de admin
4. **Prioridad Baja**: Mejorar los fallbacks actuales si se mantienen

## 🔗 Archivos Clave Analizados

- ✅ `lib/admin-queries.ts` - Queries funcionando
- ✅ `lib/admin-sanity.ts` - Cliente configurado
- ✅ `lib/featured-queries.ts` - Queries de featured completas
- ✅ `lib/featured-admin.ts` - Funciones CRUD completas
- ✅ `lib/featured-adapter.ts` - Transformador completo
- ✅ `lib/featured-data.ts` - Sistema con fallbacks
- ✅ `components/FeaturedCarousel.tsx` - Componente completo
- ⚠️ `sanity/schemas/featured-item.ts` - **VACÍO**
- ⚠️ `app/dashboard/featured/page.tsx` - **VACÍO**
- ⚠️ `app/api/admin/featured-items/route.ts` - **VACÍO**

