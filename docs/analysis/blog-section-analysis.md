# Análisis de la Sección Blog

## 📊 Resumen Ejecutivo

**Estado**: 🟡 **PARCIALMENTE IMPLEMENTADO (40%)**

La sección de blog tiene el schema completo en Sanity y puede listar posts, pero **no puede crear ni editar posts desde el dashboard**.

## ✅ Lo que ESTÁ Implementado

### 1. **Schema de Sanity COMPLETO** ✅ (`sanity/schemas/post.ts`)

El schema de posts es **muy completo y profesional**:

```typescript
{
  name: 'post',
  title: 'Crónica/Post',
  type: 'document',
  icon: '📝',
  groups: ['basic', 'content', 'media', 'seo', 'settings']
}
```

#### Campos implementados:
- ✅ **Básicos**: title, slug, excerpt, author, authorAvatar
- ✅ **Contenido**: body (array de bloques rich text)
- ✅ **Media**: heroImage con alt y caption
- ✅ **Relaciones**: categories (1-3), relatedVenues (max 5)
- ✅ **SEO/AEO**: tags, hasFaq, faq (hasta 8 preguntas), tldr
- ✅ **Metadata**: readingTime, featured, publishedAt, updatedAt

#### Características avanzadas:
- ✅ Validaciones completas
- ✅ Grupos organizados (5 pestañas)
- ✅ Preview personalizado con badges (⭐, ❓)
- ✅ Ordenamientos predefinidos (fecha, destacados, alfabético)
- ✅ Campos condicionales (FAQ solo si hasFaq está activo)
- ✅ Rich text editor con estilos y listas
- ✅ Soporte para imágenes inline

### 2. **Lista de Blog** ✅ (`app/dashboard/blog/page.tsx`)

**Funciona correctamente con Sanity**:

```typescript
const posts = await adminSanityClient.fetch(`
  *[_type == "post"] | order(_createdAt desc) {
    _id, title, slug, excerpt,
    publishedAt,
    "status": select(
      publishedAt != null => "published",
      "draft"
    )
  }
`);
```

#### Características:
- ✅ Lista posts desde Sanity
- ✅ Muestra título, extracto, estado
- ✅ Badges de estado (Publicado/Borrador)
- ✅ Fecha de última actualización
- ✅ Link a "Ver" para posts publicados
- ✅ Link a "Editar" (pero la página no existe)
- ✅ Botón "Nuevo Artículo"

### 3. **Query GROQ** ✅ (`lib/admin-queries.ts`)

```groq
*[_type == "post"] | order(_createdAt desc) {
  _id, title, slug, _createdAt, _updatedAt,
  publishedAt, excerpt,
  "author": author->name,
  "status": select(
    publishedAt != null => "published",
    "draft"
  )
}
```

## ❌ Lo que FALTA

### 1. **Página de Nuevo Post** ⚠️ (`app/dashboard/blog/new/page.tsx`)

**Estado**: UI completa pero NO FUNCIONAL

```typescript
// Línea 26 - Placeholder sin implementación
const handleSave = async () => {
  setIsLoading(true);
  try {
    // Aquí iría la lógica para guardar en Sanity ❌
    window.location.href = '/dashboard/blog';
  } catch (error) {
  } finally {
    setIsLoading(false);
  }
};
```

#### Lo que tiene:
- ✅ Formulario completo con todos los campos básicos
- ✅ Campos: title, slug, excerpt, content, status
- ✅ Validación de UI
- ✅ Plantillas de artículos (2 templates)
- ✅ Botones de guardar/cancelar
- ❌ **NO guarda realmente en Sanity**

#### Lo que le falta:
- ❌ No llama a ninguna API
- ❌ No usa adminSanityWriteClient
- ❌ No guarda en Sanity
- ❌ Faltan muchos campos del schema (categories, tags, heroImage, etc.)

### 2. **Página de Edición** ❌ (NO EXISTE)

**Archivo**: `app/dashboard/blog/[id]/page.tsx`
**Estado**: No existe

