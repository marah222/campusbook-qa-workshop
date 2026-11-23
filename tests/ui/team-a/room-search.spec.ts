/** Team A UI starter. Remove test.skip at the declaration after completing your assertions. */
import { test, expect } from '@playwright/test';
import { prepareUiScenario } from '../../support/ui-fixtures.ts';

test.skip('Filter room discovery by exact capacity', async ({ page, request }) => {
  const url = await prepareUiScenario(request, 'ui-team-a');
  await page.goto(url);
  await page.getByLabel('Group size').selectOption('4');
  await page.getByRole('button', { name: 'Search rooms' }).click();
  // TODO: R102 (capacity 4) must appear; this test can expose a product defect.

});
