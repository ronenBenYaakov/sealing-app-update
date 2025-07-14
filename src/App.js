import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function FadeInCard({ children }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`card ${visible ? "visible" : "hidden"}`}
    >
      {children}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="topbar">
        <img
          className="logo"
          src={`${process.env.PUBLIC_URL}/sealLogo.png`}
          alt="SEALing Logo"
        />
        <h1>SEALing</h1>
      </header>

      <main className="main-content">
        <FadeInCard>
          <h3>About SEALing</h3>
          <p>
            SEALing specializes in embedded AI systems, advanced computer vision, and
            state-of-the-art large language models. Our flagship technology is
            SEAL models — Self-Adapting Large Language Models that learn and evolve
            in real-time to adapt to new data and environments without costly retraining.
          </p>
          <p>
            These dynamic models enable intelligent solutions embedded in devices,
            powering smarter IoT, robotics, and autonomous systems with continual
            learning and enhanced performance.
          </p>
        </FadeInCard>

        <FadeInCard>
          <h3>Embedded AI Systems</h3>
          <p>
            We develop AI models optimized for embedded hardware, enabling fast,
            efficient, and adaptive intelligence directly on devices at the edge.
          </p>
        </FadeInCard>

        <FadeInCard>
          <h3>Computer Vision</h3>
          <p>
            Our computer vision solutions leverage deep learning to provide accurate
            object detection, scene understanding, and real-time video analytics.
          </p>
        </FadeInCard>

        <FadeInCard>
          <h3>Self-Adapting LLMs</h3>
          <p>
            Our self-adapting language models continuously learn from new inputs,
            enhancing language understanding and generation capabilities without
            extensive retraining cycles.
          </p>
        </FadeInCard>
      </main>

      <footer className="footer">
        © 2025 SEALing. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
