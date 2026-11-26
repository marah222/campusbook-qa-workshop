/**
 * Dependency-free structural and import check. Catches the previous repair
 * mistake: a ZIP with UI tests but no tests/support/ui-fixtures.ts.
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const exists=(x)=>existsSync(path.join(root,x));
const errors=[];
const storyGroups={a:[1,2,3],b:[4,5,6],c:[7,8,9],d:[10,11]};
const name=n=>`s${String(n).padStart(2,'0')}`;
const apiFiles=[];const unitFiles=[];
for(const [team,stories] of Object.entries(storyGroups)) for(const n of stories){
 apiFiles.push(`tests/api/team-${team}/${name(n)}.spec.ts`);
 unitFiles.push(`tests/unit/team-${team}/${name(n)}.test.ts`);
}
const uiFiles=[
 'tests/ui/team-a/room-search.spec.ts','tests/ui/team-a/room-maintenance.spec.ts',
 'tests/ui/team-b/booking-conflict.spec.ts','tests/ui/team-b/booking-maintenance.spec.ts',
 'tests/ui/team-c/cancellation.spec.ts','tests/ui/team-c/cancellation-maintenance.spec.ts',
 'tests/ui/team-d/reservation-filter.spec.ts','tests/ui/team-d/reservations-maintenance.spec.ts'];
const other=['tests/api/health.spec.ts','tests/ui/smoke.spec.ts','tests/support/api-fixtures.ts','tests/support/ui-fixtures.ts',
 'tests/unit/smoke.test.ts','playwright.config.ts','vitest.config.ts','server/server.mjs','package.json',
 '.github/workflows/qa.yml','public/index.html','build/web/app.js'];
const required=[...apiFiles,...unitFiles,...uiFiles,...other];
for(const f of required) if(!exists(f)) errors.push(`MISSING ${f}`);
// Verify every local import in every test starter resolves to a real project file.
for(const f of [...apiFiles,...unitFiles,...uiFiles,...other.filter(x=>x.endsWith('.ts'))]){
 if(!exists(f))continue;
 const code=readFileSync(path.join(root,f),'utf8');
 const re=/\bfrom\s*["'](\.{1,2}\/[^"']+)["']/g;
 for(const m of code.matchAll(re)){
  const imported=path.resolve(root,path.dirname(f),m[1]);
  const alternatives=[imported,`${imported}.ts`,`${imported}.js`,`${imported}.mjs`,imported.replace(/\.js$/,'.ts')];
  if(!alternatives.some(p=>existsSync(p)))errors.push(`BROKEN IMPORT ${f} -> ${m[1]}`);
 }
}
const hasPlaywrightTest = source => /\btest(?:\.(?:skip|fixme|only))?\s*\(/.test(source) || /\btest\.each\s*\(/.test(source);
for(const f of [...apiFiles,...uiFiles]) {
  if (exists(f) && !hasPlaywrightTest(readFileSync(path.join(root,f),'utf8'))) errors.push(`MISSING PLAYWRIGHT TEST ${f}`);
}
if(exists('playwright.config.ts')) {
 const config=readFileSync(path.join(root,'playwright.config.ts'),'utf8');
 if(!config.includes("testMatch: '**/*.spec.ts'"))errors.push('Playwright discovery must match all *.spec.ts');
}
console.log(`Playwright inventory: ${apiFiles.length+uiFiles.length+2} test files = 11 API exercises + 8 UI exercises + 2 active smoke tests.`);
console.log(`Vitest inventory: ${unitFiles.length} student starters + 1 smoke file.`);
console.log(`Required file inventory: ${required.length-errors.filter(x=>x.startsWith('MISSING')).length}/${required.length}.`);
if(errors.length){for(const e of errors)console.error('FAIL:',e);process.exitCode=1;}
else console.log('PASS: All required files, local imports and Playwright test declarations are present.');
