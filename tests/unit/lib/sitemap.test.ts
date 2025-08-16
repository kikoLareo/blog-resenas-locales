import { describe, it, expect, vi } from 'vitest';
import { 
  generateSitemapXML, 
  generateSitemapIndexXML, 
  getFullUrl, 
  getLatestDate, 
  formatSitemapDate,
  SitemapUrl
} from '@/lib/sitemap';

// Mock SITE_CONFIG
vi.mock('@/lib/constants', () => ({
  SITE_CONFIG: {
    url: 'https://example.com',
  },
}));

describe('Sitemap Utilities', () => {
  describe('getFullUrl', () => {
    it('should generate full URL with leading slash', () => {
      expect(getFullUrl('/test')).toBe('https://example.com/test');
    });

    it('should generate full URL without leading slash', () => {
      expect(getFullUrl('test')).toBe('https://example.com/test');
    });

    it('should handle empty path', () => {
      expect(getFullUrl('')).toBe('https://example.com/');
    });
  });

  describe('formatSitemapDate', () => {
    it('should format ISO date to YYYY-MM-DD', () => {
      const isoDate = '2024-01-15T10:30:45.123Z';
      expect(formatSitemapDate(isoDate)).toBe('2024-01-15');
    });

    it('should handle different timezone', () => {
      const isoDate = '2024-12-25T23:59:59.999Z';
      expect(formatSitemapDate(isoDate)).toBe('2024-12-25');
    });
  });

  describe('getLatestDate', () => {
    it('should return current date for empty array', () => {
      const result = getLatestDate([]);
      const now = new Date().toISOString().split('T')[0];
      const resultDate = new Date(result).toISOString().split('T')[0];
      expect(resultDate).toBe(now);
    });

    it('should return latest _updatedAt when no publishedAt', () => {
      const items = [
        { _updatedAt: '2024-01-01T00:00:00Z' },
        { _updatedAt: '2024-01-15T00:00:00Z' },
        { _updatedAt: '2024-01-10T00:00:00Z' },
      ];
      const result = getLatestDate(items);
      expect(result).toBe('2024-01-15T00:00:00.000Z');
    });

    it('should prefer publishedAt over _updatedAt', () => {
      const items = [
        { _updatedAt: '2024-01-15T00:00:00Z', publishedAt: '2024-01-01T00:00:00Z' },
        { _updatedAt: '2024-01-01T00:00:00Z', publishedAt: '2024-01-20T00:00:00Z' },
      ];
      const result = getLatestDate(items);
      expect(result).toBe('2024-01-20T00:00:00.000Z');
    });

    it('should handle mixed items with and without publishedAt', () => {
      const items = [
        { _updatedAt: '2024-01-10T00:00:00Z' },
        { _updatedAt: '2024-01-01T00:00:00Z', publishedAt: '2024-01-25T00:00:00Z' },
      ];
      const result = getLatestDate(items);
      expect(result).toBe('2024-01-25T00:00:00.000Z');
    });
  });

  describe('generateSitemapXML', () => {
    it('should generate valid XML with minimal data', () => {
      const urls: SitemapUrl[] = [
        { url: 'https://example.com/page1' },
        { url: 'https://example.com/page2' },
      ];

      const xml = generateSitemapXML(urls);
      
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('<loc>https://example.com/page1</loc>');
      expect(xml).toContain('<loc>https://example.com/page2</loc>');
      expect(xml).toContain('</urlset>');
    });

    it('should include all optional fields when provided', () => {
      const urls: SitemapUrl[] = [
        {
          url: 'https://example.com/page1',
          lastmod: '2024-01-15',
          changefreq: 'weekly',
          priority: 0.8,
        },
      ];

      const xml = generateSitemapXML(urls);
      
      expect(xml).toContain('<lastmod>2024-01-15</lastmod>');
      expect(xml).toContain('<changefreq>weekly</changefreq>');
      expect(xml).toContain('<priority>0.8</priority>');
    });

    it('should omit optional fields when not provided', () => {
      const urls: SitemapUrl[] = [
        { url: 'https://example.com/page1' },
      ];

      const xml = generateSitemapXML(urls);
      
      expect(xml).not.toContain('<lastmod>');
      expect(xml).not.toContain('<changefreq>');
      expect(xml).not.toContain('<priority>');
    });

    it('should handle empty array', () => {
      const xml = generateSitemapXML([]);
      
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('</urlset>');
      expect(xml).not.toContain('<url>');
    });
  });

  describe('generateSitemapIndexXML', () => {
    it('should generate valid sitemap index XML', () => {
      const sitemaps = [
        { loc: 'https://example.com/sitemap-posts.xml', lastmod: '2024-01-15' },
        { loc: 'https://example.com/sitemap-venues.xml', lastmod: '2024-01-20' },
      ];

      const xml = generateSitemapIndexXML(sitemaps);
      
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('<loc>https://example.com/sitemap-posts.xml</loc>');
      expect(xml).toContain('<lastmod>2024-01-15</lastmod>');
      expect(xml).toContain('<loc>https://example.com/sitemap-venues.xml</loc>');
      expect(xml).toContain('<lastmod>2024-01-20</lastmod>');
      expect(xml).toContain('</sitemapindex>');
    });

    it('should handle empty array', () => {
      const xml = generateSitemapIndexXML([]);
      
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('</sitemapindex>');
      expect(xml).not.toContain('<sitemap>');
    });
  });
});
