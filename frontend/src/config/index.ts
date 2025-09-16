// Frontend configuration utility
const config = {
  // Environment
  env: process.env.REACT_APP_ENV || 'development',
  
  // API Configuration
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  socketUrl: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
  
  // Development vs Production
  isDevelopment: process.env.REACT_APP_ENV === 'development',
  isProduction: process.env.REACT_APP_ENV === 'production',
  
  // Socket.io configuration
  socketPath: '/my-socket/',
  socketTransports: ['polling'],
  
  // Timeouts
  socketTimeout: 20000,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  
  // UI Configuration
  maxMessages: 100,
  typingDelay: 1000
};

// Validation
if (!config.apiUrl) {
  console.error('❌ REACT_APP_API_URL not configured');
}

if (!config.socketUrl) {
  console.error('❌ REACT_APP_SOCKET_URL not configured');
}

export default config;
