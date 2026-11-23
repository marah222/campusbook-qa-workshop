/** Story S03: Existing confirmed booking affects room availability. Do not change expected results to match a defect. */
import { test, expect } from '@playwright/test';
import { headersFor, resetScenario, requestedBooking, existingReservationId } from '../../support/api-fixtures.ts';

// STUDENT TODO: use a unique scope such as 'api-s03' and resetScenario(request, scope).
// Business endpoint: GET /api/rooms?start=...&end=...
// Fixture: confirmed R102 interval 10:00–11:00
// Main expected behavior: R102 is unavailable 10:00–11:00
// Check both the response and relevant application state when possible.
test.skip('S03: existing confirmed booking affects room availability', async ({ request }) => {
  // STUDENT: Remove .skip, reset your scenario, send an HTTP request,
  // and assert the agreed outcome. The setup helper is imported above.
  // Example: await resetScenario(request, 'api-your-story');
  void request;
});
