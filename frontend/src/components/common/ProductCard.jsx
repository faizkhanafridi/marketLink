import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import RatingStars from './RatingStars';
import '../../styles/cards.css';
import { ShoppingBasket, Lock } from 'lucide-react';

const ProductCard = ({ product, isLoggedIn = false }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.product_id}`} className="card-link">
        <div className="product-image-wrapper">
          <img
            src={product.image || '/assets/images/default-product.jpg'}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = '/assets/images/default-product.jpg';
            }}
          />
          {!product.is_available && (
            <div className="sold-out-badge">Sold Out</div>
          )}
          {product.stock_quantity < 5 && product.stock_quantity > 0 && (
            <div className="low-stock-badge">Only {product.stock_quantity} left</div>
          )}
        </div>

        <div className="product-info">
          {product.category && (
            <span className="product-category">{product.category.name}</span>
          )}
          <h3 className="product-name">{product.name}</h3>
          {product.farmer && (
            <p className="product-farmer">
              <i className="fas fa-tractor"></i> {product.farmer.stall_name}
            </p>
          )}
          <div className="product-rating">
            <RatingStars rating={4} size="small" />
          </div>
          <div className="product-footer">
            <div className="product-price">
              <span className="price-amount">{formatCurrency(product.price)}</span>
              <span className="price-unit">/ {product.unit}</span>
            </div>
          </div>
        </div>
      </Link>

      {isLoggedIn ? (
        <button
          type="button"
          className="add-to-cart-btn"
          onClick={handleAddToCart}          // your existing handler
          disabled={!product.is_available}
        >
          <ShoppingBasket size={16} />
          Add to Cart
        </button>
      ) : (
        <Link
          to="/login"
          className="add-to-cart-btn"
          state={{ from: '/products' }}      // optional: send them back after login
        >
          <Lock size={15} />
          Login to Order
        </Link>
      )}
    </div>
  );
};

export default ProductCard;