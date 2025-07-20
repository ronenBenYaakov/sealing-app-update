import React, { useState, useEffect } from "react";
import "./SealPhotoCloudHome.css";

export default function SealPhotoCloudHome() {
  const [status, setStatus] = useState("");
  const [typedStatus, setTypedStatus] = useState("");

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !file.name.endsWith(".zip")) {
      setStatus("Please upload a valid .zip file.");
      return;
    }
    setStatus(`Uploading "${file.name}"...`);
    setTimeout(() => {
      setStatus("Upload complete! 📦✏️");
    }, 1800);
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
          src={`${process.env.PUBLIC_URL}/sealLogo.png`}
          alt="Seal Logo"
          className="sketch-logo"
        />
        <h1 className="sketch-title">Seal Photo Cloud</h1>
        <p className="sketch-tagline">Step inside your digital sketchbook.</p>

        <label className="sketch-upload-btn" tabIndex={0}>
          Upload Zip Archive
          <input type="file" accept=".zip" onChange={handleUpload} />
        </label>

        <p className="sketch-status" aria-live="polite">
          {typedStatus}
        </p>
      </div>
    </div>
  );
}
