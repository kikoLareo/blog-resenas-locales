# 🍽️ Blog de Reseñas de Restaurantes

> **Un blog ultra-rápido y escalable para reseñas gastronómicas optimizado para SEO y AEO**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Sanity](https://img.shields.io/badge/Sanity-v3-red)](https://www.sanity.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)](https://tailwindcss.com/)

## 🚀 Características

- ⚡ **Next.js 15** con App Router y Server Components
- 🎨 **Sanity CMS** v3 para gestión de contenido
- 📱 **Sistema QR** completo para acceso a locales
- 🖼️ **Gestión avanzada de imágenes** con optimización automática
- 🔐 **Autenticación robusta** con Auth.js v5
- 📊 **Dashboard administrativo** completo
- 🔍 **SEO/AEO** completo con JSON-LD schema.org
- 🚀 **ISR** (Incremental Static Regeneration) con webhooks
- 📊 **Zero CLS** en carga de anuncios
- ♿ **Accesibilidad** AA completa
- 🧪 **Testing** E2E y unitario
- 📈 **Analytics** y métricas de rendimiento
- 🍪 **Sistema de consentimiento** GDPR compliant
- 📺 **Gestión de anuncios** con control de privacidad
- 🗺️ **Sitemaps automáticos** para mejor indexación
- 🔒 **Páginas legales** (privacidad, términos, cookies)

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 15    │────│   Sanity CMS    │────│    Vercel       │
│   (Frontend)    │    │   (Headless)    │    │   (Deploy)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Auth.js v5     │    │   Webhooks      │    │   Analytics     │
│  (OAuth)        │    │   (ISR)         │    │   (Tracking)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🆕 Nuevas Funcionalidades

### 📱 Sistema QR Avanzado
- **Generación automática** de códigos QR únicos
- **Acceso temporal** con fechas de expiración
- **Límites de uso** configurables
- **Formularios personalizados** para clientes
- **Estadísticas de uso** en tiempo real

### 🖼️ Gestión de Imágenes
- **Subida múltiple** con drag & drop
- **Optimización automática** con Sanity CDN
- **Reordenamiento visual** de imágenes
- **Metadatos completos** (alt, caption)
- **Límites configurables** por entidad

### 🔐 Autenticación Robusta
- **OAuth social** (Google, GitHub)
- **Magic links** por email
- **TOTP/2FA** para máxima seguridad
- **Roles y permisos** granulares
- **Sesiones seguras** con Auth.js

### 📊 Dashboard Administrativo
- **Interfaz intuitiva** con filtros avanzados
- **Búsqueda en tiempo real** en todas las entidades
- **Estadísticas visuales** y métricas
- **Gestión de usuarios** y permisos
- **Configuraciones avanzadas**

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta en Sanity.io
- Cuenta en Vercel (opcional)

### 1. Clonar y configurar

```bash
# Clonar el repositorio
git clone <repository-url>
cd blog-restaurantes

# Instalar dependencias
npm install

# Copiar variables de entorno
cp env.example .env.local
```

### 2. Configurar Sanity

```bash
# Crear proyecto en Sanity
npx sanity init

# Configurar Studio
npm run studio
```

### 3. Configurar variables de entorno

Edita `.env.local` con tus valores:

```env
# Site Configuration
SITE_URL=https://tu-dominio.com
SITE_NAME="Tu Blog de Reseñas"

# Sanity Configuration
SANITY_PROJECT_ID=tu-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=tu-read-token
SANITY_WEBHOOK_SECRET=tu-webhook-secret

# Auth.js Configuration
AUTH_SECRET=tu-auth-secret
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Database (PostgreSQL)
DATABASE_URL=tu-database-url

# Ads Configuration
NEXT_PUBLIC_ADS_ENABLED=false
ADS_PROVIDER=gam
ADS_SCRIPT_URL=https://securepubads.g.doubleclick.net/tag/js/gpt.js

# Maps Configuration
MAPS_PROVIDER=google
GOOGLE_MAPS_KEY=tu-maps-key

# Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX
PLAUSIBLE_DOMAIN=tu-dominio.com
```

### 4. Ejecutar en desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Sanity Studio (en otra terminal)
npm run studio
```

## 📝 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Next.js dev server
npm run studio       # Sanity Studio

# Build y producción
npm run build        # Build para producción
npm run start        # Servidor de producción

# Testing
npm run test         # Tests unitarios (Vitest)
npm run test:e2e     # Tests E2E (Playwright)
npm run test:e2e:ui  # Tests E2E con UI

# Utilidades
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## 📊 Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (public)/          # Rutas públicas
│   │   └── [city]/        # Páginas dinámicas por ciudad
│   ├── admin/             # Dashboard administrativo
│   ├── api/               # API Routes
│   │   ├── auth/          # Auth.js endpoints
│   │   ├── qr/            # Sistema QR
│   │   ├── upload-image/  # Subida de imágenes
│   │   ├── revalidate/    # Webhook ISR
│   │   └── sitemap/       # Sitemaps dinámicos
│   ├── dashboard/         # Dashboard principal
│   ├── qr/                # Sistema QR público
│   ├── blog/              # Crónicas/artículos
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Homepage
├── components/            # Componentes React
│   ├── ui/                # Componentes base (shadcn/ui)
│   ├── admin/             # Componentes del dashboard
│   ├── ImageManager.tsx   # Gestión de imágenes
│   ├── QRVenueForm.tsx    # Formulario QR
│   ├── AdSlot.tsx         # Anuncios sin CLS
│   ├── FAQ.tsx            # Preguntas frecuentes
│   ├── TLDR.tsx           # Resúmenes AEO
│   ├── ScoreBar.tsx       # Puntuaciones visuales
│   └── Breadcrumbs.tsx    # Navegación + JSON-LD
├── lib/                   # Utilidades
│   ├── auth.ts            # Configuración Auth.js
│   ├── qr-utils.ts        # Utilidades QR
│   ├── sanity.client.ts   # Cliente Sanity
│   ├── groq.ts            # Queries GROQ
│   ├── schema.ts          # Generadores JSON-LD
│   ├── seo.ts             # Helpers SEO
│   └── types.ts           # Tipos TypeScript
├── sanity/                # Configuración CMS
│   ├── schemas/           # Esquemas de contenido
│   │   ├── qr-code.ts     # Esquema QR
│   │   ├── qr-feedback.ts # Esquema feedback QR
│   │   └── ...            # Otros esquemas
│   └── desk/              # Estructura del Studio
├── tests/                 # Tests
│   ├── e2e/               # Playwright
│   └── unit/              # Vitest
└── styles/                # Estilos globales
```

## 🎯 Modelos de Contenido

### Venue (Local)
- Información NAP (Name, Address, Phone)
- Coordenadas GPS y horarios
- Imágenes con hotspot
- Categorías y rango de precios
- Redes sociales

### Review (Reseña)
- Puntuaciones (comida, servicio, ambiente, precio)
- TL;DR optimizado para AEO (50-75 caracteres)
- FAQ con respuestas de 40-55 caracteres
- Pros/contras y platos destacados
- Galería de imágenes

### QR Code (Código QR)
- Código único generado automáticamente
- Local asociado
- Fecha de expiración opcional
- Límite de usos opcional
- Estadísticas de uso

### QR Feedback (Feedback QR)
- Información del visitante
- Detalles de la visita
- Solicitudes especiales
- Comentarios y sugerencias
- Estado de procesamiento

### Post (Crónica)
- Artículos largos estilo blog
- FAQ opcional
- Locales relacionados
- Categorización y tags

### City y Category
- Organización geográfica y temática
- Conteos automáticos
- Imágenes representativas

## 📱 Sistema QR

### Funcionalidades

```typescript
// Generar código QR para un local
const qrCode = await createQRCode({
  venueId: 'local-id',
  title: 'Acceso VIP - Mesa 5',
  expiresAt: '2025-12-31',
  maxUses: 100
});

// URL de acceso: /qr/ABC123XYZ
```

### Flujo de Uso

1. **Admin crea código QR** para un local específico
2. **Sistema valida** el código al acceder
3. **Se registra el uso** automáticamente
4. **Usuario completa formulario** con información de visita
5. **Feedback se almacena** en Sanity para análisis

### Validaciones

- ✅ Código activo/inactivo
- ✅ Fecha de expiración
- ✅ Límite de usos
- ✅ Registro de IP y User Agent

## 🖼️ Gestión de Imágenes

### Componente ImageManager

```typescript
// Componente reutilizable para todas las entidades
<ImageManager
  entityId="venue-id"
  entityType="venue"
  currentImages={images}
  onImagesChange={setImages}
  maxImages={10}
  title="Imágenes del Local"
/>
```

### Características

- **Subida múltiple** con drag & drop
- **Validación automática** de formatos y tamaños
- **Reordenamiento visual** con botones ↑↓
- **Edición de metadatos** (alt, caption)
- **Imagen destacada** automática (primera posición)
- **Eliminación individual** con confirmación

### Límites por Entidad

- **Locales**: 10 imágenes máximo
- **Reseñas**: 20 imágenes máximo
- **Ciudades**: 5 imágenes máximo
- **Categorías**: 5 imágenes máximo

## 🔐 Autenticación

### Configuración Auth.js

```typescript
// lib/auth.ts
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Email({
      server: { /* configuración SMTP */ },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      
      return true;
    },
  },
};
```

### Roles de Usuario

- **Admin**: Acceso completo a todas las funciones
- **Editor**: Puede crear y editar contenido
- **Member**: Solo puede ver contenido
- **Guest**: Acceso limitado

## 📊 Dashboard Administrativo

### Funcionalidades

- **Gestión completa** de locales, reseñas, ciudades y categorías
- **Filtros avanzados** por estado, ciudad, categoría
- **Búsqueda en tiempo real** en todas las entidades
- **Estadísticas visuales** y métricas
- **Sistema QR** integrado
- **Gestión de imágenes** avanzada

### Navegación

```
📊 Dashboard
├── 🏪 Locales
├── ⭐ Reseñas
├── 🏙️ Ciudades
├── 🏷️ Categorías
├── 📱 Códigos QR
├── 📝 Blog
├── 📈 Analytics
├── ⚙️ Configuración
└── 👤 Usuarios
```

## ✍️ Guía Editorial

### Escribir Reseñas Efectivas

#### TL;DR (Resumen AEO)
- **Longitud**: 50-75 caracteres exactos
- **Estructura**: [Local] + [Destacado] + [Veredicto]
- **Ejemplo**: "Marisquería O Porto: pescado fresco, ambiente familiar. Imprescindible."

#### FAQ Optimizadas
- **3-5 preguntas** por reseña
- **Respuestas**: 40-55 caracteres
- **Enfoque**: Preguntas que la gente realmente hace
- **Ejemplo**:
  - P: "¿Aceptan reservas?"
  - R: "Sí, recomendable reservar fines de semana"

#### Puntuaciones
- **Comida** (0-10): Calidad, frescura, preparación
- **Servicio** (0-10): Atención, rapidez, profesionalidad  
- **Ambiente** (0-10): Decoración, música, comodidad
- **Calidad-Precio** (0-10): Relación coste-beneficio

### Workflow Editorial

1. **Crear Local** (si no existe)
   - Datos NAP completos
   - Categorías apropiadas
   - Imágenes de calidad

2. **Crear Reseña**
   - Fecha de visita real
   - Puntuaciones honestas
   - TL;DR impactante
   - FAQ útiles
   - Pros/contras equilibrados

3. **Configurar QR** (opcional)
   - Generar código para el local
   - Configurar límites y expiración
   - Imprimir para uso físico

4. **Publicar y Promocionar**
   - Revisar preview
   - Compartir en redes
   - Monitorear métricas

## 🔧 Configuración Avanzada

### Webhooks de Sanity

1. En tu proyecto Sanity, ve a **Settings > API > Webhooks**
2. Crea un nuevo webhook:
   - **URL**: `https://tu-dominio.com/api/revalidate`
   - **Dataset**: production
   - **Trigger on**: Create, Update, Delete
   - **Filter**: `_type in ["venue", "review", "post", "city", "category", "qrCode", "qrFeedback"]`
   - **Secret**: Tu `SANITY_WEBHOOK_SECRET`

### Analytics

#### Google Analytics 4
```env
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Plausible (alternativa)
```env
PLAUSIBLE_DOMAIN=tu-dominio.com
```

### Anuncios

#### Google Ad Manager
```env
ADS_PROVIDER=gam
ADS_SCRIPT_URL=https://securepubads.g.doubleclick.net/tag/js/gpt.js
NEXT_PUBLIC_ADS_ENABLED=false
```

#### AdSense
```env
ADS_PROVIDER=adsense
NEXT_PUBLIC_ADS_ENABLED=true
```

> Nota: La integración de anuncios en la UI está temporalmente desactivada. Consulta `TODO.md` para el plan de reintroducción.

## 🧪 Testing

### Tests E2E (Playwright)

```bash
# Ejecutar todos los tests
npm run test:e2e

# Test específico
npx playwright test seo-validation

# Con interfaz visual
npm run test:e2e:ui
```

### Tests Unitarios (Vitest)

```bash
# Ejecutar tests
npm run test

# Modo watch
npm run test -- --watch

# Coverage
npm run test -- --coverage
```

## 🚀 Deploy

### Variables de Entorno Requeridas

Antes de desplegar, necesitas configurar las siguientes variables de entorno:

#### 🔐 Autenticación (Obligatorio)
```bash
NEXTAUTH_SECRET=7cce0f4acf16c22f449dfa846c1f8c9bc478e24bb8c9ed9fff4589d142791fb4
```

#### 🏢 Sanity CMS (Obligatorio)
```bash
SANITY_PROJECT_ID=tu-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=tu-read-token
```

### Pasos para Desplegar

1. **Generar NEXTAUTH_SECRET**:
   ```bash
   npm run generate-secret
   ```

2. **Verificar variables de entorno**:
   ```bash
   npm run check-env
   ```

3. **Configurar en Vercel**:
   - Ve a tu proyecto en Vercel Dashboard
   - Settings > Environment Variables
   - Agrega todas las variables requeridas

4. **Desplegar**:
   - Conecta tu repositorio a Vercel
   - El despliegue se ejecutará automáticamente

### Variables Opcionales

```bash
# Database (PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:port/db

# Admin Dashboard
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=$2b$10$...

# Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# IndexNow
INDEXNOW_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Ver `DEPLOYMENT.md` para instrucciones detalladas.

## 🔍 IndexNow Integration

IndexNow permite notificar automáticamente a los motores de búsqueda (Bing, Yandex) cuando el contenido se actualiza.

### Configuración

1. **Obtener clave de IndexNow**:
   - Genera una clave de 32 caracteres hexadecimales
   - Ejemplo: `abcdef1234567890abcdef1234567890`

2. **Configurar variables de entorno**:
   ```bash
   INDEXNOW_KEY=abcdef1234567890abcdef1234567890
   ```

3. **Generar archivo de verificación**:
   ```bash
   npm run indexnow:verify
   ```

4. **Verificar configuración**:
   - Después del deploy, verifica que `https://tu-dominio.com/[TU_CLAVE].txt` devuelve tu clave
   - El archivo debe contener exactamente tu clave de IndexNow

### Funcionamiento

- **Automático**: Se ejecuta en cada webhook de Sanity
- **No bloquea**: El envío es asíncrono y no afecta la revalidación
- **Resiliente**: Los errores se registran pero no interrumpen el flujo
- **Dry-run**: En desarrollo, solo registra el payload sin enviar

### Logs

```bash
# Éxito
IndexNow: 3 URLs enviadas exitosamente (200)

# Configuración incompleta
IndexNow: Configuración incompleta, saltando envío

# Modo desarrollo
IndexNow (dry-run): { "host": "...", "urlList": [...] }
```

## 📈 Monitoreo y Métricas

### Core Web Vitals
- **LCP** < 2.5s ✅
- **FID** < 100ms ✅  
- **CLS** < 0.1 ✅

### SEO Checklist
- ✅ Sitemaps dinámicos
- ✅ JSON-LD en todas las páginas
- ✅ Meta tags optimizados
- ✅ Breadcrumbs con schema
- ✅ Imágenes con alt text
- ✅ URLs semánticas

### AEO (Answer Engine Optimization)
- ✅ TL;DR optimizados
- ✅ FAQ con respuestas concisas
- ✅ Estructura de preguntas naturales
- ✅ Contenido escaneble

## 📚 Documentación

### Guías Principales
- **[📖 Índice Completo de Documentación](docs/README.md)** - Navegación organizada por categorías
- **[Documentación Técnica](docs/TECHNICAL_DOCUMENTATION.md)** - Arquitectura, APIs, componentes
- **[Guía de Usuario](docs/USER_GUIDE.md)** - Manual completo del dashboard
- **[Directrices de Código](CODE_GUIDELINES.md)** - Estándares y mejores prácticas para el código

### Documentación por Categorías
- **[🤖 Desarrollo con IA](docs/ai-development/)** - Reglas, agentes y herramientas de IA
- **[📋 Planificación](docs/planning/)** - Planes maestros y lista de tareas
- **[⚡ Funcionalidades](docs/features/)** - Estados y especificaciones de características
- **[🏗️ Infraestructura](docs/infrastructure/)** - Despliegue y arquitectura técnica
- **[📊 Reportes](docs/reports/)** - Auditorías y análisis del proyecto
- **[🐛 Issues](docs/issues/)** - Seguimiento de problemas identificados

## 🐛 Troubleshooting

### Problemas Comunes

#### Build fails con errores de TypeScript
```bash
npm run type-check
# Revisar errores y corregir
```

#### Sanity Studio no carga
```bash
# Verificar variables de entorno
echo $SANITY_PROJECT_ID
echo $SANITY_DATASET

# Reinstalar Sanity
npm install sanity@latest
```

#### ISR no funciona
- Verificar webhook URL
- Comprobar secret de webhook
- Revisar logs en Vercel

#### Error al subir imágenes
- Verificar formato de archivo (JPG, PNG, WebP)
- Comprobar tamaño (máximo 5MB)
- Verificar permisos de Sanity

#### Código QR no funciona
- Verificar si está activo
- Comprobar fecha de expiración
- Verificar límite de usos

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Add: nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request siguiendo la plantilla

> 📝 Por favor, revisa nuestras [Directrices de Código](CODE_GUIDELINES.md) antes de contribuir. Esto asegura que el código mantenga altos estándares de calidad, SEO y accesibilidad.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Créditos

- **Next.js** - Framework React
- **React 19** - Biblioteca de UI
- **Sanity** - Headless CMS
- **Auth.js** - Autenticación
- **Tailwind CSS** - Framework CSS
- **Vercel** - Platform de deploy
- **Heroicons** - Iconos
- **Playwright** - Testing E2E

---

**¡Hecho con ❤️ para la comunidad gastronómica gallega!** 🥘