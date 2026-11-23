/** Story S11: Reservation filter matches the selected status. Do not change expected results to match a defect. */
import { test, expect } from '@playwright/test';
import { headersFor, resetScenario, requestedBooking, existingReservationId } from '../../support/api-fixtures.ts';

// STUDENT TODO: use a unique scope such as 'api-s11' and resetScenario(request, scope).
// Business endpoint: GET /api/reservations?status=CANCELLED
// Fixture: Alice has one cancelled and one confirmed booking
// Main expected behavior: Every result is CANCELLED
// Check both the response and relevant application state when possible.
test.skip('S11: reservation filter matches the selected status', async ({ request }) => {
  // STUDENT: Remove .skip, reset your scenario, send an HTTP request,
  // and assert the agreed outcome. The setup helper is imported above.
  // Example: await resetScenario(request, 'api-your-story');
  void request;
});
