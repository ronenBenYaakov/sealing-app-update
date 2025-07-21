import React, { useEffect, useState, useCallback } from "react";
import "./Gallery.css";

export default function Gallery() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const fetchFolders = useCallback(async () => {
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

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      setFolders(data.folders || []);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadFolder = async (folderName) => {
    try {
      setDownloading(folderName);
      const email = localStorage.getItem("userEmail");
      const response = await fetch(
        `https://termite-next-grackle.ngrok-free.app/download-folder?email=${encodeURIComponent(email)}&folder=${encodeURIComponent(folderName)}`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download folder');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
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
              <button
                onClick={() => downloadFolder(folder)}
                disabled={downloading === folder}
                className="folder-link"
              >
                {folder}
                {downloading === folder && ' (Downloading...)'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}