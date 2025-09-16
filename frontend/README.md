# RAG News Chatbot - Frontend

React-based frontend for the RAG News Chatbot application.

## 🚀 Live Demo

**Production URL**: https://rag-news-chatbot-frontend.onrender.com

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **SCSS** - Enhanced styling
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Context API** - State management

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Backend service running

### Installation

```bash
npm install
cp env.example .env
# Update environment variables
npm start
```

### Environment Variables

```bash
# Development
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000

# Production
REACT_APP_ENV=production
REACT_APP_API_URL=https://rag-news-chatbot-backend.onrender.com/api
REACT_APP_SOCKET_URL=https://rag-news-chatbot-backend.onrender.com
```

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/        # React components
│   │   ├── ChatInterface.tsx
│   │   ├── ChatMessages.tsx
│   │   ├── ChatInput.tsx
│   │   └── TypingIndicator.tsx
│   ├── contexts/          # State management
│   │   └── SessionContext.tsx
│   ├── config/           # Configuration
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   ├── App.scss          # Global styles
│   └── index.tsx         # Entry point
└── package.json
```

## 🎨 Features

- **Real-time Chat**: WebSocket-based communication
- **Session Management**: Persistent chat sessions
- **Responsive Design**: Mobile-friendly interface
- **Dynamic Topics**: Auto-generated news topics
- **Modern UI**: Clean, professional design
- **Error Handling**: Graceful error states

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🎯 Key Components

### ChatInterface
Main chat component with session management and real-time communication.

### SessionContext
Context provider for managing chat sessions, messages, and API calls.

### ChatMessages
Component for displaying chat messages with proper formatting.

### ChatInput
Input component with send functionality and typing indicators.

## 🚀 Deployment

Deployed on Render.com with automatic builds from GitHub.

**Build Command**: `npm install && npm run build`
**Publish Directory**: `build`

## 📱 Responsive Design

- Mobile-first approach
- Adaptive layout for all screen sizes
- Touch-friendly interface
- Optimized for both desktop and mobile

## 🔒 Security

- Environment variable validation
- CORS configuration
- Input sanitization
- Error boundary implementation