# Demo Video Script - RAG News Chatbot

## Video Length: 3-5 minutes

### 1. Introduction (30 seconds)
- **Show the live website**: https://rag-news-chatbot-frontend.onrender.com
- **Brief explanation**: "This is a RAG-powered news chatbot that answers questions about the latest news using AI and vector search"
- **Show the interface**: Point out the clean UI, session info, and topic buttons

### 2. Starting the Frontend (30 seconds)
- **Open the website** in browser
- **Show the loading process** (if any)
- **Point out the welcome message** and available topics
- **Explain the session management**: "Each visit creates a new session with a unique ID"

### 3. Sending Queries and Observing Gemini Responses (2 minutes)

#### Test Query 1: Technology News
- **Type**: "What are the latest technology news?"
- **Show the typing indicator** while waiting
- **Point out the AI response** and relevant articles
- **Explain**: "The system retrieved relevant articles and used Gemini to generate a contextual response"

#### Test Query 2: Political News
- **Type**: "Tell me about recent political developments"
- **Show the response** with relevant political articles
- **Highlight the source links** and article summaries

#### Test Query 3: Specific Question
- **Type**: "What's happening with AI developments?"
- **Show how it finds relevant articles** about AI
- **Demonstrate the RAG pipeline** working

### 4. Viewing and Resetting Chat History (1 minute)

#### Show Session History
- **Point out the session info**: "Session: [ID], X messages, [duration]"
- **Scroll through the chat history** to show previous messages
- **Explain**: "All messages are stored in Redis and persist during the session"

#### Reset Session
- **Click the "🗑️ New Chat" button**
- **Show the session reset**: New session ID, cleared messages
- **Explain**: "This creates a fresh session and clears the chat history"

### 5. Technical Highlights (30 seconds)
- **Show the relevant articles section** (if visible)
- **Point out the real-time communication** (WebSocket)
- **Mention the dynamic topics** being generated from news articles
- **Show the responsive design** by resizing the browser window

## Recording Tips

### Screen Recording Setup
- **Resolution**: 1920x1080 or higher
- **Frame Rate**: 30fps
- **Audio**: Clear narration
- **Browser**: Use Chrome or Firefox

### What to Highlight
1. **Real-time responses** - Show the typing indicator
2. **Session management** - Point out session IDs and message counts
3. **Dynamic topics** - Show how topics are generated from articles
4. **Responsive design** - Resize window to show mobile view
5. **Error handling** - If any errors occur, show how they're handled gracefully

### Key Points to Mention
- "This is a full-stack RAG application"
- "Uses Google Gemini for AI responses"
- "Vector search finds relevant news articles"
- "Real-time chat with WebSocket communication"
- "Session-based architecture with Redis storage"
- "Deployed on Render.com with automatic scaling"

## Post-Production
- **Add captions** for key technical terms
- **Highlight important UI elements** with arrows or circles
- **Keep it under 5 minutes** for attention span
- **Export as MP4** for easy sharing
- **Upload to YouTube** as unlisted for sharing

## Backup Plan
If live demo fails:
- **Record locally** with the development server
- **Show the same features** but explain it's the local version
- **Mention the production deployment** is available at the live URL
