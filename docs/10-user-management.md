# Gestión de Usuarios - Documentación

## 📋 Descripción General

El sistema de gestión de usuarios permite administrar completamente los usuarios de la aplicación, incluyendo creación, edición, eliminación y gestión de roles. Los datos de usuarios se almacenan en **PostgreSQL** a través de **Prisma**, separados del contenido de Sanity.

## 🏗️ Arquitectura

### Base de Datos: Prisma + PostgreSQL

Los usuarios se almacenan en PostgreSQL usando el siguiente schema:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  passwordHash  String?   @db.Text
  emailVerified DateTime?
  image         String?
  username      String?   @unique
  role          UserRole  @default(GUEST)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  authenticators Authenticator[]
  paywallSubscriptions PaywallSubscription[]
}

enum UserRole {
  GUEST    // Invitado sin permisos
  MEMBER   // Usuario básico registrado
  EDITOR   // Editor de contenido
  ADMIN    // Administrador completo
}
```

### APIs Disponibles

#### 1. `/api/admin/users` (GET, POST)

**GET** - Lista todos los usuarios
- **Autenticación**: Requiere header `x-admin-secret`
- **Respuesta**:
```json
{
  "users": [...],
  "stats": {
    "total": 10,
    "byRole": {
      "ADMIN": 1,
      "EDITOR": 2,
      "MEMBER": 5,
      "GUEST": 2
    },
    "verified": 7,
    "withImage": 3
  }
}
```

**POST** - Crea un nuevo usuario
- **Autenticación**: Requiere header `x-admin-secret`
- **Body**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Nombre Usuario",
  "role": "MEMBER"
}
```
- **Validaciones**:
  - Email válido y único
  - Contraseña mínimo 8 caracteres
  - Rol válido: GUEST, MEMBER, EDITOR, ADMIN

#### 2. `/api/admin/users/[id]` (GET, PUT, DELETE)

**GET** - Obtiene un usuario específico
- **Autenticación**: Requiere header `x-admin-secret`
- **Parámetros**: `id` del usuario

**PUT** - Actualiza un usuario
- **Autenticación**: Requiere header `x-admin-secret`
- **Body** (todos opcionales):
```json
{
  "name": "Nuevo Nombre",
  "username": "nuevo_username",
  "role": "EDITOR",
  "password": "nueva_contraseña"
}
```
- **Validaciones especiales**:
  - No se puede cambiar el rol del último ADMIN
  - Username debe ser único
  - Contraseña debe tener mínimo 8 caracteres

**DELETE** - Elimina un usuario
- **Autenticación**: Requiere header `x-admin-secret`
- **Protección**: No se puede eliminar el último ADMIN del sistema
- **Efecto**: Elimina en cascada sessions, accounts y subscriptions

## 🎨 Dashboard UI

### Ubicación
`/dashboard/users`

### Características

#### 1. **Estadísticas en Tiempo Real**
- Total de usuarios
- Usuarios por rol (ADMIN, EDITOR, MEMBER, GUEST)
- Usuarios verificados
- Usuarios con imagen de perfil

#### 2. **Filtros y Búsqueda**
- **Búsqueda**: Por email, nombre o username
- **Filtro por rol**: Todos, ADMIN, EDITOR, MEMBER, GUEST
- Contador de resultados filtrados

#### 3. **Crear Usuario**
- Formulario modal con validación
- Campos: Email, Nombre, Contraseña, Rol
- Validación en frontend y backend
- Feedback visual de éxito/error

#### 4. **Editar Usuario**
- Edición inline sin cambiar de página
- Campos editables: Nombre, Username, Rol
- Validación de permisos (no bajar rol de último ADMIN)
- Botón de cancelar para deshacer cambios

#### 5. **Cambiar Contraseña**
- Modal específico para cambio de contraseña
- Validación de longitud mínima (8 caracteres)
- Feedback inmediato

#### 6. **Eliminar Usuario**
- Confirmación antes de eliminar
- Protección: No permite eliminar último ADMIN
- Feedback de éxito/error

#### 7. **Visualización de Usuario**
Para cada usuario se muestra:
- Avatar con inicial del email
- Nombre o email
- Estado de verificación (✓ verificado / ✗ no verificado)
- Badge de rol con código de colores
- Email completo
- Username (si existe)
- Fecha de creación
- Número de sesiones activas
- Número de suscripciones paywall

## 🔒 Seguridad

### Autenticación con Admin Secret

Todas las operaciones requieren el header `x-admin-secret`:

```javascript
headers: {
  'x-admin-secret': 'tu-admin-secret-aqui'
}
```

### Configuración

1. Establece la variable de entorno:
```bash
ADMIN_API_SECRET=tu-secret-super-seguro
```

