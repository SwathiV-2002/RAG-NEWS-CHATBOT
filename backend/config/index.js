// Environment configuration utility
const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Frontend configuration
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // API Keys
  geminiApiKey: process.env.GEMINI_API_KEY,
  jinaApiKey: process.env.JINA_API_KEY,
  
  // Database configuration
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Vector database configuration
  qdrantUrl: process.env.QDRANT_URL || 'http://localhost:6333',
  qdrantApiKey: process.env.QDRANT_API_KEY || null,
  
  // Cache configuration
  sessionTtl: parseInt(process.env.SESSION_TTL) || 86400, // 24 hours
  cacheTtl: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour
  
  // Development vs Production
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // CORS origins
  corsOrigins: [
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  
  // Socket.io configuration
  socketPath: '/my-socket/',
  socketTransports: ['websocket', 'polling']
};

// Validation
if (!config.geminiApiKey) {
  console.warn('⚠️  GEMINI_API_KEY not set - AI responses will not work');
}

if (!config.jinaApiKey) {
  console.warn('⚠️  JINA_API_KEY not set - embeddings will not work');
}

if (config.isProduction && !config.redisUrl.includes('redis://')) {
  console.warn('⚠️  REDIS_URL not properly configured for production');
}

module.exports = config;
