/** Story S09: Cancelled reservations release availability. Link to your real GitHub Issue. */
import { test, expect, describe } from 'vitest';
import { blocksAvailability } from '../../../src/domain/cancellation.js';
import type { ReservationStatus } from '../../../src/domain/types.js';


// Student task: replace this TODO with a deterministic unit test.
// Use the hand-written test data. Suggested rule to investigate:
// cancel BK-101, rebook R102 10:00–11:00
// Ensure the assertion would FAIL if the business rule were violated.

describe('blocksAvailability', () => {
    test('blocksAvailability_BookingReservationStatusCONFIRMED_ShouldReturnTrue', () => {
        
        const booking = {
            id: 'BK-101',
            roomId: 'R102',
            userId: 'U001',
            start: '2024-06-01T10:00:00Z',
            end: '2024-06-01T11:00:00Z',
            people: 2,
            status: 'CONFIRMED' as ReservationStatus,
            createdAt: '2024-05-01T09:00:00Z'
        };
        const result = blocksAvailability(booking);
        expect(result).toBe(true);
    });

    test('blocksAvailability_BookingReservationStatusCANCELLED_ShouldReturnFalse', () => {
        
        const booking = {
            id: 'BK-101',
            roomId: 'R102',
            userId: 'U001',
            start: '2024-06-01T10:00:00Z',
            end: '2024-06-01T11:00:00Z',
            people: 2,
            status: 'CANCELLED' as ReservationStatus,
            createdAt: '2024-05-01T09:00:00Z'
        };
        const result = blocksAvailability(booking);
        expect(result).toBe(false);
    });
});

