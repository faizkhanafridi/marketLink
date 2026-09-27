import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Clock,
  Navigation,
  ArrowRight,
  LayoutGrid,
  Map as MapIcon,
  Users,
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import MapView from '../../components/common/MapView';
import { marketApi, farmerApi } from '../../api';
import '../../styles/home.css';
import '../../styles/markets.css';

const operatingDaysString = (m) => {
  if (!m || typeof m.operating_days !== 'string') return '';
  return m.operating_days
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean)
    .join(', ');
};

const MarketsPage = () => {
  const navigate = useNavigate();
  const [markets, setMarkets] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('directory');
  const [selectedMarketId, setSelectedMarketId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marketsRes, farmersRes] = await Promise.all([
          marketApi.getAll(),
          farmerApi.getAll(),
        ]);
        const mkts = Array.isArray(marketsRes) ? marketsRes : [];
        setMarkets(mkts);
        setFarmers(Array.isArray(farmersRes) ? farmersRes : []);
        if (mkts.length > 0) setSelectedMarketId(mkts[0].market_id);
      } catch (error) {
        console.error('Error fetching markets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeMarket =
    markets.find((m) => m.market_id === selectedMarketId) ?? markets[0];

  const marketFarmers = farmers.filter(
    (f) => f.market_id === activeMarket?.market_id
  );

  const handleBrowseProduce = (marketId) => {
    navigate(`/products?market=${marketId}`);
  };

  const handleOpenFarmer = (farmerId) => {
    navigate(`/farmers/${farmerId}`);
  };

  const mapMarkers = markets
    .filter((m) => m.latitude && m.longitude)
    .map((m) => ({
      latitude: parseFloat(m.latitude),
      longitude: parseFloat(m.longitude),
      title: m.market_name,
      address: m.address,
    }));

  // ==================== ANIMATION VARIANTS ====================
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
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
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const floatingDecoration = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: { duration: 0.25 },
    },
  };

  const farmerButtonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.45,
        delay: i * 0.07,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  if (loading) {
    return (
      <div className="markets-page">
        <Navbar />
        <Loader message="Loading markets..." />
        <Footer />
      </div>
    );
  }

  if (!markets || markets.length === 0) {
    return (
      <div className="markets-page">
        <Navbar />
        <section className="content-section markets-content">
          <div className="container">
            <EmptyState
              icon="store"
              title="No Markets Found"
              message="No markets available yet."
            />
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="markets-page">
      <Navbar />

      {/* Hero */}
      <center>
        <section className="markets-hero">
          <motion.div
            className="markets-hero-decoration markets-hero-decoration-one"
            variants={floatingDecoration}
            animate="animate"
          />
          <motion.div
            className="markets-hero-decoration markets-hero-decoration-two"
            variants={floatingDecoration}
            animate="animate"
            transition={{ duration: 7, delay: 1 }}
          />

          <div className="container">
            <motion.div
              className="markets-hero-content"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="markets-page-tag">
                <motion.i
                  className="fas fa-store"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
                Physical Pickup Hubs
              </motion.span>

              <motion.h1 variants={fadeUp} className="markets-page-title">
                Regional
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  {' '}Farmers Markets
                </motion.span>
              </motion.h1>

              <motion.p variants={fadeUp} className="markets-page-subtitle">
                Explore weekly market locations, operating schedules, and pickup
                points mapped with OpenStreetMap.
              </motion.p>
            </motion.div>
          </div>
        </section>
      </center>

      <section className="content-section markets-content">
        <div className="container">
          {/* Toolbar — view switcher */}
          <motion.div
            className="markets-toolbar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="markets-view-toggle">
              <motion.button
                type="button"
                className={`markets-view-btn ${
                  viewMode === 'directory' ? 'active' : ''
                }`}
                onClick={() => setViewMode('directory')}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <LayoutGrid size={14} />
                Directory
              </motion.button>
              <motion.button
                type="button"
                className={`markets-view-btn ${
                  viewMode === 'list' ? 'active' : ''
                }`}
                onClick={() => setViewMode('list')}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <MapIcon size={14} />
                List View
              </motion.button>
            </div>
          </motion.div>

          {/* View Mode Content */}
          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div
                key="map-view"
                className="md-map-viewer-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <MapView markers={mapMarkers} height="500px" zoom={11} />
              </motion.div>
            ) : (
              <motion.div
                key="directory-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* MAP SECTION HEADER */}
                <div className="md-map-section">
                  <div className="md-map-header">
                    <span className="md-map-title">
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        style={{ display: 'inline-flex' }}
                      >
                        <Navigation size={15} />
                      </motion.span>
                      <span>Interactive OpenStreetMap Geolocation</span>
                    </span>
                    <span className="md-map-hint">
                      Click marker or card to inspect pickup coordinates
                    </span>
                  </div>
                </div>

                {/* MARKETS GRID */}
                <motion.div
                  className="md-grid"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={stagger}
                >
                  {markets.map((market, i) => {
                    const isSelected =
                      market.market_id === activeMarket?.market_id;
                    const assigned = farmers.filter(
                      (f) => f.market_id === market.market_id
                    );
                    const cityLabel =
                      (market.address ?? '').split(',')[0] || 'Market Hub';

                    return (
                      <motion.article
                        key={market.market_id}
                        onClick={() => setSelectedMarketId(market.market_id)}
                        className={`md-card ${
                          isSelected ? 'md-card--selected' : ''
                        }`}
                        variants={cardVariants}
                        custom={i}
                        whileHover={{
                          y: -6,
                          boxShadow: '0 18px 40px rgba(0, 0, 0, 0.12)',
                          transition: { duration: 0.3 },
                        }}
                        whileTap={{ scale: 0.98 }}
                        animate={
                          isSelected
                            ? {
                                scale: [1, 1.015, 1],
                                transition: {
                                  duration: 0.5,
                                  ease: 'easeOut',
                                },
                              }
                            : {}
                        }
                      >
                        <div className="md-card-top">
                          <div className="md-card-meta">
                            <MapPin size={13} />
                            <span className="md-card-city">{cityLabel}</span>
                            <span className="md-card-sep">·</span>
                            <span className="md-card-stalls">
                              {assigned.length} Stalls
                            </span>
                          </div>
                          <h3 className="md-card-title">{market.market_name}</h3>
                        </div>

                        {market.description && (
                          <p className="md-card-desc">{market.description}</p>
                        )}

                        <div className="md-card-details">
                          <div className="md-card-detail">
                            <Calendar size={13} />
                            <span>
                              Operating Days:{' '}
                              <strong>
                                {operatingDaysString(market) || '—'}
                              </strong>
                            </span>
                          </div>
                          <div className="md-card-detail">
                            <Clock size={13} />
                            <span>
                              Pickup Hours:{' '}
                              <strong>{market.timings ?? '—'}</strong>
                            </span>
                          </div>
                          <div className="md-card-detail md-card-detail--addr">
                            <MapPin size={13} />
                            <span>{market.address ?? '—'}</span>
                          </div>
                        </div>

                        <div className="md-card-actions">
                          <motion.button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBrowseProduce(market.market_id);
                            }}
                            className="md-btn-browse"
                            whileHover={{ scale: 1.04, x: 3 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span>Browse Produce</span>
                            <motion.span
                              whileHover={{ x: 3 }}
                              transition={{ duration: 0.2 }}
                              style={{ display: 'inline-flex' }}
                            >
                              <ArrowRight size={13} />
                            </motion.span>
                          </motion.button>

                          <motion.a
                            href={`https://www.google.com/maps/search/?api=1&query=${market.latitude},${market.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="md-btn-directions"
                            title="Directions"
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Navigation size={13} />
                            <span>Directions</span>
                          </motion.a>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>

                {/* FARMERS AT SELECTED MARKET */}
                <AnimatePresence mode="wait">
                  {activeMarket && (
                    <motion.div
                      key={activeMarket.market_id}
                      className="md-farmers"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="md-farmers-header">
                        <div>
                          <h3 className="md-farmers-title">
                            Farmers at {activeMarket.market_name}
                          </h3>
                          <p className="md-farmers-subtitle">
                            Verified growers with scheduled pickup stalls at this
                            location
                          </p>
                        </div>
                        <motion.span
                          className="md-farmers-count"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.2,
                            type: 'spring',
                            stiffness: 260,
                          }}
                        >
                          <Users size={12} />
                          {marketFarmers.length} registered farmers
                        </motion.span>
                      </div>

                      {marketFarmers.length === 0 ? (
                        <motion.div
                          className="md-farmers-empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          No farmers registered at this market yet.
                        </motion.div>
                      ) : (
                        <motion.div
                          className="md-farmers-grid"
                          initial="hidden"
                          animate="visible"
                          variants={stagger}
                        >
                          {marketFarmers.map((farmer, i) => (
                            <motion.button
                              key={farmer.farmer_id}
                              type="button"
                              onClick={() =>
                                handleOpenFarmer(farmer.farmer_id)
                              }
                              className="md-farmer"
                              variants={farmerButtonVariants}
                              custom={i}
                              whileHover={{
                                scale: 1.03,
                                y: -3,
                                transition: { duration: 0.25 },
                              }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <div>
                                <h4 className="md-farmer-name">
                                  {farmer.stall_name}
                                </h4>
                                <p className="md-farmer-contact">
                                  Contact: {farmer.contact_person ?? '—'}
                                </p>
                                <p className="md-farmer-window">
                                  Pickup:{' '}
                                  {typeof farmer.pickup_window === 'string' &&
                                  farmer.pickup_window.length > 0
                                    ? farmer.pickup_window
                                        .split(',')[0]
                                        .trim()
                                    : 'Morning slots'}
                                </p>
                              </div>
                              <motion.span
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: 'inline-flex' }}
                              >
                                <ArrowRight size={16} className="md-farmer-arrow" />
                              </motion.span>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MarketsPage;