import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  
  use: {
    baseURL: 'http://127.0.0.1:8080',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: 'cd ../backend && python run.py',
      port: 5000,
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'cd ../frontend && python -m http.server 8080',
      port: 8080,
      timeout: 60000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
