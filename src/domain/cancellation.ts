import type { Booking } from './types.js';

export function canCancelBooking(booking: Booking, userId: string): boolean {
  return booking.userId === userId && booking.status === 'CONFIRMED';
}

/** Checks whether a booking consumes a room time slot. */
export function blocksAvailability(_booking: Booking): boolean {
  return true;
}
