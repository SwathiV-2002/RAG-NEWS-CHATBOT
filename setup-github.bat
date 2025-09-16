@echo off
echo 📚 GitHub Setup for RAG Chatbot
echo ================================

echo.
echo This script will help you set up GitHub for deployment.
echo.

echo Step 1: Initialize Git repository
git init

echo.
echo Step 2: Add all files
git add .

echo.
echo Step 3: Create initial commit
git commit -m "Initial commit: RAG-powered news chatbot"

echo.
echo Step 4: Create .gitignore file
echo Creating .gitignore...

(
echo # Dependencies
echo node_modules/
echo npm-debug.log*
echo yarn-debug.log*
echo yarn-error.log*
echo.
echo # Environment variables
echo .env
echo .env.local
echo .env.development.local
echo .env.test.local
echo .env.production.local
echo.
echo # Build outputs
echo build/
echo dist/
echo.
echo # IDE
echo .vscode/
echo .idea/
echo *.swp
echo *.swo
echo.
echo # OS
echo .DS_Store
echo Thumbs.db
echo.
echo # Logs
echo logs/
echo *.log
echo.
echo # Docker
echo .docker/
) > .gitignore

echo ✅ .gitignore created!

echo.
echo Step 5: Add .gitignore to git
git add .gitignore
git commit -m "Add .gitignore"

echo.
echo 📋 Next steps:
echo.
echo 1. Go to https://github.com and create a new repository
echo 2. Copy the repository URL
echo 3. Run these commands:
echo.
echo    git remote add origin YOUR_REPOSITORY_URL
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Then follow the deployment guide in deploy-render.md
echo.
echo Press any key to continue...
pause > nul
