# Errores y Problemas Encontrados en Blog Reseñas Locales

## Resumen Ejecutivo

Este documento detalla todos los errores, fallos, páginas rotas y problemas encontrados en la aplicación durante la revisión del 30 de octubre de 2025.

**Total de problemas encontrados: 10**
- 🔴 Críticos: 2
- 🟡 Importantes: 4
- 🔵 Menores: 4

---

## 🔴 Problemas Críticos

### 1. Configuración Webpack Duplicada en next.config.mjs

**Archivo:** `next.config.mjs`
**Líneas:** 10-27 y 130-146

**Descripción:**
La configuración de webpack está duplicada. La primera configuración (líneas 10-27) es sobrescrita completamente por la segunda (líneas 130-146), lo que puede causar comportamientos inesperados y pérdida de optimizaciones.

**Primera configuración (líneas 10-27):**
```javascript
webpack: (config, { isServer }) => {
  config.resolve.alias = {
    ...config.resolve.alias,
  };

  if (!isServer) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
  }

  return config;
},
```

**Segunda configuración (líneas 130-146):**
```javascript
webpack: (config, { dev, isServer }) => {
  if (!dev && !isServer) {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
  }

  return config;
},
```

**Impacto:**
- La configuración de `resolve.fallback` para client-side se pierde
- Posibles errores en tiempo de ejecución relacionados con módulos node (fs, path, os)
- Build inconsistente

**Solución recomendada:**
Fusionar ambas configuraciones webpack en una sola función que incluya ambas lógicas.

---

### 2. Código Muerto en Homepage (app/(public)/page.tsx)

**Archivo:** `app/(public)/page.tsx`
**Líneas:** 36-337

**Descripción:**
La página principal contiene ~300 líneas de código que nunca se ejecutan o utilizan:

1. **Funciones de transformación definidas pero no usadas:**
   - `transformSanityReviews()` (líneas 36-62)
   - `transformSanityVenues()` (líneas 64-79)
   - `transformSanityCategories()` (líneas 81-92)
   - `renderSection()` (líneas 147-179)

2. **Datos preparados pero no pasados al componente:**
   - `heroFeaturedItems` (líneas 228-306)
   - `finalHeroItems` (líneas 309-329)
   - `sanityData` (líneas 332-337)

3. **Imports sin usar:**
   - `FeaturedSectionsModern`
   - `HeroModern`
   - `getAllFeaturedItems`
   - `defaultHomepageConfig`

**Código problemático:**
```typescript
export default async function HomePage() {
  // ... 300 líneas de lógica compleja ...

  return (
    <HomeSaborLocalServer /> // No recibe ninguna prop!
  );
}
```

**Impacto:**
- Aumento innecesario del bundle size
- Confusión en el mantenimiento del código
- Posible deuda técnica si la funcionalidad se pensó usar pero no se implementó
- Queries a Sanity que se ejecutan pero sus resultados se descartan

**Solución recomendada:**
1. Eliminar todo el código no utilizado, O
2. Pasar los datos preparados al componente `HomeSaborLocalServer` si era la intención original

---

## 🟡 Problemas Importantes

### 3. Ruta /top-resenas No Existe

**Archivo:** `components/Header.tsx`
**Líneas:** 99, 144

**Descripción:**
El componente Header incluye enlaces a la ruta `/top-resenas` que no existe en la aplicación.

**Código problemático:**
```tsx
// Desktop navigation (línea 99)
<Link href="/top-resenas" className="nav-link group">
  <Star className="h-4 w-4 transition-transform group-hover:scale-110" />
  <span>Top Reseñas</span>
</Link>

// Mobile navigation (línea 144)
<Link href="/top-resenas" className="mobile-nav-link">
  <Star className="h-4 w-4" />
  <span>Top Reseñas</span>
</Link>
```

**Verificación:**
No existe ningún archivo en:
- `app/(public)/top-resenas/page.tsx`
- `app/(public)/top-resenas/**`

**Impacto:**
- Los usuarios que hagan clic en "Top Reseñas" verán un error 404
- Mala experiencia de usuario
- Pérdida de navegación funcional

**Solución recomendada:**
1. Crear la página `/top-resenas`, O
2. Cambiar el enlace a una ruta existente como `/blog` o eliminar el enlace

---

### 4. Enlaces Rotos en Footer (href="#")

**Archivo:** `components/Footer.tsx`
**Líneas:** 21-23, 29-33, 39-43, 67-70

