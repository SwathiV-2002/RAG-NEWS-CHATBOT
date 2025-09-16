@echo off
echo 🚀 RAG Chatbot Deployment Script
echo ================================

echo.
echo Step 1: Checking if you have the required files...
if not exist "backend\package.json" (
    echo ❌ Backend package.json not found!
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ❌ Frontend package.json not found!
    pause
    exit /b 1
)

echo ✅ All required files found!

echo.
echo Step 2: Checking environment variables...
if not defined GEMINI_API_KEY (
    echo ⚠️  GEMINI_API_KEY not set. Please set it in your environment.
    echo    You can get it from: https://aistudio.google.com/apikey
)

if not defined JINA_API_KEY (
    echo ⚠️  JINA_API_KEY not set. Please set it in your environment.
    echo    You can get it from: https://jina.ai/embeddings
)

echo.
echo Step 3: Starting Docker services...
docker-compose up -d

echo.
echo Step 4: Checking service status...
timeout /t 10 /nobreak > nul
docker ps

echo.
echo Step 5: Getting service URLs...
echo.
echo 🌐 Your services are running at:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo    Redis:    localhost:6379
echo    Qdrant:   localhost:6333
echo.
echo 📝 To deploy to production:
echo    1. Push your code to GitHub
echo    2. Follow the guide in deploy-render.md
echo    3. Or use Railway + Vercel
echo.
echo Press any key to view logs or Ctrl+C to exit...
pause > nul

echo.
echo 📋 Viewing logs (Press Ctrl+C to stop)...
docker-compose logs -f
