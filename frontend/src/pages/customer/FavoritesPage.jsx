import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CustomerSidebar from '../../components/customer/CustomerSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ProductCard from '../../components/common/ProductCard';
import FarmerCard from '../../components/common/FarmerCard';
import { favoriteApi } from '../../api';
import '../../styles/dashboard.css';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('products');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await favoriteApi.getAll();
        setFavorites(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const favoriteProducts = favorites.filter((f) => f.product);
  const favoriteFarmers = favorites.filter((f) => f.farmer);

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <CustomerSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">My Favorites</h1>
            <p className="dashboard-subtitle">Your saved products and farmers</p>
          </div>

          <div className="filter-tabs">
            <button
              className={`filter-tab ${tab === 'products' ? 'active' : ''}`}
              onClick={() => setTab('products')}
            >
              Products ({favoriteProducts.length})
            </button>
            <button
              className={`filter-tab ${tab === 'farmers' ? 'active' : ''}`}
              onClick={() => setTab('farmers')}
            >
              Farmers ({favoriteFarmers.length})
            </button>
          </div>

          {loading ? (
            <Loader message="Loading favorites..." />
          ) : tab === 'products' ? (
            favoriteProducts.length === 0 ? (
              <EmptyState
                icon="heart"
                title="No Favorite Products"
                message="Save products you love for quick access."
                actionText="Browse Products"
                onAction={() => window.location.href = '/products'}
              />
            ) : (
              <div className="products-grid">
                {favoriteProducts.map((fav) => (
                  <ProductCard key={fav.id} product={fav.product} />
                ))}
              </div>
            )
          ) : favoriteFarmers.length === 0 ? (
            <EmptyState
              icon="heart"
              title="No Favorite Farmers"
              message="Save farmers you like for quick access."
              actionText="Browse Farmers"
              onAction={() => window.location.href = '/farmers'}
            />
          ) : (
            <div className="farmers-grid">
              {favoriteFarmers.map((fav) => (
                <FarmerCard key={fav.id} farmer={fav.farmer} />
              ))}
            </div>
          )}
        </main>
      </div>
    
    </div>
  );
};

export default FavoritesPage;