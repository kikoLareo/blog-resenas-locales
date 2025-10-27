# Lista de Issues Priorizadas - Blog Reseñas Locales
## Basado en Auditoría Exhaustiva Diciembre 2024

Esta lista contiene todas las mejoras, optimizaciones y correcciones identificadas durante la auditoría exhaustiva, organizadas por prioridad y preparadas para crear issues en GitHub.

---

## 🔴 PRIORIDAD ALTA - Issues Críticas

### 1. [BACKEND] Implementar API CRUD completa para Cities
**Título:** `Implementar endpoints API para gestión de Cities en dashboard`

**Descripción:**
```markdown
## Descripción
Completar la funcionalidad del dashboard implementando los endpoints API faltantes para la gestión de ciudades (Cities). Actualmente la UI está completa pero no hay backend.

## Archivos a crear/modificar
- `app/api/admin/cities/route.ts` - Endpoints GET, POST
- `app/api/admin/cities/[id]/route.ts` - Endpoints GET, PUT, DELETE

## Funcionalidades requeridas
- [x] UI forms (ya implementado)
- [ ] GET /api/admin/cities - Listar ciudades
- [ ] POST /api/admin/cities - Crear ciudad  
- [ ] GET /api/admin/cities/[id] - Obtener ciudad específica
- [ ] PUT /api/admin/cities/[id] - Actualizar ciudad
- [ ] DELETE /api/admin/cities/[id] - Eliminar ciudad

## Criterios de aceptación
- [ ] Endpoints implementados con validación
- [ ] Integración con Sanity CMS
- [ ] Manejo de errores consistente
- [ ] Revalidación de caché automática
- [ ] Tests unitarios añadidos

## Estimación
4-6 horas

## Impacto
🔴 Alto - Completa funcionalidad crítica del dashboard
```

**Prioridad:** 🔴 Alta  
**Etiquetas:** `backend`, `api`, `dashboard`, `cities`, `crud`

---

### 2. [BACKEND] Implementar API CRUD completa para Categories
**Título:** `Implementar endpoints API para gestión de Categories en dashboard`

**Descripción:**
```markdown
## Descripción
Completar la funcionalidad del dashboard implementando los endpoints API faltantes para la gestión de categorías. Actualmente la UI está completa pero no hay backend.

## Archivos a crear/modificar
- `app/api/admin/categories/route.ts` - Endpoints GET, POST
- `app/api/admin/categories/[id]/route.ts` - Endpoints GET, PUT, DELETE

## Funcionalidades requeridas
- [x] UI forms (ya implementado)
- [ ] GET /api/admin/categories - Listar categorías
- [ ] POST /api/admin/categories - Crear categoría
- [ ] GET /api/admin/categories/[id] - Obtener categoría específica
- [ ] PUT /api/admin/categories/[id] - Actualizar categoría
- [ ] DELETE /api/admin/categories/[id] - Eliminar categoría

## Criterios de aceptación
- [ ] Endpoints implementados con validación
- [ ] Integración con Sanity CMS
- [ ] Manejo de errores consistente
- [ ] Revalidación de caché automática
- [ ] Tests unitarios añadidos

## Estimación
4-6 horas

## Impacto
🔴 Alto - Completa funcionalidad crítica del dashboard
```

**Prioridad:** 🔴 Alta  
**Etiquetas:** `backend`, `api`, `dashboard`, `categories`, `crud`

---

### 3. [BACKEND] Implementar API CRUD completa para Reviews
**Título:** `Implementar endpoints API para gestión de Reviews en dashboard`

