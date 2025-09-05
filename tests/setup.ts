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
