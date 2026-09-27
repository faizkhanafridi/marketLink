import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoriteApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import '../../styles/cards.css';

const FarmerCard = ({ farmer }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isCustomer || !farmer?.farmer_id) return;

    let mounted = true;
    const check = async () => {
      try {
        const favs = await favoriteApi.getAll();
        if (!mounted) return;
        const list = Array.isArray(favs) ? favs : [];
        const match = list.some(
          (f) => f.farmer && f.farmer.farmer_id === farmer.farmer_id
        );
        setIsFavorite(match);
      } catch (err) {
        // silent
      }
    };
    check();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, isCustomer, farmer?.farmer_id]);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !isCustomer) {
      toast.info('Please login as a customer to save farmers');
      return;
    }

    setLoading(true);
    try {
      const res = await favoriteApi.toggle({ farmer_id: farmer.farmer_id });
      const added = res.message === 'Added to favorites';
      setIsFavorite(added);
      toast.success(added ? 'Saved to favorites' : 'Removed from favorites');
    } catch (err) {
      toast.error('Failed to update favorite');
    } finally {
      setLoading(false);
    }
  };

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

        {isCustomer && (
          <button
            type="button"
            className={`farmer-card-fav ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteToggle}
            disabled={loading}
            aria-label={
              isFavorite ? 'Remove from favorites' : 'Save to favorites'
            }
            title={isFavorite ? 'Saved' : 'Save farmer'}
          >
            <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
          </button>
        )}
      </div>

      <div className="farmer-card-body">
        {farmer.description && (
          <p className="farmer-description">{farmer.description}</p>
        )}

        <div className="farmer-meta">
          {farmer.market && (
            <span className="meta-item">
              <i className="fas fa-map-marker-alt"></i>{' '}
              {farmer.market.market_name}
            </span>
          )}
          {farmer.operating_days && (
            <span className="meta-item">
              <i className="fas fa-calendar-alt"></i>{' '}
              {farmer.operating_days}
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
        <span className="view-profile-btn">
          View Profile <i className="fas fa-arrow-right"></i>
        </span>
      </div>
    </Link>
  );
};

export default FarmerCard;