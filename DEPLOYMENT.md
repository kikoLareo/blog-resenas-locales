# �� Guía de Despliegue

## Variables de Entorno Requeridas

### 🔐 Autenticación (Obligatorio)
```bash
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=7cce0f4acf16c22f449dfa846c1f8c9bc478e24bb8c9ed9fff4589d142791fb4
```

### 🏢 Sanity CMS (Obligatorio)
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=tu-read-token
```

### 🗄️ Base de Datos (Opcional - para funcionalidades avanzadas)
```bash
DATABASE_URL="postgresql://username:password@host:port/database"
```

### 👤 Admin Dashboard
```bash
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=$2b$10$nqdaPIhyOycDi1Ze18PkqOygPVAQaBUijDno6vknoF0JmEkl7Zgki
```

### 📊 Analytics (Opcional)
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🛠️ Configuración en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a **Settings > Environment Variables**
3. Agrega cada variable de entorno con su valor correspondiente
4. Asegúrate de que estén configuradas para **Production**, **Preview** y **Development**

## 🔧 Generar Nuevos Secrets

### NEXTAUTH_SECRET
```bash
node scripts/generate-nextauth-secret.js
```

### ADMIN_PASSWORD_HASH
```bash
node scripts/generate-password-hash.js
```

## 🚨 Variables Críticas

Las siguientes variables son **OBLIGATORIAS** para que la aplicación funcione:

- ✅ `NEXTAUTH_SECRET` - Para autenticación
- ✅ `NEXT_PUBLIC_SANITY_PROJECT_ID` - Para el CMS
- ✅ `NEXT_PUBLIC_SANITY_DATASET` - Para el CMS
- ✅ `SANITY_API_READ_TOKEN` - Para leer datos del CMS

## 🔍 Verificación

Después del despliegue, verifica que:

1. La página principal carga correctamente
2. El dashboard de admin es accesible en `/dashboard`
3. Las reseñas se cargan desde Sanity
4. La autenticación funciona correctamente

## 🐛 Solución de Problemas

### Error: "NEXTAUTH_SECRET must be set"
- Verifica que `NEXTAUTH_SECRET` esté configurado en Vercel
- Asegúrate de que el valor sea una cadena hexadecimal de 64 caracteres

### Error: "Failed to fetch from Sanity"
- Verifica que `SANITY_API_READ_TOKEN` esté configurado
- Confirma que el token tenga permisos de lectura

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` esté configurado correctamente
- Confirma que la base de datos esté accesible desde Vercel
