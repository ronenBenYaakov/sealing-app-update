import React, { useEffect, useState, useCallback } from "react";
import "./Gallery.css";

export default function Gallery() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);

  // Check network connection
  useEffect(() => {
    const handleOnline = () => setNetworkStatus(true);
    const handleOffline = () => setNetworkStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchFolders = useCallback(async () => {
    if (!networkStatus) {
      setError("No internet connection. Please check your network.");
      setLoading(false);
      return;
    }

    try {
      const email = localStorage.getItem("userEmail");
      
      if (!email) {
        throw new Error("Please sign in to view your folders");
      }

      const apiUrl = `https://termite-next-grackle.ngrok-free.app/list-folders?email=${encodeURIComponent(email)}`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        credentials: 'include'
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid response: ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (!Array.isArray(data.folders)) {
        throw new Error("Invalid data format received from server");
      }

      setFolders(data.folders);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [networkStatus]);

  const downloadFolder = async (folderName) => {
    if (!networkStatus) {
      setError("No internet connection. Cannot download files.");
      return;
    }

    try {
      setDownloading(folderName);
      const email = localStorage.getItem("userEmail");
      
      if (!email) {
        throw new Error("Please sign in to download folders");
      }

      // Use the new endpoint
      const response = await fetch(
        `https://termite-next-grackle.ngrok-free.app/download/folder?email=${encodeURIComponent(email)}&folder=${encodeURIComponent(folderName)}`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        a.remove();
      }, 100);
    } catch (err) {
      console.error("Download error:", err);
      setError(`Failed to download ${folderName}: ${err.message}`);
    } finally {
      setDownloading(null);
    }
  };
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
        <div className="loading-spinner"></div>
        <p>Loading your folders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-container">
        <h1>Your Photo Folders</h1>
        <div className="error-message">
          <p>{error}</p>
          {networkStatus ? (
            <button onClick={handleRetry} className="retry-button">
              Try Again
            </button>
          ) : (
            <p>Please check your internet connection</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <h1>Your Photo Folders</h1>
      
      {!networkStatus && (
        <div className="network-warning">
          You're currently offline. Some features may not work.
        </div>
      )}

      {folders.length === 0 ? (
        <p className="no-folders">No folders found</p>
      ) : (
        <ul className="gallery-list">
          {folders.map((folder, idx) => (
            <li key={idx} className="gallery-item">
              <span className="folder-icon">📁</span>
              <button
                onClick={() => downloadFolder(folder)}
                disabled={downloading === folder || !networkStatus}
                className={`folder-link ${downloading === folder ? 'downloading' : ''}`}
              >
                {folder}
                {downloading === folder && (
                  <span className="download-spinner"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}