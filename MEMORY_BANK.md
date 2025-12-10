# Memory Bank: Correcciones y Mejoras - SaborLocal

Este documento sirve como registro central de los errores detectados, el plan de corrección y el estado actual del proyecto.

## Estado del Proyecto
**Fecha de inicio:** 10 de Diciembre, 2025
**Estado Global:** 🔴 En Progreso (Análisis inicial y planificación)

## Sistema de Seguimiento
- 🔴 **Pendiente**: No iniciado.
- 🟡 **En Progreso**: Se está trabajando en ello.
- 🟢 **Completado**: Corregido y verificado.
- 🔵 **Verificado**: Confirmado por el usuario (opcional).

---

## 1. Rutas y Navegación (Critical)

### 1.1. Rutas 404 Principales
- [ ] **Top Reseñas (`/top-resenas`)**: La ruta no existe.
    - *Acción*: Crear página `app/top-resenas/page.tsx` o corregir enlace en menú.
- [ ] **Contacto (`/contact` vs `/contacto`)**: Enlace apunta a `/contact` (404), debería ser `/contacto`.
    - *Acción*: Corregir enlaces en navegación/footer.
- [ ] **Detalle de Reseña (`/review/...`)**: Botón "Leer más" lleva a 404.
    - *Acción*: Crear ruta dinámica `app/review/[id]/page.tsx` o ajustar enlace.

### 1.2. Enlaces Rotos a Locales
- [ ] **Enlaces en Sliders/Tarjetas**: "Greca Bar A Coruña", "Lateral Castellana", etc. llevan a 404.
    - *Acción*: Verificar generación de slugs y enlaces en componentes de tarjeta.
- [ ] **Enlaces Muertos**: "Milá Milanesería" no tiene enlace.
    - *Acción*: Revisar componente de tarjeta para asegurar que siempre haya un enlace válido.

### 1.3. Slugs de Ciudades Inconsistentes
- [ ] **Normalización de Slugs**: `Coru-a`, `A-coruna`.
    - *Acción*: Implementar función de normalización de slugs y redirigir o corregir datos en Sanity.
- [ ] **Datos Incorrectos**: Local "Café con Encanto" en ciudad incorrecta.
    - *Acción*: Corregir datos en CMS/Sanity o filtro de consulta.

---

## 2. Funcionalidad

### 2.1. Buscador
- [ ] **Barra de Búsqueda Inerte**: No hace nada al pulsar Enter.
    - *Acción*: Implementar lógica de búsqueda (redirección a `/search?q=...` o filtrado en tiempo real).

### 2.2. Sistema de Reseñas
- [ ] **Creación de Reseñas**: No hay formulario para dejar reseñas.
    - *Acción*: Crear componente de formulario y Server Action/API endpoint para guardar en Sanity.
- [ ] **Cálculo de Valoración**: Muestra `0.0` o `NaN`.
    - *Acción*: Revisar lógica de cálculo de promedio en componentes o hooks.

### 2.3. Formulario de Contacto
- [ ] **Feedback de Envío**: No hay mensaje de éxito/error tras enviar.
    - *Acción*: Implementar gestión de estado (loading, success, error) en el formulario de contacto.

---

## 3. Contenido y Datos

### 3.1. Limpieza de Datos
- [ ] **Marcadores de Citación**: Textos como `[272925892707324†screenshot]`.
    - *Acción*: Crear utilidad para limpiar strings o corregir en fuente de datos.
- [ ] **Imágenes**: Imágenes rotas o irrelevantes.
    - *Acción*: Implementar fallback de imagen y revisar mapeo de imágenes de Sanity.

### 3.2. Coherencia
- [ ] **Valoraciones NaN**: En listas de "Últimas reseñas".
    - *Acción*: Corregir lógica de visualización cuando no hay datos numéricos válidos.
- [ ] **Etiquetas y Categorías**: Errores tipográficos y enlaces cruzados incorrectos (Tapas -> Fine Dining).
    - *Acción*: Revisar datos en Sanity y enlaces en componentes de Categorías.

---

## 4. UX y Diseño

### 4.1. Información Visual
- [ ] **Paneles Vacíos**: Información de contacto/horario vacía en locales.
    - *Acción*: Ocultar secciones vacías o mostrar mensaje "Información no disponible".
- [ ] **Estructura Semántica**: Enlaces de categorías en Home no alineados.
    - *Acción*: Revisar CSS/Grid en sección de categorías.

### 4.2. Feedback
- [ ] **Confirmaciones**: Falta feedback visual en acciones de usuario.
    - *Acción*: Añadir Toasts o mensajes de estado global.

---

## Plan de Implementación

### Fase 1: Estructura y Rutas (Prioridad Alta)
1. Corregir enlaces de navegación (Contacto, Top Reseñas).
2. Asegurar que las rutas dinámicas de locales y reseñas existan.
3. Normalizar slugs de ciudades.

### Fase 2: Funcionalidad Core (Prioridad Alta)
1. Activar barra de búsqueda.
2. Implementar feedback en formulario de contacto.
3. Arreglar cálculo de valoraciones.

### Fase 3: Datos y Contenido (Prioridad Media)
1. Limpiar marcadores de texto.
2. Arreglar imágenes y fallbacks.
3. Corregir datos de categorías y ciudades.

### Fase 4: UX y Mejoras (Prioridad Baja)
1. Implementar formulario de creación de reseñas.
2. Mejorar diseño de paneles vacíos.
3. Añadir feedback visual (Toasts).