**Descripción:**
```markdown
## Descripción
Completar la funcionalidad del dashboard implementando los endpoints API faltantes para la gestión de reseñas. Este es el más complejo ya que las reseñas tienen relaciones con venues, categories y authors.

## Archivos a crear/modificar
- `app/api/admin/reviews/route.ts` - Endpoints GET, POST
- `app/api/admin/reviews/[id]/route.ts` - Endpoints GET, PUT, DELETE

## Funcionalidades requeridas
- [x] UI forms (ya implementado)
- [ ] GET /api/admin/reviews - Listar reseñas con filtros
- [ ] POST /api/admin/reviews - Crear reseña
- [ ] GET /api/admin/reviews/[id] - Obtener reseña específica
- [ ] PUT /api/admin/reviews/[id] - Actualizar reseña
- [ ] DELETE /api/admin/reviews/[id] - Eliminar reseña

## Funcionalidades específicas
- [ ] Manejo de relaciones con venues
- [ ] Validación de ratings y scores
- [ ] Upload de imágenes múltiples
- [ ] Generación automática de slugs
- [ ] Tags y categorías

## Criterios de aceptación
- [ ] Endpoints implementados con validación completa
- [ ] Integración con Sanity CMS
- [ ] Manejo de relaciones correcta
- [ ] Upload de imágenes funcional
- [ ] Manejo de errores robusto
- [ ] Revalidación de caché automática
- [ ] Tests unitarios comprehensivos

## Estimación
6-8 horas (más complejo debido a relaciones)

## Impacto
🔴 Alto - Completa funcionalidad crítica del dashboard
```

**Prioridad:** 🔴 Alta  
**Etiquetas:** `backend`, `api`, `dashboard`, `reviews`, `crud`, `complex`

---

## 🟡 PRIORIDAD MEDIA - Optimizaciones Importantes

### 4. [PERFORMANCE] Optimizar componentes de imagen con Next.js Image
**Título:** `Reemplazar tags <img> con Next.js Image component para Core Web Vitals`

**Descripción:**
```markdown
## Descripción
Optimizar performance reemplazando los tags `<img>` restantes con el componente `Next.js Image` para mejorar Core Web Vitals (LCP, CLS).

## Archivos identificados
- `app/(auth)/acceso/page.tsx:68` - Imagen en página de acceso
- `components/figma/ImageWithFallback.tsx:23,27` - Componente de fallback
- `components/figma/ImageWithFallback 2.tsx:50` - Componente duplicado

## Problemas actuales
- Slower LCP debido a imágenes no optimizadas
- Mayor ancho de banda
- Sin optimización automática de formatos (WebP, AVIF)

## Criterios de aceptación
- [ ] Todos los `<img>` reemplazados con `<Image />`
- [ ] Sizes apropiados configurados
- [ ] Alt texts mantenidos
- [ ] Fallbacks funcionando correctamente
- [ ] No warnings de eslint
- [ ] Tests actualizados

## Beneficios
- ✅ Mejor Core Web Vitals
- ✅ Menor uso de ancho de banda
- ✅ Optimización automática de formatos
- ✅ Lazy loading automático

## Estimación
2-3 horas

## Impacto
🟡 Medio - Mejora notable en performance
```

**Prioridad:** 🟡 Media  
**Etiquetas:** `performance`, `images`, `core-web-vitals`, `optimization`

---

### 5. [CODE QUALITY] Corregir dependencias de React Hooks
**Título:** `Fix React Hook dependency warnings en useEffect y useCallback`

**Descripción:**
```markdown
## Descripción
Corregir warnings de ESLint relacionados con dependencias faltantes en React Hooks para mejorar la calidad del código y prevenir bugs.

## Archivos afectados
- `components/Header.tsx:56` - useEffect con dependencia 'visible' faltante
- `components/HeroSection.tsx:166` - useCallback con dependencia 'centerThumbnail' faltante

## Warnings actuales
```
Warning: React Hook useEffect has a missing dependency: 'visible'. Either include it or remove the dependency array.
Warning: React Hook useCallback has a missing dependency: 'centerThumbnail'. Either include it or remove the dependency array.
```

## Soluciones posibles
- [ ] Añadir dependencias faltantes al array
- [ ] Remover dependencias del array si no son necesarias
- [ ] Usar useCallback/useMemo para estabilizar referencias
- [ ] Mover variables dentro del hook si es apropiado

## Criterios de aceptación
- [ ] No warnings de react-hooks/exhaustive-deps
- [ ] Funcionalidad mantenida
- [ ] Tests pasando
- [ ] Comportamiento correcto en re-renders

## Estimación
1-2 horas

## Impacto
🟡 Medio - Mejora calidad de código y previene bugs
```

