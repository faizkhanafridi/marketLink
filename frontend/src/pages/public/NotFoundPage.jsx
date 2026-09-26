import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  ShoppingBasket,
  Store,
  Tractor,
  ArrowLeft,
  Sprout,
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import '../../styles/home.css';
import '../../styles/not-found.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <Navbar />

      <section className="not-found-section">
      

        <div className="container">
          <div className="nf-inner">

            {/* ---------- LEFT: Illustration ---------- */}
            <div className="nf-visual">
              <div className="nf-visual-card">
                <svg
                  viewBox="0 0 400 320"
                  className="nf-illustration"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Background circle */}
                  <circle cx="200" cy="160" r="140" fill="#eef4e8" />

                  {/* Dashed orbit */}
                  <circle
                    cx="200"
                    cy="160"
                    r="118"
                    fill="none"
                    stroke="#c9dcc0"
                    strokeWidth="1.5"
                    strokeDasharray="4 8"
                  />

                  {/* Ground line */}
                  <ellipse
                    cx="200"
                    cy="252"
                    rx="120"
                    ry="10"
                    fill="#dbe7d3"
                  />

                  {/* Basket */}
                  <path
                    d="M120 175 L280 175 L265 245 C263 250, 258 253, 253 253 L147 253 C142 253, 137 250, 135 245 Z"
                    fill="#194d26"
                  />
                  <rect
                    x="110"
                    y="163"
                    width="180"
                    height="18"
                    rx="9"
                    fill="#194d26"
                  />
                  <path
                    d="M160 163 C160 130, 240 130, 240 163"
                    stroke="#194d26"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Basket weave lines */}
                  <line x1="150" y1="185" x2="147" y2="240" stroke="#2c5f38" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="180" y1="185" x2="178" y2="240" stroke="#2c5f38" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="210" y1="185" x2="212" y2="240" stroke="#2c5f38" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="240" y1="185" x2="243" y2="240" stroke="#2c5f38" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Leaves poking out */}
                  <path
                    d="M185 163 C185 135, 205 118, 220 128 C232 138, 215 158, 198 160 Z"
                    fill="#6EE7B7"
                  />
                  <path
                    d="M215 160 C220 130, 250 122, 258 138 C264 152, 240 165, 224 163 Z"
                    fill="#A6895C"
                  />

                  {/* Floating "?" */} 
                  <g className="nf-question">
                    <circle cx="308" cy="90" r="26" fill="#c47a0a" />
                    <text
                      x="308"
                      y="102"
                      textAnchor="middle"
                      fontSize="34"
                      fontWeight="800"
                      fontFamily="Manrope, sans-serif"
                      fill="#ffffff"
                    >
                      ?
                    </text>
                  </g>

                  {/* Small floating dots */}
                  <circle cx="95" cy="105" r="5" fill="#6EE7B7" opacity="0.7" />
                  <circle cx="330" cy="200" r="4" fill="#A6895C" opacity="0.6" />
                  <circle cx="70" cy="200" r="3" fill="#194d26" opacity="0.4" />
                </svg>
              </div>
            </div>

            {/* ---------- RIGHT: Content ---------- */}
            <div className="nf-content">
              <span className="nf-eyebrow">
                <Sprout size={14} />
                Error 404
              </span>

              <h1 className="nf-title">
                This patch of the field
                <span className="nf-title-accent"> hasn't been planted yet</span>
              </h1>

              <p className="nf-subtitle">
                The page you're looking for doesn't exist, was moved, or
                the link may be broken. Let's get you back to the good stuff.
              </p>

              <div className="nf-actions">
                <Link to="/" className="nf-btn nf-btn-primary">
                  <Home size={16} />
                  Back to Home
                </Link>
                <Link to="/products" className="nf-btn nf-btn-outline">
                  <ShoppingBasket size={16} />
                  Browse Products
                </Link>
              </div>

              {/* Helpful quick links */}
              <div className="nf-quick-links">
                <span className="nf-quick-label">Popular pages</span>
                <div className="nf-quick-grid">
                  <Link to="/markets" className="nf-quick-item">
                    <Store size={16} />
                    <span>Markets</span>
                  </Link>
                  <Link to="/farmers" className="nf-quick-item">
                    <Tractor size={16} />
                    <span>Farmers</span>
                  </Link>
                  <Link to="/about" className="nf-quick-item">
                    <ArrowLeft size={16} />
                    <span>About Us</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotFoundPage;