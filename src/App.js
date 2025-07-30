import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your SEAL assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [aboutHeight, setAboutHeight] = useState(0);

  const chatContainerRef = useRef(null);
  const aboutRef = useRef(null);
  const prevScrollTop = useRef(0);
  const prevScrollHeight = useRef(0);

  const topSuggestions = [
    { emoji: '🚗', label: 'Cars' },
    { emoji: '🧬', label: 'Biology' },
    { emoji: '🍳', label: 'Cooking' }
  ];

  const toggleAbout = () => {
    setShowAbout(!showAbout);
  };

  // Update about section height when it's shown
  useEffect(() => {
    if (aboutRef.current) {
      setAboutHeight(showAbout ? aboutRef.current.scrollHeight : 0);
    }
  }, [showAbout]);

  // Function to send message to API
  const sendMessageToAPI = async (message) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://yearly-notable-newt.ngrok-free.app/agent-go/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'current_user', message })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.ai_response;
    } catch (error) {
      console.error('API error:', error);
      return "Sorry, I'm having trouble connecting to the server.";
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a user message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
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

  // Scroll chat container smartly on new messages
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
      {/* Header Section - Now more compact */}
      <div className="agent-go-header">
        <div className="agent-go-title-container">
          <div className="agent-go-main-logo">
            <img
              src={`${process.env.PUBLIC_URL}/AgentGoMascot.png`}
              alt="Agent Go Mascot"
              className="mascot-img"
            />
          </div>
          <div className="agent-go-title">
            <h2>Agent Go</h2>
            <p>Your intelligent assistant</p>
          </div>
        </div>

        <div className="header-container">
          <div className="header-search-bar">
            <input
              type="text"
              className="header-message-bar"
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 100)}
            />
            <button className="search-button" aria-label="Search">
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

            {searchFocused && (
              <div className="search-suggestions">
                {topSuggestions.map(({ emoji, label }, idx) => (
                  <div className="suggestion-item" key={idx}>
                    <span>{emoji}</span> <span>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        <div className="chat-messages" ref={chatContainerRef}>
          {messages.map(({ text, sender }, index) => (
            <div key={index} className={`message ${sender}`}>
              <div className="message-content">{text}</div>
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
        </div>

        {/* Bottom Input Bar */}
        <form onSubmit={handleSendMessage} className="chat-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message here..."
            disabled={isLoading}
            aria-label="Message input"
          />
          <button type="submit" disabled={isLoading} aria-label="Send message">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 11L12 6L17 11M12 18V7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="rotate(90 12 12)"
              />
            </svg>
          </button>
        </form>

        <div className="bottom-bar-info">
          <div className="arrow-down" onClick={toggleAbout}>
            <ChevronUp 
              size={54} 
              color="#2563eb" 
              className={showAbout ? "rotate-180" : ""}
              style={{ transition: "transform 0.3s ease", display: showAbout ? "none" : "block" }}
            />
          </div>
          <p className="about-text">About SealChat</p>
        </div>
      </div>

      <div 
        ref={aboutRef}
        className="about-section"
        style={{
          height: `${aboutHeight}px`,
          overflow: 'hidden',
          transition: 'height 0.5s ease',
          position: 'relative'
        }}
      >
        <div className="about-content">
          <h2>About SealChat</h2>
          <p>
            SealChat is an intelligent conversational assistant designed to help you with 
            various tasks and answer your questions. Powered by advanced AI technology, 
            it can assist with topics ranging from general knowledge to specific domains.
          </p>
          <p>
            Our mission is to provide a seamless and intuitive chat experience that 
            feels natural and helpful. Whether you need quick information or in-depth 
            discussions, SealChat is here to assist.
          </p>
          <h3>Features</h3>
          <ul>
            <li>Natural language understanding</li>
            <li>Wide range of knowledge</li>
            <li>Personalized responses</li>
            <li>Continuous learning</li>
          </ul>
          
          {/* Up Arrow in About Section */}
          <div className="arrow-up-container" onClick={toggleAbout}>
            <ChevronDown
              size={54} 
              color="#2563eb" 
              style={{ transition: "transform 0.3s ease", display: showAbout ? "block" : "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;