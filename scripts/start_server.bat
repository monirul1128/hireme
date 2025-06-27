@echo off
echo 🎬 Video Downloader Server
echo ================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.7 or higher from https://python.org
    pause
    exit /b 1
)

echo ✅ Python found
echo.

REM Check if requirements are installed
echo 📦 Checking dependencies...
python -c "import flask, flask_cors, yt_dlp" >nul 2>&1
if errorlevel 1 (
    echo ❌ Dependencies not installed
    echo Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies found
)

echo.
echo 🚀 Starting server...
echo 📍 Server will be available at: http://localhost:5000
echo 📱 Frontend: Open video-downloader.html in your browser
echo.
echo Press Ctrl+C to stop the server
echo ================================
echo.

python start_server.py

pause 