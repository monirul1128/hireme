@echo off
echo 🚀 Starting Production Chat Server with Gunicorn
echo ================================================

REM Stop any existing servers on port 4000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4000') do (
    echo Stopping process %%a on port 4000
    taskkill /PID %%a /F >nul 2>&1
)

REM Set environment variables
set FLASK_ENV=production
set PORT=4000
set GUNICORN_WORKERS=4

echo 📦 Environment: %FLASK_ENV%
echo 🌐 Port: %PORT%
echo 👥 Workers: %GUNICORN_WORKERS%

REM Start Gunicorn production server
echo 🚀 Starting Gunicorn server...
py -m gunicorn -c gunicorn.conf.py app:app

echo ✅ Production server started!
echo 🔗 Health check: http://localhost:4000/health
echo 📊 Status: http://localhost:4000/status
echo.
pause 