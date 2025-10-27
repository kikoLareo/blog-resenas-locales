# Homepage Sections Manager - Refactor Completo

## 📋 Contexto y Objetivo

Refactorizar completamente el gestor de secciones del dashboard para permitir:
- Selección flexible de tipos de contenido por sección
- Gestión visual mediante popup/modal
- Selección múltiple de elementos específicos con drag & drop
- Visualización adaptativa según tipo de contenido

## 🎯 Requisitos Funcionales

### 1. Tipos de Sección (Layout)
Cada sección tendrá un **tipo visual/layout**:

- **Hero**: Layout actual con carrusel (solo este tiene carrusel)
- **Poster**: Card alargado horizontal (imagen + info lado a lado)
- **Poster V2**: Similar a Poster pero menos alto
- **Banner**: Formato 16:9 panorámico
- **Card Cuadrado**: Formato cuadrado 1:1

### 2. Tipos de Contenido
Cada sección puede mostrar múltiples tipos de contenido:

- **Venues/Locales** (restaurantes, cafés)
- **Reviews** (reseñas individuales)
- **Categorías** (tipos de cocina)
- **Ciudades**

**IMPORTANTE**: Se pueden seleccionar **varios tipos de contenido** en una misma sección.
Ejemplo: Una sección puede mostrar tanto Venues como Reviews mezclados.

### 3. Distribución/Layout
Opciones de visualización:
- **Grid**: Cuadrícula (2, 3 o 4 columnas)
- **Lista**: Una columna vertical
- **Carrusel**: Solo disponible para tipo Hero

### 4. Selección de Elementos
- Lista con **buscador** para filtrar elementos
- **Checkboxes** para seleccionar items
- **Drag & drop** para reordenar elementos seleccionados
- **Sin límite** de elementos seleccionados
- Por cada tipo de contenido seleccionado, aparece su lista correspondiente

### 5. Flujo de Edición
1. Usuario hace clic en botón **Settings** de una sección
2. Se abre **popup/modal** (NO panel lateral)
3. En el modal:
   - Campo: Título de sección
   - Campo: Subtítulo
   - Selector: Tipo de sección (Hero, Poster, Poster V2, Banner, Card Cuadrado)
   - Selector: Distribución (Grid/Lista/Carrusel)
   - **Multi-selector**: Tipos de contenido (Venues, Reviews, Categorías, Ciudades)
   - Por cada tipo seleccionado: Lista con buscador + checkboxes
   - Área de "Elementos seleccionados" con drag & drop para reordenar
   - Toggle: Mostrar imágenes
   - Toggle: Sección habilitada
4. Botón "Guardar" actualiza la sección
5. **NO hay campo "Número de elementos"** (se calcula automáticamente)

## 🗂️ Estructura de Datos

### Interface HomepageSection (Nueva)
```typescript
interface HomepageSection {
  id: string;
  title: string;                    // Título interno de la sección
  sectionType: 'hero' | 'poster' | 'poster-v2' | 'banner' | 'card-square';
  enabled: boolean;
  order: number;
  config: {
    title?: string;                 // Título visible
    subtitle?: string;
    layout: 'grid' | 'list' | 'carousel';
    gridColumns?: 2 | 3 | 4;      // Solo para layout grid
    showImages?: boolean;
    contentTypes: ('venue' | 'review' | 'category' | 'city')[];
    selectedItems: SelectedItem[];  // Items específicos seleccionados
  };
}

interface SelectedItem {
  id: string;                       // ID del documento en Sanity
  type: 'venue' | 'review' | 'category' | 'city';
  order: number;                    // Orden dentro de la sección
  title: string;                    // Título para mostrar en preview
  slug?: string;                    // Para construir URL
}
```

### Queries Sanity por Tipo
```groq
// Venues
*[_type == "venue"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  "city": city->title,
  "imageUrl": images[0].asset->url
}

// Reviews
*[_type == "review"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  "venue": venue->title,
  "imageUrl": heroImage.asset->url
}

// Categories
*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  "imageUrl": image.asset->url
}

// Cities
*[_type == "city"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  "imageUrl": heroImage.asset->url
}
```

