@echo off
echo Starting WebCraft Studio Backend Server...
echo.
echo Make sure MongoDB is running!
echo.
echo If you haven't seeded the database yet, run: node utils/seeder.js
echo.
echo Starting server on http://localhost:5000
echo API available at http://localhost:5000/api
echo.
npm run dev
pause 