La lista de blog tiene links a editar pero la página no existe:
```typescript
const editUrl = `/dashboard/blog/${post._id}`; // ❌ Esta ruta no existe
```

### 3. **API de Blog** ❌ (NO EXISTE)

**Archivos faltantes**:
- `app/api/admin/blog/route.ts` - Para crear posts
- `app/api/admin/blog/[id]/route.ts` - Para editar/eliminar posts

**Impacto**: No se pueden crear ni editar posts desde el dashboard.

### 4. **Funciones de Admin** ❌ (NO EXISTEN)

No hay funciones auxiliares en `lib/` para:
- `createBlogPost()`
- `updateBlogPost()`
- `deleteBlogPost()`
- `getBlogPostById()`

## 🔍 Comparación con Otras Secciones

| Aspecto | Blog | Homepage | Featured |
|---------|------|----------|----------|
| Schema Sanity | ✅ Completo | ✅ Completo | ❌ Vacío |
| Dashboard Lista | ✅ Funcional | ✅ Funcional | ❌ Vacío |
| Dashboard Crear | ⚠️ UI sin backend | ✅ Funcional | ❌ Vacío |
| Dashboard Editar | ❌ No existe | ✅ Funcional | ❌ Vacío |
| API Admin | ❌ No existe | ✅ Funcional | ❌ Vacía |
| Funciones CRUD | ❌ No existe | ✅ Completas | ✅ Completas |
| **Completitud** | **40%** | **100%** | **40%** |

## 📝 Campos del Schema vs Formulario

### En el Schema (Sanity):
```typescript
{
  title, slug, excerpt, author, authorAvatar,
  heroImage, body, categories, relatedVenues,
  tags, hasFaq, faq, tldr, readingTime,
  featured, publishedAt, updatedAt
}
```

### En el Formulario (Dashboard):
```typescript
{
  title, slug, excerpt, content, status  // Solo 5 campos ❌
}
```

**Faltan en el formulario**:
- ❌ heroImage (imagen principal)
- ❌ body (rich text, actualmente usa textarea simple)
- ❌ categories (referencias a categorías)
- ❌ relatedVenues (referencias a locales)
- ❌ tags (etiquetas SEO)
- ❌ hasFaq / faq (preguntas frecuentes)
- ❌ tldr (resumen AEO)
- ❌ author / authorAvatar
- ❌ readingTime
- ❌ featured (destacado)
- ❌ publishedAt (fecha de publicación)

## 🎯 Funcionalidad Actual

### ✅ Lo que SÍ funciona:
1. **Ver lista de posts** desde Sanity
2. **Filtrar por estado** (publicado/borrador)
3. **Navegación** a páginas públicas de posts
4. **UI del formulario** de nuevo post (solo visual)

### ❌ Lo que NO funciona:
1. **Crear posts** desde el dashboard
2. **Editar posts** existentes
3. **Eliminar posts**
4. **Subir imágenes**
5. **Asignar categorías**
6. **Relacionar con locales**
7. **Gestionar SEO** (tags, FAQ, tldr)

## 🔄 Flujo Actual vs Esperado

### 🔴 Flujo Actual:

```
Dashboard → Lista de posts ✅
            ↓
      Click "Nuevo Artículo"
            ↓
   Formulario (solo visual) ⚠️
            ↓
      Click "Guardar"
            ↓
   Redirect sin guardar ❌
```

### ✅ Flujo Esperado:

```
Dashboard → Lista de posts
            ↓
      Click "Nuevo Artículo"
            ↓
   Formulario completo
            ↓
      POST /api/admin/blog
            ↓
      adminSanityWriteClient
            ↓
       ✅ Sanity CMS
            ↓
      Redirect con confirmación
```

## 🚀 Para Completar la Implementación

### Prioridad ALTA:

#### 1. **Crear API de Blog**
```typescript
// app/api/admin/blog/route.ts
export async function GET() { /* Listar posts */ }
export async function POST(request) { /* Crear post */ }

// app/api/admin/blog/[id]/route.ts  
export async function GET(request, { params }) { /* Obtener post */ }
export async function PUT(request, { params }) { /* Actualizar post */ }
export async function DELETE(request, { params }) { /* Eliminar post */ }
```

#### 2. **Crear Funciones de Admin**
```typescript
// lib/blog-admin.ts
export async function getAllBlogPosts()
export async function getBlogPostById(id)
export async function createBlogPost(data)
export async function updateBlogPost(id, data)
export async function deleteBlogPost(id)
```

#### 3. **Completar Formulario de Nuevo Post**
Agregar campos faltantes:
- ImageManager para heroImage
- Rich text editor para body
- Select múltiple para categories
- Select múltiple para relatedVenues
- Input de tags
- Toggle para hasFaq
- Array de FAQ questions/answers
- Textarea para tldr
- Input para readingTime
- Toggle para featured
- DatePicker para publishedAt

#### 4. **Crear Página de Edición**
```
app/dashboard/blog/[id]/page.tsx
app/dashboard/blog/[id]/BlogEditClient.tsx (componente cliente)
```

### Prioridad MEDIA:

#### 5. **Mejorar Formulario**
- Rich text editor (en lugar de textarea)
- Preview del post
- Autosave de borradores
- Generación automática de slug
- Cálculo automático de readingTime
- Validación en tiempo real

#### 6. **Funciones Auxiliares**
- Duplicar post
- Cambiar estado masivo
- Búsqueda y filtros
- Exportar posts

## 💡 Ventajas del Sistema Actual

A pesar de estar incompleto, tiene buenas bases:

1. ✅ **Schema excelente**: Muy completo y profesional
2. ✅ **Lista funcional**: Muestra datos reales de Sanity
3. ✅ **UI preparada**: El formulario base está listo
4. ✅ **Plantillas**: Incluye 2 templates útiles
5. ✅ **Estado**: Distingue entre publicado/borrador

## ⚠️ Limitaciones Actuales

### Para crear/editar posts actualmente debes:
1. Ir directamente a Sanity Studio: `http://localhost:3000/studio`
2. Crear/editar posts desde allí
3. Los posts aparecerán en el dashboard

### No puedes desde el dashboard:
- ❌ Crear nuevos posts
- ❌ Editar posts existentes  
- ❌ Eliminar posts
- ❌ Subir imágenes
- ❌ Gestionar relaciones (categorías, locales)

## 🎉 Conclusión

**Blog está al 40% de implementación**

### ✅ Fortalezas:
- Schema de Sanity excelente y muy completo
- Lista de posts funcional
- UI base del formulario preparada
- Integración con Sanity funcionando

### ⚠️ Puntos críticos:
- **Sin API**: No se puede crear/editar desde dashboard
- **Sin página de edición**: El link existe pero va a 404
- **Formulario incompleto**: Faltan 80% de los campos
- **Sin funciones admin**: No hay helpers para CRUD

### 📊 Prioridad de implementación:
**ALTA** - La sección es visible para usuarios admin pero no funciona. Crear la expectativa de que funcione y que no lo haga es peor que no tenerla.

## 🔗 Archivos Analizados

- ✅ `sanity/schemas/post.ts` - Schema completo (342 líneas)
- ✅ `app/dashboard/blog/page.tsx` - Lista funcional
- ⚠️ `app/dashboard/blog/new/page.tsx` - UI sin backend
- ❌ `app/dashboard/blog/[id]/page.tsx` - NO EXISTE
- ❌ `app/api/admin/blog/route.ts` - NO EXISTE
- ❌ `app/api/admin/blog/[id]/route.ts` - NO EXISTE
- ❌ `lib/blog-admin.ts` - NO EXISTE
- ✅ `lib/admin-queries.ts` - Query básica definida

## 📋 Recomendación

1. **Opción A (Recomendada)**: Implementar completamente (API + formularios + edición)
2. **Opción B**: Ocultar el botón "Nuevo Artículo" hasta implementarlo
3. **Opción C**: Agregar mensaje indicando que deben usar Sanity Studio

Para una experiencia de usuario coherente, se recomienda la **Opción A**.

