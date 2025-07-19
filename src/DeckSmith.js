import React, { useState } from 'react';
import './DeckSmith.css';

const DeckSmith = () => {
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status1, setStatus1] = useState('');
  const [status2, setStatus2] = useState('');
  const [authStatus, setAuthStatus] = useState('');

  const handleAuthenticate = async () => {
    if (token.trim() === '') {
      alert('Please enter a token first!');
      return;
    }

    setAuthStatus('Verifying token...');
    setStatus1('');
    setStatus2('');
    setIsAuthenticated(false);

    try {
      const res = await fetch('http://localhost:3001/tokens');
      if (!res.ok) {
        setAuthStatus(`❌ Failed to verify token: ${res.statusText}`);
        return;
      }

      const data = await res.json();
      if (data.tokens && data.tokens.includes(token.trim())) {
        setIsAuthenticated(true);
        setAuthStatus('✅ Token authenticated successfully!');
      } else {
        setIsAuthenticated(false);
        setAuthStatus('❌ Token not found or invalid.');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      setAuthStatus('⚠️ Error verifying token.');
      setIsAuthenticated(false);
    }
  };

  const handleUpload1 = async (event) => {
    if (!isAuthenticated) return;

    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setStatus1('✅ Model ZIP file uploaded successfully!');
      } else {
        setStatus1('❌ Model Zip file upload failed.');
      }
    } catch (error) {
      console.error('Error uploading Zip file 1:', error);
      setStatus1('⚠️ An error occurred uploading Zip file 1.');
    }
  };

  const handleUpload2 = async (event) => {
    if (!isAuthenticated) return;

    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setStatus2('✅ Tokenizer Zip file uploaded successfully!');
      } else {
        setStatus2('❌ Tokenizer Zip file upload failed.');
      }
    } catch (error) {
      console.error('Error uploading Zip file 2:', error);
      setStatus2('⚠️ An error occurred uploading Zip file 2.');
    }
  };

  return (
    <div className="decksmith-wrapper">
      <div className="decksmith-glass">
        <img
          src="/DeckSmithSealLogo.jpg"
          alt="DeckSmith Logo"
          className="decksmith-logo"
        />
        <h1 className="decksmith-title">DeckSmith</h1>
        <p className="decksmith-subtitle">Forge your decks with power.</p>

        <label htmlFor="token-input" className="decksmith-token-label">
          Enter your token:
        </label>
        <input
          type="text"
          id="token-input"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            setIsAuthenticated(false); // Reset auth if token changes
            setAuthStatus('');
          }}
          placeholder="Enter your token here"
          className="decksmith-token-input"
        />
        <button onClick={handleAuthenticate} className="decksmith-auth-button">
          Authenticate
        </button>
        <p className="decksmith-status">{authStatus}</p>

        <label
          className="decksmith-button"
          tabIndex={0}
          style={{
            opacity: isAuthenticated ? 1 : 0.5,
            pointerEvents: isAuthenticated ? 'auto' : 'none',
          }}
        >
          Upload HuggingFace Model ZIP File
          <input
            type="file"
            accept=".zip"
            onChange={handleUpload1}
            className="decksmith-input"
            disabled={!isAuthenticated}
          />
        </label>
        <p className="decksmith-status">{status1}</p>

        <label
          className="decksmith-button"
          tabIndex={0}
          style={{
            opacity: isAuthenticated ? 1 : 0.5,
            pointerEvents: isAuthenticated ? 'auto' : 'none',
          }}
        >
          Upload HuggingFace Tokenizer Zip File
          <input
            type="file"
            accept=".zip"
            onChange={handleUpload2}
            className="decksmith-input"
            disabled={!isAuthenticated}
          />
        </label>
        <p className="decksmith-status">{status2}</p>
      </div>
    </div>
  );
};

export default DeckSmith;
