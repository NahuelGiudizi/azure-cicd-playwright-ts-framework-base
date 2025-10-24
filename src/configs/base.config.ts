export const baseConfig = {
  timeout: 180000,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  maxFailures: 0,
  use: {
    headless: true,
    actionTimeout: 10000
  }
};
