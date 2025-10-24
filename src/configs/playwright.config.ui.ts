import { defineConfig, devices } from '@playwright/test';
import { baseConfig } from './base.config';

const baseURL = process.env.BASE_URL || 'https://automationexercise.com';

export default defineConfig({
  ...baseConfig,
  testDir: '../tests/user-interface',
  fullyParallel: true, // Ensures ordered execution
  workers: 4, // Execute in a single worker to preserve order
  reporter: [
    ['junit', { outputFile: '../../results/test-results-e2e/e2e-junit-results.xml' }],
    ['list'],
    ['html', {
      outputFolder: '../../results/playwright-report-e2e',
      open: 'never',
      inline: true,
    }]
  ],

  use: {
    ...baseConfig.use,
    screenshot: 'only-on-failure',
    actionTimeout: 5000,
    baseURL: baseURL,
    // trace: 'retain-on-failure',
    // video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
