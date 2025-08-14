# 🚀 Guía de Despliegue - Blog de Reseñas Locales

Esta guía te llevará paso a paso desde el desarrollo local hasta tener tu blog funcionando en producción.

## 📋 Pre-Despliegue Checklist

### ✅ Preparación del Código
- [ ] Todos los tests pasan (`npm run test`)
- [ ] ESLint sin errores (`npm run lint`)
- [ ] TypeScript sin errores (`npm run type-check`)
- [ ] Build exitoso (`npm run build`)
- [ ] Sitemap generado (`npm run generate-sitemap`)

### ✅ Configuración de Sanity
- [ ] Proyecto de Sanity creado y configurado
- [ ] Esquemas desplegados (`npm run studio:deploy`)
- [ ] Datos de prueba cargados (`npm run seed`)
- [ ] Tokens de API generados (read y write)
- [ ] Webhooks configurados para revalidación

### ✅ Variables de Entorno
- [ ] Archivo `.env.example` actualizado
- [ ] Variables de producción preparadas
- [ ] Secrets sensibles seguros
- [ ] URLs de producción configuradas

---

## 🌐 Despliegue en Vercel (Recomendado)

### Paso 1: Preparar el Repositorio

```bash
# Asegurar que todo está commitado
git add .
git commit -m "feat: preparar para despliegue inicial"
git push origin main
```

### Paso 2: Conectar con Vercel

