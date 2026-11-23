/** Story S11: Reservation filter matches the selected status. Link to your real GitHub Issue. */
import { test, expect } from "vitest";
import { filterByStatus } from "../../../src/domain/reservations.js";
import type { Booking, ReservationStatus } from "../../../src/domain/types.js";

test("filterByStatus_GivenMultipleStatuses_shouldReturnOnlyBookingsMatchingSelectedStatus", () => {
  const mockBookings: Booking[] = [
    {
      id: "1",
      userId: "alice",
      roomId: "room-101",
      start: "2024-05-01T10:00:00Z",
      end: "2024-05-01T11:00:00Z",
      people: 1,
      createdAt: "2024-04-30T10:00:00Z",
      status: "CANCELLED",
    },
    {
      id: "2",
      userId: "alice",
      roomId: "room-102",
      start: "2024-05-02T10:00:00Z",
      end: "2024-05-02T11:00:00Z",
      people: 2,
      createdAt: "2024-04-30T11:00:00Z",
      status: "CONFIRMED",
    },
  ];

  const confirmedResults = filterByStatus(mockBookings, "CONFIRMED");
  expect.soft(confirmedResults).toHaveLength(1);
  expect.soft(confirmedResults[0].id).toBe("2");

  const cancelledResults = filterByStatus(mockBookings, "CANCELLED");
  expect.soft(cancelledResults).toHaveLength(1);
  expect.soft(cancelledResults[0].id).toBe("1");
});

// --- Added based on Peer Review ---

test("filterByStatus_InvalidStatus_throwsError", () => {
  const mockBookings: Booking[] = [];

  // Test unknown status (e.g., 'banana')
  expect(() => filterByStatus(mockBookings, "banana" as any)).toThrowError(
    "Invalid reservation status: banana"
  );

  // Test empty string
  expect(() => filterByStatus(mockBookings, "" as any)).toThrowError(
    "Invalid reservation status: "
  );

  // Test undefined/null
  expect(() => filterByStatus(mockBookings, null as any)).toThrowError(
    "Invalid reservation status: null"
  );
});
