// playwright.config.api.ts
import { PlaywrightTestConfig } from '@playwright/test';
import { baseConfig } from './base.config';

const baseURL = process.env.API_BASE_URL || 'https://automationexercise.com/api';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  timeout: 120000,
  workers: 10,
  testDir: '../tests/api',
  reporter: [
    ['junit', { outputFile: '../../results/test-results-api/api-junit-results.xml' }],
    ['list'],
    ['html', {
      outputFolder: '../../results/playwright-report-api',
      open: 'never',
      inline: true,
    }]
  ],
  use: {
    ...baseConfig.use,
    baseURL: baseURL,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 120000,
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'Chromium',
      use: { browserName: 'chromium' },
    }
  ],
}

export default config
