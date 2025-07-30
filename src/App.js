// src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your SEAL assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const prevScrollTop = useRef(0);
  const prevScrollHeight = useRef(0);

  const sendMessageToAPI = async (message) => {
    try {
      setIsLoading(true);
      const response = await fetch('https://yearly-notable-newt.ngrok-free.app/agent-go/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'current_user', message })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      return data.ai_response;
    } catch (error) {
      console.error('Error calling API:', error);
      return "Sorry, I'm having trouble connecting to the server.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputValue('');

    const container = chatContainerRef.current;
    if (container) {
      prevScrollTop.current = container.scrollTop;
      prevScrollHeight.current = container.scrollHeight;
    }

    const aiResponse = await sendMessageToAPI(userMessage);
    setMessages(prev => [...prev, { text: aiResponse, sender: 'bot' }]);
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 120;

    container.scrollTop = isNearBottom
      ? container.scrollHeight
      : prevScrollTop.current + (container.scrollHeight - prevScrollHeight.current);

    prevScrollTop.current = container.scrollTop;
    prevScrollHeight.current = container.scrollHeight;
  }, [messages]);

  return (
    <div className="agent-go-container">
      <div className="agent-go-header">
        <div className="agent-go-main-logo">
          <img
            src={`${process.env.PUBLIC_URL}/AgentGoMascot.png`}
            alt="Agent Go Mascot"
            className="mascot-img"
          />
        </div>
        <h2>Agent Go</h2>
        <p>Your intelligent conversational assistant</p>
        <div className="header-container">
          <div className="header-search-bar">
            <input
              type="text"
              className="header-message-bar"
              placeholder="Search..."
            />
            <button className="search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="16"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 
                6.5 6.5 0 109.5 16c1.61 0 3.09-.59 
                4.23-1.57l.27.28v.79l5 4.99L20.49 
                19l-4.99-5zm-6 0C8.01 14 6 11.99 6 
                9.5S8.01 5 10.5 5 15 7.01 15 
                9.5 12.99 14 10.5 14z"/>
              </svg>
            </button>
          </div>
        </div>

      </div>


      <div className="chat-container">
        <div className="chat-messages" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <div className="message-content">{message.text}</div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message here..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 12 12)" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