2. El secret se guarda en localStorage del navegador la primera vez
3. Se valida en cada request del API

### Protecciones Implementadas

✅ Validación de email único
✅ Hash de contraseñas con bcrypt (10 rounds)
✅ No se puede eliminar el último ADMIN
✅ No se puede cambiar el rol del último ADMIN
✅ Validación de formato de email
✅ Validación de longitud de contraseña
✅ Validación de roles permitidos
✅ Sanitización de inputs (trim, lowercase en emails)

## 🚀 Uso del Dashboard

### Primera Vez

1. Navega a `/dashboard/users`
2. Ingresa el `ADMIN_API_SECRET` configurado en tu .env
3. Click en "Guardar y Continuar"
4. El secret se guarda en localStorage para futuras visitas

### Crear Usuario

1. Click en "Nuevo Usuario"
2. Completa el formulario:
   - **Email**: Correo electrónico único
   - **Nombre**: Nombre del usuario (opcional)
   - **Contraseña**: Mínimo 8 caracteres
   - **Rol**: GUEST, MEMBER, EDITOR o ADMIN
3. Click en "Crear Usuario"

### Editar Usuario

1. Click en el botón de editar (icono lápiz)
2. Modifica los campos deseados
3. Click en "Guardar Cambios" o "Cancelar"

### Cambiar Contraseña

1. Click en el botón de llave (icono Key)
2. Ingresa la nueva contraseña (mínimo 8 caracteres)
3. Click en "Cambiar Contraseña"

### Eliminar Usuario

1. Click en el botón rojo de eliminar (icono basura)
2. Confirma la eliminación en el diálogo
3. El usuario y sus datos relacionados se eliminan

### Buscar y Filtrar

**Buscar:**
- Escribe en el campo de búsqueda
- Busca por email, nombre o username
- Los resultados se actualizan en tiempo real

**Filtrar por rol:**
- Selecciona un rol del dropdown
- Los usuarios se filtran automáticamente
- Combina con búsqueda para mayor precisión

## 🔄 Diferencias con Otras Secciones

### Venues, Reviews, Blog → Sanity CMS
- Contenido público
- Esquemas flexibles
- Optimizado para SEO
- Versionamiento de contenido

### Users → Prisma + PostgreSQL
- Datos sensibles (contraseñas, sesiones)
- Autenticación y autorización
- Relaciones con tablas del sistema
- ACID compliance para datos críticos

## 📊 Roles y Permisos

| Rol    | Descripción | Color Badge |
|--------|-------------|-------------|
| GUEST  | Invitado sin permisos especiales | Gris |
| MEMBER | Usuario registrado básico | Verde |
| EDITOR | Puede editar contenido | Azul |
| ADMIN  | Acceso completo al sistema | Rojo |

## 🐛 Troubleshooting

### Error: "Unauthorized"
- Verifica que el `ADMIN_API_SECRET` esté configurado en .env
- Confirma que el secret ingresado en el dashboard es correcto
- Revisa la consola del navegador para más detalles

### Error: "User already exists"
- El email ya está registrado
- Usa un email diferente
- Verifica si el usuario ya existe en la lista

### Error: "Cannot delete the last ADMIN user"
- Sistema de protección activo
- Crea otro ADMIN antes de eliminar
- O cambia el rol del usuario a otro diferente

### No se pueden ver los usuarios
- Verifica la conexión a PostgreSQL
- Ejecuta `npx prisma generate`
- Revisa las migraciones: `npx prisma migrate deploy`
- Verifica el `DATABASE_URL` en .env

## 🔧 Desarrollo

### Ejecutar Migraciones
```bash
npx prisma migrate dev
```

### Regenerar Cliente Prisma
```bash
npx prisma generate
```

### Ver Base de Datos
```bash
npx prisma studio
```

### Crear Admin desde CLI
```bash
npm run create-admin
```

## 📝 Notas Importantes

1. **Sin datos mock**: Todos los datos son reales de PostgreSQL
2. **Operaciones en tiempo real**: Los cambios se reflejan inmediatamente
3. **Validación dual**: Frontend (UX) + Backend (seguridad)
4. **Mensajes en español**: Toda la UI está en español
5. **Responsive**: Funciona en desktop y mobile

## 🎯 Próximas Mejoras Sugeridas

- [ ] Paginación para grandes cantidades de usuarios
- [ ] Exportar lista de usuarios a CSV
- [ ] Envío de email de bienvenida al crear usuario
- [ ] Reseteo de contraseña vía email
- [ ] Historial de actividad del usuario
- [ ] Suspensión temporal de usuarios
- [ ] Gestión masiva de usuarios (bulk actions)
- [ ] Integración con proveedores OAuth (Google, GitHub, etc.)
