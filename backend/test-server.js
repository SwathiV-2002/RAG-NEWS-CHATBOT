// Simple test server without external dependencies
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for testing
const sessions = new Map();
const messages = new Map();

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mode: 'test-mode',
    message: 'Running without Redis/Qdrant - limited functionality'
  });
});

app.post('/api/session', (req, res) => {
  const sessionId = uuidv4();
  sessions.set(sessionId, {
    id: sessionId,
    createdAt: new Date().toISOString(),
    messages: []
  });
  res.json({ sessionId });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }

    // Store user message
    if (!messages.has(sessionId)) {
      messages.set(sessionId, []);
    }
    messages.get(sessionId).push({
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    // Generate a simple response (without AI)
    const responses = [
      "I'm a test chatbot. In full mode, I would search news articles and provide AI-powered responses.",
      "This is a demo response. To get real news answers, you need to configure API keys and external services.",
      "Test mode: I can't access news articles or AI services right now, but the chat interface works!",
      "Hello! I'm running in test mode. The full RAG functionality requires Redis, Qdrant, and API keys.",
      "This is a placeholder response. The real chatbot would analyze news articles and provide intelligent answers."
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Store bot response
    messages.get(sessionId).push({
      id: uuidv4(),
      role: 'bot',
      content: response,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      response,
      relevantArticles: [], // No articles in test mode
      sessionId 
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/session/:sessionId/history', (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionMessages = messages.get(sessionId) || [];
    res.json({ history: sessionMessages, sessionId });
  } catch (error) {
    console.error('Error fetching session history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    messages.delete(sessionId);
    sessions.delete(sessionId);
    res.json({ message: 'Session cleared successfully', sessionId });
  } catch (error) {
    console.error('Error clearing session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
  console.log('');
  console.log('⚠️  Running in TEST MODE:');
  console.log('   - No Redis (sessions stored in memory)');
  console.log('   - No Qdrant (no vector search)');
  console.log('   - No AI responses (placeholder responses)');
  console.log('   - No news ingestion');
  console.log('');
  console.log('✅ To get full functionality:');
  console.log('   1. Install Docker Desktop');
  console.log('   2. Run: docker-compose up -d');
  console.log('   3. Add API keys to .env');
  console.log('   4. Restart with: npm run dev');
});
