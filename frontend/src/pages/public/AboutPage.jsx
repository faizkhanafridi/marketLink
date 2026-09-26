import React from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  Handshake,
  Smartphone,
  MapPin,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Tractor,
  ShoppingBasket,
  Store,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "../../styles/home.css";
import "../../styles/page-hero.css";
import "../../styles/about.css";

const AboutPage = () => {
  const stats = [
    { icon: Users, value: "120+", label: "Local Farmers" },
    { icon: MapPin, value: "12+", label: "Partner Markets" },
    { icon: ShoppingBasket, value: "480+", label: "Fresh Products" },
    { icon: ShieldCheck, value: "98%", label: "Pickup Success" },
  ];

  const values = [
    {
      icon: Leaf,
      title: "Fresh & Local",
      description:
        "We prioritize locally grown, seasonal produce from farmers in your community — nothing shipped from halfway across the world.",
    },
    {
      icon: Handshake,
      title: "Community First",
      description:
        "Every pre-order directly supports a nearby grower. We build lasting relationships between farmers and the people they feed.",
    },
    {
      icon: Smartphone,
      title: "Convenient by Design",
      description:
        "Browse real-time stock, reserve what you want ahead of time, and simply show up to collect. No more guessing at the stall.",
    },
  ];

  const steps = [
    {
      icon: ShoppingBasket,
      title: "Browse & Reserve",
      text: "Customers discover nearby markets and pre-order exactly what they need.",
    },
    {
      icon: Tractor,
      title: "Farmers Prepare",
      text: "Growers see incoming reservations and harvest precisely to demand.",
    },
    {
      icon: Store,
      title: "Pickup & Pay",
      text: "Everyone meets at the market on pickup day. Cash or card, no surprises.",
    },
  ];

  return (
    <div className="about-page">
      <Navbar />

      {/* =========================================================
          PAGE HERO
      ========================================================= */}
      <center>
        <section className="about-hero">
          <div className="about-hero-decoration about-hero-decoration-one"></div>
          <div className="about-hero-decoration about-hero-decoration-two"></div>

          <div className="container">
            <div className="about-hero-content">
              <span className="about-page-tag">
                <Sparkles size={13} />
                About MarketLink
              </span>

              <h1 className="about-page-title">
                Bridging Farmers
                <span> and Community</span>
              </h1>

              <p className="about-page-subtitle">
                MarketLink connects local growers with the people who love their
                food — making farmers markets more predictable, personal, and
                convenient for everyone.
              </p>
            </div>
          </div>
        </section>
      </center>
      {/* =========================================================
          MISSION / STORY
      ========================================================= */}
      <section className="about-story-section">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-content">
              <span className="about-eyebrow">Our Story</span>
              <h2 className="about-story-title">Why we built MarketLink</h2>

              <p className="about-story-text">
                Local farmers markets are growing in popularity as shoppers look
                for fresh, seasonal, and locally grown produce. But customers
                rarely know in advance which farmers will be at a market on a
                given day, what stock they have, or at what price.
              </p>

              <p className="about-story-text">
                MarketLink was created to solve this problem. We provide a
                unified platform where farmers publish their weekly stock and
                pricing, while customers discover nearby markets, browse
                available products, and reserve items for pickup.
              </p>

              <p className="about-story-text">
                Our mission is to strengthen the connection between local
                producers and their community by making farmers markets more
                convenient, predictable, and personal.
              </p>

              <div className="about-story-actions">
                <Link to="/products" className="about-btn about-btn-primary">
                  Browse Products
                  <ArrowRight size={15} />
                </Link>
                <Link to="/markets" className="about-btn about-btn-outline">
                  Find a Market
                </Link>
              </div>
            </div>

            <div className="about-story-visual">
              <div className="about-visual-card">
                <div className="about-visual-icon">
                  <Leaf size={28} strokeWidth={1.6} />
                </div>
                <h3 className="about-visual-title">Fresh. Local. Yours.</h3>
                <p className="about-visual-text">
                  Every basket you reserve supports a grower in your community —
                  and brings home food that was picked this week, not last
                  month.
                </p>

                <ul className="about-visual-list">
                  <li>
                    <span className="about-check">
                      <ShieldCheck size={12} />
                    </span>
                    Verified independent growers only
                  </li>
                  <li>
                    <span className="about-check">
                      <ShieldCheck size={12} />
                    </span>
                    Real-time stock visibility
                  </li>
                  <li>
                    <span className="about-check">
                      <ShieldCheck size={12} />
                    </span>
                    Zero pre-payment — pay at the stall
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STATS BAR
      ========================================================= */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="about-stat">
                  <div className="about-stat-icon">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <div className="about-stat-content">
                    <span className="about-stat-value">{stat.value}</span>
                    <span className="about-stat-label">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          VALUES
      ========================================================= */}
      <section className="about-values-section">
        <div className="container">
          <div className="about-section-header">
            <span className="about-eyebrow">What We Stand For</span>
            <h2 className="about-section-title">Our Core Values</h2>
            <p className="about-section-subtitle">
              Three principles guide everything we build and every decision we
              make on behalf of farmers and shoppers.
            </p>
          </div>

          <div className="about-values-grid">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="about-value-card">
                  <div className="about-value-icon">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h3 className="about-value-title">{value.title}</h3>
                  <p className="about-value-text">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="about-how-section">
        <div className="container">
          <div className="about-section-header">
            <span className="about-eyebrow">How It Works</span>
            <h2 className="about-section-title">Three Steps, Zero Friction</h2>
            <p className="about-section-subtitle">
              From discovery to pickup, the whole journey is designed to be
              simple for both sides of the market stall.
            </p>
          </div>

          <div className="about-how-grid">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="about-how-card">
                  <span className="about-how-number">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="about-how-icon">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h3 className="about-how-title">{step.title}</h3>
                  <p className="about-how-text">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
{/* =========================================================
    CTA — plain hero style
========================================================= */}
<section className="about-cta-section">
  <div className="container">
    <div className="about-cta-inner">
      <span className="about-cta-badge">
        <Sparkles size={13} />
        Ready When You Are
      </span>

      <h2 className="about-cta-title">
        Ready to taste the difference?
      </h2>

      <p className="about-cta-text">
        Discover fresh produce from farmers near you — or join MarketLink
        as a grower and reach more customers.
      </p>

      <div className="about-cta-actions">
        <Link to="/products" className="about-btn about-btn-primary">
          Browse Products
          <ArrowRight size={15} />
        </Link>
        <Link
          to="/register/farmer"
          className="about-btn about-btn-outline"
        >
          Register as Farmer
        </Link>
      </div>
    </div>
  </div>
</section>

      <Footer />
    </div>
  );
};

export default AboutPage;
