# RAG News Chatbot - Tech Stack

## Frontend Technologies
- **React 18** - UI framework for building interactive user interface
- **TypeScript** - Type-safe JavaScript for better development experience
- **SCSS** - Enhanced CSS with variables, nesting, and mixins
- **Socket.io Client** - Real-time bidirectional communication
- **Axios** - HTTP client for API requests
- **Context API** - State management for session and messages

## Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Socket.io** - Real-time communication server
- **Redis** - In-memory data store for session management and caching
- **Axios** - HTTP client for external API calls

## AI & ML Technologies
- **Google Gemini API** - Large Language Model for generating responses
- **Jina Embeddings API** - Text embedding service for vector representations
- **Qdrant** - Vector database for storing and searching embeddings

## Data Processing
- **RSS Parser** - Fetching and parsing news articles from RSS feeds
- **UUID** - Generating unique identifiers for sessions and articles
- **Cheerio** - Server-side HTML parsing (optional for content extraction)

## Deployment & Infrastructure
- **Render.com** - Cloud hosting platform for both frontend and backend
- **GitHub** - Version control and code repository
- **Docker** - Containerization (for Qdrant deployment)

## Development Tools
- **Nodemon** - Development server with auto-restart
- **Helmet** - Security middleware for Express
- **CORS** - Cross-Origin Resource Sharing middleware
- **Dotenv** - Environment variable management

## News Sources
- **BBC News RSS** - International news
- **NPR RSS** - US news and analysis
- **Washington Post RSS** - Politics, business, world news
- **CNN RSS** - Breaking news, business, technology
- **Reuters RSS** - Global news coverage
- **Indian Tech Sources** - Economic Times, LiveMint, Hindustan Times, India Today, Money Control, Business Standard

## Architecture Pattern
- **RAG (Retrieval-Augmented Generation)** - Combines retrieval of relevant documents with generation
- **Microservices** - Separate frontend and backend services
- **Real-time Communication** - WebSocket-based chat interface
- **Session-based Architecture** - Stateless backend with session management

## Justification of Tech Choices

### Frontend: React + TypeScript
- **React**: Component-based architecture, excellent ecosystem, great for real-time UIs
- **TypeScript**: Type safety reduces bugs, better IDE support, easier maintenance
- **SCSS**: Enhanced styling capabilities, maintainable CSS architecture

### Backend: Node.js + Express
- **Node.js**: JavaScript everywhere, excellent for real-time applications
- **Express**: Lightweight, flexible, great middleware ecosystem
- **Socket.io**: Handles real-time communication with fallbacks

### AI Stack: Gemini + Jina + Qdrant
- **Gemini**: Free tier available, good performance, easy integration
- **Jina**: High-quality embeddings, free tier, good documentation
- **Qdrant**: Fast vector search, easy setup, good free tier

### Database: Redis
- **Redis**: Perfect for session management, fast in-memory operations, TTL support

### Deployment: Render.com
- **Render.com**: Free tier, easy deployment, automatic scaling, good for full-stack apps
