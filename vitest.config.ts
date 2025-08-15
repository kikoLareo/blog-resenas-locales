import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Setup files
    setupFiles: ['./tests/setup.ts'],
    
    // Global test configuration
    globals: true,
    css: true,
    
    // Test file patterns
    include: [
      'tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'components/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'lib/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    
    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'tests/e2e',
      'coverage',
      '**/*.d.ts',
    ],

    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      
      // Coverage thresholds
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      
      // Include patterns
      include: [
        'components/**/*.{js,jsx,ts,tsx}',
        'lib/**/*.{js,jsx,ts,tsx}',
        'app/**/*.{js,jsx,ts,tsx}',
      ],
      
      // Exclude patterns
      exclude: [
        'node_modules/',
        'tests/',
        '.next/',
        'coverage/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts', // Usually just re-exports
        'app/layout.tsx', // Next.js layout file
        'app/page.tsx', // Next.js page file
        'sanity/**/*', // Sanity configuration
        'tailwind.config.ts',
        'next.config.mjs',
        '**/*.stories.*', // Storybook files
        '**/*.test.*',
        '**/*.spec.*',
      ],
      
      // All files should be included in coverage report
      all: true,
      
      // Skip coverage for files with no tests
      skipFull: false,
    },

    // Reporter configuration
    reporters: [
      'verbose',
      'json',
      'html',
      ...(process.env.CI ? ['github-actions'] : []),
    ],

    // Output configuration
    outputFile: {
      json: './test-results/unit-results.json',
      html: './test-results/unit-report.html',
    },

    // Watch configuration
    watch: !process.env.CI,
    
    // Parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
      },
    },

    // Mock configuration
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,

    // Test isolation
    isolate: true,
    
    // Retry configuration
    retry: process.env.CI ? 2 : 0,

    // Environment variables for tests
    env: {
      NODE_ENV: 'test',
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'test-project',
      NEXT_PUBLIC_SANITY_DATASET: 'test',
    },
  },

  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/app': path.resolve(__dirname, './app'),
      '@/sanity': path.resolve(__dirname, './sanity'),
      '@/styles': path.resolve(__dirname, './styles'),
      '@/tests': path.resolve(__dirname, './tests'),
    },
  },

  // Define global constants
  define: {
    __TEST__: true,
    __DEV__: false,
    __PROD__: false,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@testing-library/react',
      '@testing-library/jest-dom',
    ],
  },

  // ESBuild configuration
  esbuild: {
    target: 'node18',
    format: 'esm',
  },
});
