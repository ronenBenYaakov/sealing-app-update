import React, { useState, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import ContactUs from "./ContactUs";
import OurModels from "./OurModels";
import DeckSmith from "./DeckSmith";
import GetToken from "./GetToken";
import SignUp from './Signup'
import Login from './Login'
import SealPhotoCloudHome from './SealPhotoCloudHome'
import Gallery from './Gallery'
import "./App.css";

// Fade-in animation wrapper
function FadeInCard({ children }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`card ${visible ? "visible" : "hidden"}`}>
      {children}
    </div>
  );
}

// Overlay menu with links and login options
function MenuOverlay({ onClose }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="menu-overlay" onClick={onClose}>
      <nav className="menu-content" onClick={(e) => e.stopPropagation()}>
        <ul>
          <li onClick={() => handleNavigate("/our-models")}>Our Models</li>
          <li onClick={() => handleNavigate("/get-token")}>Get API Token</li>
          <li onClick={() => handleNavigate("/")}>About Us</li>
          <li onClick={() => handleNavigate("/contact")}>Contact Us</li>
        </ul>
        <div className="auth-buttons">
          <button onClick={() => handleNavigate("/login")}>Login</button>
          <button onClick={() => handleNavigate("/signup")}>Sign Up</button>
        </div>
      </nav>
    </div>
  );
}


// Home component
function Home({ toggleMenu, menuOpen }) {
  return (
    <>
      <header className="topbar">
        <img
          className="logo"
          src={`${process.env.PUBLIC_URL}/sealLogo.png`}
          alt="SEALing Logo"
        />
        <h1>SEALing</h1>
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {menuOpen && <MenuOverlay onClose={toggleMenu} />}

      <main className="main-content">
        <FadeInCard>
          <h3>About SEALing</h3>
          <p>
            SEALing specializes in embedded AI systems, advanced computer vision,
            and large language models. Our SEAL models adapt in real time to new
            data and environments without costly retraining.
          </p>
        </FadeInCard>
        <FadeInCard>
          <h3>Embedded AI Systems</h3>
          <p>Fast, efficient AI models that run directly on devices at the edge.</p>
        </FadeInCard>
        <FadeInCard>
          <h3>Computer Vision</h3>
          <p>Deep learning for real-time scene understanding and object detection.</p>
        </FadeInCard>
        <FadeInCard>
          <h3>Self-Adapting LLMs</h3>
          <p>Language models that evolve with use — no retraining needed.</p>
        </FadeInCard>
      </main>

      <footer className="footer">© 2025 SEALing. All rights reserved.</footer>
    </>
  );
}

// Wrapper to toggle menu state for <Home />
function HomeWrapper() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  return <Home toggleMenu={toggleMenu} menuOpen={menuOpen} />;
}

// App component with full routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeWrapper />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/our-models" element={<OurModels />} />
        <Route path="/decksmith" element={<DeckSmith />} />
        <Route path="/get-token" element={<GetToken />} />
        <Route path='/seal-photo-cloud-home' element={<SealPhotoCloudHome />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;
