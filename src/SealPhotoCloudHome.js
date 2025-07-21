import React, { useState, useEffect } from "react";
import "./SealPhotoCloudHome.css";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";


export default function SealPhotoCloudHome() {
  const [status, setStatus] = useState("");
  const [typedStatus, setTypedStatus] = useState("");
  const navigate = useNavigate();

  const handleUpload = async (event) => {
    const files = event.target.files;
    const email = localStorage.getItem("userEmail");

    if (!email) {
      setStatus("User email not found. Please log in.");
      return;
    }

    if (!files || files.length === 0) {
      setStatus("No files selected.");
      return;
    }

    setStatus(`Preparing files for upload...`);

    // Create ZIP
    const zip = new JSZip();
    for (const file of files) {
      zip.file(file.name, file);
    }

    // Generate the zip blob
    const zipBlob = await zip.generateAsync({ type: "blob" });

    const formData = new FormData();
    formData.append("email", email);
    formData.append("file", new File([zipBlob], "upload.zip", { type: "application/zip" }));

    try {
      const response = await fetch("https://termite-next-grackle.ngrok-free.app/upload-photos", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setStatus(result.message || `Upload complete ✅`);
    } catch (error) {
      console.error("Upload error:", error);
      setStatus(`Upload failed ❌`);
    }
  };

  const handleViewGallery = () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setStatus("Please log in to view your gallery");
      return;
    }
    navigate("/gallery");
  };

  useEffect(() => {
    let i = 0;
    setTypedStatus("");
    if (!status) return;

    const interval = setInterval(() => {
      setTypedStatus((prev) => prev + status.charAt(i));
      i++;
      if (i > status.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="sketch-container">
      <div className="sketch-doorframe">
        <img
          src={`${process.env.PUBLIC_URL}/photoSeal.png`}
          alt="Seal Logo"
          className="sketch-logo"
        />
        <h1 className="sketch-title">Seal Photo Cloud</h1>
        <p className="sketch-tagline">Step inside your digital sketchbook.</p>

        <div className="sketch-buttons-container">
          <label className="sketch-upload-btn" tabIndex={0}>
            Upload Files
            <input
              type="file"
              multiple
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </label>

          <button
            className="sketch-upload-btn"
            onClick={handleViewGallery}
            style={{
              fontFamily: "'Patrick Hand', cursive",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            View Gallery
          </button>
        </div>

        <p className="sketch-status" aria-live="polite">
          {typedStatus}
        </p>
      </div>
    </div>
  );
}
