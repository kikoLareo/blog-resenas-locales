# 🎯 PLAN MAESTRO DE AGENTES - Blog de Reseñas de Restaurantes

> **Jefe Orquestador**: Claude  
> **Gestor de Agentes**: Usuario (usando Ctrl+E en Cursor)  
> **Objetivo**: Crear blog completo con 5 agentes especializados trabajando en paralelo

## 📋 RESUMEN EJECUTIVO

**5 AGENTES ESPECIALIZADOS** trabajando en paralelo para crear el blog completo:

1. **SANITY-ARCHITECT** → Esquemas CMS + Configuración
2. **BACKEND-MASTER** → API Routes + GROQ + JSON-LD + Utilidades
3. **REACT-SPECIALIST** → Componentes + Páginas + Layouts
4. **SEO-OPTIMIZER** → Tests + Validaciones + Performance
5. **DEVOPS-CONFIGURATOR** → Configuración + Documentación + Deploy

---

## 🚀 AGENTE #1: SANITY-ARCHITECT

### **Activación en Cursor**: 
```
Ctrl+E → "Eres SANITY-ARCHITECT: Especialista experto en Sanity CMS. Crear TODOS los esquemas (venue, review, post, city, category) con configuración Studio v3 completa para blog de reseñas de restaurantes con optimización SEO/JSON-LD."
```

### **Tareas Específicas**:

#### ✅ ESQUEMAS PRINCIPALES
1. **`sanity/schemas/venue.ts`** - COMPLETAR con todos los campos:
   - title, slug, city (ref), address, postalCode, phone, website
   - geo (geopoint), openingHours, priceRange, categories
   - images con hotspot, description, social links
   - schemaType (Restaurant, CafeOrCoffeeShop, etc.)

2. **`sanity/schemas/review.ts`** - COMPLETAR con:
   - ratings (food, service, ambience, value 0-10)
   - tldr (50-75 caracteres), faq (array Q&A optimizado)
   - pros/cons, highlights, gallery, visitDate
   - avgTicket, author, tags

3. **`sanity/schemas/post.ts`** - Crónicas con FAQ opcional
4. **`sanity/schemas/city.ts`** - Ciudades con geo y descripción  
5. **`sanity/schemas/category.ts`** - Categorías de restaurantes

#### ✅ CONFIGURACIÓN STUDIO
6. **`sanity.config.ts`** - Studio v3 completo
7. **`sanity/schemas/index.ts`** - Exportar todos los esquemas
8. **`sanity/desk/structure.ts`** - Estructura personalizada del CMS

### **Criterios de Aceptación**:
- ✅ Todos los esquemas con validaciones estrictas
- ✅ Preview personalizado para cada schema
- ✅ Campos optimizados para JSON-LD
- ✅ Studio funcional y deployable

### **Herramientas**: `edit_file`, `read_file`, `grep`

---

## 🚀 AGENTE #2: BACKEND-MASTER

### **Activación en Cursor**:
```
Ctrl+E → "Eres BACKEND-MASTER: Especialista backend Next.js + Sanity. Crear TODAS las API routes, cliente Sanity, queries GROQ, generadores JSON-LD, helpers SEO y webhook ISR para blog de reseñas con performance óptimo."
```

### **Tareas Específicas**:

#### ✅ CLIENTE SANITY + QUERIES
1. **`lib/sanity.client.ts`** - Cliente con cache y optimizaciones
2. **`lib/groq.ts`** - Queries tipadas:
   - `venueBySlug(slug)` → datos + reseñas recientes
   - `reviewBySlug(slug)` → reseña + venue relacionado  
   - `latestReviews(limit)` → cards homepage
   - `postsByTag(tag)` → posts relacionados
   - `citiesWithCounts()` → ciudades con conteos

#### ✅ JSON-LD GENERATORS  
3. **`lib/schema.ts`** - Generadores completos:
   - `localBusinessJsonLd(venue)` → LocalBusiness schema
   - `reviewJsonLd(review, venue)` → Review schema  
   - `articleJsonLd(post)` → Article/BlogPosting
   - `faqJsonLd(faq[])` → FAQPage
   - `breadcrumbsJsonLd(items)` → BreadcrumbList

