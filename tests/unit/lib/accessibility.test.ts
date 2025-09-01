import { describe, it, expect } from 'vitest';
import {
  validateAltText,
  validateAriaLabel,
  validateHeadingHierarchy,
  validateFormAccessibility,
  validateKeyboardNavigation,
  calculateAccessibilityScore,
} from '../../../lib/accessibility';

describe('Accessibility Validation Utilities', () => {
  describe('validateAltText', () => {
    it('should validate good alt text', () => {
      const result = validateAltText('A red bicycle parked next to a blue wall');
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
      expect(result.score).toBeGreaterThan(80);
    });

    it('should allow empty alt for decorative images', () => {
      const result = validateAltText('', { isDecorative: true });
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
      expect(result.score).toBe(100);
    });

    it('should flag missing alt text for non-decorative images', () => {
      const result = validateAltText('');
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Missing alt text for non-decorative image');
      expect(result.score).toBe(0);
    });

    it('should warn about redundant phrases', () => {
      const result = validateAltText('Image of a cat sitting on a chair');
      
      expect(result.warnings).toContain('Alt text contains redundant phrases like "image of" or "picture of"');
    });

    it('should flag filename-based alt text', () => {
      const result = validateAltText('IMG_1234.jpg content', { filename: 'IMG_1234.jpg' });
      
      expect(result.issues).toContain('Alt text appears to be based on filename rather than content description');
    });

    it('should flag file extensions in alt text', () => {
      const result = validateAltText('Cat image.jpg');
      
      expect(result.issues).toContain('Alt text contains file extension');
    });

    it('should flag very short alt text', () => {
      const result = validateAltText('Cat');
      
      expect(result.issues).toContain('Alt text too short - should be descriptive');
    });
  });

  describe('validateAriaLabel', () => {
    it('should validate good aria-label', () => {
      const result = validateAriaLabel('Close navigation menu', { tagName: 'button' });
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
      expect(result.score).toBeGreaterThan(80);
    });

    it('should allow missing aria-label when element has text content', () => {
      const result = validateAriaLabel('', { tagName: 'button', hasTextContent: true });
      
      expect(result.isValid).toBe(true);
      expect(result.score).toBe(80);
    });

    it('should flag missing aria-label when no text content', () => {
      const result = validateAriaLabel('', { tagName: 'button', hasTextContent: false });
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('button element needs aria-label when it has no text content');
    });

    it('should warn about redundant role information', () => {
      const result = validateAriaLabel('Click this button', { tagName: 'button' });
      
      expect(result.warnings).toContain('ARIA label contains redundant role information');
    });

    it('should flag very short aria-label', () => {
      const result = validateAriaLabel('X', { tagName: 'button' });
      
      expect(result.issues).toContain('ARIA label too short to be meaningful');
    });
  });

  describe('validateHeadingHierarchy', () => {
    it('should validate proper heading hierarchy', () => {
      const headings = [
        { level: 1, text: 'Main Title' },
        { level: 2, text: 'Section Title' },
        { level: 3, text: 'Subsection Title' },
        { level: 2, text: 'Another Section' },
      ];
      
      const result = validateHeadingHierarchy(headings);
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should flag missing h1', () => {
      const headings = [
        { level: 2, text: 'Section Title' },
        { level: 3, text: 'Subsection Title' },
      ];
      
      const result = validateHeadingHierarchy(headings);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Page must have exactly one h1');
    });

    it('should flag multiple h1s', () => {
      const headings = [
        { level: 1, text: 'First Title' },
        { level: 1, text: 'Second Title' },
      ];
      
      const result = validateHeadingHierarchy(headings);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Page should have only one h1');
    });

    it('should flag skipped heading levels', () => {
      const headings = [
        { level: 1, text: 'Main Title' },
        { level: 4, text: 'Skipped to h4' },
      ];
      
      const result = validateHeadingHierarchy(headings);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Heading hierarchy skips from h1 to h4');
    });

    it('should flag empty headings', () => {
      const headings = [
        { level: 1, text: 'Main Title' },
        { level: 2, text: '' },
      ];
      
      const result = validateHeadingHierarchy(headings);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('1 headings are empty');
    });

    it('should warn about generic headings', () => {
      const headings = [
        { level: 1, text: 'Title' },
        { level: 2, text: 'Section Content' },
      ];
      
      const result = validateHeadingHierarchy(headings);
      
      expect(result.warnings).toContain('1 headings have generic text');
    });
  });

  describe('validateFormAccessibility', () => {
    it('should validate accessible form', () => {
      const form = {
        inputs: [
          {
            type: 'email',
            hasLabel: true,
            hasAriaLabel: false,
            hasPlaceholder: true,
            isRequired: true,
            hasErrorMessage: true,
          },
          {
            type: 'password',
            hasLabel: true,
            hasAriaLabel: false,
            hasPlaceholder: false,
            isRequired: true,
            hasErrorMessage: true,
          },
        ],
      };
      
      const result = validateFormAccessibility(form);
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should flag inputs without labels', () => {
      const form = {
        inputs: [
          {
            type: 'text',
            hasLabel: false,
            hasAriaLabel: false,
            hasPlaceholder: true,
            isRequired: false,
            hasErrorMessage: false,
          },
        ],
      };
      
      const result = validateFormAccessibility(form);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Input 1 (text) lacks a label or aria-label');
    });

    it('should flag placeholder as label usage', () => {
      const form = {
        inputs: [
          {
            type: 'text',
            hasLabel: false,
            hasAriaLabel: false,
            hasPlaceholder: true,
            isRequired: false,
            hasErrorMessage: false,
          },
        ],
      };
      
      const result = validateFormAccessibility(form);
      
      expect(result.issues).toContain('Input 1 (text) uses placeholder as label (not accessible)');
    });

    it('should skip hidden inputs', () => {
      const form = {
        inputs: [
          {
            type: 'hidden',
            hasLabel: false,
            hasAriaLabel: false,
            hasPlaceholder: false,
            isRequired: false,
            hasErrorMessage: false,
          },
        ],
      };
      
      const result = validateFormAccessibility(form);
      
      expect(result.isValid).toBe(true);
      expect(result.score).toBe(100);
    });
  });

  describe('validateKeyboardNavigation', () => {
    it('should validate accessible keyboard navigation', () => {
      const elements = [
        {
          isInteractive: true,
          isFocusable: true,
          hasSkipLink: true,
          hasFocusIndicator: true,
        },
        {
          isInteractive: true,
          isFocusable: true,
          hasSkipLink: false,
          hasFocusIndicator: true,
        },
      ];
      
      const result = validateKeyboardNavigation(elements);
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should flag non-focusable interactive elements', () => {
      const elements = [
        {
          isInteractive: true,
          isFocusable: false,
          hasSkipLink: false,
          hasFocusIndicator: false,
        },
      ];
      
      const result = validateKeyboardNavigation(elements);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('1 interactive elements are not keyboard focusable');
    });

    it('should flag missing focus indicators', () => {
      const elements = [
        {
          isInteractive: true,
          isFocusable: true,
          hasSkipLink: false,
          hasFocusIndicator: false,
        },
      ];
      
      const result = validateKeyboardNavigation(elements);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('1 focusable elements lack visible focus indicators');
    });

    it('should warn about missing skip link', () => {
      const elements = [
        {
          isInteractive: true,
          isFocusable: true,
          hasSkipLink: false,
          hasFocusIndicator: true,
        },
      ];
      
      const result = validateKeyboardNavigation(elements);
      
      expect(result.warnings).toContain('Page should have a skip link for keyboard navigation');
    });
  });

  describe('calculateAccessibilityScore', () => {
    it('should calculate overall accessibility score', () => {
      const validations = [
        { isValid: true, issues: [], warnings: [], score: 95 },
        { isValid: true, issues: [], warnings: ['minor issue'], score: 85 },
        { isValid: false, issues: ['major issue'], warnings: [], score: 70 },
      ];
      
      const result = calculateAccessibilityScore(validations);
      
      expect(result.overallScore).toBe(83); // (95 + 85 + 70) / 3
      expect(result.totalIssues).toBe(1);
      expect(result.totalWarnings).toBe(1);
      expect(result.grade).toBe('B');
    });

    it('should assign correct grades', () => {
      const excellent = calculateAccessibilityScore([{ isValid: true, issues: [], warnings: [], score: 95 }]);
      expect(excellent.grade).toBe('A');
      
      const good = calculateAccessibilityScore([{ isValid: true, issues: [], warnings: [], score: 85 }]);
      expect(good.grade).toBe('B');
      
      const fair = calculateAccessibilityScore([{ isValid: true, issues: [], warnings: [], score: 75 }]);
      expect(fair.grade).toBe('C');
      
      const poor = calculateAccessibilityScore([{ isValid: false, issues: ['issue'], warnings: [], score: 65 }]);
      expect(poor.grade).toBe('D');
      
      const failing = calculateAccessibilityScore([{ isValid: false, issues: ['issue'], warnings: [], score: 45 }]);
      expect(failing.grade).toBe('F');
    });
  });
});