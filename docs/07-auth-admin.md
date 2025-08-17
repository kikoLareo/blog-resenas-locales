## 07. Autenticación y Panel Admin ✅

### Implementado

- ✅ Auth.js (NextAuth) en modo JWT (sin base de datos)
- ✅ OAuth con Google y GitHub
- ✅ Allowlist de emails para control de acceso
- ✅ Sistema de roles (ADMIN, EDITOR) por email
- ✅ Rutas protegidas `/admin` con middleware
- ✅ Dashboard con estadísticas reales de Sanity
- ✅ Páginas de gestión de contenido conectadas a Sanity
- ✅ Sistema de autenticación completo
- ✅ Integración completa con Sanity CMS
- ✅ Arquitectura simplificada y eficiente

### Arquitectura Recomendada

#### Características Principales
- **Sin Base de Datos**: Modo JWT para 2-10 administradores
- **OAuth Social**: Google y GitHub para autenticación segura
- **Allowlist de Emails**: Control granular de acceso
- **Roles Mínimos**: ADMIN y EDITOR configurados por email
- **Sanity Server-Only**: Escritura solo desde servidor con PAT

#### Ventajas
- ✅ **Simplicidad**: No requiere base de datos para usuarios
- ✅ **Seguridad**: OAuth social + allowlist de emails
- ✅ **Escalabilidad**: Suficiente para 2-10 administradores
- ✅ **Mantenimiento**: Configuración mínima
- ✅ **Coste**: Sin costes de base de datos adicionales

### Estructura del Panel Admin

```
/admin/
├── login/          # Página de login (OAuth + credenciales dev)
├── page.tsx        # Dashboard principal (datos reales de Sanity)
├── reviews/        # Gestión de reseñas (datos reales)
├── venues/         # Gestión de locales (datos reales)
├── cities/         # Gestión de ciudades (datos reales)
├── categories/     # Gestión de categorías (datos reales)
├── blog/           # Gestión de blog (datos reales)
├── analytics/      # Métricas y estadísticas
├── users/          # Gestión de usuarios (allowlist)
└── settings/       # Configuración del sitio
```

### Configuración

#### Variables de Entorno Requeridas

```env
# Auth.js
NEXTAUTH_SECRET=super-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3001

# Allowlist de emails autorizados
ADMIN_EMAILS=admin@example.com,tu-email@gmail.com,editor@ejemplo.com

# OAuth Providers (opcional)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
GITHUB_ID=tu-github-client-id
GITHUB_SECRET=tu-github-client-secret

# Sanity (para datos del admin)
NEXT_PUBLIC_SANITY_PROJECT_ID=xaenlpyp
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=sk...  # Token con permisos de lectura
SANITY_API_WRITE_TOKEN=sk... # Token con permisos de escritura (opcional)
```

#### Configurar OAuth (Opcional)

1. **Google OAuth**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un proyecto y habilita Google+ API
   - Crea credenciales OAuth 2.0
   - Añade `http://localhost:3001/api/auth/callback/google` a URIs autorizados

2. **GitHub OAuth**:
   - Ve a [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
   - Crea una nueva OAuth App
   - Añade `http://localhost:3001/api/auth/callback/github` a Authorization callback URL

### Funcionalidades

#### Dashboard Principal
- **Estadísticas reales** desde Sanity:
  - Total de reseñas, locales, ciudades, posts, categorías
  - Actividad reciente con fechas reales
  - Porcentajes de crecimiento
- **Datos dinámicos** actualizados automáticamente

#### Gestión de Contenido (Conectado a Sanity)
- **Reseñas**: Listado completo con ratings, estados, fechas
- **Locales**: Información completa con ciudades, contactos, número de reseñas
- **Ciudades**: Estadísticas de locales y reseñas por ciudad
- **Categorías**: Gestión con descripciones y conteo de locales
- **Blog**: Posts con autores, estados, fechas de publicación

#### Gestión de Usuarios (Allowlist)
- Listado de emails autorizados
- Roles configurados por email
- Instrucciones de configuración
- Sin base de datos requerida

#### Analytics
- Métricas de tráfico (placeholder para GA4)
- Páginas más visitadas
- Distribución por dispositivos
- Configuración de herramientas de analytics

#### Configuración
- Configuración del sitio
- Configuración SEO
- Configuración de anuncios
- Configuración de Sanity CMS

#### Seguridad
- Middleware de protección de rutas
- Autenticación OAuth social
- Allowlist de emails
- Logout seguro
- Validación de permisos por roles

### Sistema de Roles

#### Roles Disponibles
- **ADMIN**: Acceso completo al panel de administración
- **EDITOR**: Puede crear y editar contenido (reseñas, locales, blog)

#### Configuración de Roles
```typescript
// En lib/auth.ts
const USER_ROLES: Record<string, 'ADMIN' | 'EDITOR'> = {
  'admin@example.com': 'ADMIN',
  'editor@ejemplo.com': 'EDITOR',
  // Añadir más emails según necesites
};
```

### Uso

1. **Acceder al panel**: `http://localhost:3001/admin`
2. **Login OAuth**: Usar Google o GitHub (recomendado)
3. **Login Desarrollo**: Email `admin@example.com`, contraseña `admin123`
4. **Navegación**: Menú lateral con todas las secciones
5. **Datos reales**: Todas las páginas muestran datos de Sanity
6. **Logout**: Botón en el header superior

### Ventajas de esta Arquitectura

#### Para 2-10 Administradores
- ✅ **Sin Base de Datos**: No requiere PostgreSQL para usuarios
- ✅ **Configuración Simple**: Solo variables de entorno
- ✅ **OAuth Social**: Más seguro que contraseñas
- ✅ **Allowlist**: Control granular de acceso
- ✅ **Mantenimiento Mínimo**: Sin migraciones ni gestión de usuarios

#### Seguridad
- ✅ **OAuth Social**: Autenticación de terceros confiables
- ✅ **Allowlist**: Solo emails autorizados pueden acceder
- ✅ **JWT**: Sesiones seguras sin base de datos
- ✅ **Middleware**: Protección de rutas automática

#### Escalabilidad
- ✅ **Hasta 10 Usuarios**: Suficiente para la mayoría de proyectos
- ✅ **Fácil Migración**: Si crece, migrar a base de datos es simple
- ✅ **Coste Cero**: Sin costes de base de datos adicionales

### Próximos Pasos

- [ ] Implementar métricas reales de GA4
- [ ] Añadir passkeys (WebAuthn) para passwordless
- [ ] Implementar email magic links
- [ ] Añadir TOTP/2FA
- [ ] Implementar búsqueda y filtros funcionales
- [ ] Añadir funcionalidad de edición directa
- [ ] Implementar notificaciones en tiempo real
- [ ] Añadir auditoría de acciones
- [ ] Configurar rate limiting
- [ ] Implementar CSP headers


