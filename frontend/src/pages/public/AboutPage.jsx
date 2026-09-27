import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

  // ==================== ANIMATION VARIANTS ====================
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const slideRight = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const cardPop = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        delay: i * 0.12,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const floatingDecoration = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div className="about-page">
      <Navbar />

      {/* =========================================================
          PAGE HERO
      ========================================================= */}
      <center>
        <section className="about-hero">
          <motion.div
            className="about-hero-decoration about-hero-decoration-one"
            variants={floatingDecoration}
            animate="animate"
          />
          <motion.div
            className="about-hero-decoration about-hero-decoration-two"
            variants={floatingDecoration}
            animate="animate"
            transition={{ duration: 7, delay: 1 }}
          />

          <div className="container">
            <motion.div
              className="about-hero-content"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="about-page-tag">
                <motion.span
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  style={{ display: "inline-flex" }}
                >
                  <Sparkles size={13} />
                </motion.span>
                About MarketLink
              </motion.span>

              <motion.h1 variants={fadeUp} className="about-page-title">
                Bridging Farmers
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  {" "}and Community
                </motion.span>
              </motion.h1>

              <motion.p variants={fadeUp} className="about-page-subtitle">
                MarketLink connects local growers with the people who love their
                food — making farmers markets more predictable, personal, and
                convenient for everyone.
              </motion.p>
            </motion.div>
          </div>
        </section>
      </center>

      {/* =========================================================
          MISSION / STORY
      ========================================================= */}
      <section className="about-story-section">
        <div className="container">
          <div className="about-story-grid">
            {/* Content slides from left */}
            <motion.div
              className="about-story-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideLeft}
            >
              <motion.span
                className="about-eyebrow"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Our Story
              </motion.span>

              <motion.h2
                className="about-story-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                Why we built MarketLink
              </motion.h2>

              {[
                "Local farmers markets are growing in popularity as shoppers look for fresh, seasonal, and locally grown produce. But customers rarely know in advance which farmers will be at a market on a given day, what stock they have, or at what price.",
                "MarketLink was created to solve this problem. We provide a unified platform where farmers publish their weekly stock and pricing, while customers discover nearby markets, browse available products, and reserve items for pickup.",
                "Our mission is to strengthen the connection between local producers and their community by making farmers markets more convenient, predictable, and personal.",
              ].map((text, i) => (
                <motion.p
                  key={i}
                  className="about-story-text"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
                >
                  {text}
                </motion.p>
              ))}

              <motion.div
                className="about-story-actions"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to="/products" className="about-btn about-btn-primary">
                    Browse Products
                    <ArrowRight size={15} />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to="/markets" className="about-btn about-btn-outline">
                    Find a Market
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Visual slides from right */}
            <motion.div
              className="about-story-visual"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideRight}
            >
              <motion.div
                className="about-visual-card"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="about-visual-icon"
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Leaf size={28} strokeWidth={1.6} />
                </motion.div>

                <h3 className="about-visual-title">Fresh. Local. Yours.</h3>
                <p className="about-visual-text">
                  Every basket you reserve supports a grower in your community —
                  and brings home food that was picked this week, not last
                  month.
                </p>

                <ul className="about-visual-list">
                  {[
                    "Verified independent growers only",
                    "Real-time stock visibility",
                    "Zero pre-payment — pay at the stall",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.12 }}
                    >
                      <motion.span
                        className="about-check"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <ShieldCheck size={12} />
                      </motion.span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STATS BAR
      ========================================================= */}
      <section className="about-stats-section">
        <div className="container">
          <motion.div
            className="about-stats-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  className="about-stat"
                  variants={cardPop}
                  custom={idx}
                  whileHover={{ y: -6, scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="about-stat-icon"
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Icon size={20} strokeWidth={1.8} />
                  </motion.div>
                  <div className="about-stat-content">
                    <motion.span
                      className="about-stat-value"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2 + idx * 0.1,
                        type: "spring",
                        stiffness: 260,
                      }}
                    >
                      {stat.value}
                    </motion.span>
                    <span className="about-stat-label">{stat.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          VALUES
      ========================================================= */}
      <section className="about-values-section">
        <div className="container">
          <motion.div
            className="about-section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="about-eyebrow">
              What We Stand For
            </motion.span>
            <motion.h2 variants={fadeUp} className="about-section-title">
              Our Core Values
            </motion.h2>
            <motion.p variants={fadeUp} className="about-section-subtitle">
              Three principles guide everything we build and every decision we
              make on behalf of farmers and shoppers.
            </motion.p>
          </motion.div>

          <motion.div
            className="about-values-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  className="about-value-card"
                  variants={cardPop}
                  custom={idx}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 18px 40px rgba(0, 0, 0, 0.10)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <motion.div
                    className="about-value-icon"
                    whileHover={{ rotate: -10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </motion.div>
                  <h3 className="about-value-title">{value.title}</h3>
                  <p className="about-value-text">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="about-how-section">
        <div className="container">
          <motion.div
            className="about-section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="about-eyebrow">
              How It Works
            </motion.span>
            <motion.h2 variants={fadeUp} className="about-section-title">
              Three Steps, Zero Friction
            </motion.h2>
            <motion.p variants={fadeUp} className="about-section-subtitle">
              From discovery to pickup, the whole journey is designed to be
              simple for both sides of the market stall.
            </motion.p>
          </motion.div>

          <motion.div
            className="about-how-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  className="about-how-card"
                  variants={cardPop}
                  custom={idx}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 18px 40px rgba(0, 0, 0, 0.10)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <motion.span
                    className="about-how-number"
                    initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + idx * 0.12,
                      type: "spring",
                      stiffness: 220,
                      damping: 14,
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </motion.span>
                  <motion.div
                    className="about-how-icon"
                    whileHover={{ rotate: 10, scale: 1.12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </motion.div>
                  <h3 className="about-how-title">{step.title}</h3>
                  <p className="about-how-text">{step.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          CTA — plain hero style
      ========================================================= */}
      <section className="about-cta-section">
        <div className="container">
          <motion.div
            className="about-cta-inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="about-cta-badge">
              <motion.span
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                style={{ display: "inline-flex" }}
              >
                <Sparkles size={13} />
              </motion.span>
              Ready When You Are
            </motion.span>

            <motion.h2 variants={fadeUp} className="about-cta-title">
              Ready to taste the difference?
            </motion.h2>

            <motion.p variants={fadeUp} className="about-cta-text">
              Discover fresh produce from farmers near you — or join MarketLink
              as a grower and reach more customers.
            </motion.p>

            <motion.div variants={fadeUp} className="about-cta-actions">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                <Link to="/products" className="about-btn about-btn-primary">
                  Browse Products
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  to="/register/farmer"
                  className="about-btn about-btn-outline"
                >
                  Register as Farmer
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;