**Prioridad:** 🟡 Media  
**Etiquetas:** `code-quality`, `react`, `hooks`, `linting`

---

### 6. [MONITORING] Implementar Error Tracking y Monitoring
**Título:** `Configurar Sentry para error tracking en producción`

**Descripción:**
```markdown
## Descripción
Implementar sistema de monitoring y error tracking para producción usando Sentry, mejorando la observabilidad de la aplicación.

## Funcionalidades a implementar
- [ ] Configuración de Sentry
- [ ] Error boundary reporting
- [ ] Performance monitoring
- [ ] User session tracking
- [ ] Custom error contexts

## Archivos a crear/modificar
- `lib/sentry.ts` - Configuración de Sentry
- `app/error.tsx` - Error boundary global
- `components/ErrorBoundary.tsx` - Component para error handling
- Environment variables para configuración

## Beneficios
- ✅ Tracking de errores en tiempo real
- ✅ Performance monitoring
- ✅ User session insights
- ✅ Error alerting automático
- ✅ Debug context rico

## Criterios de aceptación
- [ ] Sentry configurado y funcionando
- [ ] Error boundaries reportando correctamente
- [ ] Performance monitoring activo
- [ ] Documentación de configuración
- [ ] Tests para error scenarios

## Estimación
3-4 horas

## Impacto
🟡 Medio - Mejora significativa en observabilidad
```

**Prioridad:** 🟡 Media  
**Etiquetas:** `monitoring`, `sentry`, `error-tracking`, `observability`

---

### 7. [SECURITY] Audit y mejora de configuración de seguridad
**Título:** `Revisar y fortalecer configuración de seguridad`

**Descripción:**
```markdown
## Descripción
Revisar y mejorar la configuración de seguridad actual, incluyendo headers, CSP, y mejores prácticas de seguridad.

## Áreas a revisar
- [ ] Content Security Policy (CSP)
- [ ] Security headers adicionales
- [ ] Rate limiting para APIs
- [ ] Input sanitization
- [ ] CORS configuration

## Archivos a modificar
- `middleware.ts` - Headers de seguridad
- `next.config.mjs` - Configuración de seguridad
- API routes - Rate limiting y validación

## Mejoras sugeridas
- [ ] Implementar CSP headers
- [ ] Rate limiting en API endpoints
- [ ] Mejorar sanitización de inputs
- [ ] Headers de seguridad adicionales
- [ ] HTTPS redirection enforcement

## Criterios de aceptación
- [ ] CSP configurado apropiadamente
- [ ] Rate limiting implementado
- [ ] Headers de seguridad mejorados
- [ ] Tests de seguridad pasando
- [ ] Documentación actualizada

## Estimación
4-5 horas

## Impacto
🟡 Medio - Mejora la postura de seguridad
```

**Prioridad:** 🟡 Media  
**Etiquetas:** `security`, `csp`, `headers`, `rate-limiting`

---

## 🟢 PRIORIDAD BAJA - Mejoras Menores

### 8. [CLEANUP] Remover console.log statements
**Título:** `Limpiar console.log statements de código de producción`

**Descripción:**
```markdown
## Descripción
Remover console.log statements identificados en el código para producción.

## Archivos afectados
- `components/QrVenueForm 2.tsx:57` - Console statement

## Criterios de aceptación
- [ ] Todos los console.log removidos o reemplazados
- [ ] Logger apropiado implementado si es necesario
- [ ] No warnings de no-console

## Estimación
30 minutos

## Impacto
🟢 Bajo - Limpieza de código
```

**Prioridad:** 🟢 Baja  
**Etiquetas:** `cleanup`, `console`, `linting`

---

### 9. [REFACTOR] Corregir async client components
**Título:** `Convertir async client components a server components`