**Descripción:**
El Footer contiene múltiples enlaces que usan `href="#"` en lugar de URLs reales, lo que indica que las páginas no están implementadas.

**Enlaces problemáticos:**

**Redes sociales (líneas 21-23):**
```tsx
<a href="#" className="..."><Instagram /></a>
<a href="#" className="..."><Twitter /></a>
<a href="#" className="..."><Facebook /></a>
```

**Enlaces rápidos (líneas 29-33):**
```tsx
<a href="#">Categorías</a>
<a href="#">Top Reseñas</a>
<a href="#">Nuevos Locales</a>
<a href="#">Cerca de ti</a>
<a href="#">Blog</a>
```

**Ciudades hardcodeadas (líneas 39-43):**
```tsx
<a href="#">Madrid</a>
<a href="#">Barcelona</a>
<a href="#">Valencia</a>
<a href="#">Sevilla</a>
<a href="#">Bilbao</a>
```

**Links legales (líneas 67-70):**
```tsx
<a href="#">Política de Privacidad</a>
<a href="#">Términos de Uso</a>
<a href="#">Cookies</a>
<a href="#">Aviso Legal</a>
```

**Impacto:**
- Enlaces que no funcionan confunden a los usuarios
- Mala experiencia de usuario
- Problemas de SEO (enlaces a "#")
- Las páginas legales faltan y pueden ser requeridas por GDPR

**Solución recomendada:**
1. Implementar las páginas faltantes (ya existen algunas en `/app/(marketing)/`)
2. Actualizar los enlaces del Footer a las rutas correctas
3. Las ciudades deberían ser dinámicas desde Sanity, no hardcodeadas

---

### 5. Ciudad "A Coruña" Faltante en getCityDisplayName()

**Archivo:** `app/(public)/ciudades/page.tsx`
**Líneas:** 44-51

**Descripción:**
La función `getCityDisplayName()` solo incluye 5 ciudades hardcodeadas (Barcelona, Madrid, Valencia, Sevilla, Bilbao), pero según el código del proyecto, "A Coruña" (`a-coruna`) es la ciudad principal con ~90% de las reseñas.

**Código problemático:**
```typescript
function getCityDisplayName(slug: string): string {
  const names: Record<string, string> = {
    'barcelona': 'Barcelona',
    'madrid': 'Madrid',
    'valencia': 'Valencia',
    'sevilla': 'Sevilla',
    'bilbao': 'Bilbao',
  };
  return names[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}
```

**Evidencia de que A Coruña es la ciudad principal:**
- En `app/(public)/page.tsx:272` hay comentario: "Si no tiene ciudad asignada, usar A Coruña como default (90% de reseñas)"
- Múltiples referencias en el código a `'a-coruna'` como ciudad por defecto

**Impacto:**
- La ciudad principal del sitio se muestra como "A-coruna" (capitalizada incorrectamente) en lugar de "A Coruña"
- Inconsistencia en la presentación de datos
- Potencial confusión para usuarios

**Solución recomendada:**
Agregar 'a-coruna': 'A Coruña' al objeto `names` en la función.

---

### 6. Páginas Marketing Sin Enlaces desde el Sitio

**Archivos:**
- `app/(marketing)/sobre/page.tsx`
- `app/(marketing)/contacto/page.tsx`
- `app/(marketing)/politica-privacidad/page.tsx`
- `app/(marketing)/terminos/page.tsx`
- `app/(marketing)/cookies/page.tsx`

**Descripción:**
Existen páginas de marketing implementadas pero no hay enlaces funcionales a ellas desde el Footer ni desde otras partes del sitio.

**Verificación:**
Las páginas existen pero el Footer usa `href="#"` en lugar de las rutas correctas:
- `/sobre`
- `/contacto`
- `/politica-privacidad`
- `/terminos`
- `/cookies`

**Impacto:**
- Páginas inaccesibles para usuarios
- Contenido legal (GDPR) no accesible
- Pérdida de oportunidades de engagement (página sobre, contacto)

**Solución recomendada:**
Actualizar los enlaces del Footer para que apunten a las rutas correctas.

---

## 🔵 Problemas Menores

### 7. Función getCityIcon() Incompleta

**Archivo:** `app/(public)/ciudades/page.tsx`
**Líneas:** 54-63

**Descripción:**
Similar al problema #5, la función `getCityIcon()` no incluye un emoji para "A Coruña".

