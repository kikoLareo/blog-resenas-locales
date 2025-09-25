# 🧠 MEMORY BANK - Estructura Homepage y Admin

## 📋 Orden de Secciones Homepage (SEO + UX Optimizado)

### 1. 🎯 **Hero + Carrusel Principal**
**Prioridad:** CRÍTICA
**Estado:** ⏳ En desarrollo
**Objetivo:** Primer impacto visual y refuerzo de marca

#### Frontend Components:
- `HeroSection.tsx` ✅ (ya existe)
- `HeroSlider.tsx` ✅ (ya existe) 
- Necesario: `FeaturedReviewsCarousel.tsx`

#### Admin Panel:
- **Gestión de Hero:**
  - Subir/cambiar imagen hero principal
  - Editar claim/texto principal
  - Toggle activar/desactivar sección
- **Gestión Carrusel:**
  - Seleccionar reseñas destacadas (top rated)
  - Orden de aparición en carrusel
  - Configurar velocidad/transición
  - Preview en tiempo real

#### Sanity Schema:
```typescript
{
  name: 'heroSettings',
  title: 'Configuración Hero',
  type: 'document',
  fields: [
    { name: 'mainImage', type: 'image' },
    { name: 'title', type: 'string' },
    { name: 'subtitle', type: 'text' },
    { name: 'ctaText', type: 'string' },
    { name: 'isActive', type: 'boolean' },
    { name: 'featuredReviews', type: 'array', of: [{ type: 'reference', to: 'review' }] }
  ]
}
```

---

### 2. 🔍 **Buscador / Filtros Principales**
**Prioridad:** ALTA
**Estado:** 🔄 Por implementar
**Objetivo:** Búsqueda rápida y SEO para asistentes de voz

#### Frontend Components:
- `SearchBar.tsx` (nuevo)
- `FilterChips.tsx` (nuevo)
- `QuickFilters.tsx` (nuevo)

#### Admin Panel:
- **Configuración de búsqueda:**
  - Términos sugeridos automáticos
  - Filtros rápidos predefinidos
  - Configurar placeholder text
  - Analytics de búsquedas populares

#### Features:
- Autocompletado con Algolia/ElasticSearch
- Filtros: Ubicación, Tipo cocina, Precio, Puntuación
- Voice search compatibility
- Historial de búsquedas (para usuarios registrados)

---

### 3. 📝 **Reseñas Recientes**
**Prioridad:** ALTA
**Estado:** 🔄 Por implementar
**Objetivo:** Mostrar actividad del blog y contenido fresco

#### Frontend Components:
- `RecentReviews.tsx` (nuevo)
- `ReviewCard.tsx` ✅ (ya existe)

#### Admin Panel:
- **Configuración de reseñas recientes:**
  - Número de reseñas a mostrar (4, 6, 8)
  - Criterio de ordenación (fecha, popularidad, mixto)
  - Filtrar por categorías específicas
  - Programar destacados temporales

#### Logic:
- Fetch últimas X reseñas publicadas
- Lazy loading con infinite scroll
- Cache intelligent para performance

---

### 4. 🏆 **Top Rankings / Listas**
**Prioridad:** ALTA
**Estado:** 🔄 Por implementar
**Objetivo:** SEO long-tail y alto CTR

#### Frontend Components:
- `TopRankings.tsx` (nuevo)
- `RankingCard.tsx` (nuevo)
- `RankingList.tsx` (nuevo)

#### Admin Panel:
- **Gestión de rankings:**
  - Crear/editar listas temáticas
  - Ordenar establecimientos en cada lista
  - Programar rotación de listas destacadas
  - Analytics de clicks por ranking

#### Rankings Sugeridos:
- "Los 10 mejores para cenar en pareja"
- "Top 5 marisquerías tradicionales"
- "Los más económicos del centro"
- "Mejores terrazas con vistas"
- "Imprescindibles para turistas"

#### Sanity Schema:
```typescript
{
  name: 'ranking',
  title: 'Ranking/Lista',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'category', type: 'string' },
    { name: 'venues', type: 'array', of: [{ type: 'reference', to: 'venue' }] },
    { name: 'isFeatured', type: 'boolean' },
    { name: 'publishDate', type: 'datetime' }
  ]
}
```

---

### 5. 🗺️ **Mapa Interactivo de Coruña**
**Prioridad:** MEDIA-ALTA
**Estado:** 🔄 Por implementar
**Objetivo:** UX atractivo y refuerzo local

#### Frontend Components:
- `InteractiveMap.tsx` (nuevo)
- `MapVenuePopup.tsx` (nuevo)
- `MapFilters.tsx` (nuevo)

#### Admin Panel:
- **Gestión del mapa:**
  - Marcar/desmarcar establecimientos en mapa
  - Categorizar pins por colores
  - Gestionar rutas gastronómicas
  - Configurar zoom y centro inicial

#### Technical:
- MapBox o Google Maps API
- Clustering para performance
- Filtros por categoría en tiempo real
- Deep linking a reseñas específicas

---

### 6. 🏷️ **Categorías Temáticas**
**Prioridad:** ALTA
**Estado:** 🔄 Por implementar
**Objetivo:** SEO long-tail y navegación intuitiva

