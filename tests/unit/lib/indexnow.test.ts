import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildIndexNowPayload, submitToIndexNow, buildAbsoluteUrls } from '@/lib/indexnow';

// Mock fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock console methods
let mockConsoleLog: ReturnType<typeof vi.spyOn>;
let mockConsoleError: ReturnType<typeof vi.spyOn>;

describe('IndexNow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup fresh console mocks for each test
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Reset environment variables
    delete process.env.INDEXNOW_HOST;
    delete process.env.INDEXNOW_KEY;
    delete process.env.INDEXNOW_KEY_LOCATION;
    delete process.env.NODE_ENV;
    delete process.env.INDEXNOW_DRY_RUN;
  });

  afterEach(() => {
    vi.resetAllMocks();
    // Restore console methods
    mockConsoleLog?.mockRestore();
    mockConsoleError?.mockRestore();
  });

  describe('buildIndexNowPayload', () => {
    it('should build correct payload structure', () => {
      const urls = ['https://example.com/page1', 'https://example.com/page2'];
      const key = 'abcdef1234567890abcdef1234567890';
      const host = 'example.com';
      const keyLocation = 'https://example.com/abcdef1234567890abcdef1234567890.txt';

      const payload = buildIndexNowPayload(urls, key, host, keyLocation);

      expect(payload).toEqual({
        host,
        key,
        keyLocation,
        urlList: urls
      });
    });

    it('should handle empty URL list', () => {
      const urls: string[] = [];
      const key = 'abcdef1234567890abcdef1234567890';
      const host = 'example.com';
      const keyLocation = 'https://example.com/abcdef1234567890abcdef1234567890.txt';

      const payload = buildIndexNowPayload(urls, key, host, keyLocation);

      expect(payload.urlList).toEqual([]);
    });
  });

  describe('buildAbsoluteUrls', () => {
    it('should convert relative paths to absolute URLs', () => {
      const paths = ['/page1', '/page2', 'page3'];
      const baseUrl = 'https://example.com';

      const result = buildAbsoluteUrls(paths, baseUrl);

      expect(result).toEqual([
        'https://example.com/page1',
        'https://example.com/page2',
        'https://example.com/page3'
      ]);
    });

    it('should handle base URL with trailing slash', () => {
      const paths = ['/page1', '/page2'];
      const baseUrl = 'https://example.com/';

      const result = buildAbsoluteUrls(paths, baseUrl);

      expect(result).toEqual([
        'https://example.com/page1',
        'https://example.com/page2'
      ]);
    });

    it('should handle empty paths array', () => {
      const paths: string[] = [];
      const baseUrl = 'https://example.com';

      const result = buildAbsoluteUrls(paths, baseUrl);

      expect(result).toEqual([]);
    });
  });

  describe('submitToIndexNow', () => {
    it('should skip submission if environment variables are missing', async () => {
      const urls = ['https://example.com/page1'];

      const result = await submitToIndexNow(urls);

      expect(result).toBe(0);
      expect(mockConsoleLog).toHaveBeenCalledWith('IndexNow: Configuración incompleta, saltando envío');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should skip submission if URLs array is empty', async () => {
      process.env.INDEXNOW_HOST = 'example.com';
      process.env.INDEXNOW_KEY = 'abcdef1234567890abcdef1234567890';
      process.env.INDEXNOW_KEY_LOCATION = 'https://example.com/abcdef1234567890abcdef1234567890.txt';

      const result = await submitToIndexNow([]);

      expect(result).toBe(0);
      expect(mockConsoleLog).toHaveBeenCalledWith('IndexNow: No hay URLs para enviar');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should run in dry-run mode in development', async () => {
      process.env.NODE_ENV = 'development';
      process.env.INDEXNOW_HOST = 'example.com';
      process.env.INDEXNOW_KEY = 'abcdef1234567890abcdef1234567890';
      process.env.INDEXNOW_KEY_LOCATION = 'https://example.com/abcdef1234567890abcdef1234567890.txt';

      const urls = ['https://example.com/page1'];
      const result = await submitToIndexNow(urls);

      expect(result).toBe(1);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'IndexNow (dry-run):',
        expect.stringContaining('"urlList"')
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should run in dry-run mode when INDEXNOW_DRY_RUN is true', async () => {
      process.env.NODE_ENV = 'production';
      process.env.INDEXNOW_DRY_RUN = 'true';
      process.env.INDEXNOW_HOST = 'example.com';
      process.env.INDEXNOW_KEY = 'abcdef1234567890abcdef1234567890';
      process.env.INDEXNOW_KEY_LOCATION = 'https://example.com/abcdef1234567890abcdef1234567890.txt';

      const urls = ['https://example.com/page1'];
      const result = await submitToIndexNow(urls);

      expect(result).toBe(1);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'IndexNow (dry-run):',
        expect.stringContaining('"urlList"')
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should successfully submit URLs to IndexNow API', async () => {
      process.env.NODE_ENV = 'production';
      process.env.INDEXNOW_HOST = 'example.com';
      process.env.INDEXNOW_KEY = 'abcdef1234567890abcdef1234567890';
      process.env.INDEXNOW_KEY_LOCATION = 'https://example.com/abcdef1234567890abcdef1234567890.txt';

      const urls = ['https://example.com/page1', 'https://example.com/page2'];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK'
      } as Response);

      const result = await submitToIndexNow(urls);

      expect(result).toBe(2);
      expect(mockFetch).toHaveBeenCalledWith('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'BlogResenasLocales/1.0'
        },
        body: JSON.stringify({
          host: 'example.com',
          key: 'abcdef1234567890abcdef1234567890',
          keyLocation: 'https://example.com/abcdef1234567890abcdef1234567890.txt',
          urlList: urls
        })
      });
      expect(mockConsoleLog).toHaveBeenCalledWith('IndexNow: Enviadas 2 URLs exitosamente (200)');
    });

    it('should handle API errors gracefully', async () => {
      process.env.NODE_ENV = 'production';
      process.env.INDEXNOW_HOST = 'example.com';
      process.env.INDEXNOW_KEY = 'abcdef1234567890abcdef1234567890';
      process.env.INDEXNOW_KEY_LOCATION = 'https://example.com/abcdef1234567890abcdef1234567890.txt';

      const urls = ['https://example.com/page1'];
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      } as Response);

      const result = await submitToIndexNow(urls);

      expect(result).toBe(0);
      expect(mockConsoleError).toHaveBeenCalledWith('IndexNow: Error 400: Bad Request');
    });

    it('should handle network errors gracefully', async () => {
      process.env.NODE_ENV = 'production';
      process.env.INDEXNOW_HOST = 'example.com';
      process.env.INDEXNOW_KEY = 'abcdef1234567890abcdef1234567890';
      process.env.INDEXNOW_KEY_LOCATION = 'https://example.com/abcdef1234567890abcdef1234567890.txt';

      const urls = ['https://example.com/page1'];
      const networkError = new Error('Network error');
      
      mockFetch.mockRejectedValueOnce(networkError);

      const result = await submitToIndexNow(urls);

      expect(result).toBe(0);
      expect(mockConsoleError).toHaveBeenCalledWith('IndexNow: Error al enviar URLs:', networkError);
    });
  });
});