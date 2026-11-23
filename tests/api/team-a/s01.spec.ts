/** Story S01: Room list hides inactive rooms. Do not change expected results to match a defect. */
import { test, expect } from '@playwright/test';
import { headersFor, resetScenario, requestedBooking, existingReservationId } from '../../support/api-fixtures.ts';

// STUDENT TODO: use a unique scope such as 'api-s01' and resetScenario(request, scope).
// Business endpoint: GET /api/rooms
// Fixture: active vs inactive room rows
// Main expected behavior: Check all returned rooms are active
// Check both the response and relevant application state when possible.
test.skip('S01: room list hides inactive rooms', async ({ request }) => {
  // STUDENT: Remove .skip, reset your scenario, send an HTTP request,
  // and assert the agreed outcome. The setup helper is imported above.
  // Example: await resetScenario(request, 'api-your-story');
  void request;
});
