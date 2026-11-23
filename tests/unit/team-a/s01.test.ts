import { test, expect, describe } from 'vitest';
import { getVisibleRooms } from '../../../src/domain/rooms.js';
import type { Room } from '../../../src/domain/types.js';


describe('getVisibleRooms', () => {
    // Arrange
const activeRoom = {
  id: 'R1',
  name: 'A',
  active: true,
  capacity: 4,
  floor: 1,
  amenities: [],
  color: 'mint'
} satisfies Room;

const inactiveRoom = {
  id: 'R2',
  name: 'B',
  active: false,
  capacity: 4,
  floor: 1,
  amenities: [],
  color: 'mint'
} satisfies Room;

  test.each([
    {
      name: 'getVisibleRooms_allInactive_ShouldReturnNoRoom',
      rooms: [inactiveRoom],
      expected: []
    },
    {
      name: 'getVisibleRooms_allactive_ShouldReturnAllRooms',
      rooms: [activeRoom],
      expected: [activeRoom]
    },
     {
      name: 'getVisibleRooms_Mixed_ShouldReturnOnlyActiveRooms',
      rooms: [activeRoom,inactiveRoom],
      expected: [activeRoom]
    },
    {
      name: 'getVisibleRooms_Empty_ShouldReturnNoRooms',
      rooms: [],
      expected: []
    }
  ])('$name', ({ rooms, expected }) => {
    // Arrange: test data is provided by the test case above

    // Act
    const visibleRooms = getVisibleRooms(rooms);

    // Assert
    expect(visibleRooms).toEqual(expected);
  });

  test('getVisibleRooms_NullList_ShouldThrowError', () => {
    // Arrange
    const rooms = null as unknown as Room[];

    // Act + Assert
    expect(() => getVisibleRooms(rooms)).toThrow();
  });

  test('getVisibleRooms_ListConatinNull_ShouldThrowError', () => {
    // Arrange
    const rooms = [null] as unknown as Room[];

    // Act + Assert
    expect(() => getVisibleRooms(rooms)).toThrow();
  });

  test('getVisibleRooms_NullParameter_ShouldThrowError', () => {
  // Arrange
  const validRoom: Room = {
    id: 'R1',
    name: 'A',
    active: true,
    capacity: 4,
    floor: 1,
    amenities: [],
    color: 'mint'
  };

  // Act + Assert: try null for each field automatically
  for (const field of Object.keys(validRoom) as (keyof Room)[]) {
    const invalidRoom = {
      ...validRoom,
      [field]: null
    } as unknown as Room;

    expect( () =>
      getVisibleRooms([invalidRoom]),
      `should reject a null ${String(field)}`
    ).toThrow();
  }
});
});
