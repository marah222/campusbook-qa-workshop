/** Story S10: Only current user can see their reservations. GitHub Issue #10 */
import { test, expect } from 'vitest';
import { filterOwnedReservations } from '../../../src/domain/reservations.js';
import type { Booking } from '../../../src/domain/types.js';

// Reference time in system: 2027-03-18T08:00
// Hand-written data for two demo accounts: user-alice and user-bob.
const sampleBookings: Booking[] = [
  {
    id: 'b-1',
    roomId: 'room-101',
    userId: 'user-alice',
    start: '2027-03-19T09:00', // future, confirmed
    end: '2027-03-19T10:00',
    people: 3,
    status: 'CONFIRMED',
    createdAt: '2027-03-18T08:00',
  },
  {
    id: 'b-2',
    roomId: 'room-102',
    userId: 'user-bob',
    start: '2027-03-19T11:00', // future, confirmed
    end: '2027-03-19T12:00',
    people: 2,
    status: 'CONFIRMED',
    createdAt: '2027-03-18T08:05',
  },
  {
    id: 'b-3',
    roomId: 'room-101',
    userId: 'user-alice',
    start: '2027-03-20T14:00', // future, cancelled
    end: '2027-03-20T15:30',
    people: 4,
    status: 'CANCELLED',
    createdAt: '2027-03-18T08:10',
  },
  {
    id: 'b-4',
    roomId: 'room-103',
    userId: 'user-alice',
    start: '2027-03-17T10:00', // past / ended
    end: '2027-03-17T11:00',
    people: 2,
    status: 'CONFIRMED',
    createdAt: '2027-03-16T09:00',
  },
  {
    id: 'b-5',
    roomId: 'room-104',
    userId: 'user-bob',
    start: '2027-03-17T13:00', // past / ended
    end: '2027-03-17T14:00',
    people: 5,
    status: 'CONFIRMED',
    createdAt: '2027-03-16T10:00',
  },
];

test('filterOwnedReservations_aliceHasFutureCancelledAndPastBookings_returnsAllThreeOfHerBookings', () => {
  // Arrange
  const currentUserId = 'user-alice';

  // Act
  const result = filterOwnedReservations(sampleBookings, currentUserId);

  // Assert
  expect(result.map(b => b.id)).toEqual(['b-1', 'b-3', 'b-4']);
});

test('filterOwnedReservations_bobHasTwoBookings_returnsOnlyHisTwoBookings', () => {
  // Arrange
  const currentUserId = 'user-bob';

  // Act
  const result = filterOwnedReservations(sampleBookings, currentUserId);

  // Assert
  expect(result.map(b => b.id)).toEqual(['b-2', 'b-5']);
});

test('filterOwnedReservations_aliceIsCurrentUser_returnsNoBookingBelongingToAnotherUser', () => {
  // Arrange
  const currentUserId = 'user-alice';

  // Act
  const result = filterOwnedReservations(sampleBookings, currentUserId);

  // Assert
  expect(result.some(b => b.userId !== currentUserId)).toBe(false);
});

test('filterOwnedReservations_userHasNoBookings_returnsEmptyList', () => {
  // Arrange
  const currentUserId = 'user-charlie';

  // Act
  const result = filterOwnedReservations(sampleBookings, currentUserId);

  // Assert
  expect(result).toEqual([]);
});

test('filterOwnedReservations_userIdDiffersOnlyByCase_returnsEmptyList', () => {
  // Arrange
  const currentUserId = 'USER-ALICE';

  // Act
  const result = filterOwnedReservations(sampleBookings, currentUserId);

  // Assert
  expect(result).toEqual([]);
});

test('filterOwnedReservations_emptyUserId_returnsEmptyList', () => {
  // Arrange
  const currentUserId = '';

  // Act
  const result = filterOwnedReservations(sampleBookings, currentUserId);

  // Assert
  expect(result).toEqual([]);
});
