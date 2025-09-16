@echo off
REM RAG News Chatbot Setup Script for Windows
echo 🚀 Setting up RAG News Chatbot...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v16 or higher) first.
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm found
npm --version

REM Setup Backend
echo 📦 Setting up backend...
cd backend

REM Install dependencies
echo Installing backend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file from template...
    copy env.example .env
    echo ⚠️  Please edit backend\.env and add your API keys:
    echo    - GEMINI_API_KEY
    echo    - JINA_API_KEY
    echo    - REDIS_URL (optional, defaults to redis://localhost:6379)
    echo    - QDRANT_URL (optional, defaults to http://localhost:6333)
) else (
    echo ✅ Backend .env file already exists
)

cd ..

REM Setup Frontend
echo 📦 Setting up frontend...
cd frontend

REM Install dependencies
echo Installing frontend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file from template...
    copy env.example .env
    echo ✅ Frontend .env file created
) else (
    echo ✅ Frontend .env file already exists
)

cd ..

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Configure your API keys in backend\.env
echo 2. Start Redis server (if not using cloud Redis)
echo 3. Start Qdrant server (if not using cloud Qdrant)
echo 4. Start the backend: cd backend ^&^& npm run dev
echo 5. Start the frontend: cd frontend ^&^& npm start
echo.
echo 📚 For detailed instructions, see README.md
pause
