import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import FarmerCard from "../../components/common/FarmerCard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { farmerApi } from "../../api";
import "../../styles/farmers.css";
import "../../styles/page-hero.css";

const FarmersPage = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const data = await farmerApi.getAll();
        setFarmers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching farmers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.stall_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const gridItem = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.06,
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

  return (
    <div className="farmers-page">
      <Navbar />

      {/* Hero */}
      <center>
        <section className="farmers-hero">
          <motion.div
            className="farmers-hero-decoration farmers-hero-decoration-one"
            variants={floatingDecoration}
            animate="animate"
          />
          <motion.div
            className="farmers-hero-decoration farmers-hero-decoration-two"
            variants={floatingDecoration}
            animate="animate"
            transition={{ duration: 7, delay: 1 }}
          />

          <div className="container">
            <motion.div
              className="farmers-hero-content"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="farmers-page-tag">
                <motion.i
                  className="fas fa-seedling"
                  animate={{ rotate: [0, 12, -12, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
                Meet the Producers
              </motion.span>

              <motion.h1 variants={fadeUp} className="farmers-page-title">
                Local Farmers
              </motion.h1>

              <motion.p variants={fadeUp} className="farmers-page-subtitle">
                Discover trusted farmers in your community and explore fresh,
                seasonal produce grown locally.
              </motion.p>
            </motion.div>
          </div>
        </section>
      </center>

      {/* Main Content */}
      <section className="farmers-content-section">
        <div className="container">
          {/* Toolbar */}
          <motion.div
            className="farmers-toolbar"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.div
              className="farmers-toolbar-heading"
              variants={fadeUp}
            >
              <span className="farmers-eyebrow">Our Community</span>
              <h2>Find a Farmer</h2>
              <p>
                Connect with local producers and discover what's growing near
                you.
              </p>
            </motion.div>

            <motion.div className="farmers-search" variants={fadeUp}>
              <i className="fas fa-search"></i>

              <input
                type="text"
                placeholder="Search farmers or stalls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    type="button"
                    className="farmers-search-clear"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <i className="fas fa-times"></i>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Results Bar */}
          <AnimatePresence>
            {!loading && (
              <motion.div
                className="farmers-results-bar"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <motion.span
                  key={filteredFarmers.length}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, type: "spring", stiffness: 260 }}
                >
                  {filteredFarmers.length}{" "}
                  {filteredFarmers.length === 1 ? "farmer" : "farmers"}
                  {searchTerm ? " found" : ""}
                </motion.span>

                <AnimatePresence>
                  {searchTerm && (
                    <motion.button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.25 }}
                    >
                      Clear search
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="farmers-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Loader message="Loading farmers..." />
              </motion.div>
            ) : filteredFarmers.length === 0 ? (
              <motion.div
                key="empty"
                className="farmers-empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <EmptyState
                  icon="tractor"
                  title="No Farmers Found"
                  message={
                    searchTerm
                      ? "Try adjusting your search."
                      : "No farmers registered yet."
                  }
                  actionText={searchTerm ? "Clear Search" : undefined}
                  onAction={
                    searchTerm ? () => setSearchTerm("") : undefined
                  }
                />
              </motion.div>
            ) : (
              <motion.div
                key={`grid-${searchTerm}`}
                className="farmers-grid"
                initial="hidden"
                animate="visible"
                variants={stagger}
              >
                {filteredFarmers.map((farmer, i) => (
                  <motion.div
                    className="farmer-card-wrapper"
                    key={farmer.farmer_id}
                    variants={gridItem}
                    custom={i}
                    layout
                  >
                    <FarmerCard farmer={farmer} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FarmersPage;