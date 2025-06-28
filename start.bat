@echo off
echo 🌐 WebCraft Studio - Portfolio & Chat Server
echo ============================================
echo.

echo 📋 Choose an option:
echo 1. Open website only (no server)
echo 2. Start with chat server (production)
echo 3. Start development server
echo 4. Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto website
if "%choice%"=="2" goto production
if "%choice%"=="3" goto development
if "%choice%"=="4" goto exit

echo Invalid choice. Please try again.
pause
goto start

:website
echo.
echo 🌐 Opening website...
start index.html
echo ✅ Website opened in browser
echo 💡 Chat will work in demo mode
pause
goto exit

:production
echo.
echo 🚀 Starting production chat server...
echo 📦 Environment: Production
echo 🌐 Port: 4000
echo.
py production_server_windows.py
goto exit

:development
echo.
echo 🔧 Starting development server...
echo 📦 Environment: Development
echo 🌐 Port: 4000
echo.
py chat_server_python.py
goto exit

:exit
echo.
echo 👋 Thank you for using WebCraft Studio!
pause 