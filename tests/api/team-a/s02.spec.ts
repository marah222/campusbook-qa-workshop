/** Story S02: Room capacity accepts its exact boundary. Do not change expected results to match a defect. */
import { test, expect } from '@playwright/test';
import { headersFor, resetScenario, requestedBooking, existingReservationId } from '../../support/api-fixtures.ts';

// STUDENT TODO: use a unique scope such as 'api-s02' and resetScenario(request, scope).
// Business endpoint: GET /api/rooms?minCapacity=4
// Fixture: capacity 4 for group size 4
// Main expected behavior: R102 capacity four should be included
// Check both the response and relevant application state when possible.
test.skip('S02: room capacity accepts its exact boundary', async ({ request }) => {
  // STUDENT: Remove .skip, reset your scenario, send an HTTP request,
  // and assert the agreed outcome. The setup helper is imported above.
  // Example: await resetScenario(request, 'api-your-story');
  void request;
});
