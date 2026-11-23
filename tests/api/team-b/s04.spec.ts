/** Story S04: Valid booking request is accepted. Do not change expected results to match a defect. */
import { test, expect } from '@playwright/test';
import { headersFor, resetScenario, requestedBooking, existingReservationId } from '../../support/api-fixtures.ts';

// STUDENT TODO: use a unique scope such as 'api-s04' and resetScenario(request, scope).
// Business endpoint: POST /api/reservations
// Fixture: R101 11:00–12:00, 1 person
// Main expected behavior: 201 and correct saved state
// Check both the response and relevant application state when possible.
test.skip('S04: valid booking request is accepted', async ({ request }) => {
  // STUDENT: Remove .skip, reset your scenario, send an HTTP request,
  // and assert the agreed outcome. The setup helper is imported above.
  // Example: await resetScenario(request, 'api-your-story');
  void request;
});
