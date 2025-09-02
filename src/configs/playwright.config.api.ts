// playwright.config.api.ts
import { PlaywrightTestConfig } from '@playwright/test'
const baseURL = process.env.API_BASE_URL || 'https://automationexercise.com/api';


const config: PlaywrightTestConfig = {
  timeout: 120000,
  retries: process.env.CI ? 1 : 0,
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
    baseURL: baseURL,
    headless: true,
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
