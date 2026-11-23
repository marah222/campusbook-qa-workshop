/**
 * Story S04: Valid booking request is accepted.
 * Link this test file to your Story S04 GitHub Issue.
 *
 * Overview:
 * - Tests `validateBookingRequest` in `src/domain/booking.ts` for Story S04 ("Valid booking request is accepted").
 * - Valid requests return `null` (accepted); invalid requests return a `ValidationError` (`422`).
 * - Duration and operating-hours policy rules are out of scope for this test file.
 */
import { describe, expect, test } from 'vitest';
import { validateBookingRequest } from '../../../src/domain/booking.js';
import type { BookingRequest, ValidationError } from '../../../src/domain/types.js';

// Fixed reference clock (March 18, 2027 at 08:00) for deterministic time checks.
const WORKSHOP_CLOCK = '2027-03-18T08:00';

// Creates a valid baseline booking request and applies field overrides for a test case.
function createSampleBookingRequestWithOverrides(
  fieldOverrides: Partial<BookingRequest> = {}
): BookingRequest {
  const baselineValidRequest: BookingRequest = {
    roomId: 'R101',
    start: '2027-03-18T11:00',
    end: '2027-03-18T12:00',
    people: 1
  };
  return { ...baselineValidRequest, ...fieldOverrides };
}

