@echo off
setlocal EnableExtensions
cd /d "%~dp0"
echo ==================================================
echo      CampusBook V3 - Classroom Verification
echo ==================================================
echo.
node scripts\verify-workshop.mjs
if errorlevel 1 goto FAIL
call npm.cmd run build
if errorlevel 1 goto FAIL
call npm.cmd run check
if errorlevel 1 goto FAIL
call npm.cmd run test:smoke
if errorlevel 1 goto FAIL
call npm.cmd run test:unit
if errorlevel 1 goto FAIL
node scripts\verify-playwright-list.mjs
if errorlevel 1 goto FAIL
echo.
echo Running 2 WORKING smoke tests in Chromium...
call npx.cmd playwright test tests/api/health.spec.ts tests/ui/smoke.spec.ts --project=chromium
if errorlevel 1 goto FAIL
echo.
echo Running the complete classroom Playwright baseline...
call npx.cmd playwright test --project=chromium
if errorlevel 1 goto FAIL
echo.
echo PASS: 21 Playwright tests discoverable (2 execute, 19 are student exercises).
if /I "%~1"=="/nopause" exit /b 0
pause
exit /b 0
:FAIL
echo.
echo FAIL: Setup or tests have an error. Review the line above.
if /I "%~1"=="/nopause" exit /b 1
pause
exit /b 1
