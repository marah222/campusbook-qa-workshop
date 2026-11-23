import type { Booking, Room } from '../domain/types.js';

type ApiError = Error & { status?: number; code?: string };
const el = <T extends HTMLElement>(id: string): T => {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing UI element: ${id}`);
  return node as T;
};
const query = new URLSearchParams(location.search);
const scope = /^[a-zA-Z0-9_-]{1,48}$/.test(query.get('scope') || '') ? query.get('scope')! : 'demo';
let user = 'alice';
let view: 'rooms' | 'reservations' = 'rooms';
let selectedRoom: Room | null = null;
let rooms: Room[] = [];
let bookings: Booking[] = [];
let toastTimer: number | undefined;

async function api<T>(route: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(route, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-demo-user': user,
      'x-test-scope': scope,
      ...(init.headers || {})
    }
  });
  const body: unknown = await response.json();
  if (!response.ok) {
    const data = body as {message?: string; code?: string};
    const error = new Error(data.message || `Request failed (${response.status})`) as ApiError;
    error.status = response.status;
    error.code = data.code;
    throw error;
  }
  return body as T;
}
function safe(s: string): string { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c)); }
function notify(message: string, isError = false): void {
  const target = el<HTMLDivElement>('toast');
  target.textContent = message;
  target.classList.toggle('error', isError);
  target.classList.add('visible');
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => target.classList.remove('visible'), 5200);
}
const str = (id: string) => (el<HTMLInputElement | HTMLSelectElement>(id)).value;
const iso = (time: string) => `${str('searchDate')}T${time}`;
function pretty(time: string): string { return time.replace('T', ' · ').replace('2027-03-18', 'Mar 18'); }
function setView(next: 'rooms' | 'reservations'): void {
  view = next;
  el<HTMLElement>('roomsView').hidden = next !== 'rooms';
  el<HTMLElement>('reservationsView').hidden = next !== 'reservations';
  el<HTMLElement>('currentCrumb').textContent = next === 'rooms' ? 'Find a room' : 'My reservations';
  document.querySelectorAll<HTMLButtonElement>('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === next));
  if (next === 'reservations') void loadReservations();
}
function renderRooms(): void {
  el<HTMLElement>('roomCount').textContent = `${rooms.length} room${rooms.length === 1 ? '' : 's'}`;
  el<HTMLElement>('resultSummary').textContent = `Available for ${str('minCapacity')} guest${str('minCapacity') === '1' ? '' : 's'} · ${str('searchStart')}–${str('searchEnd')}`;
  if (!rooms.length) {
    el<HTMLElement>('roomsGrid').innerHTML = '<div class="empty"><strong>No rooms match your search.</strong><p>Try a different group size or time slot.</p></div>';
    return;
  }
  el<HTMLElement>('roomsGrid').innerHTML = rooms.map(room => `
  <article class="room-card" data-testid="room-${safe(room.id)}">
    <div class="room-art ${safe(room.color)}"><div class="room-window"></div><div class="room-chair"></div><span class="art-pill">Room ${safe(room.id)}</span></div>
    <div class="room-body"><div class="room-topline">FLOOR ${room.floor} &nbsp;·&nbsp; ROOM ${safe(room.id)}</div><h3>${safe(room.name)}</h3>
      <div class="room-details"><span>♧ &nbsp; Up to ${room.capacity} people</span><span>◷ &nbsp; 30–120 min</span></div>
      <div class="amenities">${room.amenities.map(a => `<span>${safe(a)}</span>`).join('')}</div>
      <div class="room-footer"><span class="available-label">● &nbsp; Available</span><button type="button" class="reserve-btn" data-room="${safe(room.id)}">Reserve Room</button></div>
    </div>
  </article>`).join('');
  document.querySelectorAll<HTMLButtonElement>('[data-room]').forEach(button => button.addEventListener('click', () => openBooking(button.dataset.room || '')));
}
async function loadRooms(): Promise<void> {
  const params = new URLSearchParams({ minCapacity: str('minCapacity'), start: iso(str('searchStart')), end: iso(str('searchEnd')) });
  el<HTMLElement>('roomsGrid').innerHTML = '<div class="loading">Finding available rooms…</div>';
  try { rooms = await api<Room[]>(`/api/rooms?${params}`); renderRooms(); }
  catch (error) { rooms = []; renderRooms(); notify((error as Error).message, true); }
}
function openBooking(id: string): void {
  selectedRoom = rooms.find(room => room.id === id) || null;
  if (!selectedRoom) return;
  el<HTMLElement>('bookingHeading').textContent = `Reserve room ${selectedRoom.id}`;
  el<HTMLElement>('bookingDescription').textContent = `${selectedRoom.name} · up to ${selectedRoom.capacity} people · ${str('searchDate')}`;
  el<HTMLInputElement>('bookingStart').value = str('searchStart');
  el<HTMLInputElement>('bookingEnd').value = str('searchEnd');
  el<HTMLDialogElement>('bookingDialog').showModal();
}
async function submitBooking(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  if (!selectedRoom) return;
  const button = el<HTMLButtonElement>('submitBooking');
  button.disabled = true;
  try {
    const body = {
      roomId: selectedRoom.id,
      start: iso(str('bookingStart')),
      end: iso(str('bookingEnd')),
      people: Number(str('minCapacity'))
    };
    const saved = await api<Booking>('/api/reservations', { method: 'POST', body: JSON.stringify(body) });
    el<HTMLDialogElement>('bookingDialog').close();
    notify(`Booking confirmed! ${saved.roomId} · ${saved.id}`);
    await loadRooms();
  } catch (error) { notify((error as Error).message, true); }
  finally { button.disabled = false; }
}
function renderReservations(): void {
  el<HTMLElement>('reservationSummary').textContent = `${bookings.length} reservation${bookings.length === 1 ? '' : 's'} in this view`;
  if (!bookings.length) {
    el<HTMLElement>('reservationList').innerHTML = '<div class="empty"><strong>No reservations to display.</strong><p>Explore available study spaces and make your first booking.</p></div>';
    return;
  }
  el<HTMLElement>('reservationList').innerHTML = bookings.map(b => `
  <article class="reservation-item" data-testid="reservation-${safe(b.id)}">
    <div class="reservation-main"><div class="reservation-emoji">▤</div><div><h3>Room ${safe(b.roomId)}</h3>
      <p>${safe(pretty(b.start))} – ${safe(b.end.slice(11))} &nbsp;·&nbsp; ${b.people} guest${b.people === 1 ? '' : 's'}</p>
      <p>Booking ${safe(b.id)}</p></div></div>
    <div class="reservation-right"><span class="status-tag ${b.status === 'CANCELLED' ? 'cancelled' : ''}">${b.status === 'CANCELLED' ? 'Cancelled' : 'Confirmed'}</span>
      ${b.status === 'CONFIRMED' ? `<button class="cancel-btn" data-cancel="${safe(b.id)}" type="button">Cancel reservation</button>` : ''}
    </div></article>`).join('');
  document.querySelectorAll<HTMLButtonElement>('[data-cancel]').forEach(button => button.addEventListener('click', () => void cancelBooking(button.dataset.cancel || '')));
}
async function loadReservations(): Promise<void> {
  const status = str('statusFilter');
  try { bookings = await api<Booking[]>(`/api/reservations${status === 'ALL' ? '' : `?status=${status}`}`); renderReservations(); }
  catch (error) { bookings = []; renderReservations(); notify((error as Error).message, true); }
}
async function cancelBooking(id: string): Promise<void> {
  try {
    await api<Booking>(`/api/reservations/${encodeURIComponent(id)}/cancel`, { method: 'POST' });
    notify(`Reservation ${id} cancelled.`);
    await loadReservations();
  } catch (error) { notify((error as Error).message, true); }
}
function init(): void {
  document.querySelectorAll<HTMLButtonElement>('.nav-item').forEach(button => button.addEventListener('click', () => setView(button.dataset.view as 'rooms' | 'reservations')));
  el<HTMLSelectElement>('accountSelect').addEventListener('change', event => { user = (event.target as HTMLSelectElement).value; void loadRooms(); if (view === 'reservations') void loadReservations(); });
  el<HTMLFormElement>('searchForm').addEventListener('submit', event => { event.preventDefault(); void loadRooms(); });
  el<HTMLSelectElement>('statusFilter').addEventListener('change', () => void loadReservations());
  el<HTMLFormElement>('bookingForm').addEventListener('submit', event => void submitBooking(event));
  el<HTMLButtonElement>('closeModal').addEventListener('click', () => el<HTMLDialogElement>('bookingDialog').close());
  el<HTMLButtonElement>('cancelModal').addEventListener('click', () => el<HTMLDialogElement>('bookingDialog').close());
  void loadRooms();
}
init();
