import React, { useState, useEffect } from "react";
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

  return (
    <div className="farmers-page">
      <Navbar />

      {/* Hero */}
      <center>
        <section className="farmers-hero">
          <div className="farmers-hero-decoration farmers-hero-decoration-one"></div>
          <div className="farmers-hero-decoration farmers-hero-decoration-two"></div>

          <div className="container">
            <div className="farmers-hero-content">
              <span className="farmers-page-tag">
                <i className="fas fa-seedling"></i>
                Meet the Producers
              </span>

              <h1 className="farmers-page-title">Local Farmers</h1>

              <p className="farmers-page-subtitle">
                Discover trusted farmers in your community and explore fresh,
                seasonal produce grown locally.
              </p>
            </div>
          </div>
        </section>
      </center>
      {/* Main Content */}
      <section className="farmers-content-section">
        <div className="container">
          {/* Toolbar */}
          <div className="farmers-toolbar">
            <div className="farmers-toolbar-heading">
              <span className="farmers-eyebrow">Our Community</span>
              <h2>Find a Farmer</h2>
              <p>
                Connect with local producers and discover what's growing near
                you.
              </p>
            </div>

            <div className="farmers-search">
              <i className="fas fa-search"></i>

              <input
                type="text"
                placeholder="Search farmers or stalls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchTerm && (
                <button
                  type="button"
                  className="farmers-search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          {!loading && (
            <div className="farmers-results-bar">
              <span>
                {filteredFarmers.length}{" "}
                {filteredFarmers.length === 1 ? "farmer" : "farmers"}
                {searchTerm ? " found" : ""}
              </span>

              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm("")}>
                  Clear search
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div className="farmers-loading">
              <Loader message="Loading farmers..." />
            </div>
          ) : filteredFarmers.length === 0 ? (
            <div className="farmers-empty">
              <EmptyState
                icon="tractor"
                title="No Farmers Found"
                message={
                  searchTerm
                    ? "Try adjusting your search."
                    : "No farmers registered yet."
                }
                actionText={searchTerm ? "Clear Search" : undefined}
                onAction={searchTerm ? () => setSearchTerm("") : undefined}
              />
            </div>
          ) : (
            <div className="farmers-grid">
              {filteredFarmers.map((farmer) => (
                <div className="farmer-card-wrapper" key={farmer.farmer_id}>
                  <FarmerCard farmer={farmer} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FarmersPage;
