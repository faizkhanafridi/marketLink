import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/cards.css';

const FarmerCard = ({ farmer }) => {
  return (
    <Link to={`/farmers/${farmer.farmer_id}`} className="farmer-card">
      <div className="farmer-card-header">
        <div className="farmer-avatar">
          {farmer.stall_name?.charAt(0).toUpperCase()}
        </div>
        <div className="farmer-header-info">
          <h3 className="farmer-stall-name">{farmer.stall_name}</h3>
          <p className="farmer-contact">{farmer.contact_person}</p>
        </div>
      </div>

      <div className="farmer-card-body">
        {farmer.description && (
          <p className="farmer-description">{farmer.description}</p>
        )}
        <div className="farmer-meta">
          {farmer.market && (
            <span className="meta-item">
              <i className="fas fa-map-marker-alt"></i> {farmer.market.market_name}
            </span>
          )}
          {farmer.operating_days && (
            <span className="meta-item">
              <i className="fas fa-calendar-alt"></i> {farmer.operating_days}
            </span>
          )}
          {farmer.pickup_window && (
            <span className="meta-item">
              <i className="fas fa-clock"></i> {farmer.pickup_window}
            </span>
          )}
        </div>
      </div>

      <div className="farmer-card-footer">
        <span className="view-profile-btn">View Profile <i className="fas fa-arrow-right"></i></span>
      </div>
    </Link>
  );
};

export default FarmerCard;