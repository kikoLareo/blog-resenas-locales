import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ...(process.env.CI ? [['github']] : []),
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
    /* Global timeout for each test */
    actionTimeout: 10000,
    /* Navigation timeout */
    navigationTimeout: 30000,
    /* Extra HTTP headers */
    extraHTTPHeaders: {
      // Accept language for Spanish content
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Enable additional Chrome features for better testing
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
          ],
        },
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        // Mobile-specific settings for performance testing
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        viewport: { width: 390, height: 844 },
      },
    },

    /* Performance testing project */
    {
      name: 'Performance',
      use: {
        ...devices['Desktop Chrome'],
        // Throttle network for realistic performance testing
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
          ],
        },
      },
      testMatch: '**/performance.spec.ts',
    },

    /* SEO and accessibility focused testing */
    {
      name: 'SEO',
      use: {
        ...devices['Desktop Chrome'],
        // Disable images and CSS for faster SEO testing
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-images',
            '--disable-javascript', // Some SEO tests run without JS
          ],
        },
      },
      testMatch: '**/seo-validation.spec.ts',
    },

    /* CLS testing with slow network */
    {
      name: 'CLS',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--disable-web-security',
            '--force-device-scale-factor=1',
          ],
        },
      },
      testMatch: '**/cls-zero.spec.ts',
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Configure global setup and teardown */
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    // Wait for specific content to ensure app is ready
  },

  /* Configure test timeouts */
  timeout: 60 * 1000, // 60 seconds per test
  expect: {
    // Timeout for expect() calls
    timeout: 10 * 1000,
  },

  /* Output directory */
  outputDir: 'test-results/',
  
  /* Configure test metadata */
  metadata: {
    'test-type': 'e2e',
    'browser-versions': 'latest',
    'test-environment': process.env.CI ? 'CI' : 'local',
  },
});

// Export types for test files
export type { Page, BrowserContext, Locator } from '@playwright/test';
