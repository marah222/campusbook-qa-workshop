/** Story S11: Reservation filter matches the selected status. Link to your real GitHub Issue. */
import { test, expect } from "vitest";
import { filterByStatus } from "../../../src/domain/reservations.js";
import type { Booking, ReservationStatus } from "../../../src/domain/types.js";

test("filterByStatus_GivenMultipleStatuses_shouldReturnOnlyBookingsMatchingSelectedStatus", () => {
  // 1. Setup mock data with strings for dates to match the 'Booking' type definition.
  const mockBookings: Booking[] = [
    {
      id: "1",
      userId: "alice",
      roomId: "room-101",
      start: "2024-05-01T10:00:00Z", // Changed to string
      end: "2024-05-01T11:00:00Z", // Changed to string
      people: 1,
      createdAt: "2024-04-30T10:00:00Z", // Changed to string
      status: "cancelled" as ReservationStatus,
    },
    {
      id: "2",
      userId: "alice",
      roomId: "room-102",
      start: "2024-05-02T10:00:00Z", // Changed to string
      end: "2024-05-02T11:00:00Z", // Changed to string
      people: 2,
      createdAt: "2024-04-30T11:00:00Z", // Changed to string
      status: "confirmed" as ReservationStatus,
    },
  ];

  // 2. Execute the filter function for 'confirmed' status
  const confirmedResults = filterByStatus(
    mockBookings,
    "confirmed" as ReservationStatus
  );

  // 3. Assertions for 'confirmed' filter
  // Note: This should FAIL with the current buggy code (!==) and PASS after fixing to (===)
  expect.soft(confirmedResults).toHaveLength(1);
  expect.soft(confirmedResults[0].id).toBe("2");

  // 4. Execute the filter function for 'cancelled' status
  const cancelledResults = filterByStatus(
    mockBookings,
    "cancelled" as ReservationStatus
  );

  // 5. Assertions for 'cancelled' filter
  expect.soft(cancelledResults).toHaveLength(1);
  expect.soft(cancelledResults[0].id).toBe("1");
});
