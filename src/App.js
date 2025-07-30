import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // Make sure this CSS file is in the same directory

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AgentGO assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu
  const [searchQuery, setSearchQuery] = useState(''); // State for search bar input
  const [searchResults, setSearchResults] = useState([]); // State for dummy search results
  const [showSearchResults, setShowSearchResults] = useState(false); // State to control visibility of search results
  const [showLoadingScreen, setShowLoadingScreen] = useState(true); // State for the loading screen
  const chatContainerRef = useRef(null);
  const prevScrollTop = useRef(0);
  const prevScrollHeight = useRef(0);
  const searchInputRef = useRef(null); // Ref for the search input to handle outside clicks

  // Dummy data for categories
  const dummyCategories = [
    "Technical Support",
    "Billing Inquiries",
    "Product Features",
    "Account Management",
    "Troubleshooting Guides",
    "General Information",
    "Security Concerns",
    "Privacy Policy",
    "API Documentation",
    "Integrations"
  ];

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
  };

  // Handler for closing the sidebar (e.g., by clicking overlay)
  const closeSidebar = () => {
    setIsMenuOpen(false);
  };

  // Handler for search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      // If query is empty, show all dummy categories
      setSearchResults(dummyCategories);
    } else {
      // Filter dummy categories based on search query
      const filteredResults = dummyCategories.filter(category =>
        category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
    }
    setShowSearchResults(true); // Always show results when typing or input is focused
  };

  // Handler for when the search input gains focus
  const handleSearchFocus = () => {
    if (searchQuery.trim() === '') {
      setSearchResults(dummyCategories); // Show all categories if input is empty
    }
    setShowSearchResults(true);
  };

  // Handler for selecting a search result
  const handleSelectSearchResult = (result) => {
    setSearchQuery(result); // Set the input value to the selected result
    setSearchResults([]); // Clear results
    setShowSearchResults(false); // Hide results
    // You can add further logic here, e.g., trigger a chat message or navigate
    console.log("Selected category:", result);
  };

  // Effect to handle clicks outside the search results dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchInputRef]);

  // Effect for the loading screen animation
  useEffect(() => {
    if (showLoadingScreen) {
      // Total animation duration: typing (2s) + fade out (1s) + small buffer (0.5s)
      const totalAnimationDuration = 2000 + 1000 + 500; // 3.5 seconds
      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
      }, totalAnimationDuration);
      return () => clearTimeout(timer);
    }
  }, [showLoadingScreen]);


  return (
    <div className="agent-go-container">
      {/* Loading Screen */}
      {showLoadingScreen && (
        <div className="loading-screen">
          <h1 className="loading-text">Welcome to Sealing</h1>
        </div>
      )}

      {/* Sidebar Overlay */}
      {isMenuOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-sidebar-button" onClick={closeSidebar} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <ul className="sidebar-nav">
          <li><a href="#home" onClick={closeSidebar}>Home</a></li>
          <li><a href="#profile" onClick={closeSidebar}>Profile</a></li>
          <li><a href="#settings" onClick={closeSidebar}>Settings</a></li>
          <li><a href="#logout" onClick={closeSidebar}>Logout</a></li>
        </ul>
      </div>

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
              <h1>AgentGO</h1> {/* Changed from SEAL Assistant */}
              {/* Removed the tagline below */}
            </div>
          </div>
          {/* Removed status indicator as per previous request */}
        </div>

        {/* Search Bar */}
        <div className="search-bar" ref={searchInputRef}> {/* Attach ref here */}
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus} 
            aria-label="Search categories"
          />
          {/* Search Icon (using SVG for simplicity, can be a Font Awesome icon) */}
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19ZM21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <ul className="search-results-dropdown">
              {searchResults.map((result, index) => (
                <li key={index} onClick={() => handleSelectSearchResult(result)}>
                  {result}
                </li>
              ))}
            </ul>
          )}
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
