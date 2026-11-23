/** Story S09: Cancelled reservations release availability. Do not change expected results to match a defect. */
import { test, expect } from '@playwright/test';
import { headersFor, resetScenario, requestedBooking, existingReservationId } from '../../support/api-fixtures.ts';

// STUDENT TODO: use a unique scope such as 'api-s09' and resetScenario(request, scope).
// Business endpoint: POST /api/reservations/BK-101/cancel + POST /api/reservations
// Fixture: cancel BK-101, rebook R102 10:00–11:00
// Main expected behavior: A later booking for the released slot succeeds
// Check both the response and relevant application state when possible.
test.skip('S09: cancelled reservations release availability', async ({ request }) => {
  // STUDENT: Remove .skip, reset your scenario, send an HTTP request,
  // and assert the agreed outcome. The setup helper is imported above.
  // Example: await resetScenario(request, 'api-your-story');
  void request;
});
