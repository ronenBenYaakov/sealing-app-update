import React, { useState, useEffect, useRef } from 'react';
import './Auth.css'; // Reuse Auth.css for styling
// You might also want to import MyAccount.css here if it contains specific styles
// import './MyAccount.css';

function MyAccount({ username, currentProfilePic, onUpdateProfilePic, onGoToChat }) {
  const [newProfilePicUrl, setNewProfilePicUrl] = useState(currentProfilePic || '');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null); // Ref for the hidden file input

  useEffect(() => {
    // Update local state if currentProfilePic changes from parent (e.g., on initial load)
    setNewProfilePicUrl(currentProfilePic || '');
  }, [currentProfilePic]);

  const defaultProfilePic = "https://placehold.co/100x100/cccccc/ffffff?text=User";

  // Handler for file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Use the Data URL as the new profile picture
        // In a real app, you would upload this file to a server and get a URL back.
        // For demonstration, we're using Data URL which is stored in localStorage.
        onUpdateProfilePic(reader.result); // Update profile picture in App.js
        setMessage('Profile picture updated!');
      };
      reader.readAsDataURL(file); // Read file as Data URL
    }
  };

  // Function to trigger the hidden file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="auth-container"> {/* Reusing auth-container for centering */}
      <div className="auth-card"> {/* Reusing auth-card for styling */}
        <h2>My Account</h2>
        <div className="profile-display">
          <div className="profile-picture-wrapper"> {/* Wrapper for positioning pencil */}
            <img
              src={currentProfilePic || defaultProfilePic}
              alt="Profile"
              className="large-profile-picture"
              onError={(e) => { e.target.onerror = null; e.target.src = defaultProfilePic; }}
            />
            {/* Custom SVG pencil icon button to trigger file upload */}
            <span className="edit-profile-pic-icon" onClick={triggerFileInput}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </span>
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }} // Hide the input
            />
          </div>
          <p className="username-display">Hello, {username || 'Guest'}!</p>
        </div>

        {message && <p className="success-message">{message}</p>} {/* Display success message */}

        <p className="auth-switch">
          <span onClick={onGoToChat} className="switch-link">
            Back to Chat
          </span>
        </p>
      </div>
    </div>
  );
}

export default MyAccount;