**Descripción:**
```markdown
## Descripción
Corregir warnings sobre client components async convirtiéndolos a server components donde sea apropiado.

## Archivos afectados
- `app/dashboard/categories/[id]/page.tsx:399`
- `app/dashboard/cities/[id]/page.tsx:319`
- `app/dashboard/venues/[id]/page.tsx:404`

## Warnings actuales
```
Warning: Prevent client components from being async functions.
```

## Criterios de aceptación
- [ ] Components convertidos apropiadamente
- [ ] Funcionalidad mantenida
- [ ] No warnings de Next.js
- [ ] Performance mejorada

## Estimación
2-3 horas

## Impacto
🟢 Bajo - Mejores prácticas de Next.js
```

**Prioridad:** 🟢 Baja  
**Etiquetas:** `refactor`, `server-components`, `async`, `next.js`

---

### 10. [ENHANCEMENT] Implementar PWA capabilities
**Título:** `Agregar Progressive Web App capabilities`

**Descripción:**
```markdown
## Descripción
Implementar capacidades de PWA para mejorar la experiencia de usuario en dispositivos móviles.

## Funcionalidades a implementar
- [ ] Service Worker
- [ ] Web App Manifest (ya existe parcialmente)
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Install prompt

## Archivos a crear/modificar
- `public/sw.js` - Service Worker
- `public/manifest.json` - Actualizar manifest
- Configuración de PWA en Next.js

## Beneficios
- ✅ Experiencia nativa en móviles
- ✅ Funcionalidad offline
- ✅ Notificaciones push
- ✅ Instalación en dispositivo

## Estimación
8-12 horas

## Impacto
🟢 Bajo - Funcionalidad avanzada nice-to-have
```

**Prioridad:** 🟢 Baja  
**Etiquetas:** `pwa`, `service-worker`, `offline`, `enhancement`

---

## 📊 Resumen de Issues por Prioridad

### Distribución de Esfuerzo

| Prioridad | Issues | Estimación Total | Impacto |
|-----------|--------|------------------|---------|
| 🔴 Alta | 3 | 14-20 horas | Completar funcionalidad crítica |
| 🟡 Media | 4 | 10-14 horas | Optimizaciones importantes |
| 🟢 Baja | 3 | 10-15 horas | Mejoras menores |
| **TOTAL** | **10** | **34-49 horas** | **Proyecto 100% completo** |

### Roadmap Sugerido

**Sprint 1 (Prioridad Alta):**
- Issues #1, #2, #3 - Completar APIs faltantes
- **Objetivo:** Dashboard 100% funcional

**Sprint 2 (Prioridad Media):**  
- Issues #4, #5, #6 - Optimizaciones y monitoring
- **Objetivo:** Performance y observabilidad

**Sprint 3 (Prioridad Baja):**
- Issues #7, #8, #9 - Limpieza y refactoring  
- **Objetivo:** Código perfecto

**Futuro (Enhancements):**
- Issue #10 - PWA capabilities
- **Objetivo:** Funcionalidades avanzadas

---

## 🎯 Notas para Implementación

### Convenciones para Issues GitHub

**Template de Issue:**
```markdown
## 📋 Descripción
[Descripción del problema/mejora]

## 🎯 Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2

## 📁 Archivos Afectados
- `archivo1.ts`
- `archivo2.tsx`

## ⏱️ Estimación
X horas

## 🔗 Referencias
- Link a documentación
- Link a ejemplos
```

**Etiquetas Recomendadas:**
- `priority-high`, `priority-medium`, `priority-low`
- `backend`, `frontend`, `api`, `ui`
- `performance`, `security`, `monitoring`
- `bug`, `enhancement`, `refactor`, `cleanup`

### Testing Requirements

Cada issue debe incluir:
- [ ] Tests unitarios actualizados
- [ ] Tests de integración si aplica
- [ ] Verificación manual
- [ ] Documentación actualizada

---

*Lista generada basada en auditoría exhaustiva - Diciembre 2024*