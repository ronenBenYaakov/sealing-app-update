import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // Main app styles
import './Auth.css'; // Styles for Login/Signup pages
import Login from './Login'; // Import the Login component
import Signup from './Signup'; // Import the Signup component
import MyAccount from './MyAccount'; // Import the MyAccount component

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
  const [currentView, setCurrentView] = useState('loading'); // State to manage current view: 'loading', 'login', 'signup', 'chat', 'myAccount'
  const [selectedCategory, setSelectedCategory] = useState(null); // State to store the selected category for API calls
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [loggedInUsername, setLoggedInUsername] = useState(null); // State for logged-in username
  const [loggedInUserProfilePic, setLoggedInUserProfilePic] = useState(() => {
    // Initialize profile pic from localStorage if available
    return localStorage.getItem('profilePictureUrl') || null;
  });
  // New states for achievements
  const [messageCount, setMessageCount] = useState(() => {
    return parseInt(localStorage.getItem('messageCount') || '0', 10);
  });
  const [hasFrequentChatterAchievement, setHasFrequentChatterAchievement] = useState(() => {
    return localStorage.getItem('hasFrequentChatterAchievement') === 'true';
  });

  const chatContainerRef = useRef(null);
  const prevScrollTop = useRef(0);
  const prevScrollHeight = useRef(0);
  const searchInputRef = useRef(null); // Ref for the search input to handle outside clicks

  // Dummy data for categories
  const dummyCategories = [
    "Classic 😊",
    "Trivia 🤓",
    "Cooking 👨‍🍳",
  ];

  // Helper function to strip emojis from a string
  const stripEmojis = (str) => {
    // Regex to match common emoji ranges
    return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
  };

  // Function to send message to API
  const sendMessageToAPI = async (message) => {
    setIsLoading(true);
    let apiUrl = 'https://yearly-notable-newt.ngrok-free.app/agent-go/chat';

    // If a category is selected, append it to the URL
    if (selectedCategory) {
      apiUrl = `https://yearly-notable-newt.ngrok-free.app/agent-go/chat/${selectedCategory.toLowerCase().replace(/\s/g, '-')}`;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loggedInUsername || 'guest', message }) // Use loggedInUsername
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

    // Increment message count and check for achievement if logged in
    if (isLoggedIn) {
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      localStorage.setItem('messageCount', newCount.toString());

      if (newCount >= 3 && !hasFrequentChatterAchievement) {
        setHasFrequentChatterAchievement(true);
        localStorage.setItem('hasFrequentChatterAchievement', 'true');
        alert("Achievement Unlocked: Frequent Chatter!"); // Simple notification
      }
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
      setSearchResults(dummyCategories);
    } else {
      const filteredResults = dummyCategories.filter(category =>
        category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
    }
    setShowSearchResults(true);
  };

  // Handler for when the search input gains focus
  const handleSearchFocus = () => {
    if (searchQuery.trim() === '') {
      setSearchResults(dummyCategories);
    }
    setShowSearchResults(true);
  };

  // Handler for selecting a search result
  const handleSelectSearchResult = (result) => {
    const firstWord = result.split(' ')[0];
    const cleanedResult = stripEmojis(firstWord);
    setSearchQuery(result);
    setSelectedCategory(cleanedResult);
    setSearchResults([]);
    setShowSearchResults(false);
    console.log("Selected category for API (first word, no emoji):", cleanedResult);
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

  // Effect for the loading screen animation and transitioning to chat
  useEffect(() => {
    if (showLoadingScreen) {
      const totalAnimationDuration = 2000 + 1000 + 500; // 3.5 seconds
      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
        setCurrentView('chat'); // Transition directly to chat screen after loading animation
      }, totalAnimationDuration);
      return () => clearTimeout(timer);
    }
  }, [showLoadingScreen]);

  // Functions to switch between views and handle authentication
  const handleLoginSuccess = (username) => {
    setIsLoggedIn(true);
    setLoggedInUsername(username);
    // Reset message count on login for achievement tracking for this session
    setMessageCount(0);
    localStorage.setItem('messageCount', '0');
    // Check if the frequent chatter achievement was already earned
    setHasFrequentChatterAchievement(localStorage.getItem('hasFrequentChatterAchievement') === 'true');
    setCurrentView('chat');
  };

  const handleSignupSuccess = (username) => {
    setLoggedInUsername(username);
    setCurrentView('login');
  };

  const handleUpdateProfilePic = (newUrl) => {
    setLoggedInUserProfilePic(newUrl);
    localStorage.setItem('profilePictureUrl', newUrl); // Store in localStorage
  };

  const handleSwitchToSignup = () => {
    setCurrentView('signup');
    closeSidebar();
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
    closeSidebar();
  };

  const handleGoToMyAccount = () => {
    setCurrentView('myAccount');
    closeSidebar();
  };

  const handleGoToChat = () => {
    setCurrentView('chat');
    closeSidebar();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUsername(null);
    setLoggedInUserProfilePic(null); // Clear profile pic on logout
    localStorage.removeItem('profilePictureUrl'); // Clear from localStorage
    localStorage.removeItem('messageCount'); // Clear message count on logout
    // Keep hasFrequentChatterAchievement as it's a permanent achievement
    setMessages([{ text: "Hello! I'm your AgentGO assistant. How can I help you today?", sender: 'bot' }]); // Reset messages
    setCurrentView('login');
    closeSidebar();
  };

  // Conditional rendering based on currentView state
  const renderContent = () => {
    switch (currentView) {
      case 'loading':
        return (
          <div className="loading-screen">
            <h1 className="loading-text">Welcome to Sealing</h1>
          </div>
        );
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignup={handleSwitchToSignup} />;
      case 'signup':
        return <Signup onSignupSuccess={handleSignupSuccess} onSwitchToLogin={handleSwitchToLogin} />;
      case 'myAccount':
        return (
          <MyAccount
            username={loggedInUsername}
            currentProfilePic={loggedInUserProfilePic}
            onUpdateProfilePic={handleUpdateProfilePic}
            onGoToChat={handleGoToChat}
          />
        );
      case 'chat':
        return (
          <>
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
                <li><a href="#home" onClick={handleGoToChat}>Home</a></li>
                {isLoggedIn && <li><a href="#myaccount" onClick={handleGoToMyAccount}>My Account</a></li>}
                <li><a href="#settings" onClick={closeSidebar}>Settings</a></li>
                {isLoggedIn ? (
                  <li><a href="#logout" onClick={handleLogout}>Logout</a></li>
                ) : (
                  <>
                    <li><a href="#login" onClick={handleSwitchToLogin}>Log In</a></li>
                    <li><a href="#signup" onClick={handleSwitchToSignup}>Sign Up</a></li>
                  </>
                )}
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
                  {/* Profile Picture Display */}
                  {isLoggedIn && loggedInUserProfilePic && (
                    <img
                      src={loggedInUserProfilePic}
                      alt="Profile"
                      className="profile-picture"
                      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/50x50/cccccc/ffffff?text=User"; }} // Fallback
                    />
                  )}
                  <div className="assistant-details">
                    <h1>AgentGO</h1>
                    {/* Achievements Section */}
                    <div className="achievements-section">
                      {isLoggedIn && (
                        <div className="achievement-item">
                          <svg className="achievement-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                          </svg>
                          <span className="achievement-text">Account Holder</span>
                        </div>
                      )}
                      {isLoggedIn && hasFrequentChatterAchievement && (
                        <div className="achievement-item">
                          <svg className="achievement-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          <span className="achievement-text">Frequent Chatter</span>
                        </div>
                      )}
                      {/* Add more achievements here */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="search-bar" ref={searchInputRef}>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  aria-label="Search categories"
                />
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
          </>
        );
      default:
        return null;
    }
  };

  return <div className="agent-go-container">{renderContent()}</div>;
}

export default App;
