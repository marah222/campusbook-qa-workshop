/** Story S03: Existing confirmed booking affects room availability. Link to your real GitHub Issue. */
import { test, expect } from 'vitest';
import { isRoomAvailable } from '../../../src/domain/rooms.js';
import type { Booking } from '../../../src/domain/types.js';

test('isRoomAvailable_existingConfirmedBooking_returnsFalseOnlyForSameSlotAndRoom', () => {
  // Arrange
  const bookings: Booking[] = [
    { id: 'b1', roomId: 'R102', userId: 'u1', start: '2027-03-19T10:00', end: '2027-03-19T11:00', people: 4, status: 'CONFIRMED', createdAt: '2027-03-18T08:00' }
  ];

  // Act
  const sameSlot = isRoomAvailable('R102', { start: '2027-03-19T10:00', end: '2027-03-19T11:00' }, bookings);
  const laterSlot = isRoomAvailable('R102', { start: '2027-03-19T11:00', end: '2027-03-19T12:00' }, bookings);
  const otherRoom = isRoomAvailable('R101', { start: '2027-03-19T10:00', end: '2027-03-19T11:00' }, bookings);

  // Assert
  expect(sameSlot).toBe(false);
  expect(laterSlot).toBe(true);
  expect(otherRoom).toBe(true);
});



test('isRoomAvailable_invalidDate33November_returnsFalse', () => {
  // Arrange
  const bookings: Booking[] = [];

  // Act
  const result = isRoomAvailable('R102', { start: '2027-11-33T10:00', end: '2027-11-33T11:00' }, bookings);

  // Assert
  expect(result).toBe(false);
});

test('isRoomAvailable_invalidTime_returnsFalse', () => {
  // Arrange
  const bookings: Booking[] = [];

  // Act
  const result = isRoomAvailable('R102', { start: '2027-03-19T25:00', end: '2027-03-19T26:00' }, bookings);

  // Assert
  expect(result).toBe(false);
});

test('isRoomAvailable_negativeValues_returnsFalse', () => {
  // Arrange
  const bookings: Booking[] = [];

  // Act
  const result = isRoomAvailable('R102', { start: '2027-03-19T-1:00', end: '2027-03-19T-2:00' }, bookings);

  // Assert
  expect(result).toBe(false);
});

test('isRoomAvailable_feb29LeapYear_returnsTrue', () => {
  // Arrange
  const bookings: Booking[] = [];

  // Act
  const result = isRoomAvailable('R102', { start: '2024-02-29T10:00', end: '2024-02-29T11:00' }, bookings);

  // Assert
  expect(result).toBe(true);
});

test('isRoomAvailable_feb29NonLeapYear_returnsFalse', () => {
  // Arrange
  const bookings: Booking[] = [];

  // Act
  const result = isRoomAvailable('R102', { start: '2023-02-29T10:00', end: '2023-02-29T11:00' }, bookings);

  // Assert
  expect(result).toBe(false);
});

test('isRoomAvailable_endBeforeStart_returnsFalse', () => {
  // Arrange
  const bookings: Booking[] = [];

  // Act
  const result = isRoomAvailable('R102', { start: '2027-03-19T11:00', end: '2027-03-19T10:00' }, bookings);

  // Assert
  expect(result).toBe(false);
});

test('isRoomAvailable_endEqualToStart_returnsFalse', () => {
  // Arrange
  const bookings: Booking[] = [];

  // Act
  const result = isRoomAvailable('R102', { start: '2027-03-19T10:00', end: '2027-03-19T10:00' }, bookings);

  // Assert
  expect(result).toBe(false);
});

test('isRoomAvailable_validPeriodNoBookings_returnsTrue', () => {
  // Arrange
  const bookings: Booking[] = [];

  // Act
  const result = isRoomAvailable('R102', { start: '2027-03-19T10:00', end: '2027-03-19T11:00' }, bookings);

  // Assert
  expect(result).toBe(true);
});