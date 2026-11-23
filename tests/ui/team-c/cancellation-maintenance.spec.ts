/** Maintainers' workshop: inspect and improve this preprepared test. */
import { test, expect } from '@playwright/test';
import { prepareUiScenario } from '../../support/ui-fixtures.ts';

test.skip('Team C: automation maintainability challenge', async ({ page, request }) => {
  const url = await prepareUiScenario(request, 'maint-team-C');
  await page.goto(url);
await page.getByRole('button', { name: 'My reservations' }).click();
  await page.getByTestId('reservation-BK-101').getByRole('button', { name: 'Cancel reservation' }).click();
  // Unreliable fixed delay (slows the suite and does not establish correct state):
  await page.waitForTimeout(5000);
  // TODO replace with a retrying state assertion.
});
