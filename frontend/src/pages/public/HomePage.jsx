import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  Clock,
  ArrowRight,
  ShoppingBasket,
  Store,
  Tractor,
  Leaf,
  Users,
  Package,
  TrendingUp,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import ProductCard from "../../components/common/ProductCard";
import FarmerCard from "../../components/common/FarmerCard";
import Loader from "../../components/common/Loader";
import { productApi, farmerApi, marketApi } from "../../api";
import {
  heroMarket3DImg,
  basketHarvest3DImg,
  iconProduce3D,
  iconMarket3D,
  iconPickup3D,
  iconHoney3D,
} from "../../assets/images";
import "../../styles/home.css";
import { AuthContext } from "../../context/AuthContext";
import {
  SkeletonProductGrid,
  SkeletonFarmerGrid,
} from "../../components/common/SkeletonCard";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isFarmer, isCustomer, isAdmin } =
    useContext(AuthContext);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredFarmers, setFeaturedFarmers] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const days = ["All Days", "Wednesday", "Friday", "Saturday", "Sunday"];

  const [stats, setStats] = useState({
    farmers: 0,
    markets: 0,
    products: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, farmersRes, marketsRes] = await Promise.all([
          productApi.getAll({ per_page: 8, is_available: true }),
          farmerApi.getAll(),
          marketApi.getAll(),
        ]);

        const data = productsRes.data || productsRes;
        const productsList = Array.isArray(data) ? data : [];
        setFeaturedProducts(productsList);

        const farmersList = Array.isArray(farmersRes) ? farmersRes : [];
        setFeaturedFarmers(farmersList.slice(0, 4));

        const marketsList = Array.isArray(marketsRes) ? marketsRes : [];
        setMarkets(marketsList.slice(0, 3));

        setStats({
          products:
            productsRes.meta?.total ||
            productsRes.total ||
            productsList.length,
          farmers: farmersList.length,
          markets: marketsList.length,
        });
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ============================================================
  // HERO SEARCH → navigate to /products with filters
  // ============================================================
  const handleHeroSearch = () => {
    const params = new URLSearchParams();
    const q = searchQuery.trim();
    if (q) params.set("search", q);
    if (selectedDay) params.set("market_day", selectedDay);

    const qs = params.toString();
    navigate(qs ? `/products?${qs}` : "/products");
  };

  const handleDayClick = (d) => {
    const day = d === "All Days" ? "" : d;
    setSelectedDay(day);
  };

  // ==================== ANIMATION VARIANTS ====================
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const cardPop = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: i * 0.12,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const hoverLift = {
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" },
  };

  const quickHighlights = [
    {
      title: "Fresh Harvest",
      subtitle: "Dawn picked greens",
      icon: iconProduce3D,
      to: "/products",
    },
    {
      title: "Local Markets",
      subtitle: "Regional hubs",
      icon: iconMarket3D,
      to: "/markets",
    },
    {
      title: "Artisan Goods",
      subtitle: "Honey & sourdough",
      icon: iconHoney3D,
      to: "/products",
    },
    {
      title: "Zero Risk Pickup",
      subtitle: "Pay cash at stall",
      icon: iconPickup3D,
      to: "/about",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Browse & Discover",
      description:
        "Explore nearby markets and farmers. Browse fresh produce, dairy, baked goods and more.",
    },
    {
      number: "02",
      icon: ShoppingBasket,
      title: "Pre-Order",
      description:
        "Add items to your basket and reserve them for pickup. Choose your pickup date and time slot.",
    },
    {
      number: "03",
      icon: Store,
      title: "Pickup & Enjoy",
      description:
        "Visit the market, collect your pre-ordered items, and pay in person. Fresh and ready for you.",
    },
  ];

  return (
    <div className="home-page">
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section className="hero-section">
        <div className="hero-bg">
          <motion.img
            src={heroMarket3DImg}
            alt="MarketLink farmers market"
            className="hero-bg-img"
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="hero-bg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>

        <div className="hero-container">
          <div className="hero-grid">
            {/* LEFT — Value Proposition + Search */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="hero-left"
            >
              <motion.span variants={slideLeft} className="hero-badge">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  style={{ display: "inline-flex" }}
                >
                  <Leaf size={14} />
                </motion.span>
                Farm Fresh Just a Click Away
              </motion.span>

              <motion.h1 variants={slideLeft} className="hero-title">
                Connect with Local Farmers,
                <br />
                <motion.span
                  className="hero-title-accent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Fresh from the Market
                </motion.span>
              </motion.h1>

              <motion.p variants={slideLeft} className="hero-subtitle">
                Connect directly with verified local farmers in your valley.
                Reserve your weekly seasonal harvest before market day and
                collect your basket at the stall with zero pre-payment required.
              </motion.p>

              {/* Search Bar */}
              <motion.div variants={fadeUp} className="hero-search-wrapper">
                <motion.div
                  className="hero-search"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="hero-search-input-row">
                    <Search size={18} className="hero-search-icon" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleHeroSearch();
                        }
                      }}
                      placeholder="Search heirloom tomatoes, honey, sourdough..."
                      className="hero-search-input"
                    />
                    <AnimatePresence>
                      {searchQuery && (
                        <motion.button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="hero-search-clear"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          Clear
                        </motion.button>
                      )}
                    </AnimatePresence>

                    {/* Submit button */}
                    <motion.button
                      type="button"
                      className="hero-search-submit"
                      onClick={handleHeroSearch}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Search products"
                      title="Search"
                    >
                      <Search size={16} />
                    </motion.button>
                  </div>

                  <div className="hero-search-days">
                    <span className="hero-search-days-label">
                      <Calendar size={13} />
                      Market Day:
                    </span>
                    {days.map((d, i) => (
                      <motion.button
                        key={d}
                        type="button"
                        onClick={() => handleDayClick(d)}
                        className={`hero-day-btn ${
                          (d === "All Days" && !selectedDay) ||
                          selectedDay === d
                            ? "active"
                            : ""
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + i * 0.05, duration: 0.4 }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {d}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Proof Points */}
              <motion.div variants={fadeUp} className="hero-proof">
                <motion.div
                  className="hero-proof-item"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <ShieldCheck size={16} />
                  <span>Verified Independent Growers</span>
                </motion.div>
                <span className="hero-proof-divider">·</span>
                <motion.div
                  className="hero-proof-item"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Clock size={16} />
                  <span>Real-Time Stock Visibility</span>
                </motion.div>
                <span className="hero-proof-divider">·</span>
                <motion.div
                  className="hero-proof-item"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <MapPin size={16} />
                  <span>OpenStreetMap Coordinates</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* RIGHT — Hero Visual Card */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              className="hero-right"
            >
              <motion.div
                className="hero-visual-card"
                whileHover={{ scale: 1.02, rotate: -0.5 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <img
                  src={basketHarvest3DImg}
                  alt="Organic farm fresh harvest basket"
                  className="hero-visual-img"
                />
                <div className="hero-visual-overlay" />
                <div className="hero-visual-content">
                  <motion.span
                    className="hero-visual-tag"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    Featured Stall
                  </motion.span>
                  <motion.h3
                    className="hero-visual-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  >
                    Pick Up at Greenfield Market
                  </motion.h3>
                  <motion.p
                    className="hero-visual-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    Wednesday & Saturday Mornings · Pay cash or scan at stall
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Quick Highlights */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="hero-highlights"
          >
            {quickHighlights.map((item, idx) => (
              <motion.div key={idx} variants={cardPop} custom={idx}>
                <Link to={item.to} className="hero-highlight-card">
                  <motion.div
                    className="hero-highlight-icon"
                    whileHover={{ rotate: -8, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <img src={item.icon} alt={item.title} />
                  </motion.div>
                  <div className="hero-highlight-content">
                    <h4>{item.title}</h4>
                    <p>{item.subtitle}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="how-it-works-section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="section-header"
          >
            <motion.span variants={fadeUp} className="section-tag">
              How It Works
            </motion.span>
            <motion.h2 variants={fadeUp} className="section-title">
              Fresh Food in Three Simple Steps
            </motion.h2>
            <motion.p variants={fadeUp} className="section-subtitle">
              From browsing to pickup, we've made it easy to support local
              farmers.
            </motion.p>
          </motion.div>

          <div className="steps-grid">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  custom={idx}
                  variants={cardPop}
                  whileHover={hoverLift}
                  className="step-card"
                >
                  <motion.span
                    className="step-number"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + idx * 0.12, duration: 0.5 }}
                  >
                    {step.number}
                  </motion.span>
                  <motion.div
                    className="step-icon"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </motion.div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="featured-products-section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="section-header-row"
          >
            <div>
              <motion.span variants={fadeUp} className="section-tag">
                Fresh Picks
              </motion.span>
              <motion.h2 variants={fadeUp} className="section-title">
                Featured Products
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} whileHover={{ x: 6 }}>
              <Link to="/products" className="view-all-link">
                View All <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>

          {loading ? (
            <SkeletonProductGrid count={8} />
          ) : featuredProducts.length === 0 ? (
            <p className="no-data-message">No products available yet.</p>
          ) : (
            <motion.div
              className="products-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
            >
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.product_id}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard
                    product={product}
                    isLoggedIn={isAuthenticated}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ==================== FEATURED FARMERS ==================== */}
      <section className="featured-farmers-section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="section-header-row"
          >
            <div>
              <motion.span variants={fadeUp} className="section-tag">
                Meet Your Farmers
              </motion.span>
              <motion.h2 variants={fadeUp} className="section-title">
                Local Farmers Near You
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} whileHover={{ x: 6 }}>
              <Link to="/farmers" className="view-all-link">
                View All <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
          {loading ? (
            <SkeletonFarmerGrid count={4} />
          ) : featuredFarmers.length === 0 ? (
            <p className="no-data-message">No farmers registered yet.</p>
          ) : (
            <motion.div className="farmers-grid" initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}>
              {featuredFarmers.map((farmer, i) => (
                <motion.div key={farmer.farmer_id}  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}>
                  <FarmerCard farmer={farmer} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ==================== TRUST BAR / STATS ==================== */}
      <section className="trust-section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="trust-grid"
          >
            {[
              {
                icon: Users,
                value: stats.farmers,
                label: "Local Farmers",
              },
              {
                icon: MapPin,
                value: stats.markets,
                label: "Markets",
              },
              {
                icon: Package,
                value: stats.products,
                label: "Fresh Products",
              },
              {
                icon: TrendingUp,
                value: "Cash on Pickup",
                label: "Zero Pre-Payment",
                isText: true,
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={cardPop}
                  custom={idx}
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="trust-item"
                >
                  <motion.div
                    className="trust-icon"
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Icon size={20} strokeWidth={1.8} />
                  </motion.div>
                  <div className="trust-content">
                    <motion.span
                      className={`trust-value ${
                        stat.isText ? "trust-value-text" : ""
                      }`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                    >
                      {stat.isText
                        ? stat.value
                        : stat.value >= 10
                        ? `${stat.value}+`
                        : stat.value}
                    </motion.span>
                    <span className="trust-label">{stat.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ==================== ROLE-AWARE CTA ==================== */}

      {/* GUEST — For Farmers CTA */}
      {!isAuthenticated && (
        <section className="farmer-cta-section">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
              className="farmer-cta-content"
            >
              <motion.span variants={cardPop} className="farmer-cta-badge">
                <motion.span
                  animate={{ x: [0, 4, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  style={{ display: "inline-flex" }}
                >
                  <Tractor size={14} />
                </motion.span>
                For Farmers
              </motion.span>

              <motion.h2 variants={fadeUp} className="farmer-cta-title">
                Are You a Local Farmer?
              </motion.h2>

              <motion.p variants={fadeUp} className="farmer-cta-description">
                Join MarketLink to reach more customers, manage your weekly
                stock, and accept pre-orders. Grow your farm business with us.
              </motion.p>

              <motion.div variants={fadeUp} className="farmer-cta-actions">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link to="/register/farmer" className="btn-farmer-cta">
                    Register as Farmer <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link to="/about" className="btn-farmer-cta-outline">
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* FARMER — customer upsell */}
      {isFarmer && (
        <section className="farmer-cta-section">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
              className="farmer-cta-content"
            >
              <motion.span variants={cardPop} className="farmer-cta-badge">
                <motion.span
                  animate={{ x: [0, 4, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  style={{ display: "inline-flex" }}
                >
                  <ShoppingBasket size={14} />
                </motion.span>
                For Customers
              </motion.span>

              <motion.h2 variants={fadeUp} className="farmer-cta-title">
                Want to Shop as a Customer?
              </motion.h2>

              <motion.p variants={fadeUp} className="farmer-cta-description">
                You're registered as a farmer. Create a customer account to
                browse and pre-order fresh produce from other local farmers
                near you.
              </motion.p>

              <motion.div variants={fadeUp} className="farmer-cta-actions">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link to="/register" className="btn-farmer-cta">
                    Register as Customer <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link to="/products" className="btn-farmer-cta-outline">
                    Browse Products
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CUSTOMER — next order CTA */}
      {isCustomer && (
        <section className="farmer-cta-section">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
              className="farmer-cta-content"
            >
              <motion.span variants={cardPop} className="farmer-cta-badge">
                <motion.span
                  animate={{ x: [0, 4, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  style={{ display: "inline-flex" }}
                >
                  <ShoppingBasket size={14} />
                </motion.span>
                Your Basket
              </motion.span>

              <motion.h2 variants={fadeUp} className="farmer-cta-title">
                Ready for Your Next Fresh Order?
              </motion.h2>

              <motion.p variants={fadeUp} className="farmer-cta-description">
                Browse this week's seasonal harvest, reserve what you love, and
                pick up at the market. Zero pre-payment, pay cash at the stall.
              </motion.p>

              <motion.div variants={fadeUp} className="farmer-cta-actions">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link to="/products" className="btn-farmer-cta">
                    Browse Products <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link
                    to="/customer/orders"
                    className="btn-farmer-cta-outline"
                  >
                    My Orders
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;