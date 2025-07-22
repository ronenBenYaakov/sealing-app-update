import React, { useState, useEffect } from 'react';
import './Gallery.css';

export default function Gallery() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const username = localStorage.getItem('userEmail');
        if (!username) throw new Error('Please log in first');

        const response = await fetch(
          'https://yearly-notable-newt.ngrok-free.app/list-folders',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify({ username }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch folders');
        }

        const data = await response.json();
        setFolders(data.folders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  const downloadFolder = async (folderName) => {
    try {
      const username = localStorage.getItem('userEmail');
      const response = await fetch(
        'https://yearly-notable-newt.ngrok-free.app/download-folder',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({ username, folder_name: folderName }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <h1>Your Photo Collections</h1>
      {folders.length === 0 ? (
        <p className="empty-message">No photo collections found</p>
      ) : (
        <div className="folders-grid">
          {folders.map((folder) => (
            <div
              key={folder}
              className="folder-item"
              onClick={() => downloadFolder(folder)}
              title="Click to download"
            >
              <div className="folder-icon">📁</div>
              <h3>{folder}</h3>
              <p className="folder-meta">
                {Math.floor(Math.random() * 20)} photos • {Math.floor(Math.random() * 10)} MB
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
