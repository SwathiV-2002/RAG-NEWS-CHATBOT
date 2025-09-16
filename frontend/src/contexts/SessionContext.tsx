import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import config from '../config';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface Session {
  id: string;
  createdAt: string;
  lastActivity: string;
  messageCount: number;
}

interface SessionContextType {
  sessionId: string | null;
  session: Session | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  createSession: () => Promise<void>;
  clearSession: () => Promise<void>;
  addMessage: (role: 'user' | 'bot', content: string) => void;
  loadSessionHistory: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}


export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(`${config.apiUrl}/session`);
      const newSessionId = response.data.sessionId;
      
      const newSession: Session = {
        id: newSessionId,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        messageCount: 0
      };
      
      setSessionId(newSessionId);
      setSession(newSession);
      setMessages([]);
      
      // Store session ID in localStorage
      localStorage.setItem('chatSessionId', newSessionId);
      
    } catch (error) {
      console.error('Error creating session:', error);
      setError('Failed to create session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = async () => {
    if (!sessionId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await axios.delete(`${config.apiUrl}/session/${sessionId}`);
      
      setMessages([]);
      setSessionId(null);
      setSession(null);
      localStorage.removeItem('chatSessionId');
      
    } catch (error) {
      console.error('Error clearing session:', error);
      setError('Failed to clear session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (role: 'user' | 'bot', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update session activity and message count
    if (session) {
      setSession(prev => prev ? {
        ...prev,
        lastActivity: new Date().toISOString(),
        messageCount: prev.messageCount + 1
      } : null);
    }
  };

  const loadSessionHistory = async () => {
    if (!sessionId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${config.apiUrl}/session/${sessionId}/history`);
      const history = response.data.history;
      
      setMessages(history);
    } catch (error) {
      console.error('Error loading session history:', error);
      setError('Failed to load chat history.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem('chatSessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
  }, []);

  // Load session history when sessionId changes
  useEffect(() => {
    if (sessionId) {
      loadSessionHistory();
    }
  }, [sessionId]);

  const value: SessionContextType = {
    sessionId,
    session,
    messages,
    isLoading,
    error,
    createSession,
    clearSession,
    addMessage,
    loadSessionHistory
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
