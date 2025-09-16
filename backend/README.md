# RAG News Chatbot - Backend

A Node.js backend service for a RAG-powered news chatbot that uses vector embeddings, Redis for session management, and Google Gemini for response generation.

## Features

- **News Ingestion**: Fetches news articles from multiple RSS feeds
- **Vector Search**: Uses Jina embeddings and Qdrant for semantic search
- **RAG Pipeline**: Retrieves relevant articles and generates responses with Gemini
- **Session Management**: Redis-based session storage with TTL
- **Real-time Chat**: Socket.io for real-time communication
- **REST API**: Express.js API for chat, session management, and health checks

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Cache/Sessions**: Redis
- **Vector DB**: Qdrant
- **Embeddings**: Jina AI
- **LLM**: Google Gemini
- **News Parsing**: RSS Parser + Cheerio

## Prerequisites

- Node.js (v16 or higher)
- Redis server
- Qdrant vector database
- API keys for Jina AI and Google Gemini

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env
```

3. Configure your `.env` file with the required API keys and URLs.

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `FRONTEND_URL` | Frontend URL for CORS | No (default: http://localhost:3000) |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `JINA_API_KEY` | Jina AI embeddings API key | Yes |
| `REDIS_URL` | Redis connection URL | No (default: redis://localhost:6379) |
| `QDRANT_URL` | Qdrant server URL | No (default: http://localhost:6333) |
| `QDRANT_API_KEY` | Qdrant API key | No |

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Chat
- `POST /api/chat` - Send a message and get AI response
  - Body: `{ message: string, sessionId: string }`
  - Response: `{ response: string, relevantArticles: array, sessionId: string }`

### Sessions
- `POST /api/session` - Create a new session
  - Response: `{ sessionId: string }`
- `GET /api/session/:sessionId/history` - Get session chat history
  - Response: `{ history: array, sessionId: string }`
- `DELETE /api/session/:sessionId` - Clear session history
  - Response: `{ message: string, sessionId: string }`

## Socket.io Events

### Client to Server
- `join-session` - Join a specific session
- `chat-message` - Send a chat message
  - Data: `{ message: string, sessionId: string }`

### Server to Client
- `bot-response` - Receive AI response
  - Data: `{ response: string, relevantArticles: array, sessionId: string }`
- `error` - Error message
  - Data: `{ message: string }`

## Services

### NewsService
- Fetches news articles from RSS feeds
- Processes and cleans article content
- Stores articles in vector database

### VectorService
- Manages Qdrant vector database
- Creates embeddings using Jina AI
- Performs semantic search

### RAGService
- Combines retrieval and generation
- Retrieves relevant articles for queries
- Generates responses using Gemini

### SessionService
- Manages user sessions in Redis
- Stores chat history
- Handles session cleanup

## Development

### Project Structure
```
backend/
├── services/
│   ├── newsService.js      # News ingestion and processing
│   ├── vectorService.js    # Vector database operations
│   ├── ragService.js       # RAG pipeline
│   └── sessionService.js   # Session management
├── server.js               # Main server file
├── package.json
└── README.md
```

### Adding New News Sources

Add RSS feed URLs to the `rssFeeds` array in `newsService.js`:

```javascript
this.rssFeeds = [
  'https://feeds.reuters.com/reuters/topNews',
  'https://your-news-source.com/rss.xml'
];
```

### Customizing Embeddings

The service uses Jina embeddings by default. To use a different embedding service, modify the `createEmbedding` method in `vectorService.js`.

## Deployment

### Using Docker

1. Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

2. Build and run:
```bash
docker build -t rag-chatbot-backend .
docker run -p 5000:5000 rag-chatbot-backend
```

### Environment Setup

For production deployment:

1. Set up Redis server
2. Set up Qdrant vector database
3. Configure environment variables
4. Use a process manager like PM2

## Monitoring

The service includes basic health checks and logging. For production monitoring, consider adding:

- Application performance monitoring (APM)
- Log aggregation
- Metrics collection
- Error tracking

## Troubleshooting

### Common Issues

1. **Redis Connection Error**: Ensure Redis server is running
2. **Qdrant Connection Error**: Check Qdrant server status
3. **API Key Errors**: Verify all required API keys are set
4. **Memory Issues**: Monitor Redis memory usage and set appropriate TTLs

### Logs

The service logs important events to the console. For production, redirect logs to files or use a logging service.

## License

ISC
