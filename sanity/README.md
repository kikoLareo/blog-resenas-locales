# 🍽️ Sanity CMS - Blog de Reseñas de Locales

Configuración completa de Sanity Studio v3 para el blog de reseñas de restaurantes y locales gastronómicos.

## 📁 Estructura de Archivos

```
sanity/
├── schemas/           # Esquemas de contenido
│   ├── index.ts      # Exportación y configuración de esquemas
│   ├── venue.ts      # Locales/restaurantes
│   ├── review.ts     # Reseñas con ratings y FAQ
│   ├── post.ts       # Crónicas y artículos del blog
│   ├── city.ts       # Ciudades con geolocalización
│   └── category.ts   # Categorías de restaurantes
├── desk/             # Configuración del escritorio
│   └── structure.ts  # Estructura personalizada del CMS
├── lib/              # Utilidades y queries
│   └── queries.ts    # Queries GROQ optimizadas
└── README.md         # Esta documentación
```

## 🏗️ Esquemas Implementados

### 🏪 Venue (Local/Restaurante)
**Campos principales:**
- Información básica (título, slug, descripción)
- Ubicación (ciudad, dirección, coordenadas GPS)
- Contacto (teléfono, web, redes sociales)
- Detalles (horarios, rango de precios, categorías)
- Galería de imágenes con hotspot
- Optimización SEO y Schema.org

### ⭐ Review (Reseña)
**Características especiales:**
- Sistema de ratings (comida, servicio, ambiente, calidad-precio)
- TL;DR optimizado para AEO (50-75 palabras)
- FAQ estructurado para SEO (3-5 preguntas)
- Pros/contras y platos destacados
- Galería de fotos de la experiencia
- Ticket medio y fecha de visita

### 📝 Post (Crónica/Artículo)
**Funcionalidades:**
- Contenido rico con bloques personalizados
- FAQ opcional para artículos
- Posts destacados para homepage
- Locales relacionados
- Tiempo de lectura estimado
- Sistema de etiquetas

### 🏙️ City (Ciudad)
**Datos geográficos:**
- Coordenadas GPS del centro
- Región/comunidad autónoma
- Población y códigos postales
- Especialidades gastronómicas
- Lugares destacados
- Galería de imágenes

### 🏷️ Category (Categoría)
**Optimizado para restaurantes:**
- Tipos de cocina asociados
- Rango de precios típico
- Iconos y colores personalizados
- Schema.org específico
- Orden personalizable

## 🎨 Estructura del CMS

La configuración del escritorio está organizada en secciones intuitivas:

### 📝 Contenido Principal
- **Reseñas**: Ordenadas por fecha de visita
- **Crónicas/Posts**: Con filtros por destacados y FAQ

### 🏪 Locales y Ubicaciones
- **Locales**: Vista general y filtros por ciudad/precio
- **Ciudades**: Gestión de ubicaciones

### 🏷️ Categorías y Clasificación
- Gestión de categorías con destacados

### 📊 Análisis y Reportes
- Mejores valoradas (ratings ≥ 8)
- Publicaciones recientes (últimos 30 días)
- Locales sin reseñas

### ➕ Crear Nuevo
- Acceso rápido para crear contenido

## 🔍 Queries GROQ Incluidas

El archivo `lib/queries.ts` incluye queries optimizadas para:

- **Páginas principales**: Homepage, listados, detalles
- **Búsqueda y filtros**: Por ciudad, categoría, texto
- **SEO**: Sitemaps, JSON-LD
- **Análisis**: Top reviews, estadísticas

## 🚀 Configuración del Studio

### Plugins Incluidos
- **Structure Tool**: Navegación personalizada
- **Color Input**: Selector de colores para categorías
- **Orderable Document List**: Ordenar categorías
- **Vision Tool**: Queries GROQ (solo desarrollo)

### Características Avanzadas
- **Vistas previas personalizadas** para cada tipo de contenido
- **URLs de producción** configurables
- **Logo personalizado** del studio
- **Filtros de búsqueda** por tipo de contenido

## 📱 Responsive y UX

- **Grupos organizados** en pestañas para mejor navegación
- **Validaciones estrictas** para mantener calidad del contenido
- **Previews informativos** con badges y metadatos
- **Iconos descriptivos** para identificación rápida

## 🔧 Configuración Requerida

### Variables de Entorno
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

### Dependencias Adicionales
```json
{
  "@sanity/color-input": "^3.x",
  "@sanity/orderable-document-list": "^1.x"
}
```

## 💡 Características SEO

### Optimizaciones Implementadas
- **Schema.org** completo para locales y reseñas
- **FAQ Schema** para AEO (Answer Engine Optimization)
- **TL;DR** optimizado para asistentes de voz
- **Meta títulos y descripciones** personalizables
- **Slugs automáticos** para URLs amigables

### JSON-LD Ready
Los esquemas están preparados para generar:
- `LocalBusiness` / `Restaurant` para locales
- `Review` para reseñas
- `FAQPage` para preguntas frecuentes
- `Article` para posts/crónicas

## 🎯 Casos de Uso

### Para Editores
1. **Crear reseña completa** con ratings y FAQ
2. **Gestionar locales** con información detallada
3. **Escribir crónicas** con contenido rico
4. **Organizar por categorías** y ciudades

### Para Desarrolladores
1. **Queries optimizadas** listas para usar
2. **Tipos TypeScript** generables automáticamente
3. **URLs de preview** configuradas
4. **Estructura de datos** normalizada

## 📈 Escalabilidad

La configuración está diseñada para crecer:
- **Múltiples ciudades** con gestión independiente
- **Categorías extensibles** con nuevos tipos de cocina
- **Sistema de ratings** adaptable
- **Contenido multiidioma** preparado

## 🔄 Próximas Mejoras

- [ ] Plugin de traducción multiidioma
- [ ] Integración con Google Maps
- [ ] Sistema de reservas
- [ ] Análisis de sentimientos en reseñas
- [ ] Integración con redes sociales

---

**Creado por SANITY-ARCHITECT** - Configuración completa y lista para producción 🚀