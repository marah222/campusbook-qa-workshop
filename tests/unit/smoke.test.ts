import { test, expect } from 'vitest';
import { isDurationAllowed } from '../../src/domain/booking.js';
import { getVisibleRooms } from '../../src/domain/rooms.js';

test('workshop unit-test runner is configured', () => {
  expect(isDurationAllowed(60)).toBe(true);
  expect(isDurationAllowed(15)).toBe(false);
});
test('inactive rooms are omitted', () => {
  const rooms = [
    { id: 'R1', name: 'A', active: true, capacity: 4, floor: 1, amenities: [], color: 'mint' },
    { id: 'R2', name: 'B', active: false, capacity: 4, floor: 1, amenities: [], color: 'mint' }
  ];
  expect(getVisibleRooms(rooms)).toHaveLength(1);
});
