/** Check real Playwright Test discovery, not just file existence. */
import { spawnSync } from 'node:child_process';
const win=process.platform==='win32';
const cmd=win?'cmd.exe':'npx';
const args=win?['/d','/c','npx.cmd','playwright','test','--list','--project=chromium']:['playwright','test','--list','--project=chromium'];
const result=spawnSync(cmd,args,{encoding:'utf8',timeout:90000,windowsHide:true,maxBuffer:4*1024*1024});
const combined=(result.stdout||'')+'\n'+(result.stderr||'');
if(result.status!==0){console.error(combined);console.error('FAIL: Playwright could not import/discover the test modules.');process.exitCode=1;}
else {
 const m=combined.match(/Total:\s*(\d+)\s+tests?\s+in\s+(\d+)\s+files?/i);
 if(!m){console.error(combined);console.error('FAIL: Playwright did not report a test total.');process.exitCode=1;}
 else if(Number(m[1])<21 || Number(m[2])<21){console.error(combined);console.error(`FAIL: expected at least 21 tests in at least 21 files; got ${m[1]} in ${m[2]}.`);process.exitCode=1;}
 else console.log('PASS: Playwright discovers at least 21 tests in at least 21 files.');
}
