import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [viewMode, setViewMode] = useState('directory'); // 'directory' | 'list'
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

  // Markers for the fallback MapView (list view)
  const mapMarkers = markets
    .filter((m) => m.latitude && m.longitude)
    .map((m) => ({
      latitude: parseFloat(m.latitude),
      longitude: parseFloat(m.longitude),
      title: m.market_name,
      address: m.address,
    }));

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
      <center>
<section className="markets-hero">
  <div className="markets-hero-decoration markets-hero-decoration-one"></div>
  <div className="markets-hero-decoration markets-hero-decoration-two"></div>

  <div className="container">
    <div className="markets-hero-content">
      <span className="markets-page-tag">
        <i className="fas fa-store"></i>
        Physical Pickup Hubs
      </span>

      <h1 className="markets-page-title">
        Regional
        <span> Farmers Markets</span>
      </h1>

      <p className="markets-page-subtitle">
        Explore weekly market locations, operating schedules, and pickup
        points mapped with OpenStreetMap.
      </p>
    </div>
  </div>
</section>
</center>

      <section className="content-section markets-content">
        <div className="container">
          {/* Header */}
       
          {/* Toolbar — view switcher */}
          <div className="markets-toolbar">
            <div className="markets-view-toggle">
              <button
                type="button"
                className={`markets-view-btn ${
                  viewMode === 'directory' ? 'active' : ''
                }`}
                onClick={() => setViewMode('directory')}
              >
                <LayoutGrid size={14} />
                Directory
              </button>
              <button
                type="button"
                className={`markets-view-btn ${
                  viewMode === 'list' ? 'active' : ''
                }`}
                onClick={() => setViewMode('list')}
              >
                <MapIcon size={14} />
                List View
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="md-map-viewer-wrap">
              <MapView markers={mapMarkers} height="500px" zoom={11} />
            </div>
          ) : (
            <>
              {/* ============ MAP SECTION (from MarketDirectory) ============ */}
              <div className="md-map-section">
                <div className="md-map-header">
                  <span className="md-map-title">
                    <Navigation size={15} />
                    <span>Interactive OpenStreetMap Geolocation</span>
                  </span>
                  <span className="md-map-hint">
                    Click marker or card to inspect pickup coordinates
                  </span>
                </div>

            
              </div>

              {/* ============ MARKETS GRID ============ */}
              <div className="md-grid">
                {markets.map((market) => {
                  const isSelected =
                    market.market_id === activeMarket?.market_id;
                  const assigned = farmers.filter(
                    (f) => f.market_id === market.market_id
                  );
                  const cityLabel =
                    (market.address ?? '').split(',')[0] || 'Market Hub';

                  return (
                    <article
                      key={market.market_id}
                      onClick={() => setSelectedMarketId(market.market_id)}
                      className={`md-card ${
                        isSelected ? 'md-card--selected' : ''
                      }`}
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
                            <strong>{operatingDaysString(market) || '—'}</strong>
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
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBrowseProduce(market.market_id);
                          }}
                          className="md-btn-browse"
                        >
                          <span>Browse Produce</span>
                          <ArrowRight size={13} />
                        </button>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${market.latitude},${market.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="md-btn-directions"
                          title="Directions"
                        >
                          <Navigation size={13} />
                          <span>Directions</span>
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* ============ FARMERS AT SELECTED MARKET ============ */}
              {activeMarket && (
                <div className="md-farmers">
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
                    <span className="md-farmers-count">
                      <Users size={12} />
                      {marketFarmers.length} registered farmers
                    </span>
                  </div>

                  {marketFarmers.length === 0 ? (
                    <div className="md-farmers-empty">
                      No farmers registered at this market yet.
                    </div>
                  ) : (
                    <div className="md-farmers-grid">
                      {marketFarmers.map((farmer) => (
                        <button
                          key={farmer.farmer_id}
                          type="button"
                          onClick={() => handleOpenFarmer(farmer.farmer_id)}
                          className="md-farmer"
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
                                ? farmer.pickup_window.split(',')[0].trim()
                                : 'Morning slots'}
                            </p>
                          </div>
                          <ArrowRight size={16} className="md-farmer-arrow" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MarketsPage;