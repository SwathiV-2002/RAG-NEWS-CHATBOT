import React, { useState, useEffect } from 'react';
import './App.scss';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import { SessionProvider } from './contexts/SessionContext';

function App() {
  return (
    <SessionProvider>
      <div className="App">
        <Header />
        <main className="main-content">
          <ChatInterface />
        </main>
      </div>
    </SessionProvider>
  );
}

export default App;
