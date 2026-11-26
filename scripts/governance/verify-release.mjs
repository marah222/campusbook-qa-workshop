/**
 * Dedicated release evidence gate. Runs only for PRs targeting main.
 * A green unit suite alone is insufficient for a release.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const errors = [];
const groups = { a:[1,2,3], b:[4,5,6], c:[7,8,9], d:[10,11] };
const isActive = source => {
  const noComments = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  return /\b(?:test|it)\s*\(/.test(noComments) || /\b(?:test|it)\.each\s*\(/.test(noComments);
};
const read = file => readFileSync(resolve(root, file), 'utf8');
for (const [team, stories] of Object.entries(groups)) for (const n of stories) {
  const file = `tests/api/team-${team}/s${String(n).padStart(2, '0')}.spec.ts`;
  if (!existsSync(resolve(root, file)) || !isActive(read(file))) errors.push(`API story S${String(n).padStart(2, '0')} has no executable test: ${file}`);
}
for (const [team, name] of Object.entries({
  a:'room-search', b:'booking-conflict', c:'cancellation', d:'reservation-filter'
})) {
  const file = `tests/ui/team-${team}/${name}.spec.ts`;
  if (!existsSync(resolve(root, file)) || !isActive(read(file))) errors.push(`Missing executable UI scenario: ${file}`);
}
const evidenceFile = resolve(root, 'workshop/release-evidence.json');
if (!existsSync(evidenceFile)) errors.push('Missing workshop/release-evidence.json: record release decision and evidence.');
else {
  try {
    const d = JSON.parse(read('workshop/release-evidence.json'));
    if (d.releaseApproved !== true) errors.push('Release decision must explicitly set releaseApproved=true after instructor review.');
    if (typeof d.instructor !== 'string' || !d.instructor.trim()) errors.push('Release evidence: instructor missing.');
    if (typeof d.ciRunUrl !== 'string' || !/^https:\/\/github\.com\//.test(d.ciRunUrl)) errors.push('Release evidence: GitHub CI run URL missing.');
    if (!Array.isArray(d.knownRisks)) errors.push('Release evidence: knownRisks array missing (can be empty).');
    if (!Array.isArray(d.verifiedStories) || d.verifiedStories.length !== 11) errors.push('Release evidence: list all 11 verified story identifiers.');
    if (!d.coverageReviewed) errors.push('Release evidence: coverageReviewed must be true.');
    if (!d.securityReviewed) errors.push('Release evidence: securityReviewed must be true.');
  } catch (error) { errors.push(`Malformed release evidence: ${error.message}`); }
}
if (errors.length) {
  console.error('RELEASE GATE BLOCKED:');
  for (const msg of errors) console.error('- ' + msg);
  process.exitCode = 1;
} else console.log('Release evidence and required executable scenarios present. Still require green CI and instructor approval in GitHub rules.');