## 🎨 Componentes Frontend

### Nuevos Componentes Necesarios

1. **SectionConfigModal.tsx**
   - Modal/Dialog completo
   - Formulario de configuración
   - Gestión de estado del formulario

2. **ContentTypeSelector.tsx**
   - Multi-selector de tipos de contenido
   - Muestra badges de tipos seleccionados

3. **ItemPickerList.tsx**
   - Lista de items disponibles por tipo
   - Buscador integrado
   - Checkboxes para selección
   - Paginación si hay muchos items

4. **SelectedItemsManager.tsx**
   - Lista de items seleccionados
   - Drag & drop para reordenar
   - Botón para eliminar items
   - Preview visual de cada item

5. **SectionPreview.tsx**
   - Preview de cómo se verá la sección
   - Renderiza según sectionType + layout

### Componentes de Visualización (Frontend Público)

Necesitaremos componentes para renderizar cada tipo de sección:

1. **HeroSection.tsx** - Ya existe, adaptar
2. **PosterSection.tsx** - Card horizontal alargado
3. **PosterV2Section.tsx** - Poster menos alto
4. **BannerSection.tsx** - Formato 16:9
5. **CardSquareSection.tsx** - Formato cuadrado

Cada uno debe poder renderizar cualquier tipo de contenido (venue, review, category, city).

## 🔄 API Endpoints

### GET /api/admin/homepage-sections
- Obtiene configuración actual de todas las secciones
- Incluye items seleccionados con sus datos básicos

### POST /api/admin/homepage-sections
- Guarda configuración completa de secciones
- Valida estructura de datos
- Retorna configuración guardada

### GET /api/admin/content/[type]
- Obtiene lista de items disponibles por tipo
- Parámetros: type (venue|review|category|city), search (opcional)
- Retorna array de items con datos básicos

## 📊 Base de Datos

### Tabla: HomepageSection (Prisma)
```prisma
model HomepageSection {
  id          String   @id @default(cuid())
  title       String
  sectionType String   // hero, poster, poster-v2, banner, card-square
  enabled     Boolean  @default(true)
  order       Int
  config      Json     // Almacena toda la configuración
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🎯 Beneficios de esta Arquitectura

1. **Flexibilidad total**: Cualquier sección puede mostrar cualquier tipo de contenido
2. **Control granular**: Selección específica de items, no solo queries automáticas
3. **Orden personalizado**: Drag & drop para ordenar elementos
4. **Preview visual**: El admin ve exactamente cómo quedará
5. **Escalable**: Fácil añadir nuevos tipos de sección o contenido
6. **Performance**: Solo se cargan los items seleccionados

## ⚠️ Consideraciones Técnicas

### Migración de Datos
- Las secciones actuales usan `itemCount` y queries automáticas
- Necesitamos migrar a selección explícita de items
- Script de migración para convertir configuración antigua

### Caché y Revalidación
- ISR con revalidate en homepage
- Invalidar caché al guardar cambios en secciones
- Considerar cache de lista de items disponibles

### Performance
- Lazy loading de listas largas (>100 items)
- Debounce en buscador (300ms)
- Virtualización si hay +500 items

### UX
- Loading states en todas las operaciones
- Confirmación antes de eliminar sección
- Validación: al menos 1 tipo de contenido seleccionado
- Máximo de secciones activas (ej: 10)

## 📝 Notas de Implementación

- **NO usar datos mockeados**: Todo debe venir de Sanity
- **NO atajos**: Implementar completo aunque sea complejo
- **Consultar antes de asumir**: Si algo no está claro, preguntar
- **Testing**: Probar con datos reales en cada paso
- **Commits atómicos**: Cada subtarea = 1 commit

---

Fecha: 27 Octubre 2025
Estado: Planificación completa
