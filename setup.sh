#!/bin/bash

# RAG News Chatbot Setup Script
echo "🚀 Setting up RAG News Chatbot..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Setup Backend
echo "📦 Setting up backend..."
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit backend/.env and add your API keys:"
    echo "   - GEMINI_API_KEY"
    echo "   - JINA_API_KEY"
    echo "   - REDIS_URL (optional, defaults to redis://localhost:6379)"
    echo "   - QDRANT_URL (optional, defaults to http://localhost:6333)"
else
    echo "✅ Backend .env file already exists"
fi

cd ..

# Setup Frontend
echo "📦 Setting up frontend..."
cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp env.example .env
    echo "✅ Frontend .env file created"
else
    echo "✅ Frontend .env file already exists"
fi

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your API keys in backend/.env"
echo "2. Start Redis server (if not using cloud Redis)"
echo "3. Start Qdrant server (if not using cloud Qdrant)"
echo "4. Start the backend: cd backend && npm run dev"
echo "5. Start the frontend: cd frontend && npm start"
echo ""
echo "📚 For detailed instructions, see README.md"
