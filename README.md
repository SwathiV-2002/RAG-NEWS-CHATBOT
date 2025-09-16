# RAG News Chatbot

A full-stack RAG (Retrieval-Augmented Generation) powered news chatbot that answers queries over a news corpus using vector embeddings, Redis for session management, and Google Gemini for response generation.

## 🚀 Features

- **RAG Pipeline**: Ingests ~50 news articles, creates embeddings, and retrieves relevant content
- **Real-time Chat**: Socket.io based real-time communication
- **Session Management**: Redis-based session storage with TTL
- **Modern UI**: React frontend with responsive design and dark mode
- **Vector Search**: Semantic search using Jina embeddings and Qdrant
- **AI Responses**: Google Gemini powered response generation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Express Backend│    │  Vector Database│
│                 │    │                 │    │     (Qdrant)    │
│  - Chat Interface│◄──►│  - REST API     │◄──►│                 │
│  - Session Mgmt │    │  - Socket.io    │    │  - Embeddings   │
│  - Real-time UI │    │  - RAG Pipeline │    │  - Similarity   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │      Redis      │
                       │                 │
                       │  - Sessions     │
                       │  - Chat History │
                       │  - Caching      │
                       └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Cache/Sessions**: Redis
- **Vector DB**: Qdrant
- **Embeddings**: Jina AI
- **LLM**: Google Gemini
- **News Parsing**: RSS Parser + Cheerio

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: SCSS
- **State Management**: React Context API
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js (v16 or higher)
- Redis server
- Qdrant vector database
- API keys for Jina AI and Google Gemini

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rag-news-chatbot
```

### 2. Backend Setup

```bash
cd backend
npm install
cp env.example .env
```

Configure your `.env` file:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
JINA_API_KEY=your_jina_api_key
REDIS_URL=redis://localhost:6379
QDRANT_URL=http://localhost:6333
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp env.example .env
```

Start the frontend:
```bash
npm start
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 📚 API Documentation

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/chat` | Send message and get response |
| POST | `/api/session` | Create new session |
| GET | `/api/session/:id/history` | Get session history |
| DELETE | `/api/session/:id` | Clear session |

### Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-session` | Client → Server | Join a session |
| `chat-message` | Client → Server | Send message |
| `bot-response` | Server → Client | Receive response |
| `error` | Server → Client | Error message |

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# API Keys
GEMINI_API_KEY=your_gemini_api_key
JINA_API_KEY=your_jina_api_key

# Database
REDIS_URL=redis://localhost:6379
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🏃‍♂️ Running the Application

### Development Mode

1. Start Redis server
2. Start Qdrant server
3. Start backend: `cd backend && npm run dev`
4. Start frontend: `cd frontend && npm start`

### Production Mode

1. Build frontend: `cd frontend && npm run build`
2. Start backend: `cd backend && npm start`

## 📁 Project Structure

```
rag-news-chatbot/
├── backend/
│   ├── services/
│   │   ├── newsService.js      # News ingestion
│   │   ├── vectorService.js    # Vector operations
│   │   ├── ragService.js       # RAG pipeline
│   │   └── sessionService.js   # Session management
│   ├── server.js               # Main server
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── contexts/           # React contexts
│   │   ├── App.tsx
│   │   └── App.scss
│   ├── package.json
│   └── README.md
└── README.md
```

## 🔍 How It Works

### 1. News Ingestion
- Fetches news articles from multiple RSS feeds
- Processes and cleans article content
- Creates embeddings using Jina AI
- Stores in Qdrant vector database

### 2. RAG Pipeline
- User sends a query
- System retrieves relevant articles using vector similarity
- Context is prepared from retrieved articles
- Gemini generates response based on context

### 3. Session Management
- Each user gets a unique session ID
- Chat history stored in Redis with TTL
- Sessions can be cleared or persisted

### 4. Real-time Communication
- Socket.io enables real-time chat
- Typing indicators and instant responses
- Fallback to REST API if needed

## 🚀 Deployment

### Using Docker

```bash
# Build and run backend
cd backend
docker build -t rag-backend .
docker run -p 5000:5000 rag-backend

# Build and run frontend
cd frontend
docker build -t rag-frontend .
docker run -p 3000:80 rag-frontend
```

### Using Cloud Services

- **Backend**: Deploy to Railway, Render, or Heroku
- **Frontend**: Deploy to Netlify, Vercel, or GitHub Pages
- **Redis**: Use Redis Cloud or AWS ElastiCache
- **Qdrant**: Use Qdrant Cloud or self-hosted

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Monitoring

- Health check endpoint: `/api/health`
- Session statistics available via API
- Redis memory usage monitoring
- Vector database performance metrics

## 🔒 Security

- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

ISC

## 🙏 Acknowledgments

- [Jina AI](https://jina.ai/) for embeddings
- [Google Gemini](https://ai.google.dev/) for language model
- [Qdrant](https://qdrant.tech/) for vector database
- [Socket.io](https://socket.io/) for real-time communication

## 📞 Support

For questions or issues, please open an issue in the repository or contact the development team.

---

**Note**: This is a demonstration project for the Voosh Full Stack Developer assignment. Make sure to configure all required API keys and services before running the application.
