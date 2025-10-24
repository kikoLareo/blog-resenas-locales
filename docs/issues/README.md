# 📋 Issues del Dashboard - Blog Reseñas Locales

**Fecha de creación:** 2025-10-24
**Estado del dashboard:** 92% Funcional
**Total de issues:** 5

## 🎯 Resumen Ejecutivo

Tras una revisión exhaustiva del dashboard, se identificaron **5 issues** que requieren atención. El dashboard está altamente funcional con conexiones reales a Sanity CMS y PostgreSQL/Prisma. No se utilizan mocks en producción (excepto 1 caso).

## 📊 Prioridades

### 🔴 Alta Prioridad (2 issues)
- **ISSUE_01:** Schema `homepageConfig` faltante en Sanity
- **ISSUE_02:** Cálculo mock de venues usando Math.random()

### 🟡 Media Prioridad (2 issues)
- **ISSUE_03:** CRUD de Guías incompleto
- **ISSUE_04:** Verificación del Performance Dashboard

### 🟢 Baja Prioridad (1 issue)
- **ISSUE_05:** Schemas de contenido SEO opcionales

---

## 🔴 ISSUE_01: Schema Homepage Config Faltante

**Archivo:** `ISSUE_01_Homepage_Config_Schema_Missing_In_Sanity.md`
**Prioridad:** 🔴 Alta
**Estimación:** 2-3 horas
**Estado:** Pendiente

### Descripción
La página `/dashboard/homepage-sections` tiene funcionalidad completa (drag & drop, configuración, guardado), pero falta crear el schema `homepageConfig` en Sanity Studio para que los datos persistan.

### Impacto
- ❌ Los cambios no se guardan
- ❌ Siempre carga configuración por defecto
- ❌ Mala experiencia de usuario

### Solución
1. Crear schema `homepageConfig.ts` en Sanity
2. Registrar en configuración de Sanity
3. Verificar persistencia de datos

### Archivos Afectados
- `app/dashboard/homepage-sections/page.tsx`
- `app/api/admin/homepage-config/route.ts`
- `lib/homepage-admin.ts`
- `sanity/schemas/` (crear aquí)

---

## 🔴 ISSUE_02: Cálculo Mock de Venues en Guides

**Archivo:** `ISSUE_02_Guides_Mock_Venue_Count_Using_Random.md`
**Prioridad:** 🔴 Alta
**Estimación:** 1-2 horas
**Estado:** Pendiente

### Descripción
La página `/dashboard/content/guides` usa `Math.random()` para mostrar el número de locales de cada guía. Es el **único mock en producción** encontrado.

### Ubicación del Problema
```typescript
// app/dashboard/content/guides/page.tsx:65-68
const totalVenues = (guide: Guide) => {
  return Math.floor(Math.random() * 20) + 5;  // ❌ MOCK
};
```

### Impacto
- ❌ Datos falsos
- ❌ Números cambian en cada recarga
- ❌ No refleja la realidad

### Solución
Calcular desde Sanity:
- **Opción 1:** Contar desde `guide.sections`
- **Opción 2:** Agregar campo `venueCount` en query GROQ
- **Opción 3:** Query separada para contar

### Archivos Afectados
- `app/dashboard/content/guides/page.tsx:65-68`
- `lib/seo-queries.ts` (modificar query)

---

## 🟡 ISSUE_03: CRUD de Guías Incompleto

**Archivo:** `ISSUE_03_Guides_CRUD_Incomplete.md`
**Prioridad:** 🟡 Media
**Estimación:** 6-8 horas
**Estado:** Pendiente

### Descripción
El módulo de Guías tiene solo el listado. Faltan:
- ❌ Página de crear guía
- ❌ Página de editar guía
- ❌ API routes CRUD
- ❌ Funcionalidad de eliminar

### Implementado
- ✅ Listado de guías
- ✅ Query GROQ
- ✅ Conexión a Sanity

### Faltante
- ❌ `/dashboard/content/guides/new/page.tsx`
- ❌ `/dashboard/content/guides/[id]/page.tsx`
- ❌ `/api/admin/guides/route.ts`
- ❌ `/api/admin/guides/[id]/route.ts`

### Solución
Implementar CRUD completo siguiendo el patrón de Reviews/Venues que ya están funcionando.

### Archivos a Crear
- `app/dashboard/content/guides/new/page.tsx`
- `app/dashboard/content/guides/[id]/page.tsx`
- `app/api/admin/guides/route.ts`
- `app/api/admin/guides/[id]/route.ts`

---

## 🟡 ISSUE_04: Verificación Performance Dashboard

**Archivo:** `ISSUE_04_Performance_Dashboard_Backend_Verification.md`
**Prioridad:** 🟡 Media
**Estimación:** 3-4 horas
**Estado:** Pendiente

### Descripción
El Performance Dashboard está implementado pero requiere verificación y posible configuración adicional.

### Implementado
- ✅ Frontend completo (`/dashboard/performance`)
- ✅ API de métricas (`/api/performance/metrics`)
- ✅ API de bundle analysis (`/api/performance/bundle-analysis`)
- ✅ Cálculo de Core Web Vitals

