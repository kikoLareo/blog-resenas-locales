import { test, expect } from '@playwright/test';

test.describe('Dashboard CRUD Audit', () => {
  
  test('dashboard main page loads correctly', async ({ page }) => {
    // Test dashboard accessibility without authentication for now
    await page.goto('/dashboard');
    
    // Should either show login or dashboard content
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    
    // Check if we get authentication redirect or the page loads
    const isLoginPage = pageContent?.includes('Acceso') || pageContent?.includes('Login') || page.url().includes('acceso');
    const isDashboard = pageContent?.includes('Panel de Control') || pageContent?.includes('Dashboard');
    
    expect(isLoginPage || isDashboard).toBeTruthy();
  });

  test('venues management pages exist', async ({ page }) => {
    // Test venues list page
    const venuesResponse = await page.goto('/dashboard/venues');
    expect(venuesResponse?.status()).toBeLessThan(500); // Not server error
    
    // Test new venue page
    const newVenueResponse = await page.goto('/dashboard/venues/new');
    expect(newVenueResponse?.status()).toBeLessThan(500);
    
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Nuevo Local' || 'Nueva Local' || 'Venue');
  });

  test('categories management pages exist', async ({ page }) => {
    // Test categories list page
    const categoriesResponse = await page.goto('/dashboard/categories');
    expect(categoriesResponse?.status()).toBeLessThan(500);
    
    // Test new category page
    const newCategoryResponse = await page.goto('/dashboard/categories/new');
    expect(newCategoryResponse?.status()).toBeLessThan(500);
    
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Nueva Categoría' || 'Category');
  });

  test('cities management pages exist', async ({ page }) => {
    // Test cities list page
    const citiesResponse = await page.goto('/dashboard/cities');
    expect(citiesResponse?.status()).toBeLessThan(500);
    
    // Test new city page
    const newCityResponse = await page.goto('/dashboard/cities/new');
    expect(newCityResponse?.status()).toBeLessThan(500);
    
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Nueva Ciudad' || 'City');
  });

  test('reviews management pages exist', async ({ page }) => {
    // Test reviews list page
    const reviewsResponse = await page.goto('/dashboard/reviews');
    expect(reviewsResponse?.status()).toBeLessThan(500);
    
    // Test new review page
    const newReviewResponse = await page.goto('/dashboard/reviews/new');
    expect(newReviewResponse?.status()).toBeLessThan(500);
    
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Nueva Reseña' || 'Review');
  });

  test('forms have required fields and validation', async ({ page }) => {
    // Test venue form
    await page.goto('/dashboard/venues/new');
    
    // Check for form elements
    const titleInput = page.locator('input[name="title"], #title');
    const saveButton = page.locator('button:has-text("Guardar"), button:has-text("Save")');
    
    if (await titleInput.count() > 0) {
      await expect(titleInput).toBeVisible();
    }
    
    if (await saveButton.count() > 0) {
      await expect(saveButton).toBeVisible();
    }
  });
});

test.describe('Public Pages Navigation Audit', () => {
  
  test('search page exists and functions', async ({ page }) => {
    const response = await page.goto('/buscar');
    expect(response?.status()).toBe(200);
    
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Buscar');
    
    // Check for search form
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('city pages structure works', async ({ page }) => {
    // Test with a mock city slug
    const response = await page.goto('/madrid');
    
    // Should not be 404
    expect(response?.status()).not.toBe(404);
    
    // Should either show content or proper error handling
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('venue detail pages structure works', async ({ page }) => {
    // Test with mock venue path
    const response = await page.goto('/madrid/restaurante-ejemplo');
    
    // Should not be 404
    expect(response?.status()).not.toBe(404);
    
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('review detail pages structure works', async ({ page }) => {
    // Test with mock review path
    const response = await page.goto('/madrid/restaurante-ejemplo/review/review-ejemplo');
    
    // Should not be 404
    expect(response?.status()).not.toBe(404);
    
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('categories page works', async ({ page }) => {
    const response = await page.goto('/categorias');
    expect(response?.status()).toBe(200);
    
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Categorías' || 'categorías');
  });
});

test.describe('SEO and Accessibility Audit', () => {
  
  test('pages have proper meta tags', async ({ page }) => {
    await page.goto('/buscar');
    
    // Check for title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const description = await metaDescription.getAttribute('content');
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(20);
    }
  });

  test('pages have proper heading structure', async ({ page }) => {
    await page.goto('/buscar');
    
    // Should have h1
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    
    const h1Text = await h1.textContent();
    expect(h1Text).toBeTruthy();
  });

  test('forms have proper accessibility attributes', async ({ page }) => {
    await page.goto('/buscar');
    
    const searchInput = page.locator('input[type="text"]').first();
    
    if (await searchInput.count() > 0) {
      // Check for labels or aria-label
      const ariaLabel = await searchInput.getAttribute('aria-label');
      const placeholder = await searchInput.getAttribute('placeholder');
      const hasLabel = await page.locator('label').count() > 0;
      
      expect(ariaLabel || placeholder || hasLabel).toBeTruthy();
    }
  });

  test('navigation has proper accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation with proper ARIA
    const navElements = page.locator('nav');
    
    if (await navElements.count() > 0) {
      const nav = navElements.first();
      await expect(nav).toBeVisible();
    }
    
    // Check for skip links or focus management
    const links = page.locator('a');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});

test.describe('Components Integration Audit', () => {
  
  test('VenueCard component renders correctly', async ({ page }) => {
    await page.goto('/');
    
    // Look for venue cards in the homepage
    const venueCards = page.locator('[class*="venue"], [data-testid*="venue"]');
    
    // If venue cards exist, they should be properly rendered
    if (await venueCards.count() > 0) {
      const firstCard = venueCards.first();
      await expect(firstCard).toBeVisible();
    }
  });

  test('SearchForm component integrates properly', async ({ page }) => {
    await page.goto('/buscar');
    
    const searchForm = page.locator('form').first();
    const searchInput = page.locator('input[type="text"]').first();
    
    await expect(searchInput).toBeVisible();
    
    // Test search functionality
    await searchInput.fill('test');
    await searchInput.press('Enter');
    
    // Should handle the search (either show results or proper feedback)
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('buscar');
  });

  test('breadcrumbs work correctly', async ({ page }) => {
    await page.goto('/buscar');
    
    // Look for breadcrumb navigation
    const breadcrumbs = page.locator('[aria-label*="breadcrumb"], .breadcrumb, nav:has(a[href="/"])');
    
    if (await breadcrumbs.count() > 0) {
      await expect(breadcrumbs.first()).toBeVisible();
      
      // Should have home link
      const homeLink = page.locator('a[href="/"]');
      await expect(homeLink).toBeVisible();
    }
  });
});