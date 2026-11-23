import type { Booking, Period, Room } from "./types.js";
import { intervalsOverlap } from "./booking.js";
import { blocksAvailability } from "./cancellation.js";

export function getVisibleRooms(rooms: Room[]): Room[] {
  rooms.forEach((value: Room, index: number)=>{
    if(value.id==null||value.active==null||value.amenities==null||value.capacity==null||value.color==null||value.floor==null||value.name==null){
      throw new Error("null safty failed");
    }
  });
  return rooms.filter(room => room.active);
}

/** Tests whether a room meets the requested group size. */
export function meetsCapacity(
  roomCapacity: number,
  requestedPeople: number,
): boolean {
  return roomCapacity >= requestedPeople;
}

const DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

function daysInMonth(year: number, month: number): number {
  // month is 1-12; day 0 of the next month = last day of this month
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function isValidDateTime(value: string): boolean {
  const match = DATE_TIME_PATTERN.exec(value);
  if (!match) return false; // wrong format, also rejects negatives like "T-1:00"

  const [, y, mo, d, h, mi, s] = match;
  const year = Number(y);
  const month = Number(mo);
  const day = Number(d);
  const hour = Number(h);
  const minute = Number(mi);
  const second = s === undefined ? 0 : Number(s);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > daysInMonth(year, month)) return false;
  if (hour > 23) return false;
  if (minute > 59) return false;
  if (second > 59) return false;

  return true;
}


export function isRoomAvailable(roomId: string, period: Period, bookings: Booking[]): boolean {
  if (!isValidDateTime(period.start) || !isValidDateTime(period.end)) {
    return false;
  }

  if (period.end <= period.start) {
    return false;
  }

  return !bookings.some(
    booking =>
      booking.roomId === roomId &&
      blocksAvailability(booking) &&
      intervalsOverlap(booking, period)
  );
}