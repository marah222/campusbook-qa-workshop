/** Dependency-free instructor/student preflight for local classroom machines. */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');
let failures = 0;
const mark = (ok, message, mandatory = true) => {
  console.log(`${ok ? 'PASS' : mandatory ? 'FAIL' : 'WARN'}  ${message}`);
  if (!ok && mandatory) failures++;
};
const [major,minor] = process.versions.node.split('.').map(Number);
const nodeOK = major > 22 || (major === 22 && minor >= 12);
mark(nodeOK, `Node ${process.version}; required >=22.12 (Node 24 LTS recommended)`);
function version(exe, args) {
  const result = process.platform === 'win32'
    ? spawnSync('cmd.exe', ['/d', '/c', `${exe} ${args.join(' ')}`], { encoding: 'utf8', timeout: 8000, windowsHide: true })
    : spawnSync(exe, args, { encoding: 'utf8', timeout: 8000 });
  return result.status === 0 ? (result.stdout || result.stderr).trim().split('\n')[0] : null;
}
const npm = version(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['--version']);
const git = version('git', ['--version']);
mark(Boolean(npm), `npm command ${npm || 'not accessible'} (${process.platform === 'win32' ? 'use npm.cmd in PowerShell' : 'npm'})`);
mark(Boolean(git), `Git ${git || 'not accessible'}`);
mark(existsSync(path.join(root,'build/domain/booking.js')), 'Precompiled application present (or run npm.cmd run build)');
const lock = existsSync(path.join(root,'package-lock.json'));
mark(lock, 'package-lock.json present for repeatable npm ci and CI', strict);
const dependencies = ['typescript','vitest','@playwright/test'];
for (const d of dependencies) mark(existsSync(path.join(root,'node_modules',...d.split('/'),'package.json')), `${d} installed`, strict);
console.log('Browser check is performed by the UI smoke test; preinstall with npx.cmd playwright install chromium on Windows.');
console.log(failures ? `Preflight: ${failures} required check(s) failed.` : 'Preflight: required checks passed.');
process.exitCode = failures ? 1 : 0;
