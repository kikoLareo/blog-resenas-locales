# Performance Monitoring & Core Web Vitals

Este documento describe la implementación completa de monitoreo de rendimiento, Real User Monitoring (RUM) y seguimiento de Core Web Vitals en el blog de reseñas locales.

## 📊 Características Implementadas

### 1. Real User Monitoring (RUM)
- **Recopilación automática** de métricas de usuarios reales
- **Seguimiento de sesiones** con IDs únicos
- **Información del dispositivo** (memoria, CPU, conexión)
- **Almacenamiento en tiempo real** de métricas

### 2. Core Web Vitals Tracking
- **LCP** (Largest Contentful Paint) - Pintura del contenido más grande
- **FID** (First Input Delay) - Retraso de primera entrada
- **CLS** (Cumulative Layout Shift) - Cambio de diseño acumulativo
- **FCP** (First Contentful Paint) - Primera pintura de contenido
- **TTFB** (Time to First Byte) - Tiempo hasta el primer byte

### 3. Análisis de Bundles
- **Análisis automático** del tamaño de los bundles
- **Desglose por tipo** de archivo (JS, CSS, mapas)
- **Recomendaciones** de optimización
- **Seguimiento de compresión** gzip

## 🚀 Configuración

### Dependencias Instaladas
```bash
npm install --save-dev @next/bundle-analyzer webpack-bundle-analyzer
```

### Variables de Entorno
```env
# Google Analytics (ya configurado)
GA_MEASUREMENT_ID=G-XSLBYXBEZJ

# Para análisis de bundles (opcional)
ANALYZE=true
```

## 📈 Uso del Sistema

### 1. Monitoreo Automático
El componente `PerformanceMonitor` se ejecuta automáticamente en cada página:
- Se carga en `app/layout.tsx`
- Recopila métricas sin intervención del usuario
- Envía datos a Google Analytics y API interna

### 2. Dashboard de Rendimiento
Accede al dashboard en: `/dashboard/performance`

**Métricas mostradas:**
- Core Web Vitals con percentiles (P50, P75, P95)
- Información de dispositivos y conexiones
- Análisis de bundles en tiempo real
- Recomendaciones de optimización

### 3. API Endpoints

#### GET `/api/performance/metrics`
Obtiene métricas agregadas:
```javascript
// Métricas de la última hora
fetch('/api/performance/metrics')

// Métricas personalizadas
fetch('/api/performance/metrics?hours=24')

// Métricas de sesión específica
fetch('/api/performance/metrics?sessionId=session_123')
```

#### POST `/api/performance/metrics`
Envía métricas (usado automáticamente):
```javascript
{
  "sessionId": "session_123",
  "lcp": 1200,
  "fid": 50,
  "cls": 0.05,
  "fcp": 800,
  "ttfb": 200,
  "timestamp": 1673545200000,
  "url": "https://example.com/page",
  "connectionType": "4g",
  "deviceMemory": 8,
  "hardwareConcurrency": 8
}
```

#### GET `/api/performance/bundle-analysis`
Análisis de bundles de producción:
```javascript
{
  "totalSize": 2048576,
  "totalGzipSize": 614400,
  "files": [...],
  "breakdown": {
    "javascript": 1536000,
    "css": 256000,
    "sourceMaps": 256576,
    "other": 0
  },
  "recommendations": [...]
}
```

## 🔧 Scripts Disponibles

### Análisis de Bundles
```bash
# Análizar bundles y abrir reporte visual
npm run analyze

# Análizar solo el servidor
npm run analyze:server

# Análizar solo el cliente
npm run analyze:browser
```

### Testing de Rendimiento
```bash
# Ejecutar tests de rendimiento con Playwright
npm run test:e2e

# Solo tests de rendimiento
npx playwright test tests/e2e/performance.spec.ts

# Test con Lighthouse
npm run performance
```

## 📊 Interpretación de Métricas

### Core Web Vitals - Umbrales
| Métrica | Bueno | Necesita Mejora | Pobre |
|---------|-------|-----------------|-------|
| **LCP** | ≤ 2.5s | 2.5s - 4s | > 4s |
| **FID** | ≤ 100ms | 100ms - 300ms | > 300ms |
| **CLS** | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| **FCP** | ≤ 1.8s | 1.8s - 3s | > 3s |
| **TTFB** | ≤ 800ms | 800ms - 1.8s | > 1.8s |

### Percentiles Explicados
- **P50** (Mediana): 50% de usuarios tiene esta experiencia o mejor
- **P75**: 75% de usuarios tiene esta experiencia o mejor  
- **P95**: 95% de usuarios tiene esta experiencia o mejor

## 🛠️ Optimizaciones Implementadas

### 1. Configuración Next.js (`next.config.mjs`)
- **Compresión** habilitada
- **Optimización de imágenes** WebP/AVIF
- **División de código** automática
- **Cache headers** optimizados

### 2. Componente PerformanceMonitor
- **Observadores de rendimiento** nativos del navegador
- **Detección de conexión** y dispositivo
- **Envío automático** de métricas
- **Manejo de errores** silencioso

### 3. Optimizaciones de Fuentes
```javascript
// Font loading optimizado en layout.tsx
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',        // Evita FOIT
  preload: true,          // Precarga crítica
  fallback: ['system-ui', 'arial'], // Fallbacks
});
```

## 📱 Monitoreo Móvil

El sistema incluye detección específica para dispositivos móviles:
- **Throttling de red** en tests
- **Métricas específicas** para conexiones lentas
- **Umbrales ajustados** para dispositivos móviles
- **Detección de memoria** del dispositivo

## 🔍 Debugging y Troubleshooting

### Verificar Recopilación de Métricas
```javascript
// En DevTools Console
console.log(window.webVitals);
console.log(window.navigationTiming);
console.log(window.resourceTimings);
```

### Logs de Desarrollo
```bash
# Ver métricas en desarrollo
npm run dev
# Abrir DevTools → Network → XHR → /api/performance/metrics
```

### Problemas Comunes

1. **No se muestran métricas**
   - Verificar que JavaScript esté habilitado
   - Confirmar que el navegador soporte PerformanceObserver

2. **Bundle analysis falla**
   - Ejecutar `npm run build` primero
   - Verificar permisos de lectura en `.next/`

3. **Métricas inconsistentes**
   - Los valores pueden variar por condiciones de red
   - Usar percentiles para análisis agregado

## 📚 Referencias

- [Web Vitals - Google](https://web.dev/vitals/)
- [Core Web Vitals - Google Developers](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics)
- [PerformanceObserver API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)

## 🔄 Próximas Mejoras

- [ ] Integración con herramientas de APM externas
- [ ] Alertas automáticas por degradación de rendimiento
- [ ] Análisis de tendencias históricas
- [ ] Comparación de rendimiento por páginas
- [ ] Exportación de reportes automática