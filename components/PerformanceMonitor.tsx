"use client";

import { useEffect } from 'react';

interface WebVitals {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
}

declare global {
  interface Window {
    webVitals: WebVitals;
  }
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    // Inicializar métricas
    window.webVitals = {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
    };

    // Monitor CLS (Cumulative Layout Shift)
    if ('PerformanceObserver' in window) {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            window.webVitals.cls += (entry as any).value;
          }
        }
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Ignore if not supported
      }
    }

    // Monitor LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.webVitals.lcp = lastEntry.startTime;
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Ignore if not supported
      }
    }

    // Monitor FCP (First Contentful Paint)
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            window.webVitals.fcp = entry.startTime;
          }
        }
      });
      
      try {
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        // Ignore if not supported
      }
    }

    // Monitor TTFB (Time to First Byte)
    if ('PerformanceObserver' in window) {
      const ttfbObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            window.webVitals.ttfb = (entry as any).responseStart - (entry as any).requestStart;
          }
        }
      });
      
      try {
        ttfbObserver.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        // Ignore if not supported
      }
    }

    // Monitor FID (First Input Delay) - solo en navegadores que lo soporten
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            window.webVitals.fid = (entry as any).processingStart - (entry as any).startTime;
          }
        }
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Ignore if not supported
      }
    }

    // Log métricas después de 3 segundos
    setTimeout(() => {
      console.log('🚀 Core Web Vitals:', {
        LCP: `${window.webVitals.lcp.toFixed(0)}ms`,
        FCP: `${window.webVitals.fcp.toFixed(0)}ms`,
        CLS: window.webVitals.cls.toFixed(3),
        TTFB: `${window.webVitals.ttfb.toFixed(0)}ms`,
        FID: `${window.webVitals.fid.toFixed(0)}ms`,
      });

      // Enviar métricas a analytics si están disponibles
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: window.location.pathname,
          value: Math.round(window.webVitals.lcp),
          non_interaction: true,
        });
      }
    }, 3000);

  }, []);

  return null; // Este componente no renderiza nada
}