**Código:**
```typescript
function getCityIcon(slug: string): string {
  const icons: Record<string, string> = {
    'barcelona': '🏖️',
    'madrid': '🏛️',
    'valencia': '🥘',
    'sevilla': '💃',
    'bilbao': '🎨',
  };
  return icons[slug] || '🏙️';
}
```

**Impacto:**
- A Coruña se muestra con el emoji genérico 🏙️ en lugar de uno específico (por ejemplo: 🌊 o 🦞)

**Solución recomendada:**
Agregar 'a-coruna': '🌊' (u otro emoji apropiado) al objeto `icons`.

---

### 8. Newsletter CTA Sin Funcionalidad

**Archivo:** `components/HomeSaborLocal.tsx`
**Líneas:** 227-235

**Descripción:**
El formulario de suscripción al newsletter en la homepage no tiene funcionalidad backend conectada.

**Código:**
```tsx
<input
  type="email"
  placeholder="Tu email"
  className="..."
/>
<Button className="...">
  Suscribirse
</Button>
```

**Impacto:**
- Los usuarios pueden intentar suscribirse pero no pasará nada
- Pérdida de leads/suscriptores
- Frustración del usuario

**Solución recomendada:**
1. Implementar endpoint API para manejo de suscripciones
2. Conectar con servicio de email marketing (Mailchimp, SendGrid, etc.)
3. O deshabilitar temporalmente el formulario hasta implementar la funcionalidad

---

### 9. Búsqueda Sin Implementar en Header

**Archivo:** `components/Header.tsx`
**Líneas:** 79-88, 126-133

**Descripción:**
El input de búsqueda en el Header (desktop y mobile) no tiene funcionalidad conectada.

**Código:**
```tsx
<Input
  type="search"
  placeholder="Buscar restaurantes, comida, ubicación..."
  className="..."
/>
```

**Verificación:**
Existe una página `/buscar` en `app/(public)/buscar/page.tsx` pero el input no redirige a ella ni hace búsquedas.

**Impacto:**
- Funcionalidad de búsqueda no operativa
- Los usuarios no pueden buscar contenido
- Pérdida de engagement

**Solución recomendada:**
1. Conectar el input con la página `/buscar`
2. Implementar búsqueda en tiempo real o redirección al hacer submit

---

### 10. Inconsistencia en Estructura de URLs de Reviews

**Archivos:**
- `app/(public)/[city]/[venue]/review/[reviewSlug]/page.tsx`
- `app/(public)/[city]/reviews/review/[slug]/page.tsx`

**Descripción:**
Existen dos estructuras diferentes de URLs para reviews:
1. `/[city]/[venue]/review/[reviewSlug]` - Review específica de un venue
2. `/[city]/reviews/review/[slug]` - Review independiente por ciudad

**Impacto:**
- Puede causar confusión en el routing
- Inconsistencia en estructura de URLs
- Posible duplicación de contenido si una review es accesible por ambas rutas

**Solución recomendada:**
1. Documentar claramente cuándo usar cada estructura
2. Implementar redirects si es necesario para evitar duplicación
3. Considerar unificar a una sola estructura

---

## 📊 Resumen por Prioridad

### Acción Inmediata Requerida (Críticos)
1. ✅ Fusionar configuraciones webpack duplicadas
2. ✅ Limpiar código muerto en homepage o implementar funcionalidad

### Acción Recomendada (Importantes)
3. ✅ Crear página `/top-resenas` o actualizar enlaces
4. ✅ Actualizar todos los enlaces del Footer
5. ✅ Agregar "A Coruña" a funciones de display
6. ✅ Conectar páginas marketing con navegación

### Mejoras (Menores)
7. ✅ Agregar emoji para A Coruña
8. ✅ Implementar funcionalidad de newsletter
9. ✅ Conectar búsqueda del Header
10. ✅ Documentar/unificar estructura de URLs

---

## 🛠️ Próximos Pasos Recomendados

1. **Prioridad Alta:** Arreglar webpack config y código muerto en homepage
2. **Prioridad Media:** Actualizar todos los enlaces rotos en navegación
3. **Prioridad Baja:** Implementar funcionalidades pendientes (newsletter, búsqueda)
4. **Seguimiento:** Crear tests E2E para detectar enlaces rotos automáticamente

---

**Fecha del reporte:** 30 de octubre de 2025
**Revisado por:** Claude Code Assistant
**Proyecto:** blog-resenas-locales
**Branch:** claude/review-blog-errors-011CUd5YngHEMDqo4upFnD53
