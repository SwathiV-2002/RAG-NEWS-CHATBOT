import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="message bot">
      <div className="message-avatar">B</div>
      <div className="typing-indicator">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
