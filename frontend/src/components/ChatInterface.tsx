import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '../contexts/SessionContext';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import config from '../config';

interface RelevantArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  score: number;
}

const ChatInterface: React.FC = () => {
  const { sessionId, session, messages, addMessage, createSession, clearSession, isLoading, error } = useSession();
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [relevantArticles, setRelevantArticles] = useState<RelevantArticle[]>([]);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Utility function to format session duration
  const formatSessionDuration = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just started';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(config.socketUrl, {
      transports: config.socketTransports as any,
      timeout: config.socketTimeout,
      reconnection: true,
      reconnectionAttempts: config.reconnectionAttempts,
      reconnectionDelay: config.reconnectionDelay,
      path: config.socketPath
    });
    
    newSocket.on('bot-response', (data) => {
      setIsTyping(false);
      addMessage('bot', data.response);
      setRelevantArticles(data.relevantArticles || []);
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      setIsTyping(false);
      addMessage('bot', `Error: ${data.message}`);
    });

    newSocket.on('connect', () => {
    });

    newSocket.on('disconnect', (reason) => {
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('reconnect', (attemptNumber) => {
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [addMessage]);

  // Join session when socket and sessionId are available
  useEffect(() => {
    if (socket && sessionId) {
      socket.emit('join-session', sessionId);
    }
  }, [socket, sessionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Create session on mount if none exists
  useEffect(() => {
    if (!sessionId && !isLoading) {
      createSession();
    }
  }, [sessionId, isLoading, createSession]);

  // Fetch available topics with retry logic
  useEffect(() => {
    const fetchTopics = async (retryCount = 0) => {
      try {
        const response = await axios.get(`${config.apiUrl}/topics`);
        setAvailableTopics(response.data.topics);
      } catch (error: any) {
        console.error('Error fetching topics:', error);
        if (retryCount < 3 && error.response?.status === 429) {
          // Retry after delay for rate limiting
          setTimeout(() => fetchTopics(retryCount + 1), 2000 * (retryCount + 1));
        }
      }
    };
    
    // Delay initial fetch to avoid rate limiting
    setTimeout(() => fetchTopics(), 1000);
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !sessionId) return;

    // Add user message immediately
    addMessage('user', message);
    setInputMessage('');
    setIsTyping(true);

    try {
      if (socket) {
        // Use socket for real-time communication
        socket.emit('chat-message', {
          message: message.trim(),
          sessionId: sessionId
        });
      } else {
        // Fallback to REST API
        const response = await axios.post(`${config.apiUrl}/chat`, {
          message: message.trim(),
          sessionId: sessionId
        });

        setIsTyping(false);
        addMessage('bot', response.data.response);
        setRelevantArticles(response.data.relevantArticles || []);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      addMessage('bot', 'Sorry, I encountered an error. Please try again.');
    }
  };

  const handleClearSession = async () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      await clearSession();
      setRelevantArticles([]);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (error) {
    return (
      <div className="chat-container">
        <div className="error">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>News Chatbot</h1>
        <p className="subtitle">Ask me anything about the latest news</p>
        {sessionId && session && (
          <div className="session-info">
            <div className="session-details">
              <span className="session-label">Session:</span>
              <span className="session-id" title={`Full ID: ${sessionId}`}>
                {sessionId.substring(0, 8)}...
              </span>
              <span className="message-count">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </span>
              <span className="session-duration" title={`Started: ${new Date(session.createdAt).toLocaleString()}`}>
                {formatSessionDuration(session.createdAt)}
              </span>
            </div>
            <button 
              className="clear-button"
              onClick={handleClearSession}
              disabled={isLoading}
              title="Start a new conversation"
            >
              🗑️ New Chat
            </button>
          </div>
        )}
      </div>

      <div className="chat-messages">
        {messages.length === 0 && !isLoading && (
          <div className="welcome-message">
            <h3>Welcome to the News Chatbot!</h3>
            <p>I can help you find information about the latest news. Available topics:</p>
            {availableTopics.length > 0 ? (
              <div className="topics-grid">
                {availableTopics.map((topic, index) => (
                  <span key={index} className="topic-tag">{topic}</span>
                ))}
              </div>
            ) : (
              <ul>
                <li>"What are the latest technology news?"</li>
                <li>"Tell me about recent political developments"</li>
                <li>"What's happening in the economy?"</li>
              </ul>
            )}
            <p>Try asking about any of these topics or ask a specific question!</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? 'U' : 'B'}
            </div>
            <div className="message-content">
              <div>{message.content}</div>
              <div className="message-time">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {relevantArticles.length > 0 && (
        <div className="relevant-articles">
          <h4>Relevant Articles:</h4>
          <div className="articles-list">
            {relevantArticles.map((article) => (
              <div key={article.id} className="article-item">
                <h5>{article.title}</h5>
                <p>{article.summary}</p>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="article-link"
                >
                  Read more from {article.source}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="chat-input-container">
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          disabled={isLoading || isTyping}
          placeholder="Ask me about the news..."
        />
      </div>
    </div>
  );
};

export default ChatInterface;
