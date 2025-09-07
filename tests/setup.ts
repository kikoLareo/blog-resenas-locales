import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with Testing Library matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver for components que lo usan (p.ej., AdSlot)
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];

  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}

  disconnect(): void {}
  observe(_target: Element): void {}
  unobserve(_target: Element): void {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver implements ResizeObserver {
  constructor(_callback: ResizeObserverCallback) {}
  disconnect(): void {}
  observe(_target: Element, _options?: ResizeObserverOptions): void {}
  unobserve(_target: Element): void {}
}

global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Polyfill pointer capture methods used by Radix in jsdom environment
if (typeof Element !== 'undefined' && !(Element.prototype as any).hasPointerCapture) {
  (Element.prototype as any).hasPointerCapture = function () {
    return false;
  };
}
if (typeof Element !== 'undefined' && !(Element.prototype as any).setPointerCapture) {
  (Element.prototype as any).setPointerCapture = function () {};
}
if (typeof Element !== 'undefined' && !(Element.prototype as any).releasePointerCapture) {
  (Element.prototype as any).releasePointerCapture = function () {};
}

  // Polyfill scrollIntoView used by some components (Radix) in tests
  if (typeof Element !== 'undefined' && !(Element.prototype as any).scrollIntoView) {
    (Element.prototype as any).scrollIntoView = function () {};
  }

// Mock environment variables for tests
process.env.SITE_URL = 'http://localhost:3000';
process.env.SITE_NAME = 'Test Blog';
process.env.SANITY_PROJECT_ID = 'test-project';
process.env.SANITY_DATASET = 'test';
process.env.ADS_PROVIDER = 'none';

// Polyfill Pointer Events capture methods for jsdom (used by Radix UI)
// jsdom doesn't implement setPointerCapture/hasPointerCapture/releasePointerCapture
// which causes libraries that call them to throw. Provide no-op implementations.
(() => {
  const proto: any = (globalThis.Element || globalThis.HTMLElement).prototype;
  if (!proto.setPointerCapture) {
    proto.setPointerCapture = function (_pointerId: number) {
      // no-op in test env
    };
  }

  if (!proto.releasePointerCapture) {
    proto.releasePointerCapture = function (_pointerId: number) {
      // no-op in test env
    };
  }

  if (!proto.hasPointerCapture) {
    proto.hasPointerCapture = function (_pointerId: number) {
      return false;
    };
  }
})();

// Log unhandled errors and promise rejections so tests show full stack traces
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event: ErrorEvent) => {
    // Ensure Vitest picks this up on stderr
    // eslint-disable-next-line no-console
    console.error('Unhandled window error in tests:', event.error || event.message);
  });

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled promise rejection in tests:', event.reason);
  });

  // Provide a safe default `fetch` implementation for tests.
  // Some components call `fetch` during module initialization. If a test doesn't
  // explicitly mock `fetch`, that can lead to `Cannot read properties of undefined (reading 'ok')`.
  // Use a minimal stub that returns an object with `ok` and a `json()` helper.
  if (typeof (globalThis as any).fetch === 'undefined') {
    (globalThis as any).fetch = async () => ({ ok: true, json: async () => [] });
  }
}
