import type { Booking, ReservationStatus } from "./types.js";

export function filterOwnedReservations(
  bookings: Booking[],
  userId: string
): Booking[] {
  return bookings.filter((booking) => booking.userId === userId);
}

/** Filters reservations to a requested status. */
export function filterByStatus(
  bookings: Booking[],
  status: ReservationStatus
): Booking[] {
  return bookings.filter((booking) => booking.status === status);
}
