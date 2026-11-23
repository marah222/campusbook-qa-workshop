/** Story S07: Owned confirmed booking can be cancelled. Link to your real GitHub Issue. */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { canCancelBooking } from '../../../src/domain/cancellation.js';
import type { Booking } from '../../../src/domain/types.js';

describe('S07: cancellation eligibility', () => {
  function createConfirmedBooking(): Booking {
    return {
      id: 'BK-101',
      roomId: 'R102',
      userId: 'alice',
      start: '2027-03-18T10:00',
      end: '2027-03-18T11:00',
      people: 3,
      status: 'CONFIRMED',
      createdAt: '2027-03-18T08:00',
    };
  }

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2027-03-18T08:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // An owner may cancel a confirmed booking only before its reserved start.
  // Cancellation is rejected exactly at the start and at all later times.
  // Use campus-local times, matching the booking's minute-based timestamps.
  test('canCancelBooking_BeforeReservedStart_ShouldReturnTrue', () => {
    // Arrange
    const booking = createConfirmedBooking();
    vi.setSystemTime(new Date('2027-03-18T09:59'));

    // Act
    const result = canCancelBooking(booking, 'alice');

    // Assert
    expect(result).toBe(true);
  });

  test('canCancelBooking_ExactlyAtReservedStart_ShouldReturnFalse', () => {
    // Arrange
    const booking = createConfirmedBooking();
    vi.setSystemTime(new Date('2027-03-18T10:00'));

    // Act
    const result = canCancelBooking(booking, 'alice');

    // Assert
    expect(result).toBe(false);
  });

  test('canCancelBooking_AfterStartBeforeEnd_ShouldReturnFalse', () => {
    // Arrange
    const booking = createConfirmedBooking();
    vi.setSystemTime(new Date('2027-03-18T10:01'));

    // Act
    const result = canCancelBooking(booking, 'alice');

    // Assert
    expect(result).toBe(false);
  });

  test('canCancelBooking_ExactlyAtReservedEnd_ShouldReturnFalse', () => {
    // Arrange
    const booking = createConfirmedBooking();
    vi.setSystemTime(new Date('2027-03-18T11:00'));

    // Act
    const result = canCancelBooking(booking, 'alice');

    // Assert
    expect(result).toBe(false);
  });

  test('canCancelBooking_AfterReservedEnd_ShouldReturnFalse', () => {
    // Arrange
    const booking = createConfirmedBooking();
    vi.setSystemTime(new Date('2027-03-18T11:01'));

    // Act
    const result = canCancelBooking(booking, 'alice');

    // Assert
    expect(result).toBe(false);
  });

  test('canCancelBooking_UserIsNotOwner_ShouldReturnFalse', () => {
    // Arrange
    const booking = createConfirmedBooking();

    // Act
    const result = canCancelBooking(booking, 'bob');

    // Assert
    expect(result).toBe(false);
  });

  test('canCancelBooking_AlreadyCancelled_ShouldReturnFalse', () => {
    // Arrange
    const booking = createConfirmedBooking();
    booking.status = 'CANCELLED';

    // Act
    const result = canCancelBooking(booking, 'alice');

    // Assert
    expect(result).toBe(false);
  });
});
