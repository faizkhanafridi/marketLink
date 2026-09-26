import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/navbar.css';

const Footer = () => {
  return (
    <footer className="marketlink-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
  <div className="brand-icon">
    <svg
      viewBox="0 0 180 180"
      width="24"
      height="24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Same paths as navbar */}
      <path
        d="M30 78 L150 78 L138 138 C136.5 143 131.5 146 126.5 146 L53.5 146 C48.5 146 43.5 143 42 138 Z"
        fill="#F5F5F0"
      />
      <rect x="22" y="66" width="136" height="14" rx="7" fill="#F5F5F0" />
      <path
        d="M60 66 C60 36, 120 36, 120 66"
        stroke="#F5F5F0"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="58" y1="88" x2="55" y2="134" stroke="#194D26" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="83" y1="88" x2="82" y2="134" stroke="#194D26" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="108" y1="88" x2="110" y2="134" stroke="#194D26" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="130" y1="88" x2="133" y2="134" stroke="#194D26" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M75 66 C75 44, 92 34, 104 42 C114 50, 100 66, 84 66 Z"
        fill="#6EE7B7"
      />
      <path
        d="M104 66 C108 42, 132 36, 140 48 C146 58, 128 68, 112 66 Z"
        fill="#A6895C"
      />
    </svg>
  </div>
  <span className="brand-name">MarketLink</span>
</div>

            <p className="footer-description">
              Connecting local farmers with their community through fresh,
              seasonal, and locally grown produce.
            </p>

            <div className="footer-social">
              <a href="#facebook" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>

              <a href="#twitter" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>

              <a href="#instagram" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>

              <a href="#linkedin" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="footer-col">
            <h4 className="footer-heading">Explore</h4>

            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/markets">Markets</Link>
              </li>
              <li>
                <Link to="/farmers">Farmers</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
            </ul>
          </div>

          {/* For Farmers */}
          <div className="footer-col">
            <h4 className="footer-heading">For Farmers</h4>

            <ul className="footer-links">
              <li>
                <Link to="/register/farmer">Become a Farmer</Link>
              </li>
              <li>
                <Link to="/farmer">Farmer Dashboard</Link>
              </li>
              <li>
                <Link to="/about">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">Get in Touch</h4>

            <ul className="footer-contact">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Market Street, City</span>
              </li>

              <li>
                <i className="fas fa-phone"></i>
                <span>+1 (555) 123-4567</span>
              </li>

              <li>
                <i className="fas fa-envelope"></i>
                <span>hello@marketlink.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} MarketLink. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;