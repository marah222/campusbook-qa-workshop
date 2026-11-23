/** Team D UI starter. Remove test.skip at the declaration after completing your assertions. */
import { test, expect } from '@playwright/test';
import { prepareUiScenario } from '../../support/ui-fixtures.ts';

test.skip('Only cancelled reservations appear when filtered', async ({ page, request }) => {
  const url = await prepareUiScenario(request, 'ui-team-d');
  await page.goto(url);
  await page.getByRole('button', { name: 'My reservations' }).click();
  await page.getByLabel('Show reservations').selectOption('CANCELLED');
  // TODO: every visible reservation must have status Cancelled.

});
