@echo off
cd /d "%~dp0"
echo Starting CampusBook at http://127.0.0.1:3000
echo Keep this window open; press Ctrl+C to stop.
node server\server.mjs
if errorlevel 1 (
  echo Startup failed. Run CLASSROOM_SETUP_WINDOWS.cmd first.
  pause
)
