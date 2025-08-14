import { test, expect } from '@playwright/test';

test.describe('CLS Zero Tests', () => {
  test('homepage loads without layout shifts (CLS = 0)', async ({ page }) => {
    // Start monitoring layout shifts
    await page.addInitScript(() => {
      window.layoutShifts = [];
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            window.layoutShifts.push(entry);
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    });

    await page.goto('/');
    
    // Wait for page to fully load including any async content
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Additional wait for any delayed content
    
    // Calculate CLS score
    const clsScore = await page.evaluate(() => {
      return window.layoutShifts.reduce((score, entry) => score + entry.value, 0);
    });
    
    // CLS should be 0 (perfect score)
    expect(clsScore).toBe(0);
    
    // Verify that ad slots have reserved space
    const adSlots = page.locator('[data-testid="ad-slot"]');
    const adSlotCount = await adSlots.count();
    
    for (let i = 0; i < adSlotCount; i++) {
      const adSlot = adSlots.nth(i);
      await expect(adSlot).toBeVisible();
      
      // Verify fixed dimensions are set
      const styles = await adSlot.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          width: computed.width,
          height: computed.height,
          minHeight: computed.minHeight,
        };
      });
      
      expect(styles.width).not.toBe('auto');
      expect(styles.height).not.toBe('auto');
      expect(styles.minHeight).not.toBe('0px');
    }
  });

  test('ad loading does not cause layout shifts', async ({ page }) => {
    let layoutShifts = [];
    
    // Monitor layout shifts during ad loading
    await page.addInitScript(() => {
      window.layoutShifts = [];
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            window.layoutShifts.push(entry);
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    });

    await page.goto('/');
    
    // Find an ad slot
    const adSlot = page.locator('[data-testid="ad-slot"]').first();
    await expect(adSlot).toBeVisible();
    
    // Get initial dimensions
    const initialDimensions = await adSlot.boundingBox();
    
    // Wait for any potential ad loading
    await page.waitForTimeout(3000);
    
    // Get final dimensions
    const finalDimensions = await adSlot.boundingBox();
    
    // Dimensions should not have changed
    expect(finalDimensions?.width).toBe(initialDimensions?.width);
    expect(finalDimensions?.height).toBe(initialDimensions?.height);
    
    // Check CLS score
    const clsScore = await page.evaluate(() => {
      return window.layoutShifts.reduce((score, entry) => score + entry.value, 0);
    });
    
    expect(clsScore).toBe(0);
  });

  test('images load without causing layout shifts', async ({ page }) => {
    await page.addInitScript(() => {
      window.layoutShifts = [];
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            window.layoutShifts.push(entry);
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    });

    await page.goto('/');
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check that images have proper dimensions
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const hasWidth = await img.getAttribute('width');
      const hasHeight = await img.getAttribute('height');
      const hasAspectRatio = await img.evaluate((el) => {
        return window.getComputedStyle(el).aspectRatio !== 'auto';
      });
      
      // Images should have either explicit dimensions or aspect ratio
      expect(hasWidth || hasHeight || hasAspectRatio).toBeTruthy();
    }
    
    // Calculate final CLS score
    const clsScore = await page.evaluate(() => {
      return window.layoutShifts.reduce((score, entry) => score + entry.value, 0);
    });
    
    expect(clsScore).toBeLessThanOrEqual(0.1); // Good CLS score
  });

  test('dynamic content loading maintains layout stability', async ({ page }) => {
    await page.addInitScript(() => {
      window.layoutShifts = [];
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            window.layoutShifts.push(entry);
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    });

    await page.goto('/');
    
    // Interact with dynamic elements (like FAQ accordions)
    const faqButtons = page.locator('.faq-question');
    const faqCount = await faqButtons.count();
    
    if (faqCount > 0) {
      // Click on first FAQ item
      await faqButtons.first().click();
      await page.waitForTimeout(500);
      
      // Click on second FAQ item if exists
      if (faqCount > 1) {
        await faqButtons.nth(1).click();
        await page.waitForTimeout(500);
      }
    }
    
    // Check CLS after interactions
    const clsScore = await page.evaluate(() => {
      return window.layoutShifts.reduce((score, entry) => score + entry.value, 0);
    });
    
    // Should still be very low even with dynamic content
    expect(clsScore).toBeLessThanOrEqual(0.05);
  });

  test('mobile viewport maintains zero CLS', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.addInitScript(() => {
      window.layoutShifts = [];
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            window.layoutShifts.push(entry);
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Calculate CLS score on mobile
    const clsScore = await page.evaluate(() => {
      return window.layoutShifts.reduce((score, entry) => score + entry.value, 0);
    });
    
    expect(clsScore).toBe(0);
    
    // Verify responsive ad slots maintain their dimensions
    const adSlots = page.locator('[data-testid="ad-slot"]');
    const adSlotCount = await adSlots.count();
    
    for (let i = 0; i < adSlotCount; i++) {
      const adSlot = adSlots.nth(i);
      if (await adSlot.isVisible()) {
        const dimensions = await adSlot.boundingBox();
        expect(dimensions?.width).toBeGreaterThan(0);
        expect(dimensions?.height).toBeGreaterThan(0);
      }
    }
  });
});

// Extend Window type for layout shift monitoring
declare global {
  interface Window {
    layoutShifts: any[];
  }
}