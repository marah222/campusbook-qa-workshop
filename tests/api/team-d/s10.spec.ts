/** Story S10: Only current user can see their reservations. Do not change expected results to match a defect. */
import { test, expect } from '@playwright/test';
import { headersFor, resetScenario, requestedBooking, existingReservationId } from '../../support/api-fixtures.ts';

// STUDENT TODO: use a unique scope such as 'api-s10' and resetScenario(request, scope).
// Business endpoint: GET /api/reservations
// Fixture: two demo accounts
// Main expected behavior: Alice and Bob receive disjoint owned records
// Check both the response and relevant application state when possible.
test.skip('S10: only current user can see their reservations', async ({ request }) => {
  // STUDENT: Remove .skip, reset your scenario, send an HTTP request,
  // and assert the agreed outcome. The setup helper is imported above.
  // Example: await resetScenario(request, 'api-your-story');
  void request;
});
