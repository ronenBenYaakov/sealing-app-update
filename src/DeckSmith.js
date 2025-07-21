import React, { useState } from "react";
import "./DeckSmith.css";

export default function DeckSmith() {
  const username = localStorage.getItem("userEmail") || "Unknown User";
  const [statusModel, setStatusModel] = useState("");
  const [statusTokenizer, setStatusTokenizer] = useState("");

  const handleUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);

    try {
      const response = await fetch(
        "https://termite-next-grackle.ngrok-free.app/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        if (type === "model") {
          setStatusModel("✅ Model ZIP file uploaded successfully!");
        } else {
          setStatusTokenizer("✅ Tokenizer ZIP file uploaded successfully!");
        }
      } else {
        if (type === "model") {
          setStatusModel("❌ Model ZIP file upload failed.");
        } else {
          setStatusTokenizer("❌ Tokenizer ZIP file upload failed.");
        }
      }
    } catch (error) {
      console.error(`Error uploading ${type} ZIP file:`, error);
      if (type === "model") {
        setStatusModel("⚠️ An error occurred uploading model ZIP file.");
      } else {
        setStatusTokenizer("⚠️ An error occurred uploading tokenizer ZIP file.");
      }
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
        <p className="decksmith-user">Logged in as: <strong>{username}</strong></p>

        <label className="decksmith-upload-label">
          Upload HuggingFace Model ZIP File
          <input
            type="file"
            accept=".zip"
            onChange={(e) => handleUpload(e, "model")}
            className="decksmith-upload-input"
          />
        </label>
        {statusModel && <p className="decksmith-status">{statusModel}</p>}

        <label className="decksmith-upload-label">
          Upload HuggingFace Tokenizer ZIP File
          <input
            type="file"
            accept=".zip"
            onChange={(e) => handleUpload(e, "tokenizer")}
            className="decksmith-upload-input"
          />
        </label>
        {statusTokenizer && <p className="decksmith-status">{statusTokenizer}</p>}
      </div>
    </div>
  );
}
