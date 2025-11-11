# 🚀 Despliegue en Vercel - Guía de Migración

## ✅ Estado Actual

Tu proyecto ya está desplegado en Vercel con Prisma configurado.

---

## 📋 Pasos para Aplicar los Cambios

### 1. **Verificar Variables de Entorno en Vercel**

Asegúrate de que estas variables estén configuradas en Vercel:

```bash
# En Vercel Dashboard → Settings → Environment Variables

DATABASE_URL=postgresql://user:password@host:5432/dbname
ADMIN_API_SECRET=tu-secret-super-seguro
PASSWORD_SALT_ROUNDS=10
```

### 2. **Hacer Push de los Cambios**

```bash
# Commit de todos los cambios
git add .
git commit -m "feat: implementar gestión de usuarios y configuración funcional"
git push origin main
```

Vercel detectará el push y desplegará automáticamente.

### 3. **Aplicar Migraciones en Producción**

Tienes 2 opciones:

#### **Opción A: Desde tu Local (Recomendado)**

```bash
# Asegúrate de tener la DATABASE_URL de producción
# Temporal: exporta la variable
export DATABASE_URL="tu-database-url-de-produccion"

# Aplica las migraciones
npx prisma migrate deploy

# Opcional: Verifica que todo está bien
npx prisma studio
```

#### **Opción B: Desde el Build de Vercel**

Vercel ejecutará automáticamente las migraciones si tienes configurado el script en `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma migrate deploy && next build"
  }
}
```

**⚠️ Nota**: Ya tienes `postinstall` configurado, así que solo necesitarías agregar `prisma migrate deploy` antes del build.

---

## 🔍 Verificar que Todo Funciona

### 1. **Acceder al Dashboard en Producción**

```
https://tu-dominio.vercel.app/dashboard/users
```

### 2. **Probar Usuarios**

1. Ingresa el `ADMIN_API_SECRET`
2. Click en "Inicializar Defaults" (si es necesario)
3. Crear, editar, eliminar usuarios

### 3. **Probar Configuración**

```
https://tu-dominio.vercel.app/dashboard/settings
```

1. Click en "Inicializar Defaults"
2. Editar configuraciones
3. Guardar cambios

---

## ⚡ Migración Automática en Vercel

### Opción Recomendada: Agregar al Build Script

Modifica `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "postinstall": "node scripts/prisma-setup.js",
    "prebuild": "rm -rf .next/cache && tsx scripts/indexnow-verify.ts",
    "build": "prisma generate && prisma migrate deploy && next build",
    "start": "next start"
  }
}
```

Esto hará que:
1. ✅ Genere el cliente Prisma
2. ✅ Aplique las migraciones automáticamente
3. ✅ Construya la aplicación

---

## 🗄️ Tabla SiteSetting en la Base de Datos

La migración creará esta tabla:

```sql
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "category" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");
CREATE INDEX "SiteSetting_category_idx" ON "SiteSetting"("category");
```

---

## 🔧 Troubleshooting

### Error: "Table SiteSetting does not exist"

**Solución**: Las migraciones no se aplicaron.

```bash
# Desde local con DATABASE_URL de producción
npx prisma migrate deploy
```

### Error: "Prisma Client not generated"

**Solución**: Regenera el cliente.

```bash
npx prisma generate
```

### Error en Variables de Entorno

**Verificar en Vercel**:
1. Dashboard → Tu Proyecto → Settings → Environment Variables
2. Asegúrate de que `DATABASE_URL` esté configurada
3. Re-deploy el proyecto

### Los cambios no se ven en producción

**Soluciones**:
1. Verifica que el commit se hizo push a GitHub
2. Verifica que Vercel detectó el despliegue
3. Limpia cache de Vercel y re-deploya

---

## 📝 Checklist de Despliegue

- [ ] Variables de entorno configuradas en Vercel
- [ ] Código comiteado y pusheado a GitHub
- [ ] Vercel desplegó automáticamente
- [ ] Migraciones aplicadas (`prisma migrate deploy`)
- [ ] Tabla `SiteSetting` creada en la base de datos
- [ ] `/dashboard/users` funciona en producción
- [ ] `/dashboard/settings` funciona en producción
- [ ] Inicializar defaults en Settings
- [ ] Crear un usuario de prueba
- [ ] Verificar que todo guarda correctamente

---

## 🎯 Comandos Rápidos

```bash
# 1. Push de cambios
git add .
git commit -m "feat: usuarios y settings funcionales"
git push origin main

# 2. Aplicar migraciones (desde local a producción)
# Primero, obtén DATABASE_URL de Vercel Dashboard
export DATABASE_URL="postgresql://..."
npx prisma migrate deploy

# 3. Verificar en Vercel
# Ve a: https://vercel.com/tu-proyecto/deployments
# Espera a que termine el deployment
```

---

## ✅ Resultado Esperado

Después del despliegue:

1. ✅ Nueva tabla `SiteSetting` en PostgreSQL
2. ✅ `/dashboard/users` funcional con todos los features
3. ✅ `/dashboard/settings` funcional con configuraciones
4. ✅ Datos persistiendo en PostgreSQL
5. ✅ Sin errores de compilación
6. ✅ Todo funcionando en producción

---

## 🔒 Seguridad en Producción

Asegúrate de que:

- ✅ `ADMIN_API_SECRET` es seguro (min 32 caracteres random)
- ✅ `DATABASE_URL` tiene credenciales fuertes
- ✅ Solo ADMIN puede acceder a estas páginas
- ✅ HTTPS está habilitado (Vercel lo hace por defecto)

---

## 📞 Si Algo Falla

1. **Revisa los logs de Vercel**:
   - Dashboard → Deployments → Tu deployment → Runtime Logs

2. **Revisa los logs de build**:
   - Dashboard → Deployments → Tu deployment → Build Logs

3. **Verifica la base de datos**:
   ```bash
   # Con DATABASE_URL de producción
   npx prisma studio
   ```

4. **Regenera y redeploya**:
   ```bash
   git commit --allow-empty -m "trigger redeploy"
   git push origin main
   ```

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu dashboard estará **100% funcional en producción** con:

- ✅ Gestión de usuarios completa
- ✅ Configuración del sitio funcional
- ✅ Datos reales en PostgreSQL
- ✅ Sin mocks ni datos estáticos
- ✅ Seguridad implementada

**¡Tu aplicación está lista para usar en producción!** 🚀
