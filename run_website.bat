@echo off
echo Starting Abounia Auto Parts Website...
echo.

cd /d "c:\Users\OS ABD\Desktop\البرمجة والتطوير\موقع ابونيا لقطع غيار السيارات\src"

echo Checking for Python...
python -m http.server 8000 >nul 2>&1
if %errorlevel% == 0 (
    echo Server started successfully!
    echo.
    echo You can now access the website at:
    echo User Website: http://localhost:8000
    echo Admin Panel: http://localhost:8000/admin/dashboard.html
    echo.
    echo Press Ctrl+C to stop the server
    python -m http.server 8000
) else (
    echo Python not found or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    echo Or try running the server manually
    echo.
    pause
)