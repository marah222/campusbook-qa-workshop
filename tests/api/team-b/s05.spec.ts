/** Story S05: Partial booking overlap is rejected. Do not change expected results to match a defect. */
import { test, expect } from '@playwright/test';
import { headersFor, resetScenario, requestedBooking, existingReservationId } from '../../support/api-fixtures.ts';

// STUDENT TODO: use a unique scope such as 'api-s05' and resetScenario(request, scope).
// Business endpoint: POST /api/reservations
// Fixture: R102 10:30–11:30, existing 10:00–11:00
// Main expected behavior: 409, BOOKING_CONFLICT and no new record
// Check both the response and relevant application state when possible.
test.skip('S05: partial booking overlap is rejected', async ({ request }) => {
  // STUDENT: Remove .skip, reset your scenario, send an HTTP request,
  // and assert the agreed outcome. The setup helper is imported above.
  // Example: await resetScenario(request, 'api-your-story');
  void request;
});
