/** Story S06: Booking duration must be within policy. Do not change expected results to match a defect. */
import { test, expect } from '@playwright/test';
import { headersFor, resetScenario, requestedBooking, existingReservationId } from '../../support/api-fixtures.ts';

// STUDENT TODO: use a unique scope such as 'api-s06' and resetScenario(request, scope).
// Business endpoint: POST /api/reservations
// Fixture: R101 11:00–13:30 exceeds 120 minutes
// Main expected behavior: 422 and unchanged state
// Check both the response and relevant application state when possible.
test.skip('S06: booking duration must be within policy', async ({ request }) => {
  // STUDENT: Remove .skip, reset your scenario, send an HTTP request,
  // and assert the agreed outcome. The setup helper is imported above.
  // Example: await resetScenario(request, 'api-your-story');
  void request;
});
