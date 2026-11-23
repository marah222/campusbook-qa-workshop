/** Maintainers' workshop: inspect and improve this preprepared test. */
import { test, expect } from '@playwright/test';
import { prepareUiScenario } from '../../support/ui-fixtures.ts';

test.skip('Team B: automation maintainability challenge', async ({ page, request }) => {
  const url = await prepareUiScenario(request, 'maint-team-B');
  await page.goto(url);
// Original brittle selector depends on a removed CSS class:
  await page.locator('.primary-booking').click();
  await expect(page.getByRole('heading', { name: /Reserve room/ })).toBeVisible();
});
