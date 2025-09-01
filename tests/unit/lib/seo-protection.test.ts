import { describe, it, expect } from 'vitest';
import { isAdminRoute, BLOCKED_PATHS, ADMIN_SECURITY_HEADERS, createAdminMetadata } from '@/lib/seo-protection';

describe('SEO Protection', () => {
  describe('isAdminRoute', () => {
    it('should identify admin routes correctly', () => {
      expect(isAdminRoute('/dashboard')).toBe(true);
      expect(isAdminRoute('/dashboard/featured')).toBe(true);
      expect(isAdminRoute('/admin')).toBe(true);
      expect(isAdminRoute('/studio')).toBe(true);
      expect(isAdminRoute('/api/admin')).toBe(true);
      expect(isAdminRoute('/acceso')).toBe(true);
    });

    it('should not identify public routes as admin', () => {
      expect(isAdminRoute('/')).toBe(false);
      expect(isAdminRoute('/blog')).toBe(false);
      expect(isAdminRoute('/categorias')).toBe(false);
      expect(isAdminRoute('/madrid/restaurante-ejemplo')).toBe(false);
    });
  });

  describe('BLOCKED_PATHS', () => {
    it('should include essential admin paths', () => {
      expect(BLOCKED_PATHS).toContain('/dashboard/');
      expect(BLOCKED_PATHS).toContain('/admin/');
      expect(BLOCKED_PATHS).toContain('/studio/');
      expect(BLOCKED_PATHS).toContain('/api/');
      expect(BLOCKED_PATHS).toContain('/acceso');
    });
  });

  describe('ADMIN_SECURITY_HEADERS', () => {
    it('should have essential security headers', () => {
      expect(ADMIN_SECURITY_HEADERS['X-Robots-Tag']).toContain('noindex');
      expect(ADMIN_SECURITY_HEADERS['X-Frame-Options']).toBe('DENY');
      expect(ADMIN_SECURITY_HEADERS['Cache-Control']).toContain('no-cache');
    });
  });

  describe('createAdminMetadata', () => {
    it('should create metadata with SEO protection', () => {
      const metadata = createAdminMetadata('Test Admin Page');
      
      expect(metadata.title).toBe('Test Admin Page');
      expect(metadata.robots?.index).toBe(false);
      expect(metadata.robots?.follow).toBe(false);
      expect(metadata.robots?.nosnippet).toBe(true);
      expect(metadata.alternates?.canonical).toBeNull();
    });
  });
});
