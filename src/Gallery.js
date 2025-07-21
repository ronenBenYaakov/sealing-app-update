import React, { useEffect, useState, useCallback } from "react";
import "./Gallery.css";

export default function Gallery() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFolders = useCallback(async () => {
    try {
      const email = localStorage.getItem("userEmail");
      
      if (!email) {
        throw new Error("Please sign in to view your folders");
      }

      const apiUrl = `https://termite-next-grackle.ngrok-free.app/list-folders?email=${encodeURIComponent(email)}`;
      
      console.log("Attempting to fetch from:", apiUrl); // Debug log

      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // Bypass ngrok warning
        },
        credentials: 'include' // If using cookies
      });

      const responseText = await response.text();
      
      try {
        const data = JSON.parse(responseText);
        
        if (!response.ok) {
          throw new Error(data.message || `Server error: ${response.status}`);
        }

        if (!Array.isArray(data.folders)) {
          throw new Error("Invalid data format received from server");
        }

        setFolders(data.folders);
        setError(null);
      } catch (jsonError) {
        console.error("Failed to parse JSON:", responseText);
        throw new Error(`Server returned: ${responseText.substring(0, 100)}...`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);


  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchFolders();
  };

  if (loading) {
    return (
      <div className="gallery-container">
        <h1>Your Photo Folders</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-container">
        <h1>Your Photo Folders</h1>
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <h1>Your Photo Folders</h1>
      {folders.length === 0 ? (
        <p>No folders found</p>
      ) : (
        <ul className="gallery-list">
          {folders.map((folder, idx) => (
            <li key={idx}>
              <span className="folder-icon">📁</span>
              {folder}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}