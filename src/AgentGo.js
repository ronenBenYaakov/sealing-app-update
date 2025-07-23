import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgentGo.css';

function AgentGo() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your SEAL assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessageToAPI = async (message) => {
    try {
      setIsLoading(true);
      const response = await fetch('https://yearly-notable-newt.ngrok-free.app/agent-go/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'current_user', // Replace with actual username if available
          message: message
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

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

    // Add user message
    const userMessage = inputValue;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputValue('');

    // Get AI response
    const aiResponse = await sendMessageToAPI(userMessage);
    setMessages(prev => [...prev, { text: aiResponse, sender: 'bot' }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="agent-go-container">
      <div className="agent-go-header">
        <img
          src={`${process.env.PUBLIC_URL}/AgentGoMascot.png`}
          alt="Agent Go Logo"
          className="agent-go-main-logo"
        />
        <h2>Agent Go</h2>
        <p>Your intelligent conversational assistant</p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <div className="message-content">
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
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
            <img src={`${process.env.PUBLIC_URL}/sendIcon.png`} alt="Send" />
          </button>
        </form>
      </div>

      <button className="back-button" onClick={() => navigate('/')}>
        Back to Models
      </button>
    </div>
  );
}

export default AgentGo;