@echo off
cd /d "%~dp0"
echo ===================================================
echo             Starting Masroofy Servers
echo ===================================================

:: Start Django Backend in a new window
echo Starting Django Backend...
start "Masroofy Backend" cmd /k "cd backend && call .\venv\Scripts\activate.bat && python manage.py runserver"

:: Start React Frontend in a new window
echo Starting React Frontend...
start "Masroofy Frontend" cmd /k "cd frontend && npm run dev"

echo Both servers are starting up in separate windows!
echo Close this window when you're done.
pause
