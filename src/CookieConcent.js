import React, { useState, useEffect } from "react";
import "./CookieConsent.css"; // Create this CSS file for styles

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-consent-banner">
      <p>
        This site uses cookies to enhance your experience. By continuing, you
        agree to our use of cookies.
      </p>
      <button onClick={acceptCookies} className="cookie-consent-button">
        Accept
      </button>
    </div>
  );
}
