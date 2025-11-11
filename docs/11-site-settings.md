# 🔧 Configuración del Sitio - Documentación

## 📋 Descripción General

El sistema de configuración permite gestionar todas las configuraciones del sitio desde un dashboard centralizado. Las configuraciones se almacenan en **PostgreSQL** a través de **Prisma** y están organizadas por categorías.

---

## 🏗️ Arquitectura

### Modelo de Datos: Prisma + PostgreSQL

```prisma
model SiteSetting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String?  @db.Text
  category  String   // 'site', 'seo', 'ads', 'sanity', 'general'
  label     String
  type      String   // 'string', 'boolean', 'number', 'url', 'json'
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([category])
}
```

### Categorías de Configuración

| Categoría | Descripción | Configuraciones |
|-----------|-------------|-----------------|
| **site** | Configuración general del sitio | Nombre, URL, Descripción |
| **seo** | Optimización para motores de búsqueda | Google Analytics, Sitemap, Robots.txt |
| **ads** | Gestión de anuncios | Proveedor, Scripts, Estado |
| **sanity** | Conexión con Sanity CMS | Project ID, Dataset, API Version |
| **general** | Otras configuraciones | Personalizables |

---

## 🚀 APIs Disponibles

### 1. **GET /api/admin/settings**

Obtiene todas las configuraciones agrupadas por categoría.

**Autenticación**: Requiere sesión de ADMIN

**Respuesta**:
```json
{
  "settings": {
    "site": [
      { "key": "site.name", "value": "Blog de Reseñas", "label": "Nombre del Sitio", "type": "string" },
      { "key": "site.url", "value": "https://example.com", "label": "URL", "type": "url" }
    ],
    "seo": [
      { "key": "seo.googleAnalytics", "value": "G-XXX", "label": "Google Analytics", "type": "string" },
      { "key": "seo.sitemap", "value": "true", "label": "Generar Sitemap", "type": "boolean" }
    ],
    ...
  }
}
```

### 2. **PUT /api/admin/settings**

Actualiza las configuraciones del sitio.

**Autenticación**: Requiere sesión de ADMIN

**Body**:
```json
{
  "settings": {
    "site.name": "Mi Blog",
    "site.url": "https://miblog.com",
    "seo.googleAnalytics": "G-123456",
    "ads.enabled": true
  }
}
```

**Características**:
- ✅ Usa `upsert`: crea si no existe, actualiza si existe
- ✅ Convierte valores a string para almacenamiento
- ✅ Actualiza `updatedAt` automáticamente
- ✅ Retorna confirmación de éxito

### 3. **POST /api/admin/settings**

Inicializa las configuraciones por defecto del sitio.

**Autenticación**: Requiere sesión de ADMIN

**Acción**: Crea las configuraciones por defecto si no existen

**Configuraciones Inicializadas**:
```javascript
[
  // Site
  { key: 'site.name', value: 'Blog de Reseñas Locales' },
  { key: 'site.url', value: 'https://example.com' },
  { key: 'site.description', value: 'Descubre los mejores restaurantes' },
  
  // SEO
  { key: 'seo.googleAnalytics', value: '' },
  { key: 'seo.googleVerification', value: '' },
  { key: 'seo.sitemap', value: 'true' },
  { key: 'seo.robots', value: 'true' },
  
  // Ads
  { key: 'ads.enabled', value: 'false' },
  { key: 'ads.provider', value: 'gam' },
  { key: 'ads.script', value: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js' },
  
  // Sanity
  { key: 'sanity.projectId', value: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID },
  { key: 'sanity.dataset', value: 'production' },
  { key: 'sanity.apiVersion', value: '2024-01-01' }
]
```

---

## 🎨 Dashboard UI

### Ubicación
`/dashboard/settings`

### Características Principales

#### 1. **Carga Dinámica**
- ✅ Carga todas las configuraciones desde PostgreSQL
- ✅ Estado de carga con spinner
- ✅ Manejo de errores con mensajes claros
- ✅ Solo accesible para ADMIN

