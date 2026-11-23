/** Team C UI starter. Remove test.skip at the declaration after completing your assertions. */
import { test, expect } from '@playwright/test';
import { prepareUiScenario } from '../../support/ui-fixtures.ts';

test.skip('Cancel a confirmed reservation in the browser', async ({ page, request }) => {
  const url = await prepareUiScenario(request, 'ui-team-c');
  await page.goto(url);
  await page.getByRole('button', { name: 'My reservations' }).click();
  // TODO: find BK-101, click Cancel reservation,
  // and assert the status becomes Cancelled.

});
