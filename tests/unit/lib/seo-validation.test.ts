import { describe, it, expect } from 'vitest';
import { 
  validateMetaDescription, 
  validatePageTitle, 
  generateValidatedSEOData 
} from '../../../lib/seo';

describe('SEO Validation Utilities', () => {
  describe('validateMetaDescription', () => {
    it('should validate optimal description length', () => {
      const goodDescription = 'This is a well-crafted meta description that provides valuable information about the page content and stays within the optimal length range for search engines.';
      const result = validateMetaDescription(goodDescription);
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
      expect(result.description).toBe(goodDescription);
    });

    it('should flag description that is too short', () => {
      const shortDescription = 'Too short';
      const result = validateMetaDescription(shortDescription);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Description is too short (< 120 characters)');
    });

    it('should truncate description that is too long', () => {
      const longDescription = 'This is an extremely long meta description that exceeds the recommended 160 character limit and will be truncated by search engines which makes it less effective for SEO purposes and user experience in search results.';
      const result = validateMetaDescription(longDescription);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Description is too long (> 160 characters)');
      expect(result.description.length).toBeLessThanOrEqual(160);
      expect(result.description).toMatch(/\.\.\.$/);
    });

    it('should detect undefined/null values', () => {
      const badDescription = 'This description has undefined value';
      const result = validateMetaDescription(badDescription);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Description contains undefined/null values');
    });
  });

  describe('validatePageTitle', () => {
    it('should validate optimal title length', () => {
      const goodTitle = 'Perfect SEO Title for Testing Purpose';
      const result = validatePageTitle(goodTitle);
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
      expect(result.title).toBe(goodTitle);
    });

    it('should flag title that is too short', () => {
      const shortTitle = 'Short';
      const result = validatePageTitle(shortTitle);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Title is too short (< 30 characters)');
    });

    it('should truncate title that is too long', () => {
      const longTitle = 'This is an extremely long page title that exceeds the recommended limit for search engines';
      const result = validatePageTitle(longTitle);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Title is too long (> 60 characters)');
      expect(result.title.length).toBeLessThanOrEqual(60);
    });

    it('should detect undefined/null values', () => {
      const badTitle = 'Title with undefined value';
      const result = validatePageTitle(badTitle);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Title contains undefined/null values');
    });
  });

  describe('generateValidatedSEOData', () => {
    it('should generate SEO data with validation', () => {
      const config = {
        title: 'Perfect SEO Title for Testing Purpose and Validation',
        description: 'This is a well-crafted meta description that provides valuable information about the page content and stays within the optimal range.',
        canonical: 'https://example.com/test',
      };

      const result = generateValidatedSEOData(config);
      
      expect(result.validation.isValid).toBe(true);
      expect(result.validation.issues).toHaveLength(0);
      expect(result.title).toBe(config.title);
      expect(result.description).toBe(config.description);
    });

    it('should fix issues and report validation problems', () => {
      const config = {
        title: 'This is an extremely long title that will be truncated because it exceeds the limit',
        description: 'Too short',
        canonical: 'https://example.com/test',
      };

      const result = generateValidatedSEOData(config);
      
      expect(result.validation.isValid).toBe(false);
      expect(result.validation.issues.length).toBeGreaterThan(0);
      expect(result.title).not.toBe(config.title); // Should be truncated
      expect(result.title.length).toBeLessThanOrEqual(60);
    });

    it('should include all standard SEO fields', () => {
      const config = {
        title: 'Great SEO Title for Testing Purpose',
        description: 'This is a well-crafted meta description that provides valuable information about the page content and stays within the optimal length range.',
        canonical: 'https://example.com/test',
        type: 'article' as const,
        author: 'Test Author',
        tags: ['seo', 'testing'],
      };

      const result = generateValidatedSEOData(config);
      
      expect(result.title).toBeTruthy();
      expect(result.description).toBeTruthy();
      expect(result.canonical).toBe(config.canonical);
      expect(result.openGraph).toBeTruthy();
      expect(result.openGraph.type).toBe('article');
      expect(result.additionalMetaTags).toBeDefined();
    });
  });
});