@echo off
echo Starting UPTET/CTET Prep App...

echo Launching Backend Server...
start cmd /k "cd server && npm run dev"

echo Launching Frontend Client...
start cmd /k "cd client && npm run dev"

echo Project is starting! Check the new terminal windows for logs.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
pause
