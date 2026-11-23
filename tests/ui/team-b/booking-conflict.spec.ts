/** Team B UI starter. Remove test.skip at the declaration after completing your assertions. */
import { test, expect } from '@playwright/test';
import { prepareUiScenario } from '../../support/ui-fixtures.ts';

test.skip('Show correct feedback for an overlapping reservation', async ({ page, request }) => {
  const url = await prepareUiScenario(request, 'ui-team-b');
  await page.goto(url);
  await page.getByLabel('Group size').selectOption('3');
  await page.getByRole('button', { name: 'Search rooms' }).click();
  // TODO: use an appropriate fixture/room, submit an overlapping reservation,
  // and assert that correct failure feedback appears.

});
