import React, { useState } from 'react';
import './GetToken.css';

export default function GetToken() {
  const [tokens, setTokens] = useState([]);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchTokenFromBackend = async () => {
    setStatus('Fetching token...');
    setIsLoading(true);

    try {
      const res = await fetch('https://721c4cc86e23.ngrok-free.app/token-archive');
      if (!res.ok) {
        setStatus(`❌ Failed to fetch token: ${res.statusText}`);
        setIsLoading(false);
        return;
      }

      const data = await res.json();

      if (data.token) {
        setTokens((prevTokens) => [...prevTokens, data.token]);
        setStatus('✅ Token fetched successfully!');
      } else {
        setStatus('❌ No token found in response.');
      }
    } catch (error) {
      setStatus('⚠️ Network or server error');
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // freeze for 2 extra seconds
    }
  };

  const copyToClipboard = async (token) => {
    try {
      await navigator.clipboard.writeText(token);
      alert('Token copied to clipboard!');
    } catch (err) {
      alert('Failed to copy token.');
    }
  };

  return (
    <div className="get-token-container">
      <h2 className="get-token-title">Get Token From Server</h2>

      <button
        onClick={fetchTokenFromBackend}
        className="get-token-button"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Token'}
      </button>

      {tokens.map((token, index) => (
        <div className="generated-token-container" key={index}>
          <pre className="generated-token">{token}</pre>
          <div className="token-actions">
            <button
              className="token-copy-button"
              onClick={() => copyToClipboard(token)}
            >
              Copy
            </button>
          </div>
        </div>
      ))}

      {status && <p className="get-token-status">{status}</p>}
    </div>
  );
}
