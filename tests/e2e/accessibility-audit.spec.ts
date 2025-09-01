import { test, expect } from '@playwright/test';

test.describe('Accessibility Audit', () => {
  test('homepage has proper accessibility features', async ({ page }) => {
    await page.goto('/');

    // Check for skip link
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveText(/Saltar al contenido principal/);

    // Check main landmark
    const main = page.locator('main, [role="main"], #main-content');
    await expect(main).toBeAttached();

    // Check heading hierarchy starts with h1
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Check for proper heading hierarchy (no skipped levels)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingLevels = await Promise.all(
      headings.map(async (heading) => {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        return parseInt(tagName.substring(1));
      })
    );
    
    // Verify no heading levels are skipped
    let previousLevel = 0;
    for (const level of headingLevels) {
      if (level > previousLevel + 1) {
        throw new Error(`Heading hierarchy issue: jumped from h${previousLevel} to h${level}`);
      }
      previousLevel = Math.max(previousLevel, level);
    }
  });

  test('images have proper alt text', async ({ page }) => {
    await page.goto('/');

    // Check all images have alt attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      
      // Images should have alt attribute (empty is OK for decorative images)
      expect(alt).not.toBeNull();
      
      // Non-decorative images should have meaningful alt text
      if (alt && alt.trim() !== '') {
        expect(alt.length).toBeGreaterThan(0);
        // Alt text should be descriptive (more than just filename)
        expect(alt).not.toMatch(/\.(jpg|jpeg|png|gif|webp)$/i);
      }
    }
  });

  test('links have accessible names', async ({ page }) => {
    await page.goto('/');

    // Check all links have accessible names
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      // Link should have accessible name from text, aria-label, or title
      const hasAccessibleName = 
        (text && text.trim() !== '') ||
        (ariaLabel && ariaLabel.trim() !== '') ||
        (title && title.trim() !== '');
      
      expect(hasAccessibleName).toBe(true);
    }
  });

  test('forms have proper labels', async ({ page }) => {
    await page.goto('/');

    // Check all form inputs have labels
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const type = await input.getAttribute('type');
      
      // Skip hidden inputs
      if (type === 'hidden') continue;
      
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      
      // Input should have label association
      const hasLabel = 
        (id && await page.locator(`label[for="${id}"]`).count() > 0) ||
        (ariaLabel && ariaLabel.trim() !== '') ||
        (ariaLabelledby && ariaLabelledby.trim() !== '');
      
      expect(hasLabel).toBe(true);
    }
  });

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/');

    // Check all buttons have accessible names
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');
      
      // Button should have accessible name
      const hasAccessibleName = 
        (text && text.trim() !== '') ||
        (ariaLabel && ariaLabel.trim() !== '') ||
        (title && title.trim() !== '');
      
      expect(hasAccessibleName).toBe(true);
    }
  });

  test('color contrast is sufficient', async ({ page }) => {
    await page.goto('/');

    // This is a basic check - in a real audit, you'd use a tool like axe-playwright
    // For now, we'll check that text elements don't have very light colors on light backgrounds
    
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, a, button');
    const elementCount = await textElements.count();
    
    // Sample check for first few elements
    const sampleSize = Math.min(10, elementCount);
    
    for (let i = 0; i < sampleSize; i++) {
      const element = textElements.nth(i);
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      });
      
      // Basic check: ensure text isn't completely transparent
      expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
      expect(styles.color).not.toBe('transparent');
    }
  });

  test('navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // First focusable element should be the skip link
    const focused = page.locator(':focus');
    const focusedText = await focused.textContent();
    expect(focusedText).toContain('Saltar al contenido principal');

    // Test skip link functionality
    await page.keyboard.press('Enter');
    
    // Should focus on main content
    const newFocused = page.locator(':focus');
    const mainContent = page.locator('main, [role="main"], #main-content');
    
    // The focused element should be within main content area
    const isInMain = await newFocused.evaluate((focused, main) => {
      return main.contains(focused) || focused === main;
    }, await mainContent.elementHandle());
    
    expect(isInMain).toBe(true);
  });

  test('ARIA landmarks are present', async ({ page }) => {
    await page.goto('/');

    // Check for main landmarks
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeAttached();

    // Check for navigation
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav).toBeAttached();

    // Check for header
    const header = page.locator('header, [role="banner"]');
    await expect(header).toBeAttached();

    // Check for footer
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer).toBeAttached();
  });

  test('page has proper language declaration', async ({ page }) => {
    await page.goto('/');

    // Check html lang attribute
    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    
    expect(lang).toBe('es');
  });

  test('focus indicators are visible', async ({ page }) => {
    await page.goto('/');

    // Test that focused elements have visible focus indicators
    const firstLink = page.locator('a').first();
    await firstLink.focus();
    
    // Check that focus styles are applied
    const focusStyles = await firstLink.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        outlineWidth: computed.outlineWidth,
        boxShadow: computed.boxShadow,
      };
    });
    
    // Should have either outline or box-shadow for focus indication
    const hasFocusIndicator = 
      (focusStyles.outline && focusStyles.outline !== 'none') ||
      (focusStyles.outlineWidth && focusStyles.outlineWidth !== '0px') ||
      (focusStyles.boxShadow && focusStyles.boxShadow !== 'none');
    
    expect(hasFocusIndicator).toBe(true);
  });
});