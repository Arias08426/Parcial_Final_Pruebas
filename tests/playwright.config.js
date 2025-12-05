import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  
  use: {
    baseURL: 'http://localhost:8080',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: 'cd ../backend && python app.py',
      port: 5000,
      timeout: 60000,
      reuseExistingServer: true,
    },
    {
      command: 'cd ../frontend && python -m http.server 8080',
      port: 8080,
      timeout: 60000,
      reuseExistingServer: true,
    },
  ],
});
