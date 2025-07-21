import React, { useState, useEffect } from "react";
import "./SealPhotoCloudHome.css";

export default function SealPhotoCloudHome() {
  const [status, setStatus] = useState("");
  const [typedStatus, setTypedStatus] = useState("");

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const email = localStorage.getItem("userEmail"); // <-- get email from localStorage

    if (!email) {
      setStatus("User email not found. Please log in.");
      return;
    }

    if (!file || !file.name.endsWith(".zip")) {
      setStatus("Please upload a valid .zip file.");
      return;
    }

    setStatus(`Uploading "${file.name}"...`);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("file", file);

    try {
      const response = await fetch("https://termite-next-grackle.ngrok-free.app/upload-photos", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setStatus(result.message || "Upload complete! 📦");
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("Upload failed ❌. Check console.");
    }
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
