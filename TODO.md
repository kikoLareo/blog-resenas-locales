# TODO - Dashboard Administrativo

## 🚨 CRÍTICO - Errores que impiden funcionamiento

### Reseñas
- [x] **Error en nueva reseña**: Redirige a `/dashboard/reviews/new` pero muestra "Reseña no encontrada"
- [x] **Error en editar reseña**: Stack trace de React con errores de validación de propiedades
- [x] **Duplicación de botones**: Muestra "Ver | Ver" en lugar de "Editar | Ver"

### Locales
- [x] **Error en editar local**: Stack trace de React con errores de renderizado
- [x] **Botón "Nuevo Local" no funciona**: No redirige correctamente

### Ciudades
- [x] **Error en detalle de ciudad**: Stack trace de React que impide acceso
- [x] **Duplicación de botones**: Muestra "Ver | Ver" en lugar de "Editar | Ver"

### Categorías
- [x] **Botón "Nueva Categoría" no funciona**: No redirige correctamente
- [x] **Botón "Ver" no funciona**: No redirige a la página de detalle

### Blog
- [x] **Página de editar blog no existe**: Redirige a página inexistente

## 🎨 UI/UX - Problemas de interfaz

### Hover y botones
- [x] **Hover en botones**: Texto se vuelve blanco y no se ve
- [x] **Botones de acción**: Mejorar visibilidad y contraste

### Listas compactas
- [x] **Reseñas**: Cada fila ocupa demasiado espacio, hacer más compacta
- [x] **Locales**: Cada fila ocupa demasiado espacio, hacer más compacta  
- [x] **Ciudades**: Cada fila ocupa demasiado espacio, hacer más compacta
- [x] **Categorías**: Cada fila ocupa demasiado espacio, hacer más compacta

### Filtros y búsqueda
- [x] **Reseñas**: Añadir buscador y filtros
- [x] **Locales**: Añadir buscador y filtros
- [x] **Ciudades**: Añadir buscador y filtros
- [x] **Categorías**: Añadir buscador y filtros

## 🔗 Navegación y enlaces

### Reseñas
- [x] **Click en reseña**: Debe redirigir a página de detalle de la reseña
- [ ] **Enlaces de reseñas**: Corregir redirección a páginas públicas

### Locales
- [x] **Click en reseña**: Debe redirigir a página de detalle de la reseña
- [ ] **Distribución de página**: Revisar y mejorar layout de detalle

## 🖼️ Gestión de imágenes

### Foto destacada
- [x] **Reseñas**: Permitir elegir foto destacada
- [x] **Locales**: Permitir elegir foto de cabecera
- [x] **Todas las entidades**: Permitir elegir foto principal

## 🆕 Nuevas funcionalidades

### QR para locales
- [x] **Generador de QR**: Crear sistema para generar QR de acceso a locales
- [x] **Página sin header/sidebar**: Página especial para que locales añadan información
- [x] **Acceso limitado**: Sistema de permisos temporales para locales
- [x] **Reactivación**: Sistema para reactivar acceso temporal

## 🌐 Frontend público

### Páginas de reseñas
- [x] **404 en reseñas públicas**: `/madrid/pizzeria-tradizionale/review/pizza-masa-madre-48h-madrid` da 404

## 📝 Documentación

### Diferencias entre entidades
- [x] **Reseña vs Blog**: Documentar diferencias y casos de uso
- [x] **Estructura de datos**: Documentar relaciones entre entidades

## 🔧 Prioridades

### Alta prioridad (bloquean funcionamiento)
1. Errores de React que impiden acceso a páginas
2. Botones que no funcionan (nuevo, editar, ver)
3. 404 en páginas públicas

### Media prioridad (afectan UX)
1. Duplicación de botones
2. Hover en botones
3. Listas compactas
4. Filtros y búsqueda

### Baja prioridad (nuevas funcionalidades)
1. Sistema QR para locales
2. Gestión de fotos destacadas
3. Documentación

## 📋 Estado actual
- ✅ Next 15 + React 19 migrado
- ✅ Sanity Studio configurado
- ✅ Estructura básica del dashboard
- ✅ Autenticación configurada
- ❌ Múltiples errores de React en páginas de detalle
- ❌ Botones duplicados y no funcionales
- ❌ Falta de filtros y búsqueda