### Limitaciones Actuales
⚠️ **Storage en memoria:** Los datos se pierden al reiniciar
```typescript
// Línea 28-29 de metrics/route.ts
const performanceStore = new Map<string, PerformanceMetrics[]>();
```

### Problemas Potenciales
- ❌ No funciona en serverless (Vercel, AWS Lambda)
- ❌ Datos limitados a 1 hora
- ❌ No escala con múltiples instancias
- ❓ Falta verificar si hay cliente de web-vitals

### Solución
1. Verificar si existe cliente de tracking
2. Implementar si no existe (con `web-vitals` package)
3. Migrar storage a Redis/KV/PostgreSQL (opcional)
4. Probar funcionalidad completa

### Archivos Afectados
- `app/dashboard/performance/page.tsx`
- `app/api/performance/metrics/route.ts`
- `app/api/performance/bundle-analysis/route.ts`
- `lib/performance-tracking.ts` (crear)

---

## 🟢 ISSUE_05: Schemas de Contenido SEO

**Archivo:** `ISSUE_05_SEO_Content_Schemas_Implementation.md`
**Prioridad:** 🟢 Baja
**Estimación:** Variable (4-50 horas según alcance)
**Estado:** Pendiente (Requiere decisión de negocio)

### Descripción
El código tiene queries GROQ para 6 tipos de contenido SEO que pueden no tener schemas implementados en Sanity.

### Tipos de Contenido

| Tipo | Estado | Prioridad Sugerida | Estimación |
|------|--------|-------------------|------------|
| `guide` | ⚠️ Parcial | 🟢 Alta | 4-6h |
| `list` | ❓ Query only | 🟢 Alta | 8-10h |
| `recipe` | ❓ Query only | 🟡 Media | 10-12h |
| `news` | ❓ Query only | 🟡 Media | 6-8h |
| `dish-guide` | ❓ Query only | 🔴 Baja | 8-10h |
| `offer` | ❓ Query only | 🔴 Baja | 6-8h |

### Uso de Cada Tipo
- **Guide:** Guías como "Mejores restaurantes en Malasaña"
- **List:** Listas SEO como "Top 10 pizzerías"
- **Recipe:** Recetas para reproducir en casa
- **News:** Noticias del sector gastronómico
- **Dish Guide:** Guías de platos "Todo sobre la paella"
- **Offer:** Ofertas y descuentos de venues

### Solución
**Decisión requerida:** ¿Qué tipos de contenido se van a usar?

Opciones:
- **A:** Implementar todos los 6 tipos
- **B:** Solo los necesarios (ej: Guide + List)
- **C:** Empezar con 2-3 y expandir después
- **D:** Eliminar queries no usadas

**Recomendación:** Opción C - Empezar con `guide` y `list`.

### Archivos Afectados
- `lib/seo-queries.ts` (queries ya existen)
- `sanity/schemas/` (crear schemas)
- `app/dashboard/content/` (crear páginas)
- `app/api/admin/` (crear API routes)

---

## ✅ Checklist Pre-Deploy Global

Antes de desplegar **cualquier** issue:

### Verificaciones de Código
- [ ] `npm run lint` - Sin errores
- [ ] `npm run test` - Todos los tests pasan
- [ ] `npm run build` - Build exitoso sin errores

### Verificaciones de Base de Datos
- [ ] Sanity Studio funciona sin errores
- [ ] Prisma migrations aplicadas (si aplica)
- [ ] Conexiones a BD funcionando

### Verificaciones Funcionales
- [ ] Funcionalidad implementada funciona correctamente
- [ ] No hay regresiones en otras funcionalidades
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en logs del servidor

---

## 📈 Progreso de Implementación

### Completitud del Dashboard
```
██████████████████░░ 92%
```

### Issues por Prioridad
- 🔴 Alta: 2 issues (40%)
- 🟡 Media: 2 issues (40%)
- 🟢 Baja: 1 issue (20%)

### Estimación Total
- **Mínimo (issues críticos):** 3-5 horas
- **Recomendado (alta + media):** 12-17 horas
- **Completo (todos):** 16-67 horas

---

## 🎯 Recomendaciones

### Fase 1: Crítico (1-2 semanas)
1. ✅ Resolver ISSUE_01 (Homepage Config Schema)
2. ✅ Resolver ISSUE_02 (Mock venues calculation)

### Fase 2: Mejoras (2-4 semanas)
3. ✅ Resolver ISSUE_03 (Guides CRUD)
4. ✅ Resolver ISSUE_04 (Performance Dashboard)

### Fase 3: Expansión (opcional, 4-8 semanas)
5. ✅ Decidir sobre ISSUE_05 (SEO Content)
6. ✅ Implementar tipos de contenido seleccionados

---

## 📚 Documentación Relacionada

- `/docs/implementation/` - Documentación de implementación
- `/DASHBOARD_IMPLEMENTATION_COMPLETE.md` - Estado actual del dashboard
- `/tests/` - Suite de tests

---

## 🤝 Contribución

Al trabajar en un issue:
1. Leer completamente el archivo del issue
2. Seguir los pasos propuestos
3. Verificar todos los criterios de aceptación
4. Completar checklist pre-deploy
5. Documentar cambios

---

**Última actualización:** 2025-10-24
**Autor:** Claude Code Review
**Versión:** 1.0
