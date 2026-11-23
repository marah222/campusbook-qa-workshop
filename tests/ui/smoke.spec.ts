import { test, expect } from '@playwright/test';
test('CampusBook loads the room discovery page', async ({ page }) => {
  await page.goto('/?scope=ui-smoke');
  await expect(page.getByRole('heading', { name: 'Find your focus.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Search rooms' })).toBeVisible();
});
