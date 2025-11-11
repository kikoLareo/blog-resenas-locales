"use client";

import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  inp?: number;
  
  // Enhanced RUM metrics
  sessionId: string;
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  
  // Navigation timing
  domContentLoaded?: number;
  loadComplete?: number;
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
async function sendMetricsToAPI(metrics: Partial<PerformanceMetrics>) {
  try {
    // Use sendBeacon if available (more reliable for page unload)
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(metrics)], { type: 'application/json' });
      navigator.sendBeacon('/api/performance/metrics', blob);
    } else {
      await fetch('/api/performance/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
        keepalive: true,
      });
    }
  } catch (error) {
    // Silently fail - don't break the user experience
    // eslint-disable-next-line no-console
    console.debug('Failed to send performance metrics:', error);
  }
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check if tracking is enabled (default to true for backward compatibility)
    const trackingEnabled = process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_TRACKING !== 'false';
    if (!trackingEnabled) {
      return;
    }

    const sessionId = generateSessionId();
    const deviceInfo = getDeviceInfo();
    const connectionInfo = getConnectionInfo();

    // Store pending metrics
    const pendingMetrics: Partial<PerformanceMetrics> = {
      sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: deviceInfo.userAgent,
      connectionType: connectionInfo.effectiveType || connectionInfo.type,
      deviceMemory: deviceInfo.deviceMemory,
      hardwareConcurrency: deviceInfo.hardwareConcurrency,
    };

    // Get navigation timing data
    if ('performance' in window && 'timing' in window.performance) {
      const timing = window.performance.timing;
      pendingMetrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      pendingMetrics.loadComplete = timing.loadEventEnd - timing.navigationStart;
    }

    // Track Core Web Vitals using official web-vitals library
    const handleMetric = (metric: Metric) => {
      const metricValue = metric.value;
      const metricName = metric.name.toLowerCase();

      // Update pending metrics
      if (metricName === 'lcp') {
        pendingMetrics.lcp = metricValue;
      } else if (metricName === 'fid') {
        pendingMetrics.fid = metricValue;
      } else if (metricName === 'cls') {
        pendingMetrics.cls = metricValue;
      } else if (metricName === 'fcp') {
        pendingMetrics.fcp = metricValue;
      } else if (metricName === 'ttfb') {
        pendingMetrics.ttfb = metricValue;
      } else if (metricName === 'inp') {
        // INP replaces FID in newer browsers, map it to both for compatibility
        pendingMetrics.inp = metricValue;
        pendingMetrics.fid = metricValue;
      }

      // Send individual metric update
      sendMetricsToAPI({
        ...pendingMetrics,
        [metricName]: metricValue,
        timestamp: Date.now(),
      });

      // Send to Google Analytics if available
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: window.location.pathname,
          value: Math.round(metricValue),
          non_interaction: true,
          metric_id: metric.id,
          metric_value: metricValue,
          metric_delta: metric.delta,
        });
      }
    };

    // Register Core Web Vitals listeners
    onCLS(handleMetric);
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
    onINP(handleMetric); // Interaction to Next Paint (replaces FID in newer browsers)

    // Send complete metrics when page becomes hidden (user navigates away)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendMetricsToAPI({
          ...pendingMetrics,
          timestamp: Date.now(),
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

  }, []);

  return null; // This component doesn't render anything
}
