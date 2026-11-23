import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const groups = {a:[1,2,3],b:[4,5,6],c:[7,8,9],d:[10,11]};
const id = number => `s${String(number).padStart(2,'0')}`;
const required = [];
for (const [group,stories] of Object.entries(groups)) for (const story of stories) {
  required.push(`tests/unit/team-${group}/${id(story)}.test.ts`);
  required.push(`tests/api/team-${group}/${id(story)}.spec.ts`);
}
required.push(...[
  'tests/ui/team-a/room-search.spec.ts',
  'tests/ui/team-b/booking-conflict.spec.ts',
  'tests/ui/team-c/cancellation.spec.ts',
  'tests/ui/team-d/reservation-filter.spec.ts',
  'tests/ui/team-a/room-maintenance.spec.ts',
  'tests/ui/team-b/booking-maintenance.spec.ts',
  'tests/ui/team-c/cancellation-maintenance.spec.ts',
  'tests/ui/team-d/reservations-maintenance.spec.ts',
  '.github/workflows/qa.yml', 'workshop/STORY_ASSIGNMENTS.md'
]);
const missing = required.filter(file => !existsSync(path.join(root,file)));
for (const file of missing) console.error('MISSING '+file);
console.log(`Starter layout: ${required.length - missing.length}/${required.length} required files found.`);
if (missing.length) process.exitCode = 1;
if (missing.length === 0) console.log('11 unit starter files, 11 API starter files, 4 UI scenarios, 4 maintenance tasks and workflow present.');
