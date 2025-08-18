# 🚀 Guía de Despliegue en Vercel

## Prerrequisitos

1. **Cuenta de Vercel**: [vercel.com](https://vercel.com)
2. **Cuenta de Sanity**: [sanity.io](https://sanity.io)
3. **Base de datos PostgreSQL**: Neon, Supabase o similar
4. **Repositorio Git**: GitHub, GitLab o Bitbucket

## Pasos para el Despliegue

### 1. Preparar el Repositorio

```bash
# Asegúrate de que todos los cambios estén committeados
git add .
git commit -m "Preparar para despliegue en Vercel"
git push origin main
```

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) y conéctate con tu cuenta de Git
2. Haz clic en "New Project"
3. Importa tu repositorio
4. Configura el proyecto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (por defecto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. Configurar Variables de Entorno

En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega:

#### Variables Obligatorias:
```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=tu-read-token

# Site
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_SITE_NAME="Blog de Reseñas"

# Auth
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=tu-secret-key-muy-largo

# Database (si usas auth)
DATABASE_URL=postgresql://usuario:password@host:puerto/database
```

#### Variables Opcionales:
```env
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY=tu-maps-key

# IndexNow
INDEXNOW_HOST=tu-dominio.vercel.app
INDEXNOW_KEY=tu-indexnow-key
```

### 4. Configurar Dominio Personalizado (Opcional)

1. En **Settings > Domains**
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones de Vercel

### 5. Configurar Webhooks de Sanity

1. Ve a tu proyecto de Sanity
2. **Settings > API > Webhooks**
3. Agrega un nuevo webhook:
   - **URL**: `https://tu-dominio.vercel.app/api/revalidate`
   - **Dataset**: `production`
   - **Filter**: `_type in ["review", "venue", "post", "city"]`
   - **Secret**: Genera un secret y agrégalo como `SANITY_WEBHOOK_SECRET`

### 6. Configurar Base de Datos (si usas auth)

#### Opción A: Neon (Recomendado)
1. Ve a [neon.tech](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia la URL de conexión
4. Agrégalo como `DATABASE_URL` en Vercel

#### Opción B: Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **Settings > Database**
4. Copia la connection string
5. Agrégalo como `DATABASE_URL` en Vercel

### 7. Ejecutar Migraciones (si usas auth)

```bash
# En el dashboard de Vercel, ve a Functions y ejecuta:
npx prisma db push
```

## Verificación del Despliegue

### 1. Verificar Build
- Revisa los logs de build en Vercel
- Asegúrate de que no hay errores

### 2. Verificar Funcionalidad
- Homepage: `https://tu-dominio.vercel.app`
- Sitemap: `https://tu-dominio.vercel.app/sitemap.xml`
- API: `https://tu-dominio.vercel.app/api/sitemap`

### 3. Verificar Performance
```bash
# Instala Lighthouse CLI
npm install -g lighthouse

# Ejecuta análisis
lighthouse https://tu-dominio.vercel.app --output=json --output-path=./lighthouse-report.json
```

## Optimizaciones Post-Despliegue

### 1. Configurar Analytics
- Google Analytics 4
- Google Search Console
- Bing Webmaster Tools

### 2. Configurar CDN
- Vercel Edge Network (automático)
- Considerar Cloudflare para dominio personalizado

### 3. Monitoreo
- Vercel Analytics
- Sentry para error tracking
- Uptime monitoring

## Troubleshooting

### Error: Build Failed
```bash
# Verificar dependencias
npm install

# Verificar TypeScript
npm run type-check

# Verificar linting
npm run lint
```

### Error: Environment Variables
- Verifica que todas las variables estén configuradas
- Asegúrate de que los valores sean correctos
- Revisa los logs de build

### Error: Database Connection
- Verifica la URL de conexión
- Asegúrate de que la base de datos esté accesible
- Verifica las credenciales

### Error: Sanity Connection
- Verifica el Project ID
- Verifica el Dataset
- Verifica el API Token

## Comandos Útiles

```bash
# Despliegue manual
vercel

# Despliegue a producción
vercel --prod

# Ver logs
vercel logs

# Ver variables de entorno
vercel env ls
```

## Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://nextjs.org/docs/deployment#vercel)
- [Sanity Webhooks](https://www.sanity.io/docs/webhooks)
- [Prisma en Vercel](https://www.prisma.io/docs/guides/deployment/deploy-to-vercel)
