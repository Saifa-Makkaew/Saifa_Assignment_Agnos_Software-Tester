import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  reporter: [['html', { open: 'always' }]],

  use: {
    screenshot: 'on',
    video: 'on',
    trace: 'on',

    headless: false,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});