describe('validateBookingRequest', () => {
  describe('Accepted valid booking requests', () => {
    test.each<{
      request: BookingRequest;
      now: string;
      expected: ValidationError | null;
      testCaseName: string;
    }>([
      {
        request: createSampleBookingRequestWithOverrides({
          roomId: 'R101',
          start: '2027-03-18T11:00',
          end: '2027-03-18T12:00',
          people: 1
        }),
        now: WORKSHOP_CLOCK,
        expected: null,
        testCaseName: 'validateBookingRequest_validS04BaselineRequest_accept'
      },
      {
        request: createSampleBookingRequestWithOverrides({
          roomId: 'R102',
          start: '2027-03-18T10:00',
          end: '2027-03-18T11:00',
          people: 4
        }),
        now: WORKSHOP_CLOCK,
        expected: null,
        testCaseName: 'validateBookingRequest_validRoomR102FourPeople_accept'
      },
      {
        request: createSampleBookingRequestWithOverrides({
          roomId: 'R103',
          start: '2027-03-18T14:00',
          end: '2027-03-18T15:00',
          people: 6
        }),
        now: WORKSHOP_CLOCK,
        expected: null,
        testCaseName: 'validateBookingRequest_validRoomR103SixPeople_accept'
      }
    ])('$testCaseName', ({ request, now, expected }) => {
      // Arrange: valid request, workshop clock, and expected null result come from the test table.
      // Act: validate the booking request against the workshop clock.
      const actualResult = validateBookingRequest(request, now);
      // Assert: confirm the booking request is accepted.
      expect(actualResult).toEqual(expected);
    });

    test.each<{
      request: BookingRequest;
      expected: ValidationError | null;
      testCaseName: string;
    }>([
      {
        request: createSampleBookingRequestWithOverrides({
          roomId: 'R101',
          start: '2027-03-18T11:00',
          end: '2027-03-18T12:00',
          people: 1
        }),
        expected: null,
        testCaseName: 'validateBookingRequest_defaultClockValidRequest_accept'
      }
    ])('$testCaseName', ({ request, expected }) => {
      // Arrange: valid request is prepared without passing an explicit clock argument.
      // Act: validate the booking request using the default clock.
      const actualResult = validateBookingRequest(request);
      // Assert: confirm the booking request is accepted.
      expect(actualResult).toEqual(expected);
    });
  });

  describe('Malformed or invalid start and end timestamps', () => {
    test.each<{
      request: BookingRequest;
      now: string;
      expected: ValidationError;
      testCaseName: string;
    }>([
      {
        request: createSampleBookingRequestWithOverrides({ start: '', end: '2027-03-18T12:00' }),
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_INTERVAL', message: 'Provide valid start and end times.', status: 422 },
        testCaseName: 'validateBookingRequest_emptyStartTimestamp_reject'
      },
      {
        request: createSampleBookingRequestWithOverrides({
          start: '2027-03-18 11:00',
          end: '2027-03-18T12:00'
        }),
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_INTERVAL', message: 'Provide valid start and end times.', status: 422 },
        testCaseName: 'validateBookingRequest_spaceInsteadOfTInStart_reject'
      },
      {
        request: createSampleBookingRequestWithOverrides({
          start: 'not-a-timestamp',
          end: '2027-03-18T12:00'
        }),
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_INTERVAL', message: 'Provide valid start and end times.', status: 422 },
        testCaseName: 'validateBookingRequest_lettersInStartTimestamp_reject'
      },
      {
        request: createSampleBookingRequestWithOverrides({
          start: '2027-03-18T11:00',
          end: 'not-a-timestamp'
        }),
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_INTERVAL', message: 'Provide valid start and end times.', status: 422 },
        testCaseName: 'validateBookingRequest_lettersInEndTimestamp_reject'
      },
      {
        request: createSampleBookingRequestWithOverrides({
          start: '2027-02-29T10:00',
          end: '2027-02-29T11:00'
        }),
        now: '2027-02-01T08:00',
        expected: { code: 'INVALID_INTERVAL', message: 'Provide valid start and end times.', status: 422 },
        testCaseName: 'validateBookingRequest_nonExistentCalendarDate_reject'
      },
      {
        request: {
          roomId: 'R101',
          start: null as unknown as string,
          end: '2027-03-18T12:00',
          people: 1
        },
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_INTERVAL', message: 'Provide valid start and end times.', status: 422 },
        testCaseName: 'validateBookingRequest_nullStartTimestamp_reject'
      },
      {
        request: {
          roomId: 'R101',
          start: 12345 as unknown as string,
          end: '2027-03-18T12:00',
          people: 1
        },
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_INTERVAL', message: 'Provide valid start and end times.', status: 422 },
        testCaseName: 'validateBookingRequest_numericStartTimestamp_reject'
      },
      {
        request: {
          roomId: 'R101',
          start: '2027-03-18T11:00',
          end: null as unknown as string,
          people: 1
        },
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_INTERVAL', message: 'Provide valid start and end times.', status: 422 },
        testCaseName: 'validateBookingRequest_nullEndTimestamp_reject'
      }
    ])('$testCaseName', ({ request, now, expected }) => {
      // Arrange: malformed timestamp input, clock, and expected error come from the test table.
      // Act: validate the booking request.
      const actualResult = validateBookingRequest(request, now);
      // Assert: confirm the request is rejected with INVALID_INTERVAL (422).
      expect(actualResult).toEqual(expected);
    });
  });

  describe('Time ordering and non-future start times', () => {
    test.each<{
      request: BookingRequest;
      now: string;
      expected: ValidationError;
      testCaseName: string;
    }>([
      {
        request: createSampleBookingRequestWithOverrides({
          start: '2027-03-18T11:00',
          end: '2027-03-18T11:00'
        }),
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_INTERVAL', message: 'End time must be after start time.', status: 422 },
        testCaseName: 'validateBookingRequest_endEqualsStart_reject'
      },
      {
        request: createSampleBookingRequestWithOverrides({
          start: '2027-03-18T12:00',
          end: '2027-03-18T11:00'
        }),
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_INTERVAL', message: 'End time must be after start time.', status: 422 },
        testCaseName: 'validateBookingRequest_endBeforeStart_reject'
      },
      {
        request: createSampleBookingRequestWithOverrides({
          start: '2027-03-18T08:00',
          end: '2027-03-18T09:00'
        }),
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_INTERVAL', message: 'Reservations must be in the future.', status: 422 },
        testCaseName: 'validateBookingRequest_startEqualsNow_reject'
      },
      {
        request: createSampleBookingRequestWithOverrides({
          start: '2027-03-18T07:00',
          end: '2027-03-18T08:00'
        }),
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_INTERVAL', message: 'Reservations must be in the future.', status: 422 },
        testCaseName: 'validateBookingRequest_startInPastBeforeNow_reject'
      }
    ])('$testCaseName', ({ request, now, expected }) => {
      // Arrange: request with invalid time ordering or non-future start time is prepared.
      // Act: validate the booking request against the workshop clock.
      const actualResult = validateBookingRequest(request, now);
      // Assert: confirm the request is rejected with the expected interval error.
      expect(actualResult).toEqual(expected);
    });
  });

  describe('Invalid group sizes', () => {
    test.each<{
      request: BookingRequest;
      now: string;
      expected: ValidationError;
      testCaseName: string;
    }>([
      {
        request: createSampleBookingRequestWithOverrides({ people: 0 }),
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_GROUP', message: 'Group size must be a positive whole number.', status: 422 },
        testCaseName: 'validateBookingRequest_zeroPeople_reject'
      },
      {
        request: createSampleBookingRequestWithOverrides({ people: -1 }),
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_GROUP', message: 'Group size must be a positive whole number.', status: 422 },
        testCaseName: 'validateBookingRequest_negativePeople_reject'
      },
      {
        request: createSampleBookingRequestWithOverrides({ people: 1.5 }),
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_GROUP', message: 'Group size must be a positive whole number.', status: 422 },
        testCaseName: 'validateBookingRequest_decimalPeople_reject'
      },
      {
        request: {
          roomId: 'R101',
          start: '2027-03-18T11:00',
          end: '2027-03-18T12:00',
          people: 'two' as unknown as number
        },
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_GROUP', message: 'Group size must be a positive whole number.', status: 422 },
        testCaseName: 'validateBookingRequest_lettersInPeople_reject'
      },
      {
        request: {
          roomId: 'R101',
          start: '2027-03-18T11:00',
          end: '2027-03-18T12:00',
          people: null as unknown as number
        },
        now: WORKSHOP_CLOCK,
        expected: { code: 'INVALID_GROUP', message: 'Group size must be a positive whole number.', status: 422 },
        testCaseName: 'validateBookingRequest_nullPeople_reject'
      }
    ])('$testCaseName', ({ request, now, expected }) => {
      // Arrange: request with an invalid group size and expected error is prepared.
      // Act: validate the booking request   .
      const actualResult = validateBookingRequest(request, now);
      // Assert: confirm the request is rejected with INVALID_GROUP (422).
      expect(actualResult).toEqual(expected);
    });
  });
});