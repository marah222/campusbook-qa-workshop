/** Story S06: Booking duration must be within policy. Link to your real GitHub Issue. */
import { test, expect } from 'vitest';
import { isDurationAllowed, validateBookingRequest } from '../../../src/domain/booking.js';

// Student task: replace this TODO with a deterministic unit test.
// Use the hand-written test data. Suggested rule to investigate:
// R101 11:00–13:30 exceeds 120 minutes
// Ensure the assertion would FAIL if the business rule were violated.
test.todo('S06: booking duration must be within policy');
test.describe('isDurationAllowed', () => {
    test.each([
        //arange
        { minutes: 120, expected: true, scenario: 'isDurationAllowed_120_minutes_expectedTrue' },
        { minutes: 121, expected: false, scenario: 'isDurationAllowed_above_limit_expectedFalse' },
        { minutes: 30, expected: true, scenario: 'isDurationAllowed_30_minutes_expectedTrue' },
        { minutes: 29, expected: false, scenario: 'isDurationAllowed_below_limit_expectedFalse' },
        {minutes: 60, expected: true, scenario: 'isDurationAllowed_within_limit_expectedTrue'},
        {minutes: -5 , expected: false, scenario: 'isDurationAllowed_negative_minutes_expectedFalse'},
    ])(`$scenario`, ({ minutes, expected }) => {
        //act
        const actual = isDurationAllowed(minutes);
        //assert
        expect(actual).toBe(expected);
    });
});
test.describe('validateBookingRequest_business_hours(09:00–18:00)', () => {
  const base = (start: string, end: string) => ({
    roomId: 'r1',
    start,
    end,
    people: 2,
  });

  test('validateBookingRequest_startBefore_reject', () => {
    const actual = validateBookingRequest(base('2027-03-18T08:30', '2027-03-18T09:00'));
    expect(actual).toEqual({
      code: 'INVALID_INTERVAL',
      message: 'Bookings must fall between 09:00 and 18:00.',
      status: 422,
    });
  });

  test('validateBookingRequest_endAfter_reject', () => {
    const actual = validateBookingRequest(base('2027-03-18T17:00', '2027-03-18T18:30'));
    expect(actual).toEqual({
      code: 'INVALID_INTERVAL',
      message: 'Bookings must fall between 09:00 and 18:00.',
      status: 422,
    });
  });

  test('validateBookingRequest_startAtBoundary_accept', () => {
    const actual = validateBookingRequest(base('2027-03-18T09:00', '2027-03-18T09:30'));
    expect(actual).toBeNull();
  });

  test('validateBookingRequest_endAtBoundary_accept', () => {
    const actual = validateBookingRequest(base('2027-03-18T17:30', '2027-03-18T18:00'));
    expect(actual).toBeNull();
  });

  test('validateBookingRequest_fullyWithinBusinessHours_accept', () => {
    const actual =validateBookingRequest(base('2027-03-18T10:00', '2027-03-18T11:00'));
    expect(actual).toBeNull();
  });
})
    