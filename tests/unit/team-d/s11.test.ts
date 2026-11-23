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
      start: "2024-05-01T10:00:00Z",
      end: "2024-05-01T11:00:00Z",
      people: 1,
      createdAt: "2024-04-30T10:00:00Z",
      status: "cancelled" as ReservationStatus,
    },
    {
      id: "2",
      userId: "alice",
      roomId: "room-102",
      start: "2024-05-02T10:00:00Z",
      end: "2024-05-02T11:00:00Z",
      people: 2,
      createdAt: "2024-04-30T11:00:00Z",
      status: "confirmed" as ReservationStatus,
    },
  ];

  // 2. Test filtering by 'confirmed'
  const confirmedResults = filterByStatus(
    mockBookings,
    "confirmed" as ReservationStatus
  );

  expect.soft(confirmedResults).toHaveLength(1);
  expect.soft(confirmedResults[0].id).toBe("2");

  // 3. Test filtering by 'cancelled'
  const cancelledResults = filterByStatus(
    mockBookings,
    "cancelled" as ReservationStatus
  );

  expect.soft(cancelledResults).toHaveLength(1);
  expect.soft(cancelledResults[0].id).toBe("1");
});
