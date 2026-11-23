import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright is intentionally isolated from the manually launched app on :3000.
 * It builds and starts its own server on :3173, so an old CampusBook instance
 * cannot contaminate the smoke tests. *.spec.ts excludes Vitest *.test.ts.
 */
const testPort = 3173;
const baseURL = `http://127.0.0.1:${testPort}`;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  workers: 2,
  timeout: 20_000,
  expect: { timeout: 6_000 },
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: process.platform === 'win32' && !process.env.CI ? undefined : 'msedge' } }],
  webServer: {
    command: process.platform === 'win32' ? 'npm.cmd run dev' : 'npm run dev',
    url: `${baseURL}/api/health`,
    env: { PORT: String(testPort), HOST: '127.0.0.1' },
    reuseExistingServer: false,
    timeout: 75_000
  }
});
