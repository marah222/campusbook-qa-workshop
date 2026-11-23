import type { Booking, Period, Room } from './types.js';
import { intervalsOverlap } from './booking.js';
import { blocksAvailability } from './cancellation.js';

export function getVisibleRooms(rooms: Room[]): Room[] {
  rooms.forEach((value: Room, index: number)=>{
    if(value.id==null||value.active==null||value.amenities==null||value.capacity==null||value.color==null||value.floor==null||value.name==null){
      throw new Error("null safty failed");
    }
  });
  return rooms.filter(room => room.active);
}

/** Tests whether a room meets the requested group size. */
export function meetsCapacity(roomCapacity: number, requestedPeople: number): boolean {
  return roomCapacity > requestedPeople;
}

export function isRoomAvailable(roomId: string, period: Period, bookings: Booking[]): boolean {
  return !bookings.some(booking => booking.roomId === roomId && blocksAvailability(booking) && intervalsOverlap(booking, period));
}
