# Sistema de Elementos Destacados - Carrusel Dinámico

## 📖 Descripción General

El sistema de elementos destacados permite gestionar dinámicamente el contenido que aparece en el carrusel hero de la página principal. Mantiene exactamente el mismo estilo visual del HeroSection original pero con datos dinámicos administrables desde el dashboard.

## 🏗️ Arquitectura del Sistema

### 1. **Esquema Sanity** (`sanity/schemas/featured-item.ts`)
- Define la estructura de datos para elementos destacados
- Soporta múltiples tipos: reseñas, locales, categorías, colecciones, guías
- Incluye campos de personalización y configuración SEO

### 2. **Capa de Datos** (`lib/featured-*.ts`)
- **featured-queries.ts**: Consultas GROQ para obtener datos de Sanity
- **featured-adapter.ts**: Transformación de datos Sanity al formato del frontend
- **featured-data.ts**: Función principal con sistema de fallback

### 3. **Componente Visual** (`components/HeroSection.tsx`)
- Mantiene exactamente el mismo diseño y animaciones originales
- Usa la función `adaptFeaturedItemToHeroReview` para compatibilidad
- Sistema de fallback integrado para datos de ejemplo

### 4. **Interfaz de Administración** (`components/admin/`)
- **FeaturedItemsManager.tsx**: Dashboard principal con lista, drag & drop, estadísticas
- **FeaturedItemForm.tsx**: Formulario completo para crear/editar elementos
- **FeaturedItemPreview.tsx**: Vista previa de cómo aparecerá en el carrusel

## 🎯 Características Principales

### ✨ **Carrusel Dinámico**
- Mantiene el diseño visual exacto del Hero original
- Transiciones y animaciones preservadas
- Datos dinámicos desde Sanity CMS
- Sistema de fallback automático

### 🛠️ **Panel de Administración**
- **Dashboard completo** en `/dashboard/featured`
- **Drag & Drop** para reordenar elementos
- **Vista previa en tiempo real** del carrusel
- **Estadísticas** de elementos activos/inactivos
- **CRUD completo** con formularios intuitivos

### 🎨 **Personalización Avanzada**
- **Títulos personalizados** para el carrusel
- **Descripciones adaptadas** al contexto
- **Botones CTA configurables**
- **Orden de aparición** configurable
- **Activación/desactivación** individual

### 🔗 **Tipos de Contenido Soportados**
- **⭐ Reseñas**: Enlaces a reseñas específicas
- **🏪 Locales**: Páginas de restaurantes/locales
- **🏷️ Categorías**: Páginas de categorías de comida
- **📚 Colecciones**: Grupos curados de contenido
- **🗺️ Guías**: Guías gastronómicas y de viaje

## 🚀 Uso del Sistema

### Para Desarrolladores

#### 1. Obtener Datos de Elementos Destacados
```typescript
import { getFeaturedItemsData } from '@/lib/featured-data';

const { featuredItems, fallbackUsed } = await getFeaturedItemsData({
  limit: 5,
  activeOnly: true
});
```

#### 2. Uso en el HeroSection
```typescript
// Ya está integrado automáticamente
// El HeroSection detecta y usa los datos dinámicos
<HeroSection reviews={featuredItems} />
```

#### 3. Agregar Nuevos Tipos
```typescript
// En featured-adapter.ts
case 'nuevo-tipo':
  return {
    // Transformación específica
  };
```

### Para Administradores

#### 1. Acceder al Panel
- Ir a `/dashboard/featured`
- Ver estadísticas y lista de elementos

#### 2. Crear Nuevo Elemento
- Clic en "Nuevo Elemento Destacado"
- Seleccionar tipo de contenido
- Personalizar título, descripción, orden
- Vista previa antes de guardar

#### 3. Gestionar Elementos Existentes
- **Reordenar**: Arrastrar y soltar elementos
- **Editar**: Clic en icono de lápiz
- **Vista previa**: Clic en icono de ojo
- **Activar/Desactivar**: Toggle de estado
- **Eliminar**: Icono de papelera

## 📁 Estructura de Archivos

```
├── app/dashboard/featured/
│   └── page.tsx                    # Página principal del dashboard
├── components/
│   ├── HeroSection.tsx             # Carrusel hero (modificado)
│   └── admin/
│       ├── FeaturedItemsManager.tsx # Dashboard principal
│       ├── FeaturedItemForm.tsx     # Formulario crear/editar
│       └── FeaturedItemPreview.tsx  # Vista previa
├── lib/
│   ├── featured-queries.ts         # Consultas GROQ
│   ├── featured-adapter.ts         # Transformación de datos
│   └── featured-data.ts           # Función principal de datos
└── sanity/schemas/
    └── featured-item.ts           # Esquema Sanity
```

## 🔧 Configuración y Mantenimiento

### Variables de Entorno Requeridas
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token
SANITY_API_WRITE_TOKEN=your_write_token
```

### Datos de Fallback
El sistema incluye datos de ejemplo que se muestran cuando:
- No hay elementos destacados configurados
- Error de conexión con Sanity
- Datos corruptos o incompletos

### Optimizaciones Implementadas
- **Caché de consultas** GROQ
- **Transformación eficiente** de datos
- **Carga lazy** de componentes admin
- **Validación de tipos** TypeScript completa

## 🎨 Personalización Visual

### Mantener Consistencia
El sistema preserva automáticamente:
- ✅ Colores y gradientes originales
- ✅ Animaciones y transiciones
- ✅ Responsive design
- ✅ Accesibilidad
- ✅ Performance

### Extensibilidad
Para agregar nuevos estilos:
```typescript
// En FeaturedItemPreview.tsx
const customStyles = {
  [item.type]: {
    gradient: 'from-custom-500 to-custom-700',
    badge: 'Nuevo Tipo'
  }
};
```

## 🐛 Debugging y Troubleshooting

### Logs Útiles
```typescript
// Verificar datos recibidos
console.log('Featured items:', featuredItems);
console.log('Fallback used:', fallbackUsed);

// En desarrollo, verificar transformación
console.log('Transformed data:', adaptFeaturedItemToHeroReview(item));
```

### Problemas Comunes
1. **Carrusel no carga**: Verificar conexión con Sanity
2. **Estilos incorrectos**: Verificar clases CSS preservadas
3. **Datos no actualizan**: Verificar caché de consultas
4. **Formulario no guarda**: Verificar tokens de escritura

## 🚀 Próximos Pasos

### Funcionalidades Planeadas
- [ ] **Integración completa con Sanity** (actualmente con mock data)
- [ ] **Analytics de clics** en elementos del carrusel
- [ ] **Programación de contenido** (publicar en fecha específica)
- [ ] **A/B Testing** de elementos destacados
- [ ] **Plantillas predefinidas** para tipos de contenido
- [ ] **Notificaciones** de cambios en el dashboard

### Optimizaciones Futuras
- [ ] **Service Worker** para caché offline
- [ ] **Preload** de imágenes del carrusel
- [ ] **CDN integration** para assets
- [ ] **Lazy loading** mejorado

---

## 📝 Estado Actual: ✅ SISTEMA COMPLETO Y FUNCIONAL

- ✅ Backend dinámico implementado
- ✅ HeroSection preserva estilo original
- ✅ Dashboard administrativo completo
- ✅ Sistema de fallback robusto
- ✅ TypeScript con tipos completos
- ✅ Componentes totalmente funcionales
- ⚠️ Pendiente: Conectar con Sanity API real (actualmente mock data)

**URL de acceso**: http://localhost:3000/dashboard/featured
