import React, { useState, useEffect, useContext } from 'react'; 
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Star,
  Users,
  Package,
  TrendingUp,
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/common/ProductCard';
import FarmerCard from '../../components/common/FarmerCard';
import Loader from '../../components/common/Loader';
import { productApi, farmerApi, marketApi } from '../../api';
import {
  heroMarket3DImg,
  basketHarvest3DImg,
  iconProduce3D,
  iconMarket3D,
  iconPickup3D,
  iconHoney3D,
} from '../../assets/images';
import '../../styles/home.css';
import { AuthContext } from '../../context/AuthContext'; 

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);       
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredFarmers, setFeaturedFarmers] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const days = ['All Days', 'Wednesday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, farmersRes, marketsRes] = await Promise.all([
          productApi.getAll({ per_page: 8, is_available: true }),
          farmerApi.getAll(),
          marketApi.getAll(),
        ]);

        setFeaturedProducts(productsRes.data || productsRes || []);
        setFeaturedFarmers(Array.isArray(farmersRes) ? farmersRes.slice(0, 4) : []);
        setMarkets(Array.isArray(marketsRes) ? marketsRes.slice(0, 3) : []);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Framer Motion animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const quickHighlights = [
    {
      title: 'Fresh Harvest',
      subtitle: 'Dawn picked greens',
      icon: iconProduce3D,
      to: '/products',
    },
    {
      title: 'Local Markets',
      subtitle: '3 Regional hubs',
      icon: iconMarket3D,
      to: '/markets',
    },
    {
      title: 'Artisan Goods',
      subtitle: 'Honey & sourdough',
      icon: iconHoney3D,
      to: '/products',
    },
    {
      title: 'Zero Risk Pickup',
      subtitle: 'Pay cash at stall',
      icon: iconPickup3D,
      to: '/how-it-works',
    },
  ];

  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Browse & Discover',
      description:
        'Explore nearby markets and farmers. Browse fresh produce, dairy, baked goods and more.',
    },
    {
      number: '02',
      icon: ShoppingBasket,
      title: 'Pre-Order',
      description:
        'Add items to your basket and reserve them for pickup. Choose your pickup date and time slot.',
    },
    {
      number: '03',
      icon: Store,
      title: 'Pickup & Enjoy',
      description:
        'Visit the market, collect your pre-ordered items, and pay in person. Fresh and ready for you.',
    },
  ];

  return (
    <div className="home-page">
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section className="hero-section">
        {/* Full-bleed background image */}
        <div className="hero-bg">
          <img
            src={heroMarket3DImg}
            alt="MarketLink farmers market"
            className="hero-bg-img"
          />
          <div className="hero-bg-overlay" />
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
              <motion.span variants={fadeUp} className="hero-badge">
                <Leaf size={14} />
                Farm Fresh Just a Click Away
              </motion.span>

              <motion.h1 variants={fadeUp} className="hero-title">
                Connect with Local Farmers,
                <br />
                <span className="hero-title-accent">Fresh from the Market</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="hero-subtitle">
                Connect directly with verified local farmers in your valley.
                Reserve your weekly seasonal harvest before market day and
                collect your basket at the stall with zero pre-payment required.
              </motion.p>

              {/* Search Bar */}
              <motion.div variants={fadeUp} className="hero-search-wrapper">
                <div className="hero-search">
                  <div className="hero-search-input-row">
                    <Search size={18} className="hero-search-icon" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search heirloom tomatoes, honey, sourdough..."
                      className="hero-search-input"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="hero-search-clear"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="hero-search-days">
                    <span className="hero-search-days-label">
                      <Calendar size={13} />
                      Market Day:
                    </span>
                    {days.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDay(d === 'All Days' ? '' : d)}
                        className={`hero-day-btn ${
                          (d === 'All Days' && !selectedDay) || selectedDay === d
                            ? 'active'
                            : ''
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Proof Points */}
              <motion.div variants={fadeUp} className="hero-proof">
                <div className="hero-proof-item">
                  <ShieldCheck size={16} />
                  <span>Verified Independent Growers</span>
                </div>
                <span className="hero-proof-divider">·</span>
                <div className="hero-proof-item">
                  <Clock size={16} />
                  <span>Real-Time Stock Visibility</span>
                </div>
                <span className="hero-proof-divider">·</span>
                <div className="hero-proof-item">
                  <MapPin size={16} />
                  <span>OpenStreetMap Coordinates</span>
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT — Hero Visual Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="hero-right"
            >
              <div className="hero-visual-card">
                <img
                  src={basketHarvest3DImg}
                  alt="Organic farm fresh harvest basket"
                  className="hero-visual-img"
                />
                <div className="hero-visual-overlay" />
                <div className="hero-visual-content">
                  <span className="hero-visual-tag">Featured Stall</span>
                  <h3 className="hero-visual-title">
                    Pick Up at Greenfield Market
                  </h3>
                  <p className="hero-visual-subtitle">
                    Wednesday & Saturday Mornings · Pay cash or scan at stall
                  </p>
                </div>
              </div>
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
              <motion.div key={idx} variants={fadeUp}>
                <Link to={item.to} className="hero-highlight-card">
                  <div className="hero-highlight-icon">
                    <img src={item.icon} alt={item.title} />
                  </div>
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
              From browsing to pickup, we've made it easy to support local farmers.
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
                  variants={fadeUp}
                  className="step-card"
                >
                  <span className="step-number">{step.number}</span>
                  <div className="step-icon">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
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
          {/* ...header unchanged... */}

          {loading ? (
            <Loader message="Loading products..." />
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  isLoggedIn={isAuthenticated}          // ← pass down
                />
              ))}
            </div>
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
            <motion.div variants={fadeUp}>
              <Link to="/farmers" className="view-all-link">
                View All <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>

          {loading ? (
            <Loader message="Loading farmers..." />
          ) : (
            <div className="farmers-grid">
              {featuredFarmers.map((farmer) => (
                <FarmerCard key={farmer.farmer_id} farmer={farmer} />
              ))}
            </div>
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
              { icon: Users, value: `${featuredFarmers.length || 120}+`, label: 'Local Farmers' },
              { icon: MapPin, value: `${markets.length || 12}+`, label: 'Markets' },
              { icon: Package, value: `${featuredProducts.length || 480}+`, label: 'Fresh Products' },
              { icon: TrendingUp, value: '98%', label: 'Pickup Rate' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div key={idx} variants={fadeUp} className="trust-item">
                  <div className="trust-icon">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <div className="trust-content">
                    <span className="trust-value">{stat.value}</span>
                    <span className="trust-label">{stat.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
     {/* ==================== FARMER CTA (plain hero style) ==================== */}
<section className="farmer-cta-section">
  <div className="container">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger}
      className="farmer-cta-content"
    >
      <motion.span variants={fadeUp} className="farmer-cta-badge">
        <Tractor size={14} />
        For Farmers
      </motion.span>

      <motion.h2 variants={fadeUp} className="farmer-cta-title">
        Are You a Local Farmer?
      </motion.h2>

      <motion.p variants={fadeUp} className="farmer-cta-description">
        Join MarketLink to reach more customers, manage your weekly stock,
        and accept pre-orders. Grow your farm business with us.
      </motion.p>

      <motion.div variants={fadeUp} className="farmer-cta-actions">
        <Link to="/register/farmer" className="btn-farmer-cta">
          Register as Farmer <ArrowRight size={16} />
        </Link>
        <Link to="/about" className="btn-farmer-cta-outline">
          Learn More
        </Link>
      </motion.div>
    </motion.div>
  </div>
</section>
      <Footer />
    </div>
  );
};

export default HomePage;