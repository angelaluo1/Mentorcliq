@echo off
cd /d "%~dp0"
echo Starting Mentorcliq on http://localhost:8000
echo.
python main.py
if errorlevel 1 (
  echo.
  echo Python could not start the server.
  echo Install Python 3 from https://www.python.org/downloads/
  pause
)
