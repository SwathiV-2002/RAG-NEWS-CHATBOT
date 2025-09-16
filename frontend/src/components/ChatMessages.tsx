import React from 'react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isTyping }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-messages">
      {messages.length === 0 && !isTyping && (
        <div className="welcome-message">
          <h3>Welcome to the News Chatbot!</h3>
          <p>I can help you find information about the latest news. Try asking:</p>
          <ul>
            <li>"What are the latest technology news?"</li>
            <li>"Tell me about recent political developments"</li>
            <li>"What's happening in the economy?"</li>
          </ul>
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

      {isTyping && (
        <div className="message bot">
          <div className="message-avatar">B</div>
          <div className="typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
