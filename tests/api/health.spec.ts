import { test, expect } from '@playwright/test';

test('API health endpoint reports ready', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.status()).toBe(200);
  expect((await response.json()).status).toBe('ok');
});
