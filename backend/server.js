const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const config = require('./config');
const newsService = require('./services/newsService');
const ragService = require('./services/ragService');
const sessionService = require('./services/sessionService');
const vectorService = require('./services/vectorService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.corsOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: config.socketTransports,
  allowEIO3: true,
  path: config.socketPath
});

const PORT = config.port;

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));
app.use(express.json());

// Rate limiting - disabled for development
// Uncomment and configure for production use

// Initialize services
async function initializeServices() {
  try {
    console.log('Initializing services...');
    await vectorService.initialize();
    await sessionService.initialize();
    await ragService.initialize();
    await newsService.initialize();
    console.log('All services initialized successfully');
  } catch (error) {
    console.error('Error initializing services:', error);
    process.exit(1);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }

    // Ensure session exists
    let session = await sessionService.getSession(sessionId);
    if (!session) {
      await sessionService.createSession(sessionId);
      // Wait a moment for session to be fully created
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Get relevant news articles using RAG
    const relevantArticles = await ragService.retrieveRelevantArticles(message);
    
    // Generate response using Gemini
    const response = await ragService.generateResponse(message, relevantArticles);
    
    // Store in session history
    await sessionService.addMessage(sessionId, 'user', message);
    await sessionService.addMessage(sessionId, 'bot', response);
    
    res.json({ 
      response, 
      relevantArticles: relevantArticles.slice(0, 3), // Return top 3 for context
      sessionId 
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/session/:sessionId/history', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await sessionService.getSessionHistory(sessionId);
    res.json({ history, sessionId });
  } catch (error) {
    console.error('Error fetching session history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await sessionService.clearSession(sessionId);
    res.json({ message: 'Session cleared successfully', sessionId });
  } catch (error) {
    console.error('Error clearing session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/session', (req, res) => {
  const sessionId = require('uuid').v4();
  res.json({ sessionId });
});

// Simple test endpoint
app.post('/api/test', async (req, res) => {
  try {
    const { message } = req.body;
    res.json({ 
      response: `Echo: ${message}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in test API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available topics
app.get('/api/topics', async (req, res) => {
  try {
    const topics = await ragService.getAvailableTopics();
    res.json({ topics });
  } catch (error) {
    console.error('Error getting topics:', error);
    res.status(500).json({ error: 'Failed to get topics' });
  }
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-session', async (sessionId) => {
    socket.join(sessionId);
    console.log(`Socket ${socket.id} joined session ${sessionId}`);
    
    // Ensure session exists
    let session = await sessionService.getSession(sessionId);
    if (!session) {
      console.log(`Creating new session ${sessionId}`);
      await sessionService.setSession(sessionId, {
        id: sessionId,
        createdAt: new Date().toISOString(),
        messages: [],
        lastActivity: new Date().toISOString()
      });
    }
  });
  
  socket.on('chat-message', async (data) => {
    try {
      const { message, sessionId } = data;
      
      // Get relevant articles
      const relevantArticles = await ragService.retrieveRelevantArticles(message);
      
      // Generate response
      const response = await ragService.generateResponse(message, relevantArticles);
      
      // Store in session
      await sessionService.addMessage(sessionId, 'user', message);
      await sessionService.addMessage(sessionId, 'bot', response);
      
      // Emit response back to client and room
      const responseData = {
        response,
        relevantArticles: relevantArticles.slice(0, 3),
        sessionId
      };
      
      // Send to individual socket
      socket.emit('bot-response', responseData);
      
      // Also send to room in case socket reconnects
      socket.to(sessionId).emit('bot-response', responseData);
      
    } catch (error) {
      console.error('Error in socket chat:', error);
      socket.emit('error', { message: 'Error processing your message' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeServices();
});

module.exports = app;
