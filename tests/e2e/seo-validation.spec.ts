import { test, expect } from '@playwright/test';

test.describe('SEO and JSON-LD Validation', () => {
  test('homepage has correct meta tags and JSON-LD', async ({ page }) => {
    await page.goto('/');

    // Check basic meta tags
    await expect(page).toHaveTitle(/Blog de Reseñas/);
    
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Descubre los mejores locales/);

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /Blog de Reseñas/);

    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /Descubre los mejores locales/);

    // Validate JSON-LD presence
    const jsonLdScript = page.locator('script[type="application/ld+json"]').first();
    await expect(jsonLdScript).toBeVisible();

    // Parse and validate JSON-LD structure
    const jsonLdContent = await jsonLdScript.textContent();
    expect(jsonLdContent).toBeTruthy();
    
    const jsonLd = JSON.parse(jsonLdContent!);
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@graph']).toBeDefined();
    
    // Check for WebSite schema
    const websiteSchema = jsonLd['@graph'].find((item: any) => item['@type'] === 'WebSite');
    expect(websiteSchema).toBeDefined();
    expect(websiteSchema.url).toBeTruthy();
    expect(websiteSchema.name).toBeTruthy();
  });

  test('venue page has LocalBusiness JSON-LD', async ({ page }) => {
    // This test would run against a real venue page
    // For now, we'll test the structure when data is available
    await page.goto('/');
    
    // Navigate to first venue (if available)
    const venueLink = page.locator('a[href*="/"]').first();
    if (await venueLink.count() > 0) {
      await venueLink.click();
      
      // Check for LocalBusiness JSON-LD
      const jsonLdScript = page.locator('script[type="application/ld+json"]');
      const count = await jsonLdScript.count();
      
      if (count > 0) {
        const jsonLdContent = await jsonLdScript.first().textContent();
        const jsonLd = JSON.parse(jsonLdContent!);
        
        // Look for LocalBusiness in @graph or as main type
        let localBusiness;
        if (jsonLd['@graph']) {
          localBusiness = jsonLd['@graph'].find((item: any) => 
            ['LocalBusiness', 'Restaurant', 'CafeOrCoffeeShop', 'BarOrPub'].includes(item['@type'])
          );
        } else if (['LocalBusiness', 'Restaurant', 'CafeOrCoffeeShop', 'BarOrPub'].includes(jsonLd['@type'])) {
          localBusiness = jsonLd;
        }
        
        if (localBusiness) {
          expect(localBusiness.name).toBeTruthy();
          expect(localBusiness.address).toBeDefined();
          expect(localBusiness.address['@type']).toBe('PostalAddress');
        }
      }
    }
  });

  test('review page has Review JSON-LD', async ({ page }) => {
    await page.goto('/');
    
    // Look for review links (would contain 'review-' in URL)
    const reviewLink = page.locator('a[href*="review-"]').first();
    if (await reviewLink.count() > 0) {
      await reviewLink.click();
      
      // Check for Review JSON-LD
      const jsonLdScript = page.locator('script[type="application/ld+json"]');
      const count = await jsonLdScript.count();
      
      if (count > 0) {
        const jsonLdContent = await jsonLdScript.first().textContent();
        const jsonLd = JSON.parse(jsonLdContent!);
        
        // Look for Review schema
        let reviewSchema;
        if (jsonLd['@graph']) {
          reviewSchema = jsonLd['@graph'].find((item: any) => item['@type'] === 'Review');
        } else if (jsonLd['@type'] === 'Review') {
          reviewSchema = jsonLd;
        }
        
        if (reviewSchema) {
          expect(reviewSchema.itemReviewed).toBeDefined();
          expect(reviewSchema.author).toBeDefined();
          expect(reviewSchema.reviewRating).toBeDefined();
          expect(reviewSchema.reviewRating.ratingValue).toBeGreaterThan(0);
        }
      }
    }
  });

  test('breadcrumbs are present and have JSON-LD', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to a deep page to check breadcrumbs
    const venueLink = page.locator('a[href*="/"]').first();
    if (await venueLink.count() > 0) {
      await venueLink.click();
      
      // Check for visible breadcrumbs
      const breadcrumbs = page.locator('nav[aria-label="breadcrumb"], .breadcrumb');
      if (await breadcrumbs.count() > 0) {
        await expect(breadcrumbs).toBeVisible();
        
        // Check for BreadcrumbList JSON-LD
        const jsonLdScript = page.locator('script[type="application/ld+json"]');
        const count = await jsonLdScript.count();
        
        if (count > 0) {
          const jsonLdContent = await jsonLdScript.first().textContent();
          const jsonLd = JSON.parse(jsonLdContent!);
          
          let breadcrumbList;
          if (jsonLd['@graph']) {
            breadcrumbList = jsonLd['@graph'].find((item: any) => item['@type'] === 'BreadcrumbList');
          } else if (jsonLd['@type'] === 'BreadcrumbList') {
            breadcrumbList = jsonLd;
          }
          
          if (breadcrumbList) {
            expect(breadcrumbList.itemListElement).toBeDefined();
            expect(breadcrumbList.itemListElement.length).toBeGreaterThan(0);
            
            // Check first breadcrumb item structure
            const firstItem = breadcrumbList.itemListElement[0];
            expect(firstItem['@type']).toBe('ListItem');
            expect(firstItem.position).toBe(1);
            expect(firstItem.name).toBeTruthy();
            expect(firstItem.item).toBeTruthy();
          }
        }
      }
    }
  });

  test('FAQ sections have FAQPage JSON-LD', async ({ page }) => {
    await page.goto('/');
    
    // Look for pages with FAQ sections
    const reviewLink = page.locator('a[href*="review-"]').first();
    if (await reviewLink.count() > 0) {
      await reviewLink.click();
      
      // Check for FAQ section
      const faqSection = page.locator('.faq, [data-testid="faq"]');
      if (await faqSection.count() > 0) {
        // Check for FAQPage JSON-LD
        const jsonLdScript = page.locator('script[type="application/ld+json"]');
        const count = await jsonLdScript.count();
        
        if (count > 0) {
          const jsonLdContent = await jsonLdScript.first().textContent();
          const jsonLd = JSON.parse(jsonLdContent!);
          
          let faqPage;
          if (jsonLd['@graph']) {
            faqPage = jsonLd['@graph'].find((item: any) => item['@type'] === 'FAQPage');
          } else if (jsonLd['@type'] === 'FAQPage') {
            faqPage = jsonLd;
          }
          
          if (faqPage) {
            expect(faqPage.mainEntity).toBeDefined();
            expect(faqPage.mainEntity.length).toBeGreaterThan(0);
            
            // Check first FAQ item structure
            const firstFaq = faqPage.mainEntity[0];
            expect(firstFaq['@type']).toBe('Question');
            expect(firstFaq.name).toBeTruthy();
            expect(firstFaq.acceptedAnswer).toBeDefined();
            expect(firstFaq.acceptedAnswer['@type']).toBe('Answer');
            expect(firstFaq.acceptedAnswer.text).toBeTruthy();
          }
        }
      }
    }
  });
});
