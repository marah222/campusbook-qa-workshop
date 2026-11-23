/** Maintainers' workshop: inspect and improve this preprepared test. */
import { test, expect } from '@playwright/test';
import { prepareUiScenario } from '../../support/ui-fixtures.ts';

test.skip('Team A: automation maintainability challenge', async ({ page, request }) => {
  const url = await prepareUiScenario(request, 'maint-team-A');
  await page.goto(url);
// Original brittle selector from before a layout change:
  await page.locator('.room-grid .room-card:nth-child(2) .reserve').click();
  await expect(page.getByRole('heading', { name: 'Reserve room R103' })).toBeVisible();
});
