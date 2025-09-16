const redis = require('redis');
const { v4: uuidv4 } = require('uuid');

class SessionService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async initialize() {
    try {
      console.log('Initializing session service...');
      
      // Create Redis client
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            console.log('⚠️  Redis server connection refused - falling back to in-memory storage');
            this.initializeInMemoryStorage();
            return undefined; // Stop retrying
          }
          if (options.total_retry_time > 5000) { // Reduced retry time
            console.log('⚠️  Redis retry time exhausted - falling back to in-memory storage');
            this.initializeInMemoryStorage();
            return undefined;
          }
          if (options.attempt > 3) { // Reduced retry attempts
            console.log('⚠️  Redis max retry attempts reached - falling back to in-memory storage');
            this.initializeInMemoryStorage();
            return undefined;
          }
          return Math.min(options.attempt * 100, 1000);
        }
      });

      // Handle Redis connection events
      this.client.on('connect', () => {
        console.log('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        console.error('Redis client error:', err);
        this.isConnected = false;
      });

      this.client.on('end', () => {
        console.log('Redis client disconnected');
        this.isConnected = false;
      });

      // Connect to Redis
      await this.client.connect();
      
      console.log('Session service initialized successfully');
    } catch (error) {
      console.error('Error initializing session service:', error);
      
      // Fallback to in-memory storage if Redis is not available
      console.log('⚠️  Redis not available - falling back to in-memory storage...');
      this.initializeInMemoryStorage();
    }
  }

  initializeInMemoryStorage() {
    this.memoryStorage = new Map();
    this.isConnected = true;
    console.log('Using in-memory storage for sessions');
  }

  async createSession() {
    const sessionId = uuidv4();
    const sessionData = {
      id: sessionId,
      createdAt: new Date().toISOString(),
      messages: [],
      lastActivity: new Date().toISOString()
    };

    await this.setSession(sessionId, sessionData);
    return sessionId;
  }

  async setSession(sessionId, sessionData) {
    try {
      if (this.memoryStorage) {
        // In-memory storage
        this.memoryStorage.set(sessionId, JSON.stringify(sessionData));
      } else if (this.client && this.isConnected) {
        // Redis storage
        await this.client.setEx(
          `session:${sessionId}`,
          24 * 60 * 60, // 24 hours TTL
          JSON.stringify(sessionData)
        );
      }
    } catch (error) {
      console.error('Error setting session:', error);
      throw error;
    }
  }

  async getSession(sessionId) {
    try {
      let sessionData = null;

      if (this.memoryStorage) {
        // In-memory storage
        const data = this.memoryStorage.get(sessionId);
        sessionData = data ? JSON.parse(data) : null;
      } else if (this.client && this.isConnected) {
        // Redis storage
        const data = await this.client.get(`session:${sessionId}`);
        sessionData = data ? JSON.parse(data) : null;
      }

      return sessionData;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  async addMessage(sessionId, role, content) {
    try {
      const session = await this.getSession(sessionId);
      
      if (!session) {
        throw new Error('Session not found');
      }

      const message = {
        id: uuidv4(),
        role: role, // 'user' or 'bot'
        content: content,
        timestamp: new Date().toISOString()
      };

      session.messages.push(message);
      session.lastActivity = new Date().toISOString();

      // Keep only last 50 messages to prevent memory issues
      if (session.messages.length > 50) {
        session.messages = session.messages.slice(-50);
      }

      await this.setSession(sessionId, session);
      return message;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  async getSessionHistory(sessionId) {
    try {
      const session = await this.getSession(sessionId);
      return session ? session.messages : [];
    } catch (error) {
      console.error('Error getting session history:', error);
      return [];
    }
  }

  async clearSession(sessionId) {
    try {
      if (this.memoryStorage) {
        // In-memory storage
        this.memoryStorage.delete(sessionId);
      } else if (this.client && this.isConnected) {
        // Redis storage
        await this.client.del(`session:${sessionId}`);
      }
      
      console.log(`Session ${sessionId} cleared`);
    } catch (error) {
      console.error('Error clearing session:', error);
      throw error;
    }
  }

  async getAllSessions() {
    try {
      if (this.memoryStorage) {
        // In-memory storage
        const sessions = [];
        for (const [sessionId, data] of this.memoryStorage.entries()) {
          sessions.push({
            id: sessionId,
            ...JSON.parse(data)
          });
        }
        return sessions;
      } else if (this.client && this.isConnected) {
        // Redis storage
        const keys = await this.client.keys('session:*');
        const sessions = [];
        
        for (const key of keys) {
          const data = await this.client.get(key);
          if (data) {
            const sessionId = key.replace('session:', '');
            sessions.push({
              id: sessionId,
              ...JSON.parse(data)
            });
          }
        }
        
        return sessions;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting all sessions:', error);
      return [];
    }
  }

  async getSessionStats() {
    try {
      const sessions = await this.getAllSessions();
      
      const stats = {
        totalSessions: sessions.length,
        activeSessions: sessions.filter(s => {
          const lastActivity = new Date(s.lastActivity);
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          return lastActivity > oneHourAgo;
        }).length,
        totalMessages: sessions.reduce((sum, s) => sum + s.messages.length, 0),
        averageMessagesPerSession: sessions.length > 0 
          ? sessions.reduce((sum, s) => sum + s.messages.length, 0) / sessions.length 
          : 0
      };

      return stats;
    } catch (error) {
      console.error('Error getting session stats:', error);
      return {
        totalSessions: 0,
        activeSessions: 0,
        totalMessages: 0,
        averageMessagesPerSession: 0
      };
    }
  }

  async cleanupExpiredSessions() {
    try {
      const sessions = await this.getAllSessions();
      const now = new Date();
      const expiredSessions = [];

      for (const session of sessions) {
        const lastActivity = new Date(session.lastActivity);
        const hoursSinceActivity = (now - lastActivity) / (1000 * 60 * 60);
        
        if (hoursSinceActivity > 24) { // 24 hours
          expiredSessions.push(session.id);
        }
      }

      for (const sessionId of expiredSessions) {
        await this.clearSession(sessionId);
      }

      console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
      return expiredSessions.length;
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
      return 0;
    }
  }

  async close() {
    try {
      if (this.client && this.isConnected) {
        await this.client.quit();
        console.log('Redis client closed');
      }
    } catch (error) {
      console.error('Error closing Redis client:', error);
    }
  }
}

module.exports = new SessionService();
