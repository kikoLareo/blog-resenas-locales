# 🔧 Fix: Error 500 en Configuración

## Problema

La página `/dashboard/settings` está fallando con error 500:
```
GET /api/admin/settings → 500 Internal Server Error
```

## Causa

El modelo `SiteSetting` existe en el schema de Prisma y la migración está creada localmente, pero **no se ha aplicado en la base de datos de producción en Vercel**.

## Solución

### ✅ Paso 1: Cliente Prisma Regenerado (Ya hecho)

```bash
npx prisma generate
```

✅ **Completado** - El cliente ya se regeneró exitosamente.

### ✅ Paso 2: Verificar package.json (Ya configurado)

El `package.json` ya tiene el script correcto:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

✅ **Configurado** - Las migraciones se ejecutarán automáticamente en cada deploy.

### 🚀 Paso 3: Deploy a Vercel (ACCIÓN REQUERIDA)

Necesitas hacer un nuevo deploy para que Vercel ejecute las migraciones:

```bash
# Opción 1: Commit y push (recomendado)
git add .
git commit -m "fix: regenerar Prisma client y aplicar migración SiteSetting"
git push origin main

# Vercel hará auto-deploy y ejecutará:
# 1. prisma generate
# 2. prisma migrate deploy  ← Esto creará la tabla SiteSetting
# 3. next build
```

**O Opción 2: Deploy manual**

```bash
vercel --prod
```

### 📋 Verificación Post-Deploy

Una vez que Vercel termine el deploy, verifica:

1. **Logs de Build en Vercel:**
   - Busca: `Running prisma migrate deploy`
   - Debe mostrar: `1 migration(s) applied`

2. **Prueba la página:**
   - Ve a `https://tudominio.com/dashboard/settings`
   - Debe cargar correctamente (puede estar vacío)

3. **Inicializar configuraciones:**
   - Click en "Inicializar Datos" 
   - Se crearán las 13 configuraciones por defecto

## ¿Por qué pasó esto?

El modelo `SiteSetting` se agregó al schema de Prisma, pero:
- ✅ La migración se creó localmente (`prisma/migrations/add_site_settings/`)
- ❌ **No se aplicó en la BD de producción** (falta ejecutar en Vercel)

En Vercel, cada deploy ejecuta el build script que incluye `prisma migrate deploy`, pero como no se ha hecho un nuevo deploy desde que se agregó el modelo, la tabla no existe en PostgreSQL.

## Migración Incluida

La migración que se aplicará:

```sql
-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- CreateIndex
CREATE INDEX "SiteSetting_category_idx" ON "SiteSetting"("category");
```

## Tiempo Estimado

- **Push a Git**: 1 minuto
- **Build en Vercel**: 2-3 minutos
- **Verificación**: 1 minuto

**Total**: ~5 minutos para que esté funcionando

## Estado Actual

- ✅ Código correcto
- ✅ Migración creada
- ✅ Cliente Prisma generado
- ✅ package.json configurado
- ⏳ **Pendiente: Deploy a Vercel**

---

## TL;DR

**Haz esto:**
```bash
git add .
git commit -m "fix: aplicar migración SiteSetting"
git push origin main
```

**Espera 2-3 minutos** y la página de configuración funcionará correctamente. ✅
