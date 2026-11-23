/** Dependency-free, deterministic infrastructure smoke test. Starts its own server. */
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import assert from 'node:assert/strict';
const port = String(39000 + Math.floor(Math.random() * 1200));
const url = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['server/server.mjs'], {
  env: { ...process.env, PORT: port, HOST: '127.0.0.1' }, stdio: 'ignore'
});
const headers = { 'x-demo-user': 'alice', 'x-test-scope': 'smoke' };
async function req(route, method = 'GET', data) {
  const resp = await fetch(`${url}${route}`, {
    method, headers: { ...headers, 'Content-Type': 'application/json' },
    ...(data === undefined ? {} : { body: JSON.stringify(data) })
  });
  return [resp.status, await resp.json()];
}
try {
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try { const [status] = await req('/api/health'); if (status === 200) { ready = true; break; } }
    catch { await delay(100); }
  }
  assert(ready, 'CampusBook failed to start; run npm run build first');
  const [status, rooms] = await req('/api/rooms');
  assert.equal(status, 200);
  assert(rooms.some(room => room.id === 'R102'));
  assert(!rooms.some(room => room.id === 'R104'), 'Inactive rooms must be hidden');
  const bookingData = { roomId: 'R101', start: '2027-03-18T11:00', end: '2027-03-18T12:00', people: 1 };
  const [created, booking] = await req('/api/reservations', 'POST', bookingData);
  assert.equal(created, 201);
  assert.equal(booking.status, 'CONFIRMED');
  const [mine, list] = await req('/api/reservations');
  assert.equal(mine, 200);
  assert(list.some(item => item.id === booking.id));
  const [cancelled, updated] = await req(`/api/reservations/${booking.id}/cancel`, 'POST');
  assert.equal(cancelled, 200);
  assert.equal(updated.status, 'CANCELLED');
  console.log('PASS CampusBook startup, room listing, creation, readback and cancellation');
  console.log('Note: this checks infrastructure, not the four seeded QA defects.');
} catch (err) { console.error('FAIL infrastructure smoke test:', err); process.exitCode = 1; }
finally { server.kill('SIGTERM'); }
