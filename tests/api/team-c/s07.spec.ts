/** Story S07: Owned confirmed booking can be cancelled. Do not change expected results to match a defect. */
import { test, expect } from '@playwright/test';
import { headersFor, resetScenario, requestedBooking, existingReservationId } from '../../support/api-fixtures.ts';

// STUDENT TODO: use a unique scope such as 'api-s07' and resetScenario(request, scope).
// Business endpoint: POST /api/reservations/BK-101/cancel
// Fixture: Alice owns BK-101
// Main expected behavior: 200, status CANCELLED
// Check both the response and relevant application state when possible.
test.skip('S07: owned confirmed booking can be cancelled', async ({ request }) => {
  // STUDENT: Remove .skip, reset your scenario, send an HTTP request,
  // and assert the agreed outcome. The setup helper is imported above.
  // Example: await resetScenario(request, 'api-your-story');
  void request;
});
