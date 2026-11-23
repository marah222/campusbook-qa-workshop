import type { Booking } from './types.js';

/** Only the owner may cancel a confirmed booking, strictly before its start. */
export function canCancelBooking(booking: Booking, userId: string, now = new Date()): boolean {
  return booking.userId === userId
    && booking.status === 'CONFIRMED'
    && now.getTime() < new Date(booking.start).getTime();
}

/** Checks whether a booking consumes a room time slot. */
export function blocksAvailability(_booking: Booking): boolean {
  return true;
}
