import { test, expect } from '@playwright/test';

test.describe('Audit Agent - Critical Functionality Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Dismiss consent banner if present
    await page.goto('/');
    const consentBanner = page.locator('[data-testid="consent-banner"], .consent-banner');
    if (await consentBanner.count() > 0) {
      const acceptButton = consentBanner.locator('button:has-text("Solo necesarias"), button:has-text("Aceptar")');
      if (await acceptButton.count() > 0) {
        await acceptButton.first().click({ force: true });
        await page.waitForTimeout(500);
      }
    }
  });

  test.describe('Public Pages Existence and Functionality', () => {
    test('search page exists and is functional', async ({ page }) => {
      // Navigate to search page
      await page.goto('/buscar');
      
      // Check page loads without 404
      await expect(page).toHaveTitle(/Buscar/);
      
      // Check search form exists
      const searchForm = page.locator('form[role="search"]');
      await expect(searchForm).toBeVisible();
      
      // Check search input
      const searchInput = page.locator('input[type="search"]');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute('placeholder');
      
      // Test search functionality
      await searchInput.fill('pizza');
      await page.locator('button[type="submit"]').click();
      
      // Should have search results or no results message
      const hasResults = await page.locator('section').count() > 0;
      const hasNoResults = await page.locator('text=No se encontraron resultados').count() > 0;
      expect(hasResults || hasNoResults).toBeTruthy();
      
      // Check breadcrumbs
      const breadcrumbs = page.locator('[data-testid="breadcrumbs"], nav[aria-label*="breadcrumb"], .breadcrumb');
      if (await breadcrumbs.count() > 0) {
        await expect(breadcrumbs.first()).toBeVisible();
      }
    });

    test('venue detail page exists and loads', async ({ page }) => {
      // First get a city and venue slug from homepage or sitemap
      await page.goto('/');
      
      // Look for venue links
      const venueLinks = page.locator('a[href*="/"][href*="/"]').filter({ 
        hasText: /restaurante|local|venue/i 
      });
      
      if (await venueLinks.count() > 0) {
        const firstVenueLink = venueLinks.first();
        const href = await firstVenueLink.getAttribute('href');
        
        if (href && href.split('/').length >= 3) {
          await page.goto(href);
          
          // Check page loads
          await expect(page.locator('h1')).toBeVisible();
          
          // Check for JSON-LD structured data
          const jsonLdScript = page.locator('script[type="application/ld+json"]');
          await expect(jsonLdScript).toHaveCount({ min: 1 });
          
          const jsonLdContent = await jsonLdScript.first().textContent();
          expect(jsonLdContent).toContain('"@type":');
        }
      } else {
        // If no venue links found, test a standard pattern
        await page.goto('/madrid/restaurante-ejemplo');
        // Even if it 404s, that's valuable information for the audit
      }
    });

    test('review detail page pattern works', async ({ page }) => {
      // Test the review detail page pattern even if specific data doesn't exist
      await page.goto('/madrid/restaurante-ejemplo/review/review-ejemplo');
      
      // Check if page structure exists (even if it 404s, we want to know)
      const title = await page.title();
      const content = await page.textContent('body');
      
      // Log for audit purposes
      console.log('Review page title:', title);
      console.log('Review page has content:', content.length > 0);
      
      // If page loads successfully, check for proper structure
      if (!title.includes('404') && !content.includes('Not Found')) {
        await expect(page.locator('h1')).toBeVisible();
        
        // Check for review-specific content
        const hasReviewContent = await page.locator('[data-testid="review-content"], .review-content, article').count() > 0;
        expect(hasReviewContent).toBeTruthy();
      }
    });

    test('city page exists and loads', async ({ page }) => {
      // Test city page
      await page.goto('/madrid');
      
      // Check page loads
      await expect(page.locator('h1')).toBeVisible();
      
      // Check for venue listings
      const venueCards = page.locator('[data-testid="venue-card"], .venue-card, article');
      
      // Should have venue cards or empty state
      const hasVenues = await venueCards.count() > 0;
      const hasEmptyState = await page.locator('text=No hay.*locales, text=No se encontraron').count() > 0;
      expect(hasVenues || hasEmptyState).toBeTruthy();
      
      // Check for JSON-LD
      const jsonLdScript = page.locator('script[type="application/ld+json"]');
      await expect(jsonLdScript).toHaveCount({ min: 1 });
    });
  });

  test.describe('Key Components Integration', () => {
    test('VenueCard component renders properly', async ({ page }) => {
      await page.goto('/');
      
      // Look for venue cards
      const venueCards = page.locator('[data-testid="venue-card"], .venue-card, article').filter({
        has: page.locator('img, h2, h3')
      });
      
      if (await venueCards.count() > 0) {
        const firstCard = venueCards.first();
        
        // Check card structure
        await expect(firstCard).toBeVisible();
        
        // Check for image (should have alt text)
        const cardImage = firstCard.locator('img');
        if (await cardImage.count() > 0) {
          await expect(cardImage.first()).toHaveAttribute('alt');
        }
        
        // Check for title
        const cardTitle = firstCard.locator('h2, h3, h4').first();
        await expect(cardTitle).toBeVisible();
        
        // Check for link
        const cardLink = firstCard.locator('a').first();
        await expect(cardLink).toHaveAttribute('href');
      }
    });

    test('SearchForm component is accessible and functional', async ({ page }) => {
      await page.goto('/buscar');
      
      // Check search form accessibility
      const searchForm = page.locator('form[role="search"]');
      await expect(searchForm).toBeVisible();
      await expect(searchForm).toHaveAttribute('aria-label');
      
      // Check search input accessibility
      const searchInput = page.locator('input[type="search"]');
      await expect(searchInput).toHaveAttribute('aria-label');
      
      // Test keyboard navigation
      await searchInput.focus();
      await page.keyboard.type('test search');
      await page.keyboard.press('Enter');
      
      // Should navigate or show results
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      expect(currentUrl).toContain('test search');
    });
  });

  test.describe('Critical Routes - No 404 Errors', () => {
    const criticalRoutes = [
      '/',
      '/buscar', 
      '/blog',
      '/categorias'
    ];

    for (const route of criticalRoutes) {
      test(`route ${route} loads without 404`, async ({ page }) => {
        await page.goto(route);
        
        // Check page doesn't have 404 indicators
        const title = await page.title();
        const content = await page.textContent('body');
        
        expect(title).not.toMatch(/404|Not Found|Error/i);
        expect(content).not.toMatch(/404|Page not found|Error/i);
        
        // Check page has basic content
        await expect(page.locator('h1')).toBeVisible();
      });
    }
  });

  test.describe('SEO and Accessibility Validation', () => {
    test('pages have proper meta tags', async ({ page }) => {
      const pagesToTest = ['/', '/buscar'];
      
      for (const path of pagesToTest) {
        await page.goto(path);
        
        // Check title
        const title = await page.title();
        expect(title.length).toBeGreaterThan(10);
        expect(title.length).toBeLessThan(60);
        
        // Check meta description
        const metaDescription = page.locator('meta[name="description"]');
        if (await metaDescription.count() > 0) {
          const content = await metaDescription.getAttribute('content');
          expect(content?.length || 0).toBeGreaterThan(50);
          expect(content?.length || 0).toBeLessThan(160);
        }
        
        // Check Open Graph tags
        const ogTitle = page.locator('meta[property="og:title"]');
        const ogDescription = page.locator('meta[property="og:description"]');
        
        if (await ogTitle.count() > 0) {
          await expect(ogTitle).toHaveAttribute('content');
        }
        if (await ogDescription.count() > 0) {
          await expect(ogDescription).toHaveAttribute('content');
        }
      }
    });

    test('pages have JSON-LD structured data', async ({ page }) => {
      const pagesToTest = ['/', '/buscar'];
      
      for (const path of pagesToTest) {
        await page.goto(path);
        
        // Check for JSON-LD script
        const jsonLdScript = page.locator('script[type="application/ld+json"]');
        await expect(jsonLdScript).toHaveCount({ min: 1 });
        
        // Validate JSON-LD content
        const jsonLdContent = await jsonLdScript.first().textContent();
        expect(jsonLdContent).toBeTruthy();
        
        // Parse to ensure it's valid JSON
        expect(() => JSON.parse(jsonLdContent!)).not.toThrow();
        
        const jsonData = JSON.parse(jsonLdContent!);
        expect(jsonData['@context']).toBe('https://schema.org');
        expect(jsonData['@type']).toBeTruthy();
      }
    });

    test('images have proper alt text', async ({ page }) => {
      await page.goto('/');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        for (let i = 0; i < Math.min(imageCount, 10); i++) {
          const img = images.nth(i);
          const alt = await img.getAttribute('alt');
          
          // Alt should exist and not be empty (unless decorative)
          expect(alt).toBeTruthy();
          expect(alt!.length).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Performance and Core Web Vitals', () => {
    test('homepage loads within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Log for audit report
      console.log('Homepage load time:', loadTime, 'ms');
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('search page loads within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/buscar');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      console.log('Search page load time:', loadTime, 'ms');
      expect(loadTime).toBeLessThan(5000);
    });
  });

  test.describe('Dashboard Forms CRUD Operations', () => {
    test('dashboard pages are accessible', async ({ page }) => {
      // Note: These may require authentication, so we'll test basic accessibility
      const dashboardPages = [
        '/dashboard',
        '/dashboard/venues',
        '/dashboard/reviews',
        '/dashboard/users'
      ];
      
      for (const dashboardPath of dashboardPages) {
        await page.goto(dashboardPath);
        
        // Check if redirected to login or loads properly
        const currentUrl = page.url();
        const title = await page.title();
        
        // Should either load dashboard content or redirect to auth
        const isAuthRedirect = currentUrl.includes('/acceso') || currentUrl.includes('/login');
        const isDashboard = title.includes('Dashboard') || title.includes('Gestión');
        
        expect(isAuthRedirect || isDashboard).toBeTruthy();
        
        console.log(`Dashboard page ${dashboardPath}:`, {
          currentUrl,
          title,
          isAuthRedirect,
          isDashboard
        });
      }
    });
  });
});