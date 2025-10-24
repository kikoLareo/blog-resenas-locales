# 🟡 PRIORIDAD MEDIA - Verificar Implementación del Performance Dashboard

## 📋 Descripción del Problema

El Performance Dashboard (`/dashboard/performance`) está implementado con frontend y API routes, pero requiere **verificación y posible configuración adicional** para asegurar que funciona correctamente en producción.

## 📍 Ubicación

**Archivos implementados:**
- ✅ `app/dashboard/performance/page.tsx` - Frontend del dashboard
- ✅ `app/api/performance/metrics/route.ts` - API para métricas de rendimiento
- ✅ `app/api/performance/bundle-analysis/route.ts` - API para análisis de bundle

## 🔍 Estado Actual

### Frontend (✅ Implementado)
- Dashboard con Core Web Vitals (LCP, FCP, CLS, TTFB)
- Visualización de estadísticas agregadas
- Análisis de bundle size
- Recomendaciones de optimización
- Selector de timeframe (1h, 6h, 24h, 7d)
- Loading states y manejo de errores

### Backend - Metrics API (✅ Implementado con limitaciones)
**Archivo:** `app/api/performance/metrics/route.ts`

**Funcionalidad:**
- ✅ POST endpoint para recibir métricas del cliente
- ✅ GET endpoint para obtener métricas agregadas
- ✅ Cálculo de percentiles (P50, P75, P90, P95)
- ✅ Rate limiting (100 métricas por sesión)
- ✅ Limpieza automática de datos antiguos (> 1 hora)

**⚠️ LIMITACIÓN IMPORTANTE:**
```typescript
// Línea 28-29
// Simple in-memory store (in production, use Redis or database)
const performanceStore = new Map<string, PerformanceMetrics[]>();
```

**Problema:** Los datos se almacenan en memoria, lo que significa:
- ❌ Los datos se pierden al reiniciar el servidor
- ❌ No funciona en entornos serverless (Vercel, AWS Lambda)
- ❌ No escala para múltiples instancias del servidor
- ❌ Limitado a datos de la última 1 hora por defecto

### Backend - Bundle Analysis API (✅ Implementado)
**Archivo:** `app/api/performance/bundle-analysis/route.ts`

**Funcionalidad:**
- ✅ Análisis de archivos en `.next/static/`
- ✅ Cálculo de tamaños (raw + estimación gzip)
- ✅ Desglose por tipo (JS, CSS, maps, otros)
- ✅ Recomendaciones automáticas
- ✅ Detección de archivos grandes (> 500KB)

**⚠️ REQUISITO:**
- Requiere que exista el directorio `.next/` (después de `npm run build`)
- En desarrollo, retornará un error 404

### Cliente de Métricas (❓ Desconocido)
**Falta verificar:**
- ¿Existe un script que envíe métricas desde el navegador?
- ¿Dónde se inicializa el tracking de Web Vitals?
- ¿Se está usando `web-vitals` npm package?

## 💥 Impacto

**Severidad:** Media
**Funcionalidad afectada:** Monitoreo de rendimiento
**Riesgos:**
- Pérdida de datos en reinicio de servidor
- No funciona en Vercel/serverless sin modificaciones
- Puede no estar recolectando métricas actualmente

## 🎯 Tareas de Verificación

### 1. Verificar Cliente de Web Vitals

**Buscar script de recolección:**
```bash
# Buscar implementación de web-vitals
grep -r "web-vitals" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js"
grep -r "reportWebVitals" --include="*.tsx" --include="*.ts"
grep -r "/api/performance/metrics" --include="*.tsx" --include="*.ts"
```

**Si no existe, implementar:**

**Archivo:** `lib/performance-tracking.ts`

```typescript
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  sessionId: string;
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  domContentLoaded?: number;
  loadComplete?: number;
}

let sessionId: string | null = null;
const pendingMetrics: Partial<PerformanceMetrics> = {};

function getSessionId(): string {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  return sessionId;
}

function sendMetrics(metrics: Partial<PerformanceMetrics>) {
  const fullMetrics: PerformanceMetrics = {
    ...metrics,
    sessionId: getSessionId(),
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    connectionType: (navigator as any).connection?.effectiveType,
    deviceMemory: (navigator as any).deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    domContentLoaded: performance.timing?.domContentLoadedEventEnd - performance.timing?.navigationStart,
    loadComplete: performance.timing?.loadEventEnd - performance.timing?.navigationStart,
  };

  // Send to API
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/performance/metrics', JSON.stringify(fullMetrics));
  } else {
    fetch('/api/performance/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullMetrics),
      keepalive: true,
    }).catch(console.error);
  }
}

export function initPerformanceTracking() {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  getCLS((metric) => {
    pendingMetrics.cls = metric.value;
    sendMetrics({ cls: metric.value });
  });

  getFCP((metric) => {
    pendingMetrics.fcp = metric.value;
    sendMetrics({ fcp: metric.value });
  });

  getFID((metric) => {
    pendingMetrics.fid = metric.value;
    sendMetrics({ fid: metric.value });
  });

  getLCP((metric) => {
    pendingMetrics.lcp = metric.value;
    sendMetrics({ lcp: metric.value });
  });

  getTTFB((metric) => {
    pendingMetrics.ttfb = metric.value;
    sendMetrics({ ttfb: metric.value });
  });

  // Send complete metrics on page unload
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendMetrics(pendingMetrics);
    }
  });
}
```

**Integrar en layout:**

