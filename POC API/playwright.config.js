// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',  
  reporter: [
    ['list'],                  // console output
    ['html', { outputFolder: 'playwright-report', open: 'always' }] // gen HTML
  ],
  
  use: {
    baseURL: process.env.TEST_BASE_URL,
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ]
});
