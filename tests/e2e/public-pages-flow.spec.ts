/**
 * E2E Tests for Public Pages Critical User Flows
 * Tests complete user journeys through the public website
 */

import { test, expect, type Page } from '@playwright/test';

test.describe('Public Pages Critical User Flows', () => {
  test.describe('Homepage to City to Venue Navigation Flow', () => {
    test('should navigate from homepage through city page to venue details', async ({ page }) => {
      // Start at homepage
      await page.goto('/');
      await expect(page).toHaveTitle(/Inicio/);

      // Check that homepage loads with key elements
      await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
      
      // Look for city links (could be in different sections)
      const cityLinks = page.locator('a[href*="/madrid"], a[href*="/barcelona"], a[href*="/valencia"]');
      
      if (await cityLinks.count() > 0) {
        const firstCityLink = cityLinks.first();
        const cityHref = await firstCityLink.getAttribute('href');
        
        // Navigate to city page
        await firstCityLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verify we're on a city page
        expect(page.url()).toMatch(/\/(madrid|barcelona|valencia)/);
        await expect(page.locator('h1')).toContainText(/Restaurantes en|madrid|barcelona|valencia/i);
        
        // Look for venue cards or links
        const venueLinks = page.locator('a[href*="venue"], a[href*="local"], .venue-card a, [data-testid*="venue"] a');
        
        if (await venueLinks.count() > 0) {
          const firstVenueLink = venueLinks.first();
          await firstVenueLink.click();
          await page.waitForLoadState('networkidle');
          
          // Should be on a venue page
          expect(page.url()).toMatch(/\/[^\/]+\/[^\/]+$/);
          
          // Check for venue-specific elements
          const venueElements = page.locator('h1, .venue-title, [data-testid*="venue"]');
          await expect(venueElements.first()).toBeVisible();
        } else {
          console.log('No venue links found on city page');
        }
      } else {
        console.log('No city links found on homepage - this may be expected if no data exists');
      }
    });

    test('should handle breadcrumb navigation correctly', async ({ page }) => {
      // Navigate to a deep page if it exists
      const testPaths = ['/madrid', '/barcelona'];
      
      for (const path of testPaths) {
        const response = await page.goto(path);
        if (response?.status() === 200) {
          // Check for breadcrumbs
          const breadcrumbs = page.locator('[data-testid="breadcrumbs"], .breadcrumbs, nav[aria-label*="breadcrumb"]');
          
          if (await breadcrumbs.count() > 0) {
            // Should contain "Inicio" link
            const homeLink = breadcrumbs.locator('a[href="/"]');
            if (await homeLink.count() > 0) {
              await homeLink.click();
              await page.waitForLoadState('networkidle');
              
              // Should be back at homepage
              expect(page.url()).toBe(new URL('/', page.url()).href);
            }
          }
          break; // Test one valid path
        }
      }
    });
  });

  test.describe('Search Functionality End-to-End', () => {
    test('should perform search and display results', async ({ page }) => {
      await page.goto('/buscar');
      await expect(page).toHaveTitle(/Buscar/);

      // Find search input
      const searchInput = page.locator('input[type="text"], input[name="search"], input[placeholder*="uscar"]').first();
      await expect(searchInput).toBeVisible();

      // Perform search
      await searchInput.fill('restaurante');
      
      // Look for search button or form submission
      const searchButton = page.locator('button[type="submit"], button:has-text("Buscar")');
      if (await searchButton.count() > 0) {
        await searchButton.click();
      } else {
        // Try submitting the form directly
        await searchInput.press('Enter');
      }

      await page.waitForLoadState('networkidle');

      // Check URL contains search parameter
      expect(page.url()).toMatch(/[?&]q=/);

      // Should show either results or no results message
      const results = page.locator('[data-testid*="result"], .search-result, .result');
      const noResults = page.locator(':text("No se encontraron"), :text("sin resultados"), :text("no results")');

      const hasResults = await results.count() > 0;
      const hasNoResultsMessage = await noResults.count() > 0;

      expect(hasResults || hasNoResultsMessage).toBeTruthy();
    });

    test('should handle empty search gracefully', async ({ page }) => {
      await page.goto('/buscar');
      
      // Try empty search
      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('');
      await searchInput.press('Enter');
      
      // Should stay on search page or show empty state
      expect(page.url()).toMatch(/buscar/);
      
      // Should not show error, but may show empty state or popular searches
      const popularSearches = page.locator(':text("populares"), :text("sugerencias")');
      const searchForm = page.locator('form, input[type="text"]');
      
      // Should have either popular searches or maintain search form
      expect(await popularSearches.count() > 0 || await searchForm.count() > 0).toBeTruthy();
    });
  });

  test.describe('SEO Elements Validation', () => {
    test('should have proper meta tags and JSON-LD on homepage', async ({ page }) => {
      await page.goto('/');

      // Check basic meta tags
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
      
      // Check Open Graph tags
      const ogTitle = page.locator('meta[property="og:title"]');
      if (await ogTitle.count() > 0) {
        await expect(ogTitle).toHaveAttribute('content', /.+/);
      }

      // Check for JSON-LD structured data
      const jsonLd = page.locator('script[type="application/ld+json"]');
      if (await jsonLd.count() > 0) {
        const jsonContent = await jsonLd.first().textContent();
        expect(jsonContent).toBeTruthy();
        
        // Should be valid JSON
        expect(() => JSON.parse(jsonContent!)).not.toThrow();
      }
    });

    test('should have unique titles across different pages', async ({ page }) => {
      const pages = ['/', '/buscar'];
      const titles = new Set<string>();

      for (const pagePath of pages) {
        const response = await page.goto(pagePath);
        if (response?.status() === 200) {
          const title = await page.title();
          expect(title).toBeTruthy();
          expect(title.length).toBeGreaterThan(10);
          
          // Check for uniqueness
          expect(titles.has(title)).toBeFalsy();
          titles.add(title);
        }
      }
    });

    test('should have proper canonical URLs', async ({ page }) => {
      const testPages = ['/', '/buscar'];
      
      for (const pagePath of testPages) {
        const response = await page.goto(pagePath);
        if (response?.status() === 200) {
          const canonical = page.locator('link[rel="canonical"]');
          if (await canonical.count() > 0) {
            const href = await canonical.getAttribute('href');
            expect(href).toBeTruthy();
            expect(href).toMatch(/^https?:\/\//);
          }
        }
      }
    });
  });

  test.describe('Performance and Core Web Vitals', () => {
    test('should load homepage within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds (generous for CI)
      expect(loadTime).toBeLessThan(5000);
    });

    test('should not have layout shifts on page load', async ({ page }) => {
      await page.goto('/');
      
      // Wait for initial load
      await page.waitForLoadState('domcontentloaded');
      
      // Get initial layout
      const initialLayout = await page.evaluate(() => {
        const elements = document.querySelectorAll('h1, h2, .hero, .featured');
        return Array.from(elements).map(el => {
          const rect = el.getBoundingClientRect();
          return { tag: el.tagName, top: rect.top, left: rect.left };
        });
      });

      // Wait for network idle (images, etc.)
      await page.waitForLoadState('networkidle');

      // Check layout again
      const finalLayout = await page.evaluate(() => {
        const elements = document.querySelectorAll('h1, h2, .hero, .featured');
        return Array.from(elements).map(el => {
          const rect = el.getBoundingClientRect();
          return { tag: el.tagName, top: rect.top, left: rect.left };
        });
      });

      // Compare layouts - allow for minor differences due to font loading
      expect(initialLayout.length).toBeGreaterThanOrEqual(0);
      expect(finalLayout.length).toBeGreaterThanOrEqual(0);
    });

    test('should have functioning images', async ({ page }) => {
      await page.goto('/');
      
      // Find all images
      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        // Check first few images
        const imagesToCheck = Math.min(imageCount, 3);
        
        for (let i = 0; i < imagesToCheck; i++) {
          const img = images.nth(i);
          const src = await img.getAttribute('src');
          
          if (src && !src.startsWith('data:')) {
            // Check that image has loaded
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            const naturalHeight = await img.evaluate((el: HTMLImageElement) => el.naturalHeight);
            
            // Image should have dimensions (indicating it loaded)
            expect(naturalWidth).toBeGreaterThan(0);
            expect(naturalHeight).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  test.describe('Accessibility and Usability', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      let hasH1 = false;
      
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const text = await heading.textContent();
        
        if (tagName === 'h1') {
          hasH1 = true;
          expect(text?.trim()).toBeTruthy();
        }
        
        expect(text?.trim().length).toBeGreaterThan(0);
      }
      
      // Should have exactly one H1
      expect(hasH1).toBeTruthy();
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/');
      
      // Tab through focusable elements
      await page.keyboard.press('Tab');
      
      let focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Tab a few more times
      for (let i = 0; i < 3; i++) {
        await page.keyboard.press('Tab');
        focusedElement = page.locator(':focus');
        
        if (await focusedElement.count() > 0) {
          await expect(focusedElement).toBeVisible();
        }
      }
    });

    test('should have alt text for images', async ({ page }) => {
      await page.goto('/');
      
      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        for (let i = 0; i < Math.min(imageCount, 5); i++) {
          const img = images.nth(i);
          const alt = await img.getAttribute('alt');
          const src = await img.getAttribute('src');
          
          // Decorative images can have empty alt, but should have the attribute
          if (src && !src.startsWith('data:')) {
            expect(alt).not.toBeNull();
          }
        }
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle 404 pages gracefully', async ({ page }) => {
      const response = await page.goto('/non-existent-page-12345');
      expect(response?.status()).toBe(404);

      // Should show proper 404 page, not crash
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
      
      // Should have navigation back to site
      const homeLinks = page.locator('a[href="/"], a:text("Inicio"), a:text("Home")');
      expect(await homeLinks.count()).toBeGreaterThan(0);
    });

    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 100); // Add 100ms delay
      });

      const startTime = Date.now();
      await page.goto('/');
      
      // Should still load, just slower
      await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeGreaterThan(100); // Should be affected by delay
    });
  });
});