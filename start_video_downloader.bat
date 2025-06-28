@echo off
echo Starting Video Downloader Server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo Python not found. Trying py command...
    py --version >nul 2>&1
    if errorlevel 1 (
        echo Error: Python is not installed or not in PATH
        echo Please install Python from https://python.org
        pause
        exit /b 1
    ) else (
        set PYTHON_CMD=py
    )
) else (
    set PYTHON_CMD=python
)

REM Install dependencies if needed
echo Installing dependencies...
%PYTHON_CMD% -m pip install -r requirements_video_downloader.txt

echo.
echo Starting server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

REM Start the server
%PYTHON_CMD% video_downloader_server.py

pause 