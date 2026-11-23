/** Shared contracts for CampusBook business rules. All times are campus-local ISO minute strings. */
export type ReservationStatus = 'CONFIRMED' | 'CANCELLED';
export interface Room { id: string; name: string; capacity: number; floor: number; amenities: string[]; active: boolean; color: string; }
export interface Booking { id: string; roomId: string; userId: string; start: string; end: string; people: number; status: ReservationStatus; createdAt: string; }
export interface BookingRequest { roomId: string; start: string; end: string; people: number; }
export interface Period { start: string; end: string; }
export type ValidationError = { code: string; message: string; status: number };
