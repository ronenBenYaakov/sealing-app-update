import React from "react";
import "./OurModels.css";

function OurModels() {
  const projects = [
    {
      title: "🧠 SEAL-Lite",
      description:
        "Ultra-compact LLM built for embedded and IoT environments. Blazing fast, low-memory footprint, and always context-aware.",
    },
    {
      title: "👁️ VisionEdge",
      description:
        "Real-time edge computer vision engine. Detect, track, and interpret visual data instantly with on-device intelligence.",
    },
    {
      title: "🔁 AutoAdapt",
      description:
        "A continual learning engine that keeps your models updated in real-time — no retraining needed.",
    },
  ];

  return (
    <div className="models-container">
      <div className="models-header">
        <img
          src={`${process.env.PUBLIC_URL}/sealLogo.png`}
          alt="SEAL Mascot"
          className="seal-mascot"
        />
        <h2>Our Models</h2>
        <p>Smart. Embedded. Self-Adapting.</p>
      </div>

      <div className="model-card-grid">
        {projects.map((proj, idx) => (
          <div className="model-card" key={idx}>
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurModels;
