import { test, expect } from '@playwright/test';

test.describe('SEO Audit - Detailed', () => {
  test('homepage meta tags optimization', async ({ page }) => {
    await page.goto('/');

    // Check title optimization
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(61); // Google's title limit
    expect(title).not.toContain('undefined');
    expect(title).not.toContain('null');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    const description = await metaDescription.getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(120);
    expect(description!.length).toBeLessThan(161); // Google's description limit
    expect(description).not.toContain('undefined');
    expect(description).not.toContain('null');

    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    if (await canonical.count() > 0) {
      const href = await canonical.getAttribute('href');
      expect(href).toMatch(/^https?:\/\//);
    }

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDescription = page.locator('meta[property="og:description"]');
    const ogImage = page.locator('meta[property="og:image"]');
    const ogUrl = page.locator('meta[property="og:url"]');

    await expect(ogTitle).toBeAttached();
    await expect(ogDescription).toBeAttached();
    await expect(ogImage).toBeAttached();
    await expect(ogUrl).toBeAttached();

    // Check Twitter Card tags
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toBeAttached();
    const cardType = await twitterCard.getAttribute('content');
    expect(['summary', 'summary_large_image']).toContain(cardType);
  });

  test('JSON-LD schema completeness', async ({ page }) => {
    await page.goto('/');

    // Check for JSON-LD scripts
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const scriptCount = await jsonLdScripts.count();
    expect(scriptCount).toBeGreaterThan(0);

    // Check first JSON-LD structure
    const firstScript = jsonLdScripts.first();
    const jsonContent = await firstScript.textContent();
    expect(jsonContent).toBeTruthy();

    const jsonLd = JSON.parse(jsonContent!);
    expect(jsonLd['@context']).toBe('https://schema.org');

    // Should have either @graph or direct schema
    const hasValidStructure = jsonLd['@graph'] || jsonLd['@type'];
    expect(hasValidStructure).toBeTruthy();

    if (jsonLd['@graph']) {
      // Check for WebSite schema
      const websiteSchema = jsonLd['@graph'].find((item: any) => item['@type'] === 'WebSite');
      expect(websiteSchema).toBeTruthy();
      expect(websiteSchema.name).toBeTruthy();
      expect(websiteSchema.url).toBeTruthy();

      // Check for Organization schema
      const orgSchema = jsonLd['@graph'].find((item: any) => item['@type'] === 'Organization');
      expect(orgSchema).toBeTruthy();
      expect(orgSchema.name).toBeTruthy();
      expect(orgSchema.url).toBeTruthy();
    }
  });

  test('robots.txt is properly configured', async ({ request }) => {
    // Check robots.txt
    const robotsResponse = await request.get('/robots.txt');
    expect(robotsResponse.status()).toBe(200);
    
    const robotsContent = await robotsResponse.text();
    expect(robotsContent).toContain('User-agent: *');
    expect(robotsContent).toContain('Allow: /');
    
    // Should block admin areas
    expect(robotsContent).toContain('Disallow: /dashboard/');
    expect(robotsContent).toContain('Disallow: /admin/');
    expect(robotsContent).toContain('Disallow: /studio/');
    expect(robotsContent).toContain('Disallow: /api/');
    
    // Should have sitemap reference
    expect(robotsContent).toContain('Sitemap:');
  });

  test('sitemap accessibility and structure', async ({ request }) => {
    // Check if sitemaps are accessible
    const sitemapTypes = ['static', 'venues', 'reviews', 'posts', 'cities', 'categories'];
    
    for (const type of sitemapTypes) {
      const sitemapResponse = await request.get(`/api/sitemap/${type}`);
      expect(sitemapResponse.status()).toBe(200);
      
      const sitemapContent = await sitemapResponse.text();
      expect(sitemapContent).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemapContent).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(sitemapContent).toContain('<url>');
      expect(sitemapContent).toContain('<loc>');
    }
  });

  test('page performance and Core Web Vitals optimization', async ({ page }) => {
    await page.goto('/');

    // Check for performance optimizations
    
    // Font loading optimization
    const fontPreloads = page.locator('link[rel="preload"][as="font"]');
    // Should have font preloads or font-display: swap
    
    // Image optimization
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first few images for optimization
      for (let i = 0; i < Math.min(3, imageCount); i++) {
        const img = images.nth(i);
        const loading = await img.getAttribute('loading');
        const src = await img.getAttribute('src');
        
        // Images below the fold should be lazy loaded
        if (i > 0) { // First image can be eager loaded
          expect(loading).toBe('lazy');
        }
        
        // Check for Next.js optimized images
        if (src) {
          // Next.js images typically have _next/image or optimized parameters
          const isOptimized = src.includes('_next/image') || src.includes('w=') || src.includes('q=');
          if (!isOptimized) {
            console.warn(`Image may not be optimized: ${src}`);
          }
        }
      }
    }

    // Check for resource hints
    const dnsPreconnects = page.locator('link[rel="dns-prefetch"], link[rel="preconnect"]');
    const hintCount = await dnsPreconnects.count();
    expect(hintCount).toBeGreaterThan(0);
  });

  test('heading structure and SEO hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check heading structure
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBe(1); // Should have exactly one H1

    const h1Text = await h1.first().textContent();
    expect(h1Text).toBeTruthy();
    expect(h1Text!.length).toBeGreaterThan(5);

    // Check that headings are descriptive and not just "Title" or generic text
    const allHeadings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await allHeadings.count();
    
    for (let i = 0; i < Math.min(5, headingCount); i++) {
      const heading = allHeadings.nth(i);
      const text = await heading.textContent();
      
      expect(text).toBeTruthy();
      expect(text!.trim()).not.toBe('');
      expect(text!.toLowerCase()).not.toBe('title');
      expect(text!.toLowerCase()).not.toBe('heading');
    }
  });

  test('internal linking and navigation SEO', async ({ page }) => {
    await page.goto('/');

    // Check for descriptive link text
    const links = page.locator('a[href^="/"], a[href^="../"]'); // Internal links
    const linkCount = await links.count();
    
    expect(linkCount).toBeGreaterThan(0); // Should have internal links
    
    // Sample check for link quality
    for (let i = 0; i < Math.min(10, linkCount); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      
      // Links should have descriptive text, not just "click here" or "read more"
      if (text && text.trim() !== '') {
        const badLinkText = ['click here', 'read more', 'more', 'here', 'link'];
        const isGeneric = badLinkText.some(bad => 
          text.toLowerCase().trim() === bad
        );
        
        if (isGeneric) {
          console.warn(`Generic link text found: "${text}" -> ${href}`);
        }
      }
    }
  });

  test('mobile SEO optimization', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toBeAttached();
    
    const viewportContent = await viewport.getAttribute('content');
    expect(viewportContent).toContain('width=device-width');
    expect(viewportContent).toContain('initial-scale=1');

    // Check that text is readable without zooming
    const bodyText = page.locator('body');
    const fontSize = await bodyText.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    
    const fontSizeValue = parseInt(fontSize);
    expect(fontSizeValue).toBeGreaterThanOrEqual(14); // Minimum readable font size

    // Check for mobile-friendly tap targets
    const buttons = page.locator('button, a, input[type="button"], input[type="submit"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      // Sample check for first few buttons
      for (let i = 0; i < Math.min(3, buttonCount); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        
        if (box) {
          // Tap targets should be at least 44px (iOS) or 48px (Android)
          expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('social media meta tags completeness', async ({ page }) => {
    await page.goto('/');

    // Facebook Open Graph
    const requiredOgTags = [
      'og:title',
      'og:description', 
      'og:image',
      'og:url',
      'og:type',
      'og:site_name'
    ];

    for (const tag of requiredOgTags) {
      const metaTag = page.locator(`meta[property="${tag}"]`);
      await expect(metaTag).toBeAttached();
      
      const content = await metaTag.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content!.trim()).not.toBe('');
    }

    // Twitter Cards
    const requiredTwitterTags = [
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image'
    ];

    for (const tag of requiredTwitterTags) {
      const metaTag = page.locator(`meta[name="${tag}"]`);
      if (await metaTag.count() > 0) {
        const content = await metaTag.getAttribute('content');
        expect(content).toBeTruthy();
        expect(content!.trim()).not.toBe('');
      }
    }
  });

  test('URL structure and SEO friendliness', async ({ page }) => {
    await page.goto('/');

    // Current URL should be SEO-friendly
    const currentUrl = page.url();
    
    // Should use HTTPS
    expect(currentUrl).toMatch(/^https:/);
    
    // Should not have query parameters on main pages (unless for search/filters)
    if (!currentUrl.includes('search') && !currentUrl.includes('filter')) {
      expect(currentUrl).not.toContain('?');
    }
    
    // Check internal links for SEO-friendly URLs
    const internalLinks = page.locator('a[href^="/"]');
    const linkCount = await internalLinks.count();
    
    for (let i = 0; i < Math.min(5, linkCount); i++) {
      const link = internalLinks.nth(i);
      const href = await link.getAttribute('href');
      
      if (href) {
        // URLs should be readable (not just IDs)
        expect(href).not.toMatch(/\/\d+$/); // Don't end with just numbers
        expect(href).not.toMatch(/[?&]id=\d+/); // Avoid ID parameters
        
        // Should use hyphens, not underscores
        if (href.includes('_')) {
          console.warn(`URL uses underscores instead of hyphens: ${href}`);
        }
      }
    }
  });
});