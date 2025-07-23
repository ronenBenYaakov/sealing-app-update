import React from "react";
import { useNavigate } from "react-router-dom";
import "./OurModels.css";

function OurModels() {
  const navigate = useNavigate();

  const projects = [

    {
      title: "Agent Go",
      description:
        "Advanced autonomous agent framework that enables intelligent decision-making and task automation in dynamic environments.",
      hasButton: true,
      logo: "AgentGoMascot.png", // Make sure to add this image to your public folder
      logoClass: "agent-go-logo",
      route: "/agent-go", // You'll need to set up this route in your router
    },

    {
      title: "Photo Archive",
      description:
        "Real-time edge computer vision engine. Detect, track, and interpret visual data instantly with on-device intelligence.",
      hasButton: true,
      logo: "photoSeal.png",
      logoClass: "vision-seal-logo",
      route: "/seal-photo-cloud-home",
    },
    //{
    //  title: "Auto Adapt",
      //description:
      //  "Our innovative continual learning platform enhances your existing Hugging Face models by leveraging a collective expertise system inspired by Decksmiths, improving performance continuously without increasing model size or storage requirements.",
      //hasButton: true,
      //logo: "DeckSmithSealLogo-removebg.png",
      //logoClass: "decksmith-logo",
      //route: "/decksmith",
    //},
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
            <img
              src={`${process.env.PUBLIC_URL}/${proj.logo}`}
              alt={`${proj.title} logo`}
              className={proj.logoClass}
            />
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
            {proj.hasButton && (
              <button
                className="go-to-decksmith"
                onClick={() => navigate(proj.route)}
              >
                Go!
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurModels;