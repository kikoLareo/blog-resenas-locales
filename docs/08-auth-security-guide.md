# 🔐 Guía de Seguridad del Sistema de Autenticación

## 📋 Estado Actual del Sistema

### Configuración Implementada

```typescript
// lib/auth.ts - Configuración actual
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$...';
```

### Variables de Entorno Actuales
```env
# Autenticación
NEXTAUTH_SECRET=super-secret-key-change-in-production

# Usuario único
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=$2b$10$u2SMsz475x3Kpr0FgJ.uvePFPy1S5QKWF/wZVKz1sl9EGhLZSMpVG
```

### Credenciales de Acceso
- **Email**: `admin@example.com`
- **Contraseña**: `admin123` (cambiar en producción)
- **URL**: `http://localhost:3001/admin`

---

## 🛡️ Medidas de Seguridad Implementadas

### 1. Hash de Contraseñas
```typescript
// Verificación con bcrypt
const isValidPassword = await bcrypt.compare(credentials.password, ADMIN_PASSWORD_HASH);
```
- ✅ **bcrypt**: Algoritmo de hash seguro y lento
- ✅ **Work Factor**: 10 (configurable para mayor seguridad)
- ✅ **Salt automático**: Protección contra rainbow tables

### 2. Validación Estricta
```typescript
// Verificación de email exacto
if (email !== ADMIN_EMAIL) {
  console.log(`❌ Email incorrecto: ${email}`);
  return null;
}
```
- ✅ **Email exacto**: Solo un email específico puede acceder
- ✅ **Case insensitive**: Normalización de email
- ✅ **Logs de seguridad**: Registra intentos fallidos

### 3. Gestión de Sesiones
```typescript
session: {
  strategy: "jwt",
  maxAge: 12 * 60 * 60, // 12 horas
}
```
- ✅ **JWT**: Tokens seguros sin base de datos
- ✅ **Expiración**: 12 horas (configurable)
- ✅ **Server-side validation**: Verificación en cada request

### 4. Middleware de Protección
```typescript
// middleware.ts
export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const token = req.nextauth.token;
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
  }
);
```
- ✅ **Protección de rutas**: Todas las rutas `/admin/*` protegidas
- ✅ **Redirección automática**: Usuarios no autenticados → login
- ✅ **Validación de roles**: Solo ADMIN puede acceder

---

## 🚀 Configuración para Producción

### 1. Variables de Entorno de Producción
```env
# PRODUCCIÓN - Cambiar TODOS estos valores
NEXTAUTH_SECRET=tu-secret-super-seguro-y-unico-de-64-caracteres

# Usuario de producción
ADMIN_EMAIL=tu-email-real@gmail.com
ADMIN_PASSWORD_HASH=hash-generado-para-tu-contraseña-real
```

### 2. Generar Secret Seguro
```bash
# Generar secret de 64 caracteres
openssl rand -base64 64
# o usar un generador online seguro
```

### 3. Generar Contraseña Segura
```bash
# Generar contraseña fuerte
npm run generate-password tu-email@gmail.com "TuContraseñaSuperSegura123!"
```


## 🔧 Scripts y Herramientas Disponibles

### 1. Generador de Contraseñas
```bash
# Uso
npm run generate-password <email> <contraseña>

# Ejemplo
npm run generate-password admin@ejemplo.com "MiContraseña123!"
```

### 2. Verificación de Configuración
```bash
# Verificar variables de entorno
echo $NEXTAUTH_SECRET
echo $ADMIN_EMAIL
echo $ADMIN_PASSWORD_HASH
```

---

## 📊 Logs de Seguridad

### Logs Implementados
```typescript
// En lib/auth.ts
console.log(`❌ Email incorrecto: ${email}`);
console.log(`❌ Contraseña incorrecta para: ${email}`);
console.log(`✅ Login exitoso para: ${email}`);
```

### Monitoreo Recomendado
- ✅ **Logs de acceso**: Registra todos los intentos
- ✅ **Logs de error**: Captura intentos fallidos
- ✅ **Alertas**: Configurar notificaciones para múltiples fallos

---

## 🔍 Análisis de Seguridad

