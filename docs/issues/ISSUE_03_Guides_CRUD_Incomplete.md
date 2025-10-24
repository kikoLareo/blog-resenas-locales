# 🟡 PRIORIDAD MEDIA - CRUD de Guías Incompleto

## 📋 Descripción del Problema

La funcionalidad de Guías (`/dashboard/content/guides`) tiene solo la página de listado implementada. Faltan las páginas de creación, edición y las API routes correspondientes para tener un CRUD completo.

## 📍 Ubicación

**Implementado:**
- ✅ `app/dashboard/content/guides/page.tsx` - Listado de guías
- ✅ `lib/seo-queries.ts` - Query `getGuidesQuery`

**Faltante:**
- ❌ `app/dashboard/content/guides/new/page.tsx` - Crear guía
- ❌ `app/dashboard/content/guides/[id]/page.tsx` - Editar guía
- ❌ `app/api/admin/guides/route.ts` - API GET, POST
- ❌ `app/api/admin/guides/[id]/route.ts` - API PUT, DELETE

## 🐛 Problema Actual

En la página de listado hay enlaces a páginas que **no existen**:

```typescript
// Línea 81 - Botón "Nueva Guía"
<Link href="/dashboard/content/guides/new">  // ❌ 404
  <Button>
    <Plus className="h-4 w-4 mr-2" />
    Nueva Guía
  </Button>
</Link>

// Línea 267 - Botón "Editar"
<Link href={`/dashboard/content/guides/${guide._id}`}>  // ❌ 404
  <Button variant="outline" size="sm">
    <Edit className="h-4 w-4 mr-2" />
    Editar
  </Button>
</Link>

// Línea 281 - Botón "Eliminar"
<Button variant="ghost" size="sm" className="text-red-600">  // ❌ Sin funcionalidad
  <Trash2 className="h-4 w-4 mr-2" />
  Eliminar
</Button>
```

## 💥 Impacto

**Severidad:** Media
**Funcionalidad afectada:** Gestión completa de Guías
**Experiencia de usuario:**
- No se pueden crear nuevas guías desde el dashboard
- No se pueden editar guías existentes
- No se pueden eliminar guías

## 🎯 Funcionalidades a Implementar

### 1. Página de Creación de Guía

**Archivo:** `app/dashboard/content/guides/new/page.tsx`

**Campos del formulario:**
```typescript
interface GuideForm {
  title: string;              // Título de la guía
  slug: string;               // Slug URL-friendly
  excerpt: string;            // Descripción corta
  type: 'neighborhood' | 'thematic' | 'budget' | 'occasion';
  city: string;               // Referencia a ciudad
  neighborhood?: string;      // Opcional: nombre del barrio
  theme?: string;             // Opcional: tema de la guía
  sections: Section[];        // Secciones con venues
  published: boolean;         // Estado de publicación
  featured: boolean;          // Destacada
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

interface Section {
  title: string;
  description?: string;
  venues: string[];           // Array de IDs de venues
  order: number;
}
```

**Componentes necesarios:**
- Input para título con auto-generación de slug
- Select para tipo de guía
- Select para ciudad
- Editor de secciones con drag & drop
- Selector de venues múltiple
- Toggle para published/featured
- Campos SEO
- Botones Guardar/Cancelar

### 2. Página de Edición de Guía

**Archivo:** `app/dashboard/content/guides/[id]/page.tsx`

**Funcionalidad:**
- Cargar datos de la guía existente
- Mismo formulario que crear pero pre-poblado
- Mostrar fecha de creación y última modificación
- Botón "Eliminar" con confirmación
- Guardar cambios (PUT)

### 3. API Route - Listado y Creación

**Archivo:** `app/api/admin/guides/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminSanityClient, adminSanityWriteClient } from '@/lib/admin-sanity';
import { revalidateTag } from 'next/cache';

// GET - Obtener todas las guías
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const guides = await adminSanityClient.fetch(`
      *[_type == "guide"] | order(_createdAt desc) {
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        excerpt,
        type,
        city->{_id, title, slug},
        neighborhood,
        theme,
        sections,
        published,
        featured,
        publishedAt,
        lastUpdated,
        stats,
        seoTitle,
        seoDescription,
        seoKeywords
      }
    `);

    return NextResponse.json(guides);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener guías' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva guía
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    // Validaciones
    if (!data.title || !data.type || !data.city) {
      return NextResponse.json(
        { error: 'Título, tipo y ciudad son requeridos' },
        { status: 400 }
      );
    }

    // Generar slug si no existe
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Crear documento
    const guide = await adminSanityWriteClient.create({
      _type: 'guide',
      title: data.title,
      slug: { current: data.slug, _type: 'slug' },
      excerpt: data.excerpt || '',
      type: data.type,
      city: { _type: 'reference', _ref: data.city },
      neighborhood: data.neighborhood,
      theme: data.theme,
      sections: data.sections || [],
      published: data.published || false,
      featured: data.featured || false,
      publishedAt: data.published ? new Date().toISOString() : null,
      lastUpdated: new Date().toISOString(),
      stats: {
        views: 0,
        shares: 0,
        bookmarks: 0
      },
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords
    });

    // Revalidar
    revalidateTag('guides');
    revalidateTag('seo-content');

    return NextResponse.json({
      success: true,
      guide,
      message: 'Guía creada exitosamente'
    });
  } catch (error) {
    console.error('Error creating guide:', error);
    return NextResponse.json(
      { error: 'Error al crear la guía' },
      { status: 500 }
    );
  }
}
```

