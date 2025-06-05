@echo off
echo Starting Enhanced Potato Disease Detection Backend...
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo Installing/updating dependencies...
pip install -r requirements.txt

REM Install additional packages for enhanced accuracy
pip install opencv-python scikit-image

echo.
echo Starting Flask server with enhanced accuracy features...
echo Backend will be available at: http://localhost:5000
echo.

REM Run the enhanced app
python app_enhanced.py

pause