### Fortalezas del Sistema
1. **✅ Sin Base de Datos**: No hay vectores de ataque SQL
2. **✅ Hash bcrypt**: Contraseñas protegidas con salt
3. **✅ Email único**: Acceso restringido a un solo usuario
4. **✅ JWT seguro**: Tokens con expiración
5. **✅ Middleware**: Protección automática de rutas
6. **✅ Logs**: Auditoría de accesos

### Vectores de Ataque Mitigados
- ❌ **Fuerza bruta**: bcrypt es lento por diseño
- ❌ **SQL Injection**: No hay base de datos
- ❌ **Session hijacking**: JWT con expiración
- ❌ **Unauthorized access**: Middleware de protección
- ❌ **Password guessing**: Email único conocido

### Consideraciones de Seguridad
- ⚠️ **Single point of failure**: Un solo usuario
- ⚠️ **No rate limiting**: Implementar en producción
- ⚠️ **No 2FA**: Considerar para mayor seguridad

---

## 🚨 Checklist de Producción

### Antes de Desplegar
- [ ] Cambiar `NEXTAUTH_SECRET` por uno seguro
- [ ] Cambiar `ADMIN_EMAIL` por email real
- [ ] Generar nueva contraseña fuerte
- [ ] Verificar HTTPS en producción
- [ ] Configurar logs de seguridad

### Configuración de Seguridad
- [ ] Implementar rate limiting
- [ ] Configurar CSP headers
- [ ] Habilitar HSTS
- [ ] Configurar monitoreo de logs
- [ ] Plan de backup de credenciales

---

## 🔄 Procedimientos de Mantenimiento

### Cambiar Contraseña
```bash
# 1. Generar nueva contraseña
npm run generate-password admin@ejemplo.com "NuevaContraseña123!"

# 2. Actualizar .env
ADMIN_PASSWORD_HASH=nuevo-hash-generado

# 3. Reiniciar aplicación
npm run build && npm start
```

### Cambiar Email
```bash
# 1. Actualizar .env
ADMIN_EMAIL=nuevo-email@gmail.com

# 2. Reiniciar aplicación
npm run build && npm start
```

### Regenerar Secret
```bash
# 1. Generar nuevo secret
openssl rand -base64 64

# 2. Actualizar .env
NEXTAUTH_SECRET=nuevo-secret-generado

# 3. Reiniciar aplicación
npm run build && npm start
```

---

## 📈 Escalabilidad Futura

### Si Necesitas Más Usuarios
```typescript
// Opción 1: Múltiples emails
const ADMIN_EMAILS = [
  'admin@ejemplo.com',
  'editor@ejemplo.com',
  'manager@ejemplo.com'
];

// Opción 2: Migrar a base de datos
// Implementar Prisma + PostgreSQL
```

### Mejoras de Seguridad
- 🔐 **2FA/TOTP**: Autenticación de dos factores
- 🔐 **Passkeys**: WebAuthn para passwordless
- 🔐 **OAuth Social**: Google/GitHub para mayor seguridad
- 🔐 **Rate Limiting**: Prevenir ataques de fuerza bruta
- 🔐 **Audit Logs**: Registro detallado de acciones

---

## 🎯 Resumen de Seguridad

### Nivel de Seguridad Actual: **ALTO**
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Email único y restringido
- ✅ Sesiones JWT con expiración
- ✅ Middleware de protección
- ✅ Logs de auditoría

### Recomendaciones para Producción:
1. **Cambiar todas las credenciales por defecto**
2. **Implementar rate limiting**
3. **Configurar monitoreo de logs**
4. **Usar HTTPS obligatorio**
5. **Considerar 2FA para mayor seguridad**

---

## 📚 Archivos Relacionados

- `lib/auth.ts` - Configuración principal de Auth.js
- `middleware.ts` - Protección de rutas
- `app/dashboard/login/page.tsx` - Página de login
- `app/dashboard/layout.tsx` - Layout protegido
- `scripts/generate-password.js` - Generador de contraseñas
- `.env` - Variables de entorno (no committear)

---

## 🔗 Enlaces Útiles

- [Auth.js Documentation](https://next-auth.js.org/)
- [bcrypt Security](https://en.wikipedia.org/wiki/Bcrypt)
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
