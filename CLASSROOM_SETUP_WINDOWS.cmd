@echo off
setlocal EnableExtensions
cd /d "%~dp0"
echo ===================================================
echo    CampusBook V3 - Windows Classroom Setup
echo ===================================================
echo.
where node >nul 2>nul
if errorlevel 1 goto FAIL
node scripts\classroom-preflight.mjs
if errorlevel 1 goto FAIL
node scripts\verify-workshop.mjs
if errorlevel 1 goto FAIL
echo.
echo Installing pinned testing dependencies (first run only)...
if exist package-lock.json (
  call npm.cmd ci --no-audit --no-fund
) else (
  call npm.cmd install --no-audit --no-fund
)
if errorlevel 1 goto FAIL
echo.
echo Building app...
call npm.cmd run build
if errorlevel 1 goto FAIL
echo.
echo Checking Chromium v1208 (required for pinned Playwright 1.58)...
call npx.cmd playwright install --list | findstr /C:"chromium-1208" >nul
if errorlevel 1 (
  echo Chromium not detected. Installing Chromium now...
  call npx.cmd playwright install chromium
  if errorlevel 1 goto FAIL
) else (
  echo Chromium installation detected. No download required.
)
echo.
call CLASSROOM_CHECK_WINDOWS.cmd /nopause
if errorlevel 1 goto FAIL
echo.
echo ================================================
echo PASS: CampusBook V3 is ready for classroom use.
echo Save package-lock.json for your GitHub repository.
echo ================================================
pause
exit /b 0
:FAIL
echo.
echo FAIL: Read the error above. Do NOT upload until corrected.
pause
exit /b 1
