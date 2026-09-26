import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/cards.css';

const MarketCard = ({ market }) => {
  return (
    <Link to={`/markets/${market.market_id}`} className="market-card">
      <div className="market-card-icon">
        <i className="fas fa-store"></i>
      </div>
      <div className="market-card-content">
        <h3 className="market-name">{market.market_name}</h3>
        <p className="market-address">
          <i className="fas fa-map-marker-alt"></i> {market.address}
        </p>
        {market.operating_days && (
          <p className="market-days">
            <i className="fas fa-calendar-alt"></i> {market.operating_days}
          </p>
        )}
        {market.timings && (
          <p className="market-timings">
            <i className="fas fa-clock"></i> {market.timings}
          </p>
        )}
      </div>
      <div className="market-card-arrow">
        <i className="fas fa-chevron-right"></i>
      </div>
    </Link>
  );
};

export default MarketCard;