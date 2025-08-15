import { test, expect } from '@playwright/test';

interface WebVitals {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
}

test.describe('Core Web Vitals Performance', () => {
  test('homepage meets Core Web Vitals thresholds', async ({ page }) => {
    // Initialize Web Vitals monitoring
    await page.addInitScript(() => {
      window.webVitals = {
        lcp: 0,
        fid: 0,
        cls: 0,
        fcp: 0,
        ttfb: 0,
      };

      // Monitor CLS
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            window.webVitals.cls += entry.value;
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });

      // Monitor LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.webVitals.lcp = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor FCP
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            window.webVitals.fcp = entry.startTime;
          }
        }
      }).observe({ entryTypes: ['paint'] });

      // Monitor TTFB
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            window.webVitals.ttfb = entry.responseStart - entry.requestStart;
          }
        }
      }).observe({ entryTypes: ['navigation'] });
    });

    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for metrics to be collected
    await page.waitForTimeout(3000);

    // Get Web Vitals
    const vitals = await page.evaluate(() => window.webVitals) as WebVitals;

    // Core Web Vitals thresholds (Google's "Good" thresholds)
    expect(vitals.lcp).toBeLessThan(2500); // LCP < 2.5s
    expect(vitals.cls).toBeLessThan(0.1);  // CLS < 0.1
    expect(vitals.fcp).toBeLessThan(1800); // FCP < 1.8s
    expect(vitals.ttfb).toBeLessThan(800); // TTFB < 0.8s

    console.log('Web Vitals Results:', {
      LCP: `${vitals.lcp.toFixed(2)}ms (threshold: <2500ms)`,
      CLS: `${vitals.cls.toFixed(4)} (threshold: <0.1)`,
      FCP: `${vitals.fcp.toFixed(2)}ms (threshold: <1800ms)`,
      TTFB: `${vitals.ttfb.toFixed(2)}ms (threshold: <800ms)`,
    });
  });

  test('venue pages maintain good performance', async ({ page }) => {
    await page.addInitScript(() => {
      window.webVitals = { lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0 };

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            window.webVitals.cls += entry.value;
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.webVitals.lcp = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    });

    await page.goto('/');
    
    // Navigate to a venue page if available
    const venueLink = page.locator('a[href*="/"]').first();
    if (await venueLink.count() > 0) {
      await venueLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      const vitals = await page.evaluate(() => window.webVitals) as WebVitals;
      
      // Venue pages should also meet thresholds
      expect(vitals.lcp).toBeLessThan(3000); // Slightly more lenient for content pages
      expect(vitals.cls).toBeLessThan(0.1);
    }
  });

  test('images are optimized and load efficiently', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check image optimization
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 5); i++) { // Test first 5 images
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      
      if (src) {
        // Check if images use modern formats or optimization services
        const isOptimized = src.includes('webp') || 
                          src.includes('avif') || 
                          src.includes('cdn.sanity.io') ||
                          src.includes('cloudinary') ||
                          src.includes('/_next/image');
        
        expect(isOptimized).toBeTruthy();
        
        // Check loading attribute
        const loading = await img.getAttribute('loading');
        if (i > 0) { // First image should load immediately
          expect(loading).toBe('lazy');
        }
      }
    }
  });

  test('JavaScript bundles are optimized', async ({ page }) => {
    const responses: string[] = [];
    
    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('.js') && !url.includes('node_modules')) {
        responses.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that JS files are compressed
    for (const url of responses.slice(0, 3)) { // Test first 3 JS files
      const response = await page.request.get(url);
      const headers = response.headers();
      
      // Should have compression
      expect(headers['content-encoding']).toBeTruthy();
    }
  });

  test('critical resources load quickly', async ({ page }) => {
    const resourceTimings: any[] = [];
    
    await page.addInitScript(() => {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const resources = performance.getEntriesByType('resource');
        
        window.resourceTimings = {
          navigation: {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
            loadComplete: navigation.loadEventEnd - navigation.navigationStart,
          },
          criticalResources: resources
            .filter((resource: PerformanceResourceTiming) => 
              resource.name.includes('.css') || resource.name.includes('.js')
            )
            .map((resource: PerformanceResourceTiming) => ({
              name: resource.name,
              duration: resource.duration,
              size: resource.transferSize,
            }))
        };
      });
    });

    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);

    const timings = await page.evaluate(() => window.resourceTimings);
    expect(timings).toBeTruthy();
    expect(timings.navigation?.domContentLoaded).toBeGreaterThanOrEqual(0);
    
    // DOM Content Loaded should be fast
    expect(timings.navigation.domContentLoaded).toBeLessThan(1500);
    
    // Critical resources should load quickly
    if (Array.isArray(timings.criticalResources)) {
      timings.criticalResources.forEach((resource: any) => {
        expect(resource.duration).toBeLessThan(2000);
      });
    }
  });

  test('mobile performance meets standards', async ({ page }) => {
    // Set mobile viewport and simulate slow 3G
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Simulate slow network (optional - requires CDP)
    try {
      const client = await page.context().newCDPSession(page);
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 300,
        downloadThroughput: 1600000, // 1.6 Mbps
        uploadThroughput: 750000,    // 750 Kbps
      });
    } catch {
      // CDP not available, continue without network throttling
    }

    await page.addInitScript(() => {
      window.webVitals = { lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0 };

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.webVitals.lcp = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            window.webVitals.cls += entry.value;
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000); // Extra time for mobile

    const vitals = await page.evaluate(() => window.webVitals) as WebVitals;
    
    // Mobile thresholds (slightly more lenient)
    expect(vitals.lcp).toBeLessThan(4000); // LCP < 4s on mobile
    expect(vitals.cls).toBeLessThan(0.1);  // CLS < 0.1
  });

  test('accessibility performance standards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test keyboard navigation performance
    const startTime = Date.now();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const endTime = Date.now();
    
    // Keyboard navigation should be responsive
    expect(endTime - startTime).toBeLessThan(100);

    // Check for focus indicators
    const focusedElement = page.locator(':focus');
    if (await focusedElement.count() > 0) {
      const outline = await focusedElement.evaluate((el) => 
        window.getComputedStyle(el).outline
      );
      expect(outline).not.toBe('none');
    }
  });
});

// Extend Window type for Web Vitals monitoring
declare global {
  interface Window {
    webVitals: WebVitals;
    resourceTimings: any;
  }
}