#### ✅ API ROUTES
4. **`app/api/revalidate/route.ts`** - Webhook Sanity con ISR
5. **`app/api/sitemap/route.ts`** - Sitemap dinámico
6. **`app/api/sitemap/[type]/route.ts`** - Sitemaps por tipo

#### ✅ UTILIDADES SEO
7. **`lib/seo.ts`** - Helpers metas, canonical, OG
8. **`lib/images.ts`** - Optimización imágenes Sanity
9. **`lib/types.ts`** - Interfaces TypeScript

### **Criterios de Aceptación**:
- ✅ ISR funcionando con revalidación por tags
- ✅ JSON-LD válido según schema.org
- ✅ Queries GROQ optimizadas con cache
- ✅ Sitemap dinámico generado

### **Herramientas**: `edit_file`, `read_file`, `grep`, `run_terminal_cmd`

---

## 🚀 AGENTE #3: REACT-SPECIALIST  

### **Activación en Cursor**:
```
Ctrl+E → "Eres REACT-SPECIALIST: Expert React/Next.js App Router. Crear TODOS los componentes (AdSlot sin CLS, FAQ, TLDR, ScoreBar, Gallery, Breadcrumbs) y páginas principales (Home, Venue, Review, Blog) con SEO completo y estructura semántica."
```

### **Tareas Específicas**:

#### ✅ COMPONENTES CRÍTICOS
1. **`components/AdSlot.tsx`** - Sin CLS, lazy loading, diferentes tamaños
2. **`components/FAQ.tsx`** - Schema.org markup, acordeón accesible
3. **`components/TLDR.tsx`** - Texto optimizado AEO 50-75 palabras
4. **`components/ScoreBar.tsx`** - Ratings visuales 0-10, accesible
5. **`components/Gallery.tsx`** - Next/Image optimizado, responsive
6. **`components/Breadcrumbs.tsx`** - Navegación + JSON-LD
7. **`components/LocalInfo.tsx`** - NAP, horarios, mapa embed

#### ✅ PÁGINAS PRINCIPALES  
8. **`app/layout.tsx`** - Layout principal con SEO
9. **`app/page.tsx`** - Homepage con últimas reseñas
10. **`app/(public)/[city]/[venue]/page.tsx`** - Ficha Local
11. **`app/(public)/[city]/[venue]/review-[date]/page.tsx`** - Reseña completa
12. **`app/blog/[slug]/page.tsx`** - Post/Crónica
13. **`app/categorias/[slug]/page.tsx`** - Listados por categoría

### **Criterios de Aceptación**:
- ✅ Zero CLS en carga de anuncios
- ✅ Componentes accesibles (ARIA, keyboard nav)
- ✅ Server Components por defecto
- ✅ SEO completo en todas las páginas

### **Herramientas**: `edit_file`, `read_file`, `grep`

---

## 🚀 AGENTE #4: SEO-OPTIMIZER

### **Activación en Cursor**:
```
Ctrl+E → "Eres SEO-OPTIMIZER: Especialista en testing, SEO y performance. Crear tests E2E Playwright para validar JSON-LD, tests CLS zero, performance tests Core Web Vitals, y validaciones SEO automatizadas."
```

### **Tareas Específicas**:

#### ✅ TESTS E2E (PLAYWRIGHT)
1. **`tests/e2e/seo-validation.spec.ts`** - Validar JSON-LD presente y válido
2. **`tests/e2e/cls-zero.spec.ts`** - Test CLS=0 en carga anuncios
3. **`tests/e2e/performance.spec.ts`** - Core Web Vitals tests
4. **`tests/e2e/navigation.spec.ts`** - Breadcrumbs y navegación

#### ✅ TESTS UNITARIOS (VITEST)
5. **`tests/unit/components/AdSlot.test.tsx`** - Componente sin CLS
6. **`tests/unit/components/FAQ.test.tsx`** - Accesibilidad
7. **`tests/unit/lib/schema.test.ts`** - JSON-LD generators  
8. **`tests/unit/lib/groq.test.ts`** - Queries Sanity

#### ✅ CONFIGURACIÓN TESTING
9. **`playwright.config.ts`** - Configuración completa E2E
10. **`vitest.config.ts`** - Tests unitarios  

