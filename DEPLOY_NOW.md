# 🚀 Despliegue Rápido - Vercel

## Ya tienes Prisma configurado en Vercel ✅

Solo necesitas hacer **3 pasos**:

---

## 1️⃣ Verificar Variables de Entorno en Vercel

Ve a tu [Dashboard de Vercel](https://vercel.com) → Tu Proyecto → **Settings** → **Environment Variables**

Asegúrate de tener:
```
DATABASE_URL = postgresql://...
ADMIN_API_SECRET = (mínimo 32 caracteres aleatorios)
PASSWORD_SALT_ROUNDS = 10
```

---

## 2️⃣ Push de Cambios a GitHub

```bash
git add .
git commit -m "feat: gestión de usuarios y configuración funcional"
git push origin main
```

Vercel desplegará automáticamente y aplicará las migraciones porque actualicé el script de build:

```json
"build": "prisma generate && prisma migrate deploy && next build"
```

---

## 3️⃣ Verificar en Producción

### Usuarios (`/dashboard/users`)
1. Ve a: `https://tu-dominio.vercel.app/dashboard/users`
2. Ingresa tu `ADMIN_API_SECRET`
3. ✅ Funcional!

### Configuración (`/dashboard/settings`)
1. Ve a: `https://tu-dominio.vercel.app/dashboard/settings`
2. Click en **"Inicializar Defaults"**
3. Edita las configuraciones
4. Click en **"Guardar Cambios"**
5. ✅ Funcional!

---

## ✅ Eso es todo!

El script de build actualizado hará que Vercel:
1. Genere el cliente Prisma
2. **Aplique las migraciones automáticamente** ← NUEVO
3. Construya Next.js

---

## 🐛 Si algo falla

### Ver logs de deployment:
```
Vercel Dashboard → Deployments → Tu deployment → View Function Logs
```

### Aplicar migraciones manualmente (si es necesario):
```bash
# Obtén DATABASE_URL de Vercel Dashboard
export DATABASE_URL="postgresql://..."
npx prisma migrate deploy
```

### Forzar re-deploy:
```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

---

## 📊 Lo que se creará automáticamente

### Nueva tabla en PostgreSQL:
- `SiteSetting` - Para configuraciones del sitio

### Funcionalidades disponibles:
- ✅ Gestión completa de usuarios
- ✅ Búsqueda y filtros de usuarios
- ✅ Cambio de contraseñas
- ✅ Configuración del sitio (13 settings en 4 categorías)
- ✅ Todo guardado en PostgreSQL
- ✅ Sin datos mock

---

## 🎉 ¡Listo!

Después del push, espera 2-3 minutos y todo estará funcionando en producción.

**¡Tu dashboard está listo para usar!** 🚀
