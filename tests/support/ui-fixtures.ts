import type { APIRequestContext } from '@playwright/test';
import { resetScenario } from './api-fixtures.ts';

/** Reset the browser's named dataset before each UI scenario. No login sequence is needed. */
export async function prepareUiScenario(request: APIRequestContext, scope: string): Promise<string> {
  await resetScenario(request, scope);
  return `/?scope=${encodeURIComponent(scope)}`;
}
