import React, { useRef } from "react";
import "./ContactUs.css";

function ContactUs() {
  const formRef = useRef(null);

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>

      <div className="contact-cards">
        <div className="contact-card">
          <h3>📞 Phone</h3>
          <p>+972 (058) 4493025</p>
          <a href="tel:+9720584493025" className="contact-button">
            Call Us
          </a>
        </div>

        <div className="contact-card">
          <h3>📧 Gmail</h3>
          <p>techscope2025il@gmail.com</p>
          <a
            href="mailto:techscope2025il@gmail.com?subject=Contact%20from%20SEALing%20Site"
            className="contact-button"
          >
            Email Us
          </a>
        </div>
      </div>

      <div className="message-box" ref={formRef}>
        <h3>💬 Leave a Message</h3>

        <form
          action="https://formsubmit.co/8289b7509563c71739c4c4c3a893b86f"
          method="POST"
          className="contact-form"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="box" />

          <label htmlFor="from_name">From:</label>
          <input
            type="text"
            name="from_name"
            id="from_name"
            placeholder="techscope2025il@gmail.com"
            required
          />

          <label htmlFor="message">Message:</label>
          <textarea
            name="message"
            id="message"
            rows="6"
            placeholder="Type your message here..."
            required
          />

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