1. **Crear cuenta en Vercel** (si no tienes una)
2. **Importar proyecto desde GitHub**
   - Ve a https://vercel.com/new
   - Selecciona tu repositorio
   - Configura el proyecto:
     - Framework Preset: **Next.js**
     - Root Directory: **/** (raíz)
     - Build Command: `npm run build`
     - Output Directory: `.next`

### Paso 3: Configurar Variables de Entorno

En el dashboard de Vercel, ve a **Settings → Environment Variables** y añade:

```env
# Sanity (Requerido)
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id_real
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=tu_read_token_real
SANITY_API_WRITE_TOKEN=tu_write_token_real

# Sitio
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app

# SEO y Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GSC_VERIFICATION=tu_codigo_verificacion

# Webhooks
SANITY_REVALIDATE_SECRET=tu_secret_muy_seguro_aqui

# Redes Sociales
NEXT_PUBLIC_TWITTER_HANDLE=@tu_handle
NEXT_PUBLIC_FACEBOOK_PAGE=https://facebook.com/tu_pagina

# Opcionales
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxxxxxxxx
SENTRY_DSN=tu_sentry_dsn_si_usas_sentry
```

### Paso 4: Desplegar

1. **Hacer push a main** para desplegar automáticamente
2. **Verificar el despliegue** en el dashboard de Vercel
3. **Probar la URL** de producción

---

## 🔧 Configuración Post-Despliegue

### 1. Configurar Webhooks de Sanity

Para que el contenido se actualice automáticamente:

1. **Ve a Sanity Studio** (tu-proyecto.sanity.studio)
2. **Configuración → API → Webhooks**
3. **Crear nuevo webhook:**
   - **Name:** Vercel Revalidation
   - **URL:** `https://tu-dominio.vercel.app/api/revalidate`
   - **Dataset:** production
   - **Trigger on:** Create, Update, Delete
   - **Secret:** El valor de `SANITY_REVALIDATE_SECRET`
   - **HTTP method:** POST

### 2. Generar y Subir Sitemap

```bash
# Generar sitemap con URL de producción
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app npm run generate-sitemap

# El sitemap se genera automáticamente en cada build
```

### 3. Configurar Google Search Console

1. **Ve a Google Search Console**
2. **Añadir propiedad:** https://tu-dominio.vercel.app
3. **Verificar propiedad** usando el meta tag en `.env`
4. **Subir sitemap:** https://tu-dominio.vercel.app/sitemap.xml

### 4. Configurar Google Analytics

1. **Crear propiedad GA4** para tu dominio
2. **Copiar el ID** (G-XXXXXXXXXX)
3. **Añadir a variables de entorno** como `NEXT_PUBLIC_GA_ID`
4. **Redesplegar** para activar el tracking

---

## 🌐 Dominio Personalizado

### Configurar Dominio en Vercel

1. **En Vercel Dashboard:** Settings → Domains
2. **Añadir dominio:** tu-dominio.com
3. **Configurar DNS** según las instrucciones de Vercel
4. **Esperar propagación** (puede tardar hasta 48h)

### Actualizar Variables de Entorno

```env
# Actualizar URL del sitio
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com

# Actualizar robots.txt y sitemap
# Se actualizarán automáticamente en el próximo build
```

### Regenerar Sitemap

```bash
# Con el nuevo dominio
npm run generate-sitemap

# Commit y push para redesplegar
git add public/sitemap.xml
git commit -m "update: sitemap con nuevo dominio"
git push origin main
```

---

## 🚀 Otros Proveedores de Hosting

### Netlify

1. **Conectar repositorio** en Netlify
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Variables de entorno:** Mismas que Vercel
4. **Deploy hooks:** Para webhooks de Sanity

### Railway

1. **Crear nuevo proyecto** en Railway
2. **Conectar GitHub repo**
3. **Configurar variables de entorno**
4. **Railway se encarga** del resto automáticamente

### DigitalOcean App Platform

1. **Crear nueva app** desde GitHub
2. **Configurar como Static Site**
3. **Build command:** `npm run build`
4. **Output directory:** `.next`

---

## 🔍 Monitoreo y Mantenimiento

### Métricas Importantes

**Core Web Vitals:**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

**SEO:**
- Tiempo de carga < 3s
- Mobile-friendly score > 95
- SEO score > 90

### Herramientas de Monitoreo

1. **Vercel Analytics** (incluido)
2. **Google Analytics** (configurado)
3. **Google Search Console** (SEO)
4. **PageSpeed Insights** (rendimiento)
5. **Uptime Robot** (disponibilidad)

### Mantenimiento Regular

**Semanal:**
- [ ] Revisar métricas de Analytics
- [ ] Verificar que no hay errores 404
- [ ] Comprobar velocidad de carga

**Mensual:**
- [ ] Actualizar dependencias (`npm update`)
- [ ] Revisar logs de errores
- [ ] Verificar backups de Sanity
- [ ] Analizar rendimiento SEO

**Trimestral:**
- [ ] Auditoría completa de SEO
- [ ] Revisar estrategia de contenido
- [ ] Optimizar imágenes y assets
- [ ] Actualizar documentación

---

## 🚨 Resolución de Problemas

### Errores Comunes de Build

**Error: "Module not found"**
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

**Error: "Sanity client configuration"**
- Verificar que todas las variables de Sanity están configuradas
- Comprobar que el token tiene los permisos correctos
- Verificar que el dataset existe

**Error: "Type errors"**
```bash
# Verificar tipos localmente
npm run type-check

# Regenerar tipos de Sanity si es necesario
npx sanity typegen generate
```

### Problemas de Rendimiento

**Sitio lento:**
1. Verificar tamaño de imágenes (usar Next.js Image)
2. Comprobar bundle size (`npm run build`)
3. Revisar queries de Sanity (optimizar GROQ)
4. Activar compresión en hosting

**Problemas de SEO:**
1. Verificar que robots.txt es accesible
2. Comprobar que sitemap.xml se genera correctamente
3. Revisar metadatos en páginas individuales
4. Verificar structured data

### Problemas de Contenido

**Contenido no se actualiza:**
1. Verificar webhook de Sanity
2. Comprobar logs de revalidación
3. Forzar revalidación manual
4. Verificar cache de CDN

---

## 📊 Checklist Post-Despliegue

### ✅ Funcionalidad Básica
- [ ] Sitio carga correctamente
- [ ] Navegación funciona
- [ ] Páginas de reseñas se muestran
- [ ] Imágenes cargan correctamente
- [ ] Links internos funcionan

### ✅ SEO y Analytics
- [ ] Google Analytics trackea visitas
- [ ] Sitemap.xml accesible
- [ ] Robots.txt configurado
- [ ] Meta tags en todas las páginas
- [ ] Open Graph funciona (test con Facebook Debugger)

### ✅ Rendimiento
- [ ] PageSpeed Insights > 90
- [ ] Core Web Vitals en verde
- [ ] Tiempo de carga < 3s
- [ ] Imágenes optimizadas

### ✅ Contenido
- [ ] Sanity Studio accesible
- [ ] Webhooks funcionando
- [ ] Contenido se actualiza automáticamente
- [ ] Datos de ejemplo cargados

### ✅ Monitoreo
- [ ] Error tracking configurado
- [ ] Uptime monitoring activo
- [ ] Analytics configurado
- [ ] Search Console verificado

---

## 🎉 ¡Felicidades!

Tu blog de reseñas locales está ahora en producción y listo para conquistar el mundo gastronómico local. 

### Próximos Pasos

1. **Crear contenido regular** siguiendo la guía de contenido
2. **Optimizar SEO** basado en métricas reales
3. **Promocionar** en redes sociales locales
4. **Colaborar** con restaurantes locales
5. **Monitorear y mejorar** continuamente

### Recursos Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Guía de Sanity](https://www.sanity.io/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Google Search Console](https://search.google.com/search-console)
- [PageSpeed Insights](https://pagespeed.web.dev/)

¡Que tengas mucho éxito con tu blog! 🚀🍽️