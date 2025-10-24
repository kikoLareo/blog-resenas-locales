# 🔴 PRIORIDAD ALTA - Falta Schema `homepageConfig` en Sanity Studio

## 📋 Descripción del Problema

El dashboard tiene una página completamente funcional para gestionar las secciones del homepage (`/dashboard/homepage-sections`), con funcionalidad de drag & drop, configuración de secciones, y guardado. Sin embargo, **falta crear el schema correspondiente en Sanity Studio** para que los datos puedan persistir.

## 📍 Ubicación

**Archivos afectados:**
- `app/dashboard/homepage-sections/page.tsx` (Frontend implementado)
- `app/api/admin/homepage-config/route.ts` (API implementada)
- `lib/homepage-admin.ts` (Funciones de persistencia implementadas)
- `sanity/schemas/` (FALTA crear el schema aquí)

## 🐛 Problema Actual

El código intenta guardar y leer configuraciones con:
```typescript
*[_type == "homepageConfig"][0]
```

Pero este tipo de documento **no existe** en Sanity Studio, causando que:
- ❌ Los cambios no se persistan
- ❌ Siempre se cargue la configuración por defecto
- ❌ No haya feedback de error al usuario

## 💥 Impacto

**Severidad:** Alta
**Funcionalidad afectada:** Configuración de homepage
**Experiencia de usuario:** Los cambios se pierden al recargar la página

## 🔍 Pasos para Reproducir

1. Ir a `/dashboard/homepage-sections`
2. Reordenar secciones o cambiar configuraciones
3. Hacer clic en "Guardar Cambios"
4. Recargar la página
5. **Resultado:** Los cambios no se mantienen

## ✅ Solución Propuesta

### 1. Crear el schema en Sanity Studio

**Archivo:** `sanity/schemas/homepage-config.ts`

```typescript
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'homepageConfig',
  title: 'Homepage Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Configuration Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Homepage Principal'
    }),
    defineField({
      name: 'sections',
      title: 'Homepage Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'id',
              title: 'Section ID',
              type: 'string',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'type',
              title: 'Section Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Hero', value: 'hero' },
                  { title: 'Featured', value: 'featured' },
                  { title: 'Trending', value: 'trending' },
                  { title: 'Categories', value: 'categories' },
                  { title: 'Newsletter', value: 'newsletter' }
                ]
              },
              validation: (Rule) => Rule.required()
            },
            {
              name: 'enabled',
              title: 'Enabled',
              type: 'boolean',
              initialValue: true
            },
            {
              name: 'order',
              title: 'Order',
              type: 'number',
              validation: (Rule) => Rule.required().min(1)
            },
            {
              name: 'config',
              title: 'Section Configuration',
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Display Title',
                  type: 'string'
                },
                {
                  name: 'subtitle',
                  title: 'Subtitle',
                  type: 'text',
                  rows: 2
                },
                {
                  name: 'itemCount',
                  title: 'Number of Items',
                  type: 'number',
                  validation: (Rule) => Rule.min(1).max(12)
                },
                {
                  name: 'showImages',
                  title: 'Show Images',
                  type: 'boolean',
                  initialValue: true
                },
                {
                  name: 'layout',
                  title: 'Layout',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Grid', value: 'grid' },
                      { title: 'Carousel', value: 'carousel' },
                      { title: 'List', value: 'list' }
                    ]
                  }
                }
              ]
            }
          ],
          preview: {
            select: {
              title: 'title',
              type: 'type',
              enabled: 'enabled'
            },
            prepare({ title, type, enabled }) {
              return {
                title: title || 'Unnamed Section',
                subtitle: `${type} - ${enabled ? 'Enabled' : 'Disabled'}`
              };
            }
          }
        }
      ]
    }),
    defineField({
      name: 'lastModified',
      title: 'Last Modified',
      type: 'datetime',
      readOnly: true
    })
  ],
  preview: {
    select: {
      title: 'title',
      sections: 'sections'
    },
    prepare({ title, sections }) {
      return {
        title: title || 'Homepage Configuration',
        subtitle: `${sections?.length || 0} sections configured`
      };
    }
  }
});
```

### 2. Registrar el schema en Sanity

**Archivo:** `sanity/schema.ts` o `sanity.config.ts`

```typescript
import homepageConfig from './schemas/homepage-config';

// Añadir al array de schemas
schemas: [
  // ... otros schemas
  homepageConfig,
]
```

### 3. Inicializar configuración por defecto (opcional)

Crear un documento inicial en Sanity Studio con la configuración por defecto.

## 🎯 Criterios de Aceptación

- [ ] Schema `homepageConfig` creado en Sanity Studio
- [ ] Schema registrado correctamente en la configuración
- [ ] Se puede crear/editar el documento desde Sanity Studio
- [ ] El frontend puede guardar cambios correctamente
- [ ] Los cambios persisten después de recargar la página
- [ ] La API `/api/admin/homepage-config` funciona sin errores
- [ ] Se puede reordenar secciones y guardar el orden
- [ ] Se puede habilitar/deshabilitar secciones
- [ ] Los cambios se reflejan en el frontend del sitio (si aplica)

## ✅ Checklist Pre-Deploy

Antes de dar por completado este issue, verificar:

### Verificaciones de Código
- [ ] `npm run lint` - Sin errores
- [ ] `npm run test` - Todos los tests pasan
- [ ] `npm run build` - Build exitoso sin errores
- [ ] Sanity Studio se ejecuta sin errores (`npm run dev` en directorio sanity)

### Verificaciones Funcionales
- [ ] Crear documento de configuración en Sanity Studio
- [ ] Guardar cambios desde `/dashboard/homepage-sections`
- [ ] Verificar persistencia recargando la página
- [ ] Probar drag & drop y reordenamiento
- [ ] Probar habilitar/deshabilitar secciones
- [ ] Verificar que no hay errores en consola del navegador
- [ ] Verificar que no hay errores en logs del servidor

### Verificaciones de Integración
- [ ] La configuración se refleja correctamente en la homepage pública
- [ ] El cache se invalida correctamente al guardar cambios
- [ ] No hay conflictos con otras funcionalidades

## 📚 Referencias

- Documentación de Sanity Schemas: https://www.sanity.io/docs/schema-types
- Código existente en: `lib/homepage-admin.ts`
- Frontend en: `app/dashboard/homepage-sections/page.tsx`

## 🏷️ Labels

`priority:high` `bug` `sanity` `dashboard` `homepage` `schema`

---

**Fecha de creación:** 2025-10-24
**Estado:** 🔴 Pendiente
**Asignado a:** Por asignar
**Estimación:** 2-3 horas
