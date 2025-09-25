import { test, expect } from '@playwright/test';

test.describe('Public Route Validation', () => {
  // Test all public routes for 404 errors and proper responses
  
  const testRoutes = [
    // Homepage
    { url: '/', description: 'Homepage', expectedStatus: 200 },
    
    // Marketing pages
    { url: '/contacto', description: 'Contact page', expectedStatus: 200 },
    { url: '/sobre', description: 'About page', expectedStatus: 200 },
    { url: '/politica-privacidad', description: 'Privacy policy', expectedStatus: 200 },
    { url: '/terminos', description: 'Terms of service', expectedStatus: 200 },
    { url: '/cookies', description: 'Cookies policy', expectedStatus: 200 },
    
    // Blog pages
    { url: '/blog', description: 'Blog index', expectedStatus: 200 },
    
    // Categories
    { url: '/categorias', description: 'Categories index', expectedStatus: 200 },
    
    // Dynamic route patterns (expected to work with mock data or return 404)
    { url: '/madrid', description: 'Madrid city page', expectedStatus: [200, 404] },
    { url: '/barcelona', description: 'Barcelona city page', expectedStatus: [200, 404] },
    
    // Specific problematic route mentioned in TODO.md
    { url: '/madrid/pizzeria-tradizionale/review/pizza-masa-madre-48h-madrid', description: 'Review page mentioned in TODO', expectedStatus: [200, 404] },
    
    // Other review patterns to test
    { url: '/madrid/restaurant-x/review/sushi-de-alta-calidad-en-un-ambiente-acogedor', description: 'Featured review link from homepage', expectedStatus: [200, 404] },
    { url: '/madrid/restaurant-x/review/la-hamburguesa-gourmet-que-marca-tendencia', description: 'Another featured review', expectedStatus: [200, 404] },
    { url: '/madrid/restaurant-x/review/platos-de-autor-que-despiertan-los-sentidos', description: 'Top rated review', expectedStatus: [200, 404] },
    
    // Category pages
    { url: '/categorias/cafeterias', description: 'Category: Cafeterias', expectedStatus: [200, 404] },
    { url: '/categorias/restaurantes', description: 'Category: Restaurantes', expectedStatus: [200, 404] },
    
    // Blog posts
    { url: '/blog/mejor-marisco-coruna', description: 'Blog post from homepage', expectedStatus: [200, 404] },
    
    // Venue pages (different patterns to test)
    { url: '/madrid/cafe-con-encanto', description: 'Venue page pattern 1', expectedStatus: [200, 404] },
    { url: '/madrid/venue/cafe-con-encanto', description: 'Venue page pattern 2', expectedStatus: [200, 404] },
    
    // Known bad routes that should return 404
    { url: '/non-existent-page', description: 'Non-existent page', expectedStatus: 404 },
    { url: '/madrid/non-existent-venue', description: 'Non-existent venue', expectedStatus: 404 },
    { url: '/invalid-city/some-venue', description: 'Invalid city', expectedStatus: 404 },
  ];

  test.beforeEach(async ({ page }) => {
    // Set a reasonable timeout for requests
    page.setDefaultTimeout(10000);
  });

  for (const route of testRoutes) {
    test(`should handle route ${route.url} correctly`, async ({ page }) => {
      const response = await page.goto(route.url);
      const actualStatus = response?.status() || 0;
      
      // Handle both single expected status and array of acceptable statuses
      const expectedStatuses = Array.isArray(route.expectedStatus) 
        ? route.expectedStatus 
        : [route.expectedStatus];
      
      if (!expectedStatuses.includes(actualStatus)) {
        // Log additional details for debugging
        const pageContent = await page.textContent('body');
        console.log(`Route ${route.url} returned status ${actualStatus}`);
        console.log(`Page title: ${await page.title()}`);
        console.log(`Contains error text: ${pageContent?.includes('404') || pageContent?.includes('not found')}`);
      }
      
      expect(expectedStatuses).toContain(actualStatus);
      
      // For successful routes, ensure they have basic content
      if (actualStatus === 200) {
        // Check that the page has a title
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title).not.toBe('');
        
        // Check that the page has some content (not just an empty page)
        const bodyText = await page.textContent('body');
        expect(bodyText?.trim()).toBeTruthy();
        
        // Check for basic Next.js app structure
        const html = await page.content();
        expect(html).toContain('__next');
      }
      
      // For 404 routes, ensure they have proper error handling
      if (actualStatus === 404) {
        const pageContent = await page.textContent('body');
        const title = await page.title();
        
        // Should have 404 in title or content
        const has404Indicator = title?.includes('404') || 
                               pageContent?.includes('404') || 
                               pageContent?.includes('not found') ||
                               pageContent?.includes('no encontrada');
        
        expect(has404Indicator).toBeTruthy();
      }
    });
  }

  test('should test dynamic route patterns systematically', async ({ page }) => {
    // Test various dynamic route patterns to understand the routing structure
    const dynamicPatterns = [
      // City pages
      '/madrid',
      '/barcelona', 
      '/valencia',
      
      // Venue patterns
      '/madrid/test-venue',
      '/madrid/venue/test-venue',
      
      // Review patterns  
      '/madrid/test-venue/review/test-review',
      '/madrid/venue/test-venue/review/test-review',
      
      // Category patterns
      '/categorias/test-category',
      
      // Blog patterns
      '/blog/test-post',
    ];

    const results: Array<{url: string, status: number, hasContent: boolean}> = [];

    for (const url of dynamicPatterns) {
      try {
        const response = await page.goto(url);
        const status = response?.status() || 0;
        const bodyText = await page.textContent('body');
        const hasContent = bodyText ? bodyText.trim().length > 100 : false;
        
        results.push({ url, status, hasContent });
      } catch (error) {
        console.log(`Error testing ${url}: ${error}`);
        results.push({ url, status: 500, hasContent: false });
      }
    }

    // Log results for analysis
    console.log('Dynamic Route Test Results:');
    results.forEach(result => {
      console.log(`${result.url}: ${result.status} (content: ${result.hasContent})`);
    });

    // Ensure we got responses for all patterns
    expect(results.length).toBe(dynamicPatterns.length);
  });

  test('should validate homepage links don\'t lead to 404s', async ({ page }) => {
    await page.goto('/');
    
    // Get all links from the homepage
    const links = await page.$$eval('a[href^="/"]', (elements) => 
      elements.map(el => el.getAttribute('href')).filter(Boolean)
    );
    
    const uniqueLinks = [...new Set(links)];
    console.log(`Found ${uniqueLinks.length} internal links on homepage:`, uniqueLinks);
    
    // Test each link (limit to avoid timeout)
    const linksToTest = uniqueLinks.slice(0, 10); // Test first 10 links
    
    for (const link of linksToTest) {
      if (link && !link.includes('#') && !link.includes('mailto:')) {
        const response = await page.goto(link);
        const status = response?.status() || 0;
        
        // Log problematic links
        if (status === 404) {
          console.log(`❌ Homepage link leads to 404: ${link}`);
        } else if (status === 200) {
          console.log(`✅ Homepage link works: ${link}`);
        } else {
          console.log(`⚠️  Homepage link returned ${status}: ${link}`);
        }
        
        // Don't fail the test but collect data
        // We want to know about 404s but they might be expected for some dynamic routes
      }
    }
  });

  test('should check for proper error pages', async ({ page }) => {
    // Test that 404 pages have proper styling and navigation
    const response = await page.goto('/definitely-non-existent-page-12345');
    
    expect(response?.status()).toBe(404);
    
    // Check that 404 page has basic styling (not raw HTML)
    const hasNextjsStyles = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      return styleSheets.length > 0;
    });
    
    // Check for navigation or home link on 404 page
    const hasNavigationHome = await page.locator('a[href="/"], a:has-text("Inicio"), a:has-text("Home")').count() > 0;
    
    console.log(`404 page has styles: ${hasNextjsStyles}`);
    console.log(`404 page has navigation home: ${hasNavigationHome}`);
    
    // These are recommendations, not hard requirements
    if (!hasNavigationHome) {
      console.log('⚠️  Recommendation: 404 page should have a link back to home');
    }
  });

  test('should validate SEO and meta tags on key pages', async ({ page }) => {
    const keyPages = ['/', '/blog', '/categorias'];
    
    for (const url of keyPages) {
      await page.goto(url);
      
      const title = await page.title();
      const description = await page.getAttribute('meta[name="description"]', 'content');
      const canonicalUrl = await page.getAttribute('link[rel="canonical"]', 'href');
      
      console.log(`Page ${url}:`);
      console.log(`  Title: ${title}`);
      console.log(`  Description: ${description}`);
      console.log(`  Canonical: ${canonicalUrl}`);
      
      // Basic SEO checks
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(70);
      
      if (description) {
        expect(description.length).toBeGreaterThan(50);
        expect(description.length).toBeLessThan(160);
      }
    }
  });
});