**Archivo:** `app/layout.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { initPerformanceTracking } from '@/lib/performance-tracking';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Solo en producción o cuando esté habilitado
    if (process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_TRACKING === 'true') {
      initPerformanceTracking();
    }
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

**Instalar dependencia:**
```bash
npm install web-vitals
```

### 2. Migrar Storage de Memoria a Persistente

**Opciones:**

#### Opción A: Redis (Recomendado para producción)
```typescript
// lib/performance-storage.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function storeMetrics(sessionId: string, metrics: any) {
  const key = `perf:${sessionId}`;
  await redis.lpush(key, JSON.stringify(metrics));
  await redis.expire(key, 3600); // 1 hora
}

export async function getMetrics(sessionId: string) {
  const key = `perf:${sessionId}`;
  return await redis.lrange(key, 0, -1);
}
```

#### Opción B: Base de datos (PostgreSQL/Prisma)
```prisma
// prisma/schema.prisma
model PerformanceMetric {
  id                   String   @id @default(cuid())
  sessionId            String
  timestamp            DateTime @default(now())
  lcp                  Float?
  fid                  Float?
  cls                  Float?
  fcp                  Float?
  ttfb                 Float?
  url                  String
  userAgent            String?
  connectionType       String?
  deviceMemory         Float?
  hardwareConcurrency  Int?

  @@index([sessionId])
  @@index([timestamp])
}
```

#### Opción C: Vercel KV (Para deploy en Vercel)
```typescript
import { kv } from '@vercel/kv';

export async function storeMetrics(sessionId: string, metrics: any) {
  await kv.lpush(`perf:${sessionId}`, metrics);
  await kv.expire(`perf:${sessionId}`, 3600);
}
```

### 3. Probar el Dashboard

**Test manual:**
1. Ejecutar `npm run build`
2. Ejecutar `npm start`
3. Abrir `/dashboard/performance`
4. Verificar:
   - ✅ Muestra mensaje "No performance data available yet"
   - ✅ Bundle analysis carga correctamente
   - ✅ Muestra archivos y tamaños
   - ✅ Recomendaciones aparecen

**Test con datos:**
1. Navegar por el sitio público
2. Esperar 1-2 minutos
3. Volver a `/dashboard/performance`
4. Verificar:
   - ✅ Muestra métricas de Core Web Vitals
   - ✅ Los números tienen sentido (LCP < 5s, CLS < 1, etc.)
   - ✅ Selector de timeframe funciona

## ✅ Criterios de Aceptación

### Performance Tracking
- [ ] Script de web-vitals instalado y configurado
- [ ] Métricas se envían desde el navegador
- [ ] API recibe métricas correctamente
- [ ] Datos persisten entre reinicios (si se implementa storage)

### Bundle Analysis
- [ ] Funciona después de `npm run build`
- [ ] Muestra todos los archivos de `.next/static/`
- [ ] Cálculos de tamaño son correctos
- [ ] Recomendaciones son relevantes

### Dashboard UI
- [ ] Carga sin errores
- [ ] Muestra estado vacío cuando no hay datos
- [ ] Muestra métricas cuando hay datos
- [ ] Selector de timeframe funcional
- [ ] Gráficos y estadísticas correctas

### Performance en Producción
- [ ] Funciona en Vercel/serverless (si se usa Redis/KV)
- [ ] No causa lag o problemas de rendimiento
- [ ] Rate limiting funciona correctamente
- [ ] Cleanup de datos antiguos funciona

## ✅ Checklist Pre-Deploy

### Verificaciones de Código
- [ ] `npm install web-vitals` ejecutado
- [ ] `npm run lint` - Sin errores
- [ ] `npm run test` - Todos los tests pasan
- [ ] `npm run build` - Build exitoso sin errores
- [ ] TypeScript sin errores de tipos

### Verificaciones de Configuración
- [ ] Variable `NEXT_PUBLIC_ENABLE_PERFORMANCE_TRACKING` configurada
- [ ] Storage configurado (Redis/KV/DB según elección)
- [ ] Variables de entorno para storage configuradas

### Verificaciones Funcionales - Frontend
- [ ] Dashboard carga sin errores en `/dashboard/performance`
- [ ] Estado vacío se muestra correctamente
- [ ] Bundle analysis muestra datos después de build
- [ ] No hay errores en consola del navegador

### Verificaciones Funcionales - API
- [ ] POST `/api/performance/metrics` acepta métricas
- [ ] GET `/api/performance/metrics` retorna datos agregados
- [ ] GET `/api/performance/bundle-analysis` retorna análisis
- [ ] Rate limiting funciona (probar 100+ requests)

### Verificaciones Funcionales - Tracking
- [ ] Métricas se envían desde páginas públicas
- [ ] Métricas aparecen en el dashboard
- [ ] Los valores de Web Vitals son realistas
- [ ] No hay errores de CORS o permisos

### Verificaciones de Performance
- [ ] Tracking no ralentiza la carga de páginas
- [ ] API responde en < 500ms
- [ ] No hay fugas de memoria
- [ ] Storage no crece indefinidamente

## 📚 Referencias

- Web Vitals: https://web.dev/vitals/
- web-vitals npm: https://github.com/GoogleChrome/web-vitals
- Next.js Performance: https://nextjs.org/docs/app/building-your-application/optimizing
- Código actual: `app/dashboard/performance/page.tsx`

## 🔧 Decisiones a Tomar

1. **Storage:** ¿Redis, KV, PostgreSQL o mantener in-memory?
2. **Tracking:** ¿Solo en producción o también en desarrollo?
3. **Retención:** ¿Cuánto tiempo guardar métricas? (actualmente 1h)
4. **Privacy:** ¿Se debe anonimizar algún dato del usuario?

## 🏷️ Labels

`priority:medium` `verification` `performance` `monitoring` `dashboard` `enhancement`

---

**Fecha de creación:** 2025-10-24
**Estado:** 🟡 Pendiente
**Asignado a:** Por asignar
**Estimación:** 3-4 horas
**Dependencias:** Ninguna (independiente de otros issues)
