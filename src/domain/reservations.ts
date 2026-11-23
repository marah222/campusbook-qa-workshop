import type { Booking, ReservationStatus } from "./types.js";

export function filterOwnedReservations(
  bookings: Booking[],
  userId: string
): Booking[] {
  // Peer review fix: Prevent data leak for empty userId
  if (!userId || userId.trim() === "") {
    return [];
  }
  return bookings.filter((booking) => booking.userId === userId);
}

/** Filters reservations to a requested status. */
export function filterByStatus(
  bookings: Booking[],
  status: ReservationStatus
): Booking[] {
  // Peer review fix: Validate status to prevent silent failures
  const validStatuses: ReservationStatus[] = ["CONFIRMED", "CANCELLED"];

  if (!status || !validStatuses.includes(status)) {
    throw new Error(`Invalid reservation status: ${status}`);
  }

  return bookings.filter((booking) => booking.status === status);
}
