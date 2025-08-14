import { test, expect } from '@playwright/test';

test.describe('Navigation and Breadcrumbs', () => {
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
    const skipLink = page.locator('a[href="#main"], a[href="#content"]');
    if (await skipLink.count() > 0) {
      await expect(skipLink.first()).toHaveAttribute('href');
    }
  });

  test('breadcrumbs are present on deep pages', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to a venue page to check breadcrumbs
    const venueLink = page.locator('a[href*="/"]').first();
    if (await venueLink.count() > 0) {
      await venueLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check for breadcrumb navigation
      const breadcrumbNav = page.locator('nav[aria-label*="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]');
      if (await breadcrumbNav.count() > 0) {
        await expect(breadcrumbNav.first()).toBeVisible();
        
        // Check breadcrumb items
        const breadcrumbItems = breadcrumbNav.locator('a, span');
        const itemCount = await breadcrumbItems.count();
        expect(itemCount).toBeGreaterThan(0);
        
        // First item should be "Inicio" or similar
        const firstItem = breadcrumbItems.first();
        const firstItemText = await firstItem.textContent();
        expect(firstItemText?.toLowerCase()).toMatch(/inicio|home|principal/);
        
        // Check proper linking (all but last should be links)
        for (let i = 0; i < itemCount - 1; i++) {
          const item = breadcrumbItems.nth(i);
          const tagName = await item.evaluate(el => el.tagName.toLowerCase());
          expect(tagName).toBe('a');
        }
        
        // Last item should not be a link (current page)
        if (itemCount > 1) {
          const lastItem = breadcrumbItems.last();
          const lastTagName = await lastItem.evaluate(el => el.tagName.toLowerCase());
          expect(lastTagName).toBe('span');
        }
      }
    }
  });

  test('breadcrumbs have proper JSON-LD', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to a page that should have breadcrumbs
    const venueLink = page.locator('a[href*="/"]').first();
    if (await venueLink.count() > 0) {
      await venueLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check for BreadcrumbList JSON-LD
      const jsonLdScripts = page.locator('script[type="application/ld+json"]');
      const scriptCount = await jsonLdScripts.count();
      
      let foundBreadcrumbSchema = false;
      
      for (let i = 0; i < scriptCount; i++) {
        const script = jsonLdScripts.nth(i);
        const content = await script.textContent();
        
        if (content) {
          const jsonLd = JSON.parse(content);
          
          // Check if this script contains BreadcrumbList
          let breadcrumbList = null;
          if (jsonLd['@graph']) {
            breadcrumbList = jsonLd['@graph'].find((item: any) => item['@type'] === 'BreadcrumbList');
          } else if (jsonLd['@type'] === 'BreadcrumbList') {
            breadcrumbList = jsonLd;
          }
          
          if (breadcrumbList) {
            foundBreadcrumbSchema = true;
            
            // Validate BreadcrumbList structure
            expect(breadcrumbList['@context']).toBe('https://schema.org');
            expect(breadcrumbList['@type']).toBe('BreadcrumbList');
            expect(breadcrumbList.itemListElement).toBeDefined();
            expect(breadcrumbList.itemListElement.length).toBeGreaterThan(0);
            
            // Validate first breadcrumb item
            const firstItem = breadcrumbList.itemListElement[0];
            expect(firstItem['@type']).toBe('ListItem');
            expect(firstItem.position).toBe(1);
            expect(firstItem.name).toBeTruthy();
            expect(firstItem.item).toBeTruthy();
            
            // Validate position sequence
            breadcrumbList.itemListElement.forEach((item: any, index: number) => {
              expect(item.position).toBe(index + 1);
            });
            
            break;
          }
        }
      }
      
      // If breadcrumbs are visible, JSON-LD should exist
      const breadcrumbNav = page.locator('nav[aria-label*="breadcrumb"], .breadcrumb');
      if (await breadcrumbNav.count() > 0) {
        expect(foundBreadcrumbSchema).toBeTruthy();
      }
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
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
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
      await mobileMenuButton.click();
      
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
      await mobileMenuButton.click();
    }
  });

  test('navigation links are descriptive and accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check all navigation links
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    
    for (let i = 0; i < Math.min(linkCount, 10); i++) { // Test first 10 links
      const link = navLinks.nth(i);
      
      // Check link has text or aria-label
      const linkText = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      expect(linkText?.trim() || ariaLabel || title).toBeTruthy();
      
      // Check link text is descriptive (not just "click here", "read more", etc.)
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

  test('search functionality is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[aria-label*="buscar"]');
    if (await searchInput.count() > 0) {
      // Check search input has proper labels
      const ariaLabel = await searchInput.getAttribute('aria-label');
      const placeholder = await searchInput.getAttribute('placeholder');
      const associatedLabel = await searchInput.evaluate((input) => {
        const id = input.getAttribute('id');
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          return label?.textContent;
        }
        return null;
      });
      
      expect(ariaLabel || placeholder || associatedLabel).toBeTruthy();
      
      // Test search functionality
      await searchInput.fill('restaurante');
      await page.keyboard.press('Enter');
      
      // Should navigate to search results or show results
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/buscar|search/);
    }
  });

  test('category and tag navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Look for category links
    const categoryLinks = page.locator('a[href*="/categorias/"], a[href*="/category/"]');
    if (await categoryLinks.count() > 0) {
      const firstCategory = categoryLinks.first();
      await firstCategory.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on category page
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/categorias|category/);
      
      // Check page has proper heading
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
    }
    
    // Test tag navigation
    await page.goto('/');
    const tagLinks = page.locator('a[href*="/tags/"], a[href*="/tag/"]');
    if (await tagLinks.count() > 0) {
      const firstTag = tagLinks.first();
      await firstTag.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on tag page
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/tags|tag/);
    }
  });

  test('pagination navigation is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Look for pagination
    const pagination = page.locator('.pagination, nav[aria-label*="pagination"]');
    if (await pagination.count() > 0) {
      // Check pagination has proper ARIA label
      const ariaLabel = await pagination.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      
      // Check pagination links
      const paginationLinks = pagination.locator('a, button');
      const linkCount = await paginationLinks.count();
      
      for (let i = 0; i < linkCount; i++) {
        const link = paginationLinks.nth(i);
        const ariaLabel = await link.getAttribute('aria-label');
        const text = await link.textContent();
        
        // Each pagination link should have descriptive text or aria-label
        expect(ariaLabel || text?.trim()).toBeTruthy();
      }
      
      // Test next page navigation if available
      const nextLink = pagination.locator('a[aria-label*="next"], a:has-text("Siguiente")');
      if (await nextLink.count() > 0) {
        await nextLink.click();
        await page.waitForLoadState('networkidle');
        
        // Should navigate to next page
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/page|p=/);
      }
    }
  });

  test('error pages have proper navigation', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page');
    
    // Should show 404 or error page
    const pageContent = await page.textContent('body');
    const is404 = pageContent?.includes('404') || pageContent?.includes('no encontrada');
    
    if (is404) {
      // Check for navigation back to home
      const homeLink = page.locator('a[href="/"], a:has-text("Inicio"), a:has-text("Home")');
      if (await homeLink.count() > 0) {
        await expect(homeLink.first()).toBeVisible();
      }
    }
  });
});