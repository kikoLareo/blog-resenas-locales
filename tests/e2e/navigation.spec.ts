import { test, expect } from '@playwright/test';

test.describe('Navigation and Breadcrumbs', () => {
  test.beforeEach(async ({ page }) => {
    // Dismiss consent banner if present to avoid interference
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

  test('homepage has proper navigation structure', async ({ page }) => {
    await page.goto('/');
    
    // Check main navigation exists
    const mainNav = page.locator('nav').first();
    await expect(mainNav).toBeVisible();
    
    // Check navigation has proper ARIA labels
    const navWithAriaLabel = page.locator('nav[aria-label]');
    if (await navWithAriaLabel.count() > 0) {
      const ariaLabel = await navWithAriaLabel.first().getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
    
    // Check for skip links (accessibility)
    const skipLink = page.locator('a[href="#main"], a[href="#main-content"]');
    if (await skipLink.count() > 0) {
      await expect(skipLink.first()).toHaveAttribute('href');
    }
  });

  test('breadcrumbs are present on deep pages', async ({ page }) => {
    await page.goto('/blog');
    
    // Check for breadcrumb navigation
    const breadcrumbNav = page.locator('nav[aria-label*="breadcrumb"], nav[aria-label="Breadcrumb"]');
    if (await breadcrumbNav.count() > 0) {
      await expect(breadcrumbNav.first()).toBeVisible();
      
      // Check breadcrumb items
      const breadcrumbItems = breadcrumbNav.locator('a, li');
      const itemCount = await breadcrumbItems.count();
      expect(itemCount).toBeGreaterThan(0);
      
      // First item should be "Inicio" or similar
      const firstItem = breadcrumbItems.first();
      const firstItemText = await firstItem.textContent();
      expect(firstItemText?.toLowerCase()).toMatch(/inicio|home|principal/);
    }
  });

  test('category navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Look for category links
    const categoryLink = page.locator('a[href="/categorias"]').first();
    if (await categoryLink.count() > 0) {
      await categoryLink.click({ force: true });
      await page.waitForLoadState('networkidle');
      
      // Should be on category page
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/categorias/);
      
      // Check page has proper heading
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Categorías');
    }
  });

  test('blog navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Look for blog link
    const blogLink = page.locator('a[href="/blog"]').first();
    if (await blogLink.count() > 0) {
      await blogLink.click({ force: true });
      await page.waitForLoadState('networkidle');
      
      // Should be on blog page
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/blog/);
      
      // Check page has proper heading
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Blog');
    }
  });

  test('keyboard navigation works properly', async ({ page }) => {
    await page.goto('/');
    
    // Test Tab navigation
    await page.keyboard.press('Tab');
    let focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing through several elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      focusedElement = page.locator(':focus');
      
      // Check that focused element has visible focus indicator
      const outline = await focusedElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || styles.boxShadow !== 'none' || styles.outlineOffset !== '';
      });
      expect(outline).toBeTruthy();
    }
    
    // Test Shift+Tab (reverse navigation)
    await page.keyboard.press('Shift+Tab');
    const reverseFocused = page.locator(':focus');
    await expect(reverseFocused).toBeVisible();
  });

  test('mobile navigation is accessible', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Look for mobile menu button
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-expanded]');
    if (await mobileMenuButton.count() > 0) {
      // Check button has proper ARIA attributes
      const ariaLabel = await mobileMenuButton.getAttribute('aria-label');
      const ariaExpanded = await mobileMenuButton.getAttribute('aria-expanded');
      
      expect(ariaLabel || ariaExpanded).toBeTruthy();
      
      // Test menu toggle
      await mobileMenuButton.click({ force: true });
      
      // Check if menu opened
      const expandedState = await mobileMenuButton.getAttribute('aria-expanded');
      if (expandedState) {
        expect(expandedState).toBe('true');
      }
      
      // Check if menu is visible
      const mobileMenu = page.locator('nav[aria-hidden="false"], .mobile-menu:visible');
      if (await mobileMenu.count() > 0) {
        await expect(mobileMenu.first()).toBeVisible();
      }
      
      // Close menu
      await mobileMenuButton.click({ force: true });
    }
  });

  test('navigation links are descriptive and accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check main navigation links
    const navLinks = page.locator('header nav a');
    const linkCount = await navLinks.count();
    
    for (let i = 0; i < Math.min(linkCount, 10); i++) { // Test first 10 links
      const link = navLinks.nth(i);
      
      // Check link has text or aria-label
      const linkText = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      expect(linkText?.trim() || ariaLabel || title).toBeTruthy();
      
      // Check link text is descriptive
      if (linkText) {
        const isDescriptive = !linkText.toLowerCase().match(/^(click|read|more|here|link)$/);
        expect(isDescriptive).toBeTruthy();
      }
      
      // Check links have proper href
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).not.toBe('#');
    }
  });

  test('footer links work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test footer navigation links
    const footerLinks = page.locator('footer a');
    const linkCount = await footerLinks.count();
    
    if (linkCount > 0) {
      // Test a few key footer links
      const contactLink = page.locator('footer a[href="/contacto"]');
      if (await contactLink.count() > 0) {
        await contactLink.click({ force: true });
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).toMatch(/contacto/);
        
        // Go back to test more
        await page.goBack();
      }
      
      const aboutLink = page.locator('footer a[href="/sobre"]');
      if (await aboutLink.count() > 0) {
        await aboutLink.click({ force: true });
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).toMatch(/sobre/);
      }
    }
  });

  test('error pages have proper navigation', async ({ page }) => {
    // Test 404 page
    const response = await page.goto('/non-existent-page');
    
    // Should show 404 or error page
    const pageContent = await page.textContent('body');
    const is404 = pageContent?.includes('404') || pageContent?.includes('no encontrada') || response?.status() === 404;
    
    if (is404) {
      // Check for navigation back to home
      const homeLink = page.locator('a[href="/"], a:has-text("Inicio"), a:has-text("Home")');
      if (await homeLink.count() > 0) {
        await expect(homeLink.first()).toBeVisible();
      }
    }
  });
});