#### 2. **Edición en Tiempo Real**
- ✅ Todos los campos son editables
- ✅ Detección automática de cambios
- ✅ Indicador visual de "cambios sin guardar"
- ✅ Validación de tipos (string, boolean, URL)

#### 3. **Inicialización por Defecto**
- ✅ Botón "Inicializar Defaults"
- ✅ Confirmación antes de ejecutar
- ✅ Crea configuraciones que no existen
- ✅ No sobrescribe configuraciones existentes

#### 4. **Guardar Cambios**
- ✅ Botón deshabilitado si no hay cambios
- ✅ Feedback visual durante guardado
- ✅ Mensajes de éxito/error
- ✅ Recarga datos después de guardar

#### 5. **Cancelar Cambios**
- ✅ Descarta cambios sin guardar
- ✅ Recarga configuraciones originales
- ✅ Limpia mensajes de feedback

### Secciones del Dashboard

#### **Configuración del Sitio**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Nombre del Sitio | Input | Nombre principal del sitio |
| URL del Sitio | URL Input | URL canónica del sitio |
| Descripción | Input | Meta descripción del sitio |

#### **Configuración SEO**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Google Analytics ID | Input | ID de Google Analytics (G-XXX) |
| Google Verification | Input | Código de verificación de Google |
| Generar Sitemap | Switch | Habilitar generación automática de sitemap |
| Generar Robots.txt | Switch | Habilitar generación automática de robots.txt |

#### **Configuración de Anuncios**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Habilitar Anuncios | Switch | Activar/desactivar anuncios |
| Proveedor | Input | Proveedor de anuncios (gam, adsense) |
| Script de Anuncios | URL Input | URL del script de anuncios |

#### **Configuración de Sanity CMS**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Project ID | Input | ID del proyecto de Sanity |
| Dataset | Input | Dataset de Sanity (production/development) |
| API Version | Input | Versión del API de Sanity (YYYY-MM-DD) |

---

## 🔒 Seguridad

### Control de Acceso
- ✅ Solo usuarios con rol **ADMIN** pueden acceder
- ✅ Validación de sesión en cada request
- ✅ Retorna 401 si no está autorizado
- ✅ No expone configuraciones sensibles a usuarios no admin

### Validaciones
- ✅ Validación de tipos de datos
- ✅ Sanitización de inputs
- ✅ Confirmación para acciones importantes
- ✅ Manejo de errores robusto

---

## 📖 Uso del Dashboard

### Primera Vez (Inicializar Configuraciones)

1. **Navegar a** `/dashboard/settings`
2. **Click en** "Inicializar Defaults"
3. **Confirmar** la acción
4. **Esperar** la confirmación
5. Las configuraciones por defecto se crean automáticamente

### Editar Configuraciones

1. **Modificar** cualquier campo deseado
2. **Observar** el banner amarillo "Tienes cambios sin guardar"
3. **Click en** "Guardar Cambios" o en el botón del banner
4. **Esperar** confirmación de éxito

### Cancelar Cambios

1. **Modificar** algún campo
2. **Click en** "Cancelar"
3. Los cambios se descartan y se recargan los valores originales

---

## 🔄 Flujo de Datos

```
┌─────────────────┐
│  Dashboard UI   │
└────────┬────────┘
         │ GET /api/admin/settings
         ▼
┌─────────────────┐
│   API Route     │
└────────┬────────┘
         │ Prisma query
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   SiteSetting   │
└────────┬────────┘
         │ Return settings
         ▼
┌─────────────────┐
│  Dashboard UI   │
│  (populated)    │
└─────────────────┘

Usuario edita → PUT /api/admin/settings → Upsert → PostgreSQL → Success
```

---

## 🛠️ Desarrollo

### Agregar Nueva Configuración