### **Criterios de Aceptación**:
- ✅ JSON-LD validado en Rich Results Test
- ✅ CLS=0 verificado automáticamente  
- ✅ Core Web Vitals >90 en Lighthouse
- ✅ Tests automatizados en CI/CD

### **Herramientas**: `edit_file`, `read_file`, `run_terminal_cmd`, `grep`

---

## 🚀 AGENTE #5: DEVOPS-CONFIGURATOR

### **Activación en Cursor**:
```
Ctrl+E → "Eres DEVOPS-CONFIGURATOR: Expert en configuración, documentación y deploy. Crear .env.example, README completo, estilos globales, robots.txt, scripts de build, y documentación para influencer."
```

### **Tareas Específicas**:

#### ✅ CONFIGURACIÓN ENTORNO
1. **`.env.example`** - Todas las variables necesarias documentadas
2. **`styles/globals.css`** - Estilos base + variables CSS
3. **`public/robots.txt`** - SEO optimizado
4. **`public/favicon.ico`** + assets básicos

#### ✅ SCRIPTS Y HERRAMIENTAS  
5. **`scripts/generate-sitemap.ts`** - Generación sitemap
6. **`scripts/indexnow-verify.ts`** - Verificación para SEO
7. **Setup ESLint + Prettier** - Configuración completa

#### ✅ DOCUMENTACIÓN COMPLETA
8. **`README.md`** - Guía completa:
   - Instalación paso a paso
   - Comandos desarrollo  
   - Guía contenido (TL;DR, FAQs, estructura)
   - Checklist publicación
   - Arquitectura del proyecto

9. **`CONTENT_GUIDE.md`** - Guía para influencer:
   - Cómo escribir TL;DR efectivos
   - FAQ optimization para AEO
   - Best practices SEO
   - Workflow editorial

### **Criterios de Aceptación**:
- ✅ Documentación clara para equipos
- ✅ Setup reproducible
- ✅ Configuración production-ready
- ✅ Guías para redactores no técnicos

### **Herramientas**: `edit_file`, `read_file`, `run_terminal_cmd`

---

## 📊 COORDINACIÓN Y DEPENDENCIAS

### **ORDEN DE EJECUCIÓN RECOMENDADO**:
1. **SANITY-ARCHITECT** (1º) → Base de datos y esquemas
2. **BACKEND-MASTER** (2º) → APIs y lógica de negocio  
3. **REACT-SPECIALIST** (3º) → Interfaz y páginas
4. **SEO-OPTIMIZER** (4º) → Tests y validaciones
5. **DEVOPS-CONFIGURATOR** (5º) → Configuración final y documentación

### **TRABAJO EN PARALELO POSIBLE**:
- SANITY-ARCHITECT + DEVOPS-CONFIGURATOR (configuración base)
- BACKEND-MASTER + REACT-SPECIALIST (después de esquemas listos)
- SEO-OPTIMIZER (después de componentes básicos)

---

## ✅ CRITERIOS FINALES DE ACEPTACIÓN

### **Funcionales**:
- ✅ Blog completamente funcional
- ✅ CMS Sanity Studio deployado
- ✅ ISR funcionando con webhooks
- ✅ JSON-LD válido en todas las páginas

### **Performance**:
- ✅ Core Web Vitals > 90
- ✅ CLS = 0 en carga de anuncios
- ✅ LCP < 2.5s en páginas clave
- ✅ SEO Score > 95 en Lighthouse

### **SEO/AEO**:
- ✅ Sitemaps dinámicos generados
- ✅ FAQs optimizadas para featured snippets
- ✅ TL;DR optimizados para respuestas de voz
- ✅ Schema.org markup completo

---

## 🎯 INSTRUCCIONES PARA EL GESTOR

**Para activar cada agente**:
1. Presiona `Ctrl+E` en Cursor
2. Copia y pega el comando de activación específico
3. Monitorea progreso desde el panel
4. Revisa y aprueba cambios antes de mergear
5. Coordina dependencias entre agentes

**Comunicación conmigo (Jefe Orquestador)**:
- Reporta progreso de cada agente
- Consulta sobre conflictos o dudas técnicas  
- Solicita ajustes en prioridades si es necesario

¡**LISTOS PARA CONQUISTAR EL MUNDO GASTRONÓMICO GALLEGO!** 🚀🍽️