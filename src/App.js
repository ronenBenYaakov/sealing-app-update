import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // Make sure this CSS file is in the same directory

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your SEAL assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu
  const [searchQuery, setSearchQuery] = useState(''); // State for search bar input
  const chatContainerRef = useRef(null);
  const prevScrollTop = useRef(0);
  const prevScrollHeight = useRef(0);

  // Function to send message to API
  const sendMessageToAPI = async (message) => {
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
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

  // Handler for sending a message
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

  // Effect for auto-scrolling chat to bottom when new messages arrive
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    // Check if user is near the bottom before auto-scrolling
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 120; // 120px buffer

    // If near bottom, scroll to actual bottom, otherwise maintain relative position
    container.scrollTop = isNearBottom
      ? container.scrollHeight
      : prevScrollTop.current + (container.scrollHeight - prevScrollHeight.current);

    // Update scroll positions for next render
    prevScrollTop.current = container.scrollTop;
    prevScrollHeight.current = container.scrollHeight;
  }, [messages]);

  // Handler for toggling the hamburger menu
  const handleHamburgerClick = () => {
    setIsMenuOpen(prev => !prev);
    // You can add logic here to show/hide a sidebar or overlay menu
    console.log("Hamburger menu toggled:", !isMenuOpen);
  };

  // Handler for search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Implement search logic here, e.g., filter messages based on searchQuery
    console.log("Search query:", e.target.value);
  };

  return (
    <div className="agent-go-container">
      <div className="chat-header">
        <div className="header-content">
          {/* Hamburger Button */}
          <button
            className={`hamburger-button ${isMenuOpen ? 'open' : ''}`}
            onClick={handleHamburgerClick}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          <div className="assistant-info">
            <div className="assistant-details">
              <h1>SEAL Assistant</h1>
              <p>Enterprise AI Support</p>
            </div>
          </div>
          <div className="status-indicator online"></div>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search messages"
          />
          {/* Search Icon (using SVG for simplicity, can be a Font Awesome icon) */}
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19ZM21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

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
      </div>
    </div>
  );
}

export default App;