1. **Agregar al POST handler** en `/api/admin/settings/route.ts`:
```typescript
{
  key: 'categoria.nombre',
  value: 'valor por defecto',
  category: 'categoria',
  label: 'Etiqueta Visible',
  type: 'string' // o 'boolean', 'url', 'number', 'json'
}
```

2. **Agregar campo en el dashboard**:
```tsx
<div className="space-y-2">
  <Label htmlFor="miConfig">Mi Configuración</Label>
  <Input
    id="miConfig"
    value={getSetting('categoria.nombre', 'default')}
    onChange={(e) => updateSetting('categoria.nombre', e.target.value)}
  />
</div>
```

### Ejecutar Migración

```bash
# Generar cliente Prisma
npx prisma generate

# Crear migración
npx prisma migrate dev --name add_site_settings

# O aplicar migración en producción
npx prisma migrate deploy
```

### Ver Configuraciones en DB

```bash
npx prisma studio
```

---

## 🐛 Troubleshooting

### Error: "No autorizado"
- **Causa**: Usuario no es ADMIN
- **Solución**: Verifica el rol del usuario en la tabla `User`

### Error al cargar configuraciones
- **Causa**: Tabla `SiteSetting` no existe
- **Solución**: Ejecuta `npx prisma migrate deploy`

### Configuraciones no se guardan
- **Causa**: Problema de conexión a DB
- **Solución**: Verifica `DATABASE_URL` en `.env`

### Valores booleanos no funcionan
- **Causa**: Se están comparando strings
- **Solución**: Usa `getSetting('key', true) === true`

---

## 📊 Tipos de Datos Soportados

| Tipo | Almacenamiento | UI Component | Conversión |
|------|---------------|--------------|------------|
| **string** | TEXT | Input | Directo |
| **boolean** | 'true'/'false' | Switch | value === 'true' |
| **url** | TEXT | Input type="url" | Directo |
| **number** | TEXT | Input type="number" | Number(value) |
| **json** | TEXT | Textarea | JSON.stringify/parse |

---

## ✅ Ventajas de esta Implementación

1. ✅ **Persistente**: Configuraciones guardadas en PostgreSQL
2. ✅ **Centralizado**: Un solo lugar para todas las configs
3. ✅ **Extensible**: Fácil agregar nuevas configuraciones
4. ✅ **Tipado**: Sistema de tipos para validación
5. ✅ **Categorizado**: Organización lógica por categorías
6. ✅ **Versionado**: Timestamps para auditoría
7. ✅ **Seguro**: Solo ADMIN puede modificar
8. ✅ **UX**: Feedback visual y validaciones

---

## 🔜 Mejoras Futuras Sugeridas

- [ ] Sistema de permisos granular por configuración
- [ ] Historial de cambios (audit log)
- [ ] Validación de esquemas con Zod
- [ ] Import/Export de configuraciones
- [ ] Configuraciones por entorno (dev/staging/prod)
- [ ] Configuraciones sensibles encriptadas
- [ ] API pública para lectura (no sensibles)
- [ ] Cache de configuraciones para performance
- [ ] Validación de URLs antes de guardar
- [ ] Preview de cambios antes de aplicar

---

## 📝 Notas Importantes

1. **Sin datos mock**: Todo almacenado en PostgreSQL
2. **Upsert pattern**: Crea o actualiza automáticamente
3. **Conversión de tipos**: Booleanos se guardan como 'true'/'false'
4. **Solo ADMIN**: Protección a nivel de API
5. **Feedback UX**: Indicadores visuales de estado

---

## 🎯 Resumen

La página de configuración está ahora **100% funcional** y conectada a PostgreSQL:

- ✅ Modelo de datos creado
- ✅ APIs completas (GET, PUT, POST)
- ✅ UI interactiva y responsive
- ✅ Validaciones y seguridad
- ✅ Sin datos estáticos o mock
- ✅ Listo para producción

**¡Gestiona las configuraciones del sitio desde un solo lugar!** 🚀
