# RAG News Chatbot

A full-stack RAG (Retrieval-Augmented Generation) powered news chatbot that answers queries about the latest news using AI and vector search.

## 🚀 Live Demo

- **Frontend**: https://rag-news-chatbot-frontend.onrender.com
- **Backend API**: https://rag-news-chatbot-backend.onrender.com

## 📋 Features

- **Real-time Chat**: WebSocket-based chat interface with streaming responses
- **RAG Pipeline**: Retrieves relevant news articles and generates contextual responses
- **Session Management**: Persistent chat sessions with Redis
- **Dynamic Topics**: Automatically extracts topics from news articles
- **Responsive UI**: Modern, mobile-friendly interface
- **News Sources**: 15+ RSS feeds from major news outlets

## 🏗️ Architecture

```
Frontend (React) ←→ Backend (Node.js) ←→ Vector DB (Qdrant)
                           ↓
                    Redis (Sessions) + Gemini AI
```

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- SCSS for styling
- Socket.io Client
- Context API for state management

### Backend
- Node.js + Express
- Socket.io for real-time communication
- Redis for session management
- Qdrant for vector storage

### AI & ML
- Google Gemini API (LLM)
- Jina Embeddings API
- RSS Parser for news ingestion

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Redis server
- Qdrant instance
- API keys for Gemini and Jina

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/SwathiV-2002/RAG-NEWS-CHATBOT.git
cd RAG-NEWS-CHATBOT
```

2. **Backend Setup**
```bash
cd backend
npm install
cp env.example .env
# Add your API keys to .env
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp env.example .env
# Update API URLs in .env
npm start
```

### Environment Variables

See `ENVIRONMENT_SETUP.md` for detailed configuration.

## 📁 Project Structure

```
RAG-NEWS-CHATBOT/
├── backend/                 # Node.js backend
│   ├── services/           # Business logic
│   ├── config/            # Environment configuration
│   └── server.js          # Main server file
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # State management
│   │   └── config/        # Frontend configuration
│   └── public/
└── docs/                  # Documentation
```

## 🔧 API Endpoints

- `GET /` - Health check
- `GET /api/health` - Service status
- `GET /api/topics` - Available news topics
- `POST /api/chat` - Send chat message
- `POST /api/session` - Create new session
- `GET /api/session/:id/history` - Get session history
- `DELETE /api/session/:id` - Clear session

## 🎯 RAG Pipeline

1. **News Ingestion**: Fetch articles from RSS feeds
2. **Text Processing**: Clean and prepare content
3. **Embedding Generation**: Create vector embeddings using Jina
4. **Vector Storage**: Store embeddings in Qdrant
5. **Query Processing**: Convert user queries to embeddings
6. **Similarity Search**: Find relevant articles
7. **Response Generation**: Use Gemini to generate contextual responses

## 📊 Performance Features

- **Caching**: Redis-based caching for sessions and responses
- **Session TTL**: Automatic session cleanup
- **Error Handling**: Graceful fallbacks for service failures
- **Rate Limiting**: Built-in protection against abuse

## 🚀 Deployment

The application is deployed on Render.com:
- Automatic deployments from GitHub
- Environment variable management
- Free tier with limitations

## 👥 Author

Created by Swathi V 

## 📞 Contact

For questions about this project, please contact the repository owner.