#### Frontend Components:
- `CategoryGrid.tsx` (nuevo)
- `CategoryCard.tsx` (nuevo)

#### Admin Panel:
- **Gestión de categorías:**
  - Crear/editar categorías personalizadas
  - Subir iconos/imágenes para cada categoría
  - Configurar orden de aparición
  - Analytics de clicks por categoría

#### Categorías Base:
- 🍤 Marisco
- 🍺 Tapas
- 🌱 Vegano
- 🍣 Sushi
- 🍕 Casual
- 💰 Económico
- 💎 Premium
- 🌅 Desayunos

---

### 7. 🤝 **Destacados / Colaboraciones**
**Prioridad:** MEDIA
**Estado:** 🔄 Por implementar
**Objetivo:** Monetización y partnerships

#### Frontend Components:
- `FeaturedPartners.tsx` (nuevo)
- `PartnerCard.tsx` (nuevo)

#### Admin Panel:
- **Gestión de colaboraciones:**
  - Agregar/editar partners
  - Programar promociones temporales
  - Control de visibilidad
  - Tracking de conversiones

#### Content Types:
- Restaurantes destacados del mes
- Ofertas especiales
- Entrevistas a chefs
- Eventos gastronómicos

---

### 8. 📍 **Guías de Coruña (Evergreen)**
**Prioridad:** MEDIA
**Estado:** 🔄 Por implementar
**Objetivo:** SEO turístico y contenido duradero

#### Frontend Components:
- `CityGuides.tsx` (nuevo)
- `GuideCard.tsx` (nuevo)

#### Admin Panel:
- **Gestión de guías:**
  - Crear rutas gastronómicas
  - Asociar establecimientos a rutas
  - Gestionar contenido evergreen
  - Programar actualizaciones

#### Guías Sugeridas:
- "Ruta de tapas por el casco histórico"
- "Los imprescindibles para turistas"
- "Coruña en 48 horas gastronómicas"
- "Especial familias con niños"

---

### 9. 💬 **Opiniones de la Comunidad**
**Prioridad:** MEDIA
**Estado:** 🔄 Por implementar
**Objetivo:** Social proof y engagement

#### Frontend Components:
- `CommunityReviews.tsx` (nuevo)
- `UserTestimonial.tsx` (nuevo)

#### Admin Panel:
- **Moderación de comunidad:**
  - Aprobar/rechazar comentarios
  - Destacar testimoniales
  - Gestionar sistema de puntuaciones
  - Reportes de actividad

---

### 10. 📧 **CTA Newsletter / Suscripción**
**Prioridad:** ALTA
**Estado:** ⏳ Existe básico
**Objetivo:** Retención y lista de correos

#### Frontend Components:
- `NewsletterCTA.tsx` ✅ (ya existe)
- Mejorar: `NewsletterForm.tsx`

#### Admin Panel:
- **Gestión de newsletter:**
  - Configurar textos de llamada
  - A/B testing de CTAs
  - Integración con Mailchimp/SendGrid
  - Analytics de conversión

---

### 11. 📰 **Blog Extra (Tips y Noticias)**
**Prioridad:** BAJA
**Estado:** 🔄 Por implementar
**Objetivo:** Contenido adicional y SEO

#### Frontend Components:
- `BlogExtra.tsx` (nuevo)
- `TipCard.tsx` (nuevo)

#### Admin Panel:
- **Gestión de contenido extra:**
  - Tips rápidos de cocina
  - Noticias gastronómicas locales
  - Programación de contenidos
  - Analytics de engagement

---

## 🛠️ Plan de Implementación

### Phase 1 - Core (2-3 semanas)
1. Hero + Carrusel ✅ (casi completo)
2. Buscador principal
3. Reseñas recientes
4. Newsletter mejorado

### Phase 2 - Navigation (2-3 semanas)
5. Top Rankings
6. Categorías temáticas
7. Admin panels básicos

### Phase 3 - Advanced (3-4 semanas)
8. Mapa interactivo
9. Guías de ciudad
10. Sistema de comunidad

### Phase 4 - Business (1-2 semanas)
11. Colaboraciones
12. Analytics avanzados
13. A/B testing
14. Performance optimization

---

## 📊 Métricas de Éxito

### SEO Metrics:
- Time on page > 2 minutos
- Bounce rate < 40%
- Pages per session > 3
- Core Web Vitals en verde

### UX Metrics:
- Click-through rate en CTAs > 5%
- Newsletter signup rate > 2%
- Search usage > 30% de visitantes
- Mobile usability score > 95

### Business Metrics:
- Partner clicks y conversiones
- Revenue attribution por sección
- Retention rate semanal
- Organic traffic growth 20% mensual

---

## 🔧 Technical Stack

### Frontend:
- Next.js 14 ✅
- TypeScript ✅
- Tailwind CSS ✅
- Framer Motion (animations)
- React Query (data fetching)

### Backend/CMS:
- Sanity CMS ✅
- Prisma (user data) ✅
- NextAuth ✅
- Vercel Analytics

### Third Party:
- MapBox (mapas)
- Algolia (search)
- Mailchimp (newsletter)
- Google Analytics

---

*Última actualización: 29 Agosto 2025*
*Estado general: 🚧 En construcción activa*
