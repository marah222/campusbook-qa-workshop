/** Story S08: Repeated cancellation does not change state. Do not change expected results to match a defect. */
import { test, expect } from '@playwright/test';
import { headersFor, resetScenario, requestedBooking, existingReservationId } from '../../support/api-fixtures.ts';

// STUDENT TODO: use a unique scope such as 'api-s08' and resetScenario(request, scope).
// Business endpoint: POST /api/reservations/BK-103/cancel
// Fixture: BK-103 starts cancelled
// Main expected behavior: 409 ALREADY_CANCELLED
// Check both the response and relevant application state when possible.
test.skip('S08: repeated cancellation does not change state', async ({ request }) => {
  // STUDENT: Remove .skip, reset your scenario, send an HTTP request,
  // and assert the agreed outcome. The setup helper is imported above.
  // Example: await resetScenario(request, 'api-your-story');
  void request;
});
