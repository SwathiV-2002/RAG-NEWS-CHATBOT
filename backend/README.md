# RAG News Chatbot - Backend

Node.js backend service for the RAG News Chatbot application.

## 🚀 Live Demo

**API Base URL**: https://rag-news-chatbot-backend.onrender.com

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **Redis** - Session management and caching
- **Qdrant** - Vector database
- **Google Gemini API** - LLM for responses
- **Jina Embeddings API** - Text embeddings

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Redis server
- Qdrant instance
- API keys for Gemini and Jina

### Installation

```bash
npm install
cp env.example .env
# Add your API keys to .env
npm start
```

### Environment Variables

```bash
# Server Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://rag-news-chatbot-frontend.onrender.com

# API Keys
GEMINI_API_KEY=your_gemini_api_key
JINA_API_KEY=your_jina_api_key

# Database Configuration
REDIS_URL=redis://your-redis-url:6379
QDRANT_URL=https://your-qdrant-url.com
QDRANT_API_KEY=your_qdrant_api_key

# Cache Configuration
SESSION_TTL=86400
CACHE_TTL=3600
```

## 📁 Project Structure

```
backend/
├── services/              # Business logic
│   ├── newsService.js    # News ingestion and processing
│   ├── ragService.js     # RAG pipeline and AI responses
│   ├── sessionService.js # Session management
│   └── vectorService.js  # Vector operations
├── config/               # Configuration
│   └── index.js         # Environment configuration
├── server.js            # Main server file
├── package.json         # Dependencies
└── env.example         # Environment template
```

## 🔧 API Endpoints

### Health & Status
- `GET /` - Service health check
- `GET /api/health` - Detailed status

### Chat & Sessions
- `POST /api/chat` - Send chat message
- `POST /api/session` - Create new session
- `GET /api/session/:id/history` - Get session history
- `DELETE /api/session/:id` - Clear session

### Topics & Content
- `GET /api/topics` - Get available news topics
- `POST /api/test` - Test endpoint

## 🎯 RAG Pipeline

### 1. News Ingestion
- Fetches articles from 15+ RSS feeds
- Processes and cleans content
- Generates unique article IDs

### 2. Embedding Generation
- Uses Jina API to create text embeddings
- Processes article titles and content
- Handles API rate limits and errors

### 3. Vector Storage
- Stores embeddings in Qdrant vector database
- Creates collections and indexes
- Manages vector similarity search

### 4. Query Processing
- Converts user queries to embeddings
- Performs similarity search
- Retrieves top-k relevant articles

### 5. Response Generation
- Uses Gemini API for contextual responses
- Incorporates retrieved article context
- Handles streaming responses

## 🔄 Real-time Communication

### Socket.io Events
- `join-session` - Join a chat session
- `chat-message` - Send a message
- `bot-response` - Receive AI response
- `error` - Handle errors

### Session Management
- Redis-based session storage
- TTL-based session cleanup
- Message history persistence

## 📊 Performance Features

### Caching
- Redis caching for sessions
- Response caching for common queries
- TTL-based cache invalidation

### Error Handling
- Graceful service degradation
- Fallback responses
- Comprehensive error logging

### Rate Limiting
- Built-in protection against abuse
- Configurable rate limits
- Service health monitoring

## 🚀 Deployment

Deployed on Render.com with:
- Automatic GitHub deployments
- Environment variable management
- Health check endpoints
- Log monitoring

## 🔒 Security

- CORS configuration
- Helmet security middleware
- Input validation
- API key protection
- Rate limiting

## 📈 Monitoring

- Health check endpoints
- Service status monitoring
- Error logging and tracking
- Performance metrics

## 🧪 Testing

- Health check endpoints
- API endpoint testing
- Service integration testing
- Error scenario testing