### 4. API Route - Actualización y Eliminación

**Archivo:** `app/api/admin/guides/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminSanityClient, adminSanityWriteClient } from '@/lib/admin-sanity';
import { revalidateTag } from 'next/cache';

// GET - Obtener una guía específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const guide = await adminSanityClient.fetch(
      `*[_type == "guide" && _id == $id][0]{
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        excerpt,
        type,
        city->{_id, title, slug},
        neighborhood,
        theme,
        sections,
        published,
        featured,
        publishedAt,
        lastUpdated,
        stats,
        seoTitle,
        seoDescription,
        seoKeywords
      }`,
      { id: params.id }
    );

    if (!guide) {
      return NextResponse.json({ error: 'Guía no encontrada' }, { status: 404 });
    }

    return NextResponse.json(guide);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener la guía' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar guía
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    // Actualizar documento
    const updated = await adminSanityWriteClient
      .patch(params.id)
      .set({
        title: data.title,
        slug: data.slug ? { current: data.slug, _type: 'slug' } : undefined,
        excerpt: data.excerpt,
        type: data.type,
        city: data.city ? { _type: 'reference', _ref: data.city } : undefined,
        neighborhood: data.neighborhood,
        theme: data.theme,
        sections: data.sections,
        published: data.published,
        featured: data.featured,
        publishedAt: data.published && !data.publishedAt
          ? new Date().toISOString()
          : data.publishedAt,
        lastUpdated: new Date().toISOString(),
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords
      })
      .commit();

    revalidateTag('guides');
    revalidateTag('seo-content');

    return NextResponse.json({
      success: true,
      guide: updated,
      message: 'Guía actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error updating guide:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la guía' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar guía
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await adminSanityWriteClient.delete(params.id);

    revalidateTag('guides');
    revalidateTag('seo-content');

    return NextResponse.json({
      success: true,
      message: 'Guía eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error deleting guide:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la guía' },
      { status: 500 }
    );
  }
}
```

## 🎯 Criterios de Aceptación

### Crear Guía
- [ ] Formulario completo con todos los campos
- [ ] Validación de campos requeridos
- [ ] Auto-generación de slug desde el título
- [ ] Selector de ciudad funcional
- [ ] Editor de secciones con venues
- [ ] Guardado exitoso en Sanity
- [ ] Redirección a la lista después de crear
- [ ] Mensajes de éxito/error apropiados

### Editar Guía
- [ ] Carga de datos existentes
- [ ] Formulario pre-poblado correctamente
- [ ] Actualización exitosa en Sanity
- [ ] Detección de cambios sin guardar
- [ ] Confirmación antes de salir con cambios
- [ ] Mensajes de éxito/error apropiados

### Eliminar Guía
- [ ] Confirmación antes de eliminar
- [ ] Eliminación exitosa en Sanity
- [ ] Redirección a la lista después de eliminar
- [ ] Mensaje de confirmación
- [ ] No se puede recuperar después de eliminar

### API Routes
- [ ] Autenticación funcionando
- [ ] Validaciones de datos
- [ ] Manejo de errores apropiado
- [ ] Revalidación de cache
- [ ] Respuestas consistentes

## ✅ Checklist Pre-Deploy

### Verificaciones de Código
- [ ] `npm run lint` - Sin errores
- [ ] `npm run test` - Todos los tests pasan
- [ ] `npm run build` - Build exitoso sin errores
- [ ] TypeScript sin errores de tipos

### Verificaciones Funcionales - Crear
- [ ] Abrir `/dashboard/content/guides/new`
- [ ] Completar formulario con datos válidos
- [ ] Hacer clic en "Guardar"
- [ ] Verificar que aparece en la lista
- [ ] Verificar en Sanity Studio que se creó

### Verificaciones Funcionales - Editar
- [ ] Abrir guía existente para editar
- [ ] Modificar varios campos
- [ ] Guardar cambios
- [ ] Verificar que los cambios se reflejan
- [ ] Verificar en Sanity Studio

### Verificaciones Funcionales - Eliminar
- [ ] Intentar eliminar una guía
- [ ] Verificar modal de confirmación
- [ ] Confirmar eliminación
- [ ] Verificar que desaparece de la lista
- [ ] Verificar en Sanity Studio que se eliminó

### Verificaciones de UX
- [ ] Formularios responsivos en móvil
- [ ] Loading states durante guardado
- [ ] Error states con mensajes claros
- [ ] Validación en tiempo real
- [ ] No hay errores en consola

### Verificaciones de API
- [ ] POST `/api/admin/guides` - Crear guía
- [ ] GET `/api/admin/guides` - Listar guías
- [ ] GET `/api/admin/guides/[id]` - Obtener guía
- [ ] PUT `/api/admin/guides/[id]` - Actualizar guía
- [ ] DELETE `/api/admin/guides/[id]` - Eliminar guía

## 📚 Referencias

- Schema de Guide: Revisar en Sanity Studio
- Ejemplo similar: `app/dashboard/reviews/` (implementación completa)
- Ejemplo similar: `app/dashboard/venues/` (implementación completa)
- Query existente: `lib/seo-queries.ts:4-26`

## 🏷️ Labels

`priority:medium` `feature` `guides` `dashboard` `crud` `enhancement`

---

**Fecha de creación:** 2025-10-24
**Estado:** 🟡 Pendiente
**Asignado a:** Por asignar
**Estimación:** 6-8 horas
**Dependencias:**
- Schema `guide` debe existir en Sanity
- Issue #02 (cálculo de venues) puede resolverse en paralelo
