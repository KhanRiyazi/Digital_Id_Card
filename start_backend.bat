@echo off
cd C:\Users\Dell\Desktop\my_project
call venv\Scripts\activate
set PYTHONPATH=%CD%
python -c "from app.main import app; import uvicorn; uvicorn.run(app, host='0.0.0.0', port=8000)"
pause