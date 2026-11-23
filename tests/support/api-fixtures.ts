import type { APIRequestContext } from '@playwright/test';

/** Isolate each test in its own local in-memory booking dataset. */
export function headersFor(scope: string, user: 'alice' | 'bob' = 'alice'): Record<string, string> {
  return { 'x-demo-user': user, 'x-test-scope': scope };
}
export async function resetScenario(request: APIRequestContext, scope: string): Promise<void> {
  const response = await request.post('/api/testing/reset', { headers: headersFor(scope) });
  if (response.status() !== 200) throw new Error(`Fixture reset failed for ${scope}: HTTP ${response.status()}`);
}
export const FIXTURE_DAY = '2027-03-18';
export const existingReservationId = 'BK-101';
export function requestedBooking(roomId: string, startTime: string, endTime: string, people = 2) {
  return { roomId, start: `${FIXTURE_DAY}T${startTime}`, end: `${FIXTURE_DAY}T${endTime}`, people };
}
