/** Maintainers' workshop: inspect and improve this preprepared test. */
import { test, expect } from '@playwright/test';
import { prepareUiScenario } from '../../support/ui-fixtures.ts';

test.skip('Team D: automation maintainability challenge', async ({ page, request }) => {
  const url = await prepareUiScenario(request, 'maint-team-D');
  await page.goto(url);
await page.getByRole('button', { name: 'My reservations' }).click();
  // Too weak: a visible list does not verify correct reservation data:
  await expect(page.locator('#reservationList')).toBeVisible();
  // TODO strengthen without making it fragile.
});
