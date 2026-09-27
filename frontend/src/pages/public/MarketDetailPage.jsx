import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Clock,
  Navigation,
  ArrowRight,
  Users,
  ChevronRight,
} from 'lucide-react';

import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import FarmerCard from '../../components/common/FarmerCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import MapView from '../../components/common/MapView';
import { marketApi, farmerApi } from '../../api';

import '../../styles/home.css';
import '../../styles/markets.css';

const operatingDaysString = (market) => {
  if (!market || typeof market.operating_days !== 'string') return '';

  return market.operating_days
    .split(',')
    .map((day) => day.trim())
    .filter(Boolean)
    .join(', ');
};

const MarketDetailPage = () => {
  const { id } = useParams();

  const [market, setMarket] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marketRes, farmersRes] = await Promise.all([
          marketApi.getById(id),
          farmerApi.getAll(),
        ]);

        setMarket(marketRes);

        const allFarmers = Array.isArray(farmersRes) ? farmersRes : [];

        setFarmers(
          allFarmers.filter((farmer) => farmer.market_id === Number(id)),
        );
      } catch (error) {
        console.error('Error fetching market:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ==================== ANIMATION VARIANTS ====================
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  if (loading) {
    return (
      <div className="market-detail-page">
        <Navbar />
        <Loader fullScreen message="Loading market..." />
      </div>
    );
  }

  if (!market) {
    return (
      <div className="market-detail-page">
        <Navbar />

        <main className="market-detail-empty-page">
          <div className="container">
            <EmptyState
              icon="exclamation-circle"
              title="Market Not Found"
              message="The market you're looking for doesn't exist."
              actionText="Back to Markets"
              onAction={() => window.history.back()}
            />
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const hasCoordinates =
    market.latitude !== null &&
    market.latitude !== undefined &&
    market.longitude !== null &&
    market.longitude !== undefined;

  const latitude = hasCoordinates ? parseFloat(market.latitude) : null;
  const longitude = hasCoordinates ? parseFloat(market.longitude) : null;

  return (
    <div className="market-detail-page">
      <Navbar />

      {/* HERO */}
      <section className="market-detail-hero">
        <div className="container">
          <div className="market-detail-hero-inner">
            <motion.nav
              className="market-breadcrumb"
              aria-label="Breadcrumb"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.span variants={fadeUp}>
                <Link to="/">Home</Link>
              </motion.span>

              <motion.span variants={fadeUp}>
                <ChevronRight size={14} />
              </motion.span>

              <motion.span variants={fadeUp}>
                <Link to="/markets">Markets</Link>
              </motion.span>

              <motion.span variants={fadeUp}>
                <ChevronRight size={14} />
              </motion.span>

              <motion.span variants={fadeUp}>{market.market_name}</motion.span>
            </motion.nav>

            <motion.div
              className="market-hero-label"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.span
                className="market-hero-label-dot"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [1, 0.6, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              Market Location
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {market.market_name}
            </motion.h1>

            <motion.div
              className="market-hero-location"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.span
                className="market-hero-location-icon"
                whileHover={{ rotate: -10, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin size={17} />
              </motion.span>

              <span>{market.address}</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="content-section markets-content">
        <div className="container">
          <div className="market-detail-layout">
            {/* MAIN COLUMN */}
            <div className="market-detail-main">
              {/* Market Information */}
              <motion.section
                className="market-info-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
              >
                <motion.div
                  className="market-section-heading"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                >
                  <motion.div variants={fadeUp}>
                    <span className="market-section-eyebrow">
                      About this location
                    </span>
                    <h2>Market Information</h2>
                  </motion.div>

                  <motion.div
                    className="market-status-badge"
                    variants={fadeUp}
                  >
                    <motion.span
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [1, 0.6, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    Active Market
                  </motion.div>
                </motion.div>

                <motion.div
                  className="market-info-grid"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                >
                  {market.operating_days && (
                    <motion.div
                      className="market-info-item"
                      variants={fadeUp}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.25 }}
                    >
                      <motion.div
                        className="market-info-icon"
                        whileHover={{ rotate: -10, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Calendar size={19} />
                      </motion.div>

                      <div className="market-info-content">
                        <span className="market-info-label">
                          Operating Days
                        </span>

                        <strong>{operatingDaysString(market)}</strong>
                      </div>
                    </motion.div>
                  )}

                  {market.timings && (
                    <motion.div
                      className="market-info-item"
                      variants={fadeUp}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.25 }}
                    >
                      <motion.div
                        className="market-info-icon"
                        whileHover={{ rotate: -10, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Clock size={19} />
                      </motion.div>

                      <div className="market-info-content">
                        <span className="market-info-label">
                          Pickup Hours
                        </span>

                        <strong>{market.timings}</strong>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    className="market-info-item market-info-item--full"
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25 }}
                  >
                    <motion.div
                      className="market-info-icon"
                      whileHover={{ rotate: -10, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MapPin size={19} />
                    </motion.div>

                    <div className="market-info-content">
                      <span className="market-info-label">
                        Market Address
                      </span>

                      <strong>{market.address}</strong>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="market-detail-actions"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                >
                  <motion.div
                    variants={fadeUp}
                    whileHover={{ scale: 1.04, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={`/products?market=${market.market_id}`}
                      className="market-primary-button"
                    >
                      <span>Browse Produce</span>
                      <motion.span
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'inline-flex' }}
                      >
                        <ArrowRight size={17} />
                      </motion.span>
                    </Link>
                  </motion.div>

                  {hasCoordinates && (
                    <motion.a
                      variants={fadeUp}
                      href={`https://www.google.com/maps/search/?api=1&query=${market.latitude},${market.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="market-secondary-button"
                      whileHover={{ scale: 1.04, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.span
                        whileHover={{ rotate: -15 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'inline-flex' }}
                      >
                        <Navigation size={16} />
                      </motion.span>
                      <span>Get Directions</span>
                    </motion.a>
                  )}
                </motion.div>
              </motion.section>

              {/* Farmers */}
              {farmers.length > 0 && (
                <motion.section
                  className="market-farmers-section"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={stagger}
                >
                  <motion.div
                    className="market-section-heading market-section-heading--farmers"
                    variants={fadeUp}
                  >
                    <div>
                      <span className="market-section-eyebrow">
                        Local producers
                      </span>

                      <h2>Farmers at this Market</h2>

                      <p>
                        Meet verified growers with scheduled pickup stalls at
                        this location.
                      </p>
                    </div>

                    <motion.div
                      className="market-farmers-count"
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: 0.3,
                        type: 'spring',
                        stiffness: 260,
                      }}
                    >
                      <Users size={15} />
                      <strong>{farmers.length}</strong>
                      <span>
                        {farmers.length === 1 ? 'farmer' : 'farmers'}
                      </span>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="market-farmers-grid"
                    variants={stagger}
                  >
                    {farmers.map((farmer, i) => (
                      <motion.div
                        className="market-farmer-card"
                        key={farmer.farmer_id}
                        variants={fadeUp}
                        custom={i}
                      >
                        <FarmerCard farmer={farmer} />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.section>
              )}
            </div>

            {/* SIDEBAR */}
            <motion.aside
              className="market-detail-sidebar"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideRight}
            >
              {hasCoordinates && (
                <motion.section
                  className="market-location-card"
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="market-location-header">
                    <div>
                      <span className="market-section-eyebrow">Find us</span>
                      <h3>Market Location</h3>
                    </div>

                    <motion.div
                      className="market-location-icon"
                      whileHover={{ rotate: -10, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        style={{ display: 'inline-flex' }}
                      >
                        <Navigation size={16} />
                      </motion.span>
                    </motion.div>
                  </div>

                  <div className="market-map-container">
                    <MapView
                      latitude={latitude}
                      longitude={longitude}
                      height="320px"
                      zoom={15}
                    />
                  </div>

                  <motion.div
                    className="market-location-footer"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                  >
                    <motion.div variants={fadeUp}>
                      <span>Latitude</span>
                      <strong>{latitude.toFixed(5)}</strong>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                      <span>Longitude</span>
                      <strong>{longitude.toFixed(5)}</strong>
                    </motion.div>
                  </motion.div>

                  <motion.a
                    href={`https://www.google.com/maps/search/?api=1&query=${market.latitude},${market.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="market-map-button"
                    whileHover={{ scale: 1.04, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.span
                      whileHover={{ rotate: -15 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'inline-flex' }}
                    >
                      <Navigation size={15} />
                    </motion.span>
                    Open in Google Maps
                  </motion.a>
                </motion.section>
              )}

              <motion.section
                className="market-sidebar-note"
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="market-sidebar-note-icon"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Users size={17} />
                </motion.div>

                <div>
                  <strong>Shop local</strong>

                  <p>
                    Discover fresh produce directly from farmers selling at
                    this pickup location.
                  </p>
                </div>
              </motion.section>
            </motion.aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MarketDetailPage;