/** Native Node.js HTTP server. No runtime packages; local teaching use only. */
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getVisibleRooms, meetsCapacity, isRoomAvailable } from '../build/domain/rooms.js';
import { validateBookingRequest, intervalsOverlap } from '../build/domain/booking.js';
import { canCancelBooking, blocksAvailability } from '../build/domain/cancellation.js';
import { filterOwnedReservations, filterByStatus } from '../build/domain/reservations.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || '3000');
const DEMO_NOW = '2027-03-18T08:00';
const ROOM_DATA = [
  { id: 'R101', name: 'Maple Nook', capacity: 2, floor: 1, amenities: ['Whiteboard', 'Power outlets'], active: true, color: 'mint' },
  { id: 'R102', name: 'Cedar Commons', capacity: 4, floor: 2, amenities: ['Display', 'Whiteboard', 'Power outlets'], active: true, color: 'peach' },
  { id: 'R103', name: 'Willow Studio', capacity: 6, floor: 3, amenities: ['Display', 'Video calls'], active: true, color: 'lilac' },
  { id: 'R104', name: 'Birch Annex', capacity: 4, floor: 1, amenities: ['Whiteboard'], active: false, color: 'mint' }
];
const FIXTURES = [
  { id: 'BK-101', roomId: 'R102', userId: 'alice', start: '2027-03-18T10:00', end: '2027-03-18T11:00', people: 3, status: 'CONFIRMED', createdAt: DEMO_NOW },
  { id: 'BK-102', roomId: 'R103', userId: 'bob', start: '2027-03-18T12:00', end: '2027-03-18T13:00', people: 2, status: 'CONFIRMED', createdAt: DEMO_NOW },
  { id: 'BK-103', roomId: 'R101', userId: 'alice', start: '2027-03-18T15:00', end: '2027-03-18T16:00', people: 1, status: 'CANCELLED', createdAt: DEMO_NOW }
];
const stores = new Map();
function freshStore() { return { bookings: structuredClone(FIXTURES), next: 200 }; }
function scopeName(req) {
  const value = req.headers['x-test-scope'];
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{1,48}$/.test(value) ? value : 'demo';
}
function storeFor(req) {
  const key = scopeName(req);
  if (!stores.has(key)) {
    if (stores.size > 500) stores.clear();
    stores.set(key, freshStore());
  }
  return stores.get(key);
}
function userFrom(req) { return req.headers['x-demo-user'] === 'bob' ? 'bob' : req.headers['x-demo-user'] === 'alice' ? 'alice' : null; }
function send(res, code, value) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(value));
}
function failure(res, code, type, message) { send(res, code, { code: type, message }); }
async function requestBody(req) {
  const parts = [];
  let n = 0;
  for await (const chunk of req) {
    n += chunk.length;
    if (n > 100_000) { const err = new Error('Request body too large'); err.status = 413; throw err; }
    parts.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(parts).toString('utf8') || '{}'); }
  catch { const err = new Error('Malformed JSON'); err.status = 400; throw err; }
}
async function api(req, res, pathname, url) {
  const method = req.method;
  if (pathname === '/api/health' && method === 'GET') return send(res, 200, { status: 'ok', app: 'CampusBook', demoClock: DEMO_NOW });
  if (pathname === '/api/testing/reset' && method === 'POST') {
    if (process.env.NODE_ENV === 'production') return failure(res, 404, 'NOT_FOUND', 'Not found');
    const remote = req.socket.remoteAddress || '';
    if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(remote)) return failure(res, 403, 'FORBIDDEN', 'Reset is local only');
    stores.set(scopeName(req), freshStore());
    return send(res, 200, { reset: true, scope: scopeName(req) });
  }
  const user = userFrom(req);
  if (!user) return failure(res, 401, 'UNAUTHORIZED', 'Select a demo user.');
  const store = storeFor(req);
  if (pathname === '/api/rooms' && method === 'GET') {
    const minRaw = url.searchParams.get('minCapacity');
    const minCapacity = minRaw === null ? 0 : Number(minRaw);
    if (!Number.isInteger(minCapacity) || minCapacity < 0 || minCapacity > 100) return failure(res, 422, 'INVALID_GROUP', 'Invalid minimum capacity');
    let rooms = getVisibleRooms(ROOM_DATA);
    if (minRaw !== null) rooms = rooms.filter(room => meetsCapacity(room.capacity, minCapacity));
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');
    if (start !== null || end !== null) {
      if (!start || !end || end <= start) return failure(res, 422, 'INVALID_INTERVAL', 'Valid start and end are required');
      rooms = rooms.filter(room => isRoomAvailable(room.id, { start, end }, store.bookings));
    }
    return send(res, 200, rooms);
  }
  if (pathname === '/api/reservations' && method === 'GET') {
    const status = url.searchParams.get('status');
    if (status && !['CONFIRMED','CANCELLED'].includes(status)) return failure(res, 422, 'INVALID_STATUS', 'Unknown status');
    let bookings = filterOwnedReservations(store.bookings, user);
    if (status) bookings = filterByStatus(bookings, status);
    return send(res, 200, bookings.sort((a, b) => b.start.localeCompare(a.start)));
  }
  if (pathname === '/api/reservations' && method === 'POST') {
    const input = await requestBody(req);
    const room = ROOM_DATA.find(r => r.id === input.roomId);
    if (!room || !room.active) return failure(res, 404, 'ROOM_NOT_FOUND', 'The room is not available');
    const validation = validateBookingRequest(input, DEMO_NOW);
    if (validation) return failure(res, validation.status, validation.code, validation.message);
    if (input.people > room.capacity) return failure(res, 422, 'INVALID_GROUP', 'Group exceeds room capacity');
    const conflict = store.bookings.some(b => b.roomId === room.id && blocksAvailability(b) && intervalsOverlap(b, input));
    if (conflict) return failure(res, 409, 'BOOKING_CONFLICT', 'Room is already reserved for this time.');
    const booking = { id: `BK-${store.next++}`, userId: user, roomId: room.id, start: input.start, end: input.end, people: input.people, status: 'CONFIRMED', createdAt: DEMO_NOW };
    store.bookings.push(booking);
    return send(res, 201, booking);
  }
  const cancelMatch = pathname.match(/^\/api\/reservations\/([\w-]+)\/cancel$/);
  if (cancelMatch && method === 'POST') {
    const booking = store.bookings.find(b => b.id === cancelMatch[1]);
    if (!booking || booking.userId !== user) return failure(res, 404, 'RESERVATION_NOT_FOUND', 'Reservation not found');
    if (!canCancelBooking(booking, user)) return failure(res, 409, 'ALREADY_CANCELLED', 'This reservation is already cancelled');
    booking.status = 'CANCELLED';
    return send(res, 200, booking);
  }
  return failure(res, 404, 'NOT_FOUND', 'No matching API route');
}
const staticContent = {
  '/': ['public/index.html', 'text/html; charset=utf-8'],
  '/index.html': ['public/index.html', 'text/html; charset=utf-8'],
  '/styles.css': ['public/styles.css', 'text/css; charset=utf-8'],
  '/favicon.svg': ['public/favicon.svg', 'image/svg+xml'],
  '/assets/app.js': ['build/web/app.js', 'text/javascript; charset=utf-8']
};
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) return await api(req, res, url.pathname, url);
    const entry = staticContent[url.pathname];
    if (!entry || req.method !== 'GET') return failure(res, 404, 'NOT_FOUND', 'Not found');
    const bytes = await fs.readFile(path.join(ROOT, entry[0]));
    res.writeHead(200, { 'Content-Type': entry[1], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(bytes);
  } catch (err) {
    if (err.status) return failure(res, err.status, 'BAD_REQUEST', err.message);
    console.error('Server error:', err);
    failure(res, 500, 'INTERNAL_ERROR', 'An unexpected error occurred');
  }
});
server.listen(PORT, HOST, () => console.log(`CampusBook running at http://${HOST}:${PORT}`));
