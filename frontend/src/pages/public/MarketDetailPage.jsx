import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
          allFarmers.filter(
            (farmer) => farmer.market_id === Number(id)
          )
        );
      } catch (error) {
        console.error('Error fetching market:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  const latitude = hasCoordinates
    ? parseFloat(market.latitude)
    : null;

  const longitude = hasCoordinates
    ? parseFloat(market.longitude)
    : null;

  return (
    <div className="market-detail-page">
      <Navbar />

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="market-detail-hero">
        <div className="container">
          <div className="market-detail-hero-inner">
            <nav className="market-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>

              <ChevronRight size={14} />

              <Link to="/markets">Markets</Link>

              <ChevronRight size={14} />

              <span>{market.market_name}</span>
            </nav>

            <div className="market-hero-label">
              <span className="market-hero-label-dot" />
              Market Location
            </div>

            <h1>{market.market_name}</h1>

            <div className="market-hero-location">
              <span className="market-hero-location-icon">
                <MapPin size={17} />
              </span>

              <span>{market.address}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}
      <main className="content-section markets-content">
        <div className="container">
          <div className="market-detail-layout">
            {/* =====================================================
                MAIN COLUMN
            ====================================================== */}
            <div className="market-detail-main">
              {/* Market Information */}
              <section className="market-info-card">
                <div className="market-section-heading">
                  <div>
                    <span className="market-section-eyebrow">
                      About this location
                    </span>

                    <h2>Market Information</h2>
                  </div>

                  <div className="market-status-badge">
                    <span />
                    Active Market
                  </div>
                </div>

                <div className="market-info-grid">
                  {market.operating_days && (
                    <div className="market-info-item">
                      <div className="market-info-icon">
                        <Calendar size={19} />
                      </div>

                      <div className="market-info-content">
                        <span className="market-info-label">
                          Operating Days
                        </span>

                        <strong>
                          {operatingDaysString(market)}
                        </strong>
                      </div>
                    </div>
                  )}

                  {market.timings && (
                    <div className="market-info-item">
                      <div className="market-info-icon">
                        <Clock size={19} />
                      </div>

                      <div className="market-info-content">
                        <span className="market-info-label">
                          Pickup Hours
                        </span>

                        <strong>{market.timings}</strong>
                      </div>
                    </div>
                  )}

                  <div className="market-info-item market-info-item--full">
                    <div className="market-info-icon">
                      <MapPin size={19} />
                    </div>

                    <div className="market-info-content">
                      <span className="market-info-label">
                        Market Address
                      </span>

                      <strong>{market.address}</strong>
                    </div>
                  </div>
                </div>

                <div className="market-detail-actions">
                  <Link
                    to={`/products?market=${market.market_id}`}
                    className="market-primary-button"
                  >
                    <span>Browse Produce</span>
                    <ArrowRight size={17} />
                  </Link>

                  {hasCoordinates && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${market.latitude},${market.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="market-secondary-button"
                    >
                      <Navigation size={16} />
                      <span>Get Directions</span>
                    </a>
                  )}
                </div>
              </section>

              {/* Farmers */}
              {farmers.length > 0 && (
                <section className="market-farmers-section">
                  <div className="market-section-heading market-section-heading--farmers">
                    <div>
                      <span className="market-section-eyebrow">
                        Local producers
                      </span>

                      <h2>Farmers at this Market</h2>

                      <p>
                        Meet verified growers with scheduled pickup
                        stalls at this location.
                      </p>
                    </div>

                    <div className="market-farmers-count">
                      <Users size={15} />
                      <strong>{farmers.length}</strong>
                      <span>
                        {farmers.length === 1
                          ? 'farmer'
                          : 'farmers'}
                      </span>
                    </div>
                  </div>

                  <div className="market-farmers-grid">
                    {farmers.map((farmer) => (
                      <div
                        className="market-farmer-card"
                        key={farmer.farmer_id}
                      >
                        <FarmerCard farmer={farmer} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* =====================================================
                SIDEBAR
            ====================================================== */}
            <aside className="market-detail-sidebar">
              {hasCoordinates && (
                <section className="market-location-card">
                  <div className="market-location-header">
                    <div>
                      <span className="market-section-eyebrow">
                        Find us
                      </span>

                      <h3>Market Location</h3>
                    </div>

                    <div className="market-location-icon">
                      <Navigation size={16} />
                    </div>
                  </div>

                  <div className="market-map-container">
                    <MapView
                      latitude={latitude}
                      longitude={longitude}
                      height="320px"
                      zoom={15}
                    />
                  </div>

                  <div className="market-location-footer">
                    <div>
                      <span>Latitude</span>
                      <strong>{latitude.toFixed(5)}</strong>
                    </div>

                    <div>
                      <span>Longitude</span>
                      <strong>{longitude.toFixed(5)}</strong>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${market.latitude},${market.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="market-map-button"
                  >
                    <Navigation size={15} />
                    Open in Google Maps
                  </a>
                </section>
              )}

              <section className="market-sidebar-note">
                <div className="market-sidebar-note-icon">
                  <Users size={17} />
                </div>

                <div>
                  <strong>Shop local</strong>

                  <p>
                    Discover fresh produce directly from farmers
                    selling at this pickup location.
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MarketDetailPage;