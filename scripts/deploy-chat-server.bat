@echo off
echo 🚀 Chat Server Deployment Script
echo ==================================

set CHAT_SERVER_DIR=realtime-chat-server
set PORT=4000

if not exist "%CHAT_SERVER_DIR%" (
    echo ❌ Chat server directory not found
    pause
    exit /b 1
)

echo ✅ Found chat server directory

cd "%CHAT_SERVER_DIR%"

echo 📦 Installing dependencies...
call npm install

if not exist ".env" (
    echo Creating .env file...
    echo PORT=%PORT% > .env
    echo NODE_ENV=production >> .env
    echo ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000 >> .env
)

echo 🚀 Starting chat server...
call pm2 start server.js --name "chat-server"
call pm2 save

echo ✅ Chat server deployed successfully!
echo.
echo Commands:
echo - Check status: pm2 status
echo - View logs: pm2 logs chat-server
echo - Restart: pm2 restart chat-server
echo.
pause 