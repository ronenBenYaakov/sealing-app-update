import React, { useState, useEffect } from 'react';
import './Gallery.css';

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timestamp to prevent caching issues
      const userEmail = localStorage.getItem('userEmail');
      const apiUrl = `https://termite-next-grackle.ngrok-free.app/gallery?email=${encodeURIComponent(userEmail)}&timestamp=${Date.now()}`;      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include'  // Include cookies if needed
      });

      // First check if response is HTML
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        throw new Error('Server returned HTML instead of JSON');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [retryCount]);  // Retry when retryCount changes

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="gallery-container">
      <h1 className="gallery-title">Image Gallery</h1>
      
      {loading ? (
        <div className="gallery-loading">
          <div className="spinner"></div>
          Loading images...
        </div>
      ) : error ? (
        <div className="gallery-error">
          <p>Error loading images: {error}</p>
          <p>Possible causes:</p>
          <ul>
            <li>Server is not responding correctly</li>
            <li>Authentication required</li>
            <li>Network issues</li>
          </ul>
          <button className="retry-button" onClick={handleRetry}>
            Retry
          </button>
        </div>
      ) : images.length === 0 ? (
        <div className="gallery-empty">
          No images found in the gallery
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map((img, index) => (
            <div key={index} className="gallery-item">
              <img 
                src={img.data} 
                alt={img.filename.replace('_decompressed.png', '')} 
                className="gallery-image"
                loading="lazy"
              />
              <div className="gallery-caption">
                {img.filename.replace('_decompressed.png', '')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;