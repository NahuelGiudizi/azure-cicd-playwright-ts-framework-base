import { defineConfig, devices } from '@playwright/test';
const baseURL = process.env.BASE_URL || 'https://automationexercise.com';

export default defineConfig({
  timeout: 180000,
  testDir: '../tests/user-interface',
  fullyParallel: true, // Asegura ejecución ordenada
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,  // No repetir automáticamente pruebas fallidas en ambiente local
  maxFailures: 0, // Continuar aunque algunas pruebas fallen
  workers: 4, // Ejecutar en un único worker para preservar el orden
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
    screenshot: 'only-on-failure',
    actionTimeout: 5000,
    headless: true,
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
