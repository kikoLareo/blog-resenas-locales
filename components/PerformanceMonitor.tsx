"use client";

import { useEffect } from 'react';

interface WebVitals {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  // Enhanced RUM metrics
  sessionId: string;
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

interface NavigationTiming {
  domContentLoaded: number;
  loadComplete: number;
  firstByte: number;
  domInteractive: number;
}

interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
}

declare global {
  interface Window {
    webVitals: WebVitals;
    navigationTiming: NavigationTiming;
    resourceTimings: ResourceTiming[];
  }
}

// Generate a session ID for tracking user sessions
function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get connection information if available
function getConnectionInfo(): { type?: string; effectiveType?: string } {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  return {
    type: connection?.type,
    effectiveType: connection?.effectiveType,
  };
}

// Collect device information
function getDeviceInfo() {
  return {
    deviceMemory: (navigator as any).deviceMemory || undefined,
    hardwareConcurrency: navigator.hardwareConcurrency || undefined,
    userAgent: navigator.userAgent,
  };
}

// Send metrics to analytics endpoint
async function sendMetricsToAPI(metrics: Partial<WebVitals & NavigationTiming>) {
  try {
    await fetch('/api/performance/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metrics),
    });
  } catch (error) {
    // Silently fail - don't break the user experience
    // eslint-disable-next-line no-console
    console.debug('Failed to send performance metrics:', error);
  }
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    const sessionId = generateSessionId();
    const deviceInfo = getDeviceInfo();
    const connectionInfo = getConnectionInfo();

    // Inicializar métricas con información de sesión
    window.webVitals = {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: deviceInfo.userAgent,
      connectionType: connectionInfo.effectiveType || connectionInfo.type,
      deviceMemory: deviceInfo.deviceMemory,
      hardwareConcurrency: deviceInfo.hardwareConcurrency,
    };

    // Initialize navigation timing
    window.navigationTiming = {
      domContentLoaded: 0,
      loadComplete: 0,
      firstByte: 0,
      domInteractive: 0,
    };

    // Initialize resource timings array
    window.resourceTimings = [];

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

    // Monitor Navigation Timing
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            window.webVitals.ttfb = navEntry.responseStart - navEntry.requestStart;
            window.navigationTiming = {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
              loadComplete: navEntry.loadEventEnd - navEntry.fetchStart,
              firstByte: navEntry.responseStart - navEntry.requestStart,
              domInteractive: navEntry.domInteractive - navEntry.fetchStart,
            };
          }
        }
      });
      
      try {
        navigationObserver.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        // Ignore if not supported
      }
    }

    // Monitor Resource Timing
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            const resource: ResourceTiming = {
              name: resourceEntry.name,
              duration: resourceEntry.duration,
              size: resourceEntry.transferSize || 0,
              type: getResourceType(resourceEntry.name),
            };
            window.resourceTimings.push(resource);
          }
        }
      });
      
      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
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

    // Send initial metrics after page load
    const sendInitialMetrics = () => {
      const metrics = {
        ...window.webVitals,
        ...window.navigationTiming,
        resourceCount: window.resourceTimings.length,
        timestamp: Date.now(),
      };

      // Send to Google Analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: window.location.pathname,
          value: Math.round(window.webVitals.lcp),
          non_interaction: true,
          custom_parameter_1: sessionId,
        });

        // Send detailed RUM data
        window.gtag('event', 'rum_data', {
          event_category: 'RUM',
          event_label: 'page_load',
          value: Math.round(window.navigationTiming.loadComplete),
          non_interaction: true,
          custom_parameter_1: sessionId,
          custom_parameter_2: connectionInfo.effectiveType || 'unknown',
        });
      }

      // Send to our API endpoint
      sendMetricsToAPI(metrics);
    };

    // Send metrics after 3 seconds and on page visibility change
    const timeoutId = setTimeout(sendInitialMetrics, 3000);

    // Send metrics when page becomes hidden (user navigates away)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendInitialMetrics();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

  }, []);

  return null; // Este componente no renderiza nada
}

// Helper function to determine resource type
function getResourceType(url: string): string {
  if (url.includes('.js')) return 'script';
  if (url.includes('.css')) return 'stylesheet';
  if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/)) return 'image';
  if (url.includes('.woff') || url.includes('.ttf')) return 'font';
  if (url.includes('/api/')) return 'api';
  return 'other';
}
