import type { Period, BookingRequest, ValidationError } from './types.js';

/** Determines whether two booking intervals overlap. */
// export function intervalsOverlap(existing: Period, requested: Period): boolean {
//   return existing.start <= requested.start && existing.end >= requested.end;
// }
export function intervalsOverlap(existing: Period, requested: Period): boolean {
  return existing.start < requested.end && existing.end > requested.start;
}

export function isDurationAllowed(minutes: number): boolean {
  return minutes >= 30 && minutes <= 120;
}

const stamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
function validMinuteStamp(v: string): boolean {
  if (!stamp.test(v)) return false;
  const date = new Date(`${v}:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 16) === v;
}

/** Returns a user-facing validation error or null. Fake clock makes fixture tests deterministic. */
export function validateBookingRequest(input: BookingRequest, now = '2027-03-18T08:00'): ValidationError | null {
  if (typeof input.start !== 'string' || typeof input.end !== 'string' || !validMinuteStamp(input.start) || !validMinuteStamp(input.end)) {
    return { code: 'INVALID_INTERVAL', message: 'Provide valid start and end times.', status: 422 };
  }
  if (input.end <= input.start) {
    return { code: 'INVALID_INTERVAL', message: 'End time must be after start time.', status: 422 };
  }
  if (input.start <= now) {
    return { code: 'INVALID_INTERVAL', message: 'Reservations must be in the future.', status: 422 };
  }
  if (input.start.slice(0, 10) !== input.end.slice(0, 10)) {
    return { code: 'INVALID_INTERVAL', message: 'A reservation must begin and end on the same day.', status: 422 };
  }
  const mins = (Date.parse(`${input.end}:00Z`) - Date.parse(`${input.start}:00Z`)) / 60000;
  if (!isDurationAllowed(mins)) {
    return { code: 'INVALID_INTERVAL', message: 'Duration must be 30 to 120 minutes.', status: 422 };
  }
  if (input.start.slice(11) < '09:00' || input.end.slice(11) > '18:00') {
    return { code: 'INVALID_INTERVAL', message: 'Bookings must fall between 09:00 and 18:00.', status: 422 };
  }
  if (!Number.isInteger(input.people) || input.people < 1) {
    return { code: 'INVALID_GROUP', message: 'Group size must be a positive whole number.', status: 422 };
  }
  return null;
}
