import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useFlyToCart } from '../../context/FlyToCartContext';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/cards.css';
import { ShoppingBasket, Lock, Store, MapPin, Star } from 'lucide-react';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#f5f4f1"/>
      <g transform="translate(200 150)" fill="#d6d3d1">
        <circle cx="0" cy="0" r="46" opacity="0.35"/>
        <path d="M-24 6 L24 6 L20 26 C19.5 28 18 29 16 29 L-16 29 C-18 29 -19.5 28 -20 26 Z" opacity="0.6"/>
        <path d="M-16 6 C-16 -6 16 -6 16 6" stroke="#d6d3d1" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.6"/>
      </g>
    </svg>
  `);

const ProductCard = ({ product, isLoggedIn = false }) => {
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { flyToCart } = useFlyToCart();

  const userRole = user?.role;

  const imageSrc = product.image || product.image_url || PLACEHOLDER;

  const market = product.farmer?.market?.market_name || product.market_name;
  const category = product.category?.name || product.category_name;
  const rating = product.average_rating || product.rating;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const btn = e.currentTarget;
    const card = btn.closest('.product-card');
    const img = card?.querySelector('.product-image');

    if (img) {
      flyToCart(img.getBoundingClientRect(), imageSrc);
    }

    addToCart(product, 1);
  };

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -6,
        boxShadow: '0 16px 32px rgba(0, 0, 0, 0.10)',
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
    >
      <Link to={`/products/${product.product_id}`} className="card-link">
        <div className="product-image-wrapper">
          <motion.img
            src={imageSrc}
            alt={product.name}
            className="product-image"
            loading="lazy"
            onError={(e) => {
              e.target.src = PLACEHOLDER;
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {!product.is_available && (
            <motion.div
              className="sold-out-badge"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              Sold Out
            </motion.div>
          )}

          {product.stock_quantity < 5 && product.stock_quantity > 0 && (
            <motion.div
              className="low-stock-badge"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Only {product.stock_quantity} left
            </motion.div>
          )}
        </div>

        <div className="product-info">
          <div className="product-meta-row">
            {category && (
              <span className="product-category">{category}</span>
            )}
            {rating != null && (
              <span className="product-rating-badge">
                <Star size={11} fill="#c47a0a" stroke="#c47a0a" />
                {Number(rating).toFixed(1)}
              </span>
            )}
          </div>

          <h3 className="product-name" title={product.name}>
            {product.name}
          </h3>

          {product.farmer && (
            <p className="product-farmer">
              <Store size={12} />
              <span className="pf-name">{product.farmer.stall_name}</span>
              {market && (
                <>
                  <span className="pf-dot">·</span>
                  <MapPin size={11} />
                  <span className="pf-market">{market}</span>
                </>
              )}
            </p>
          )}

          <div className="product-price-row">
            <div className="product-price">
              <span className="price-amount">
                {formatCurrency(product.price)}
              </span>
              {product.unit && (
                <span className="price-unit">/ {product.unit}</span>
              )}
            </div>

            {product.stock_quantity != null && product.is_available && (
              <span className="product-stock">
                {product.stock_quantity} in stock
              </span>
            )}
          </div>
        </div>
      </Link>

      {isAuthenticated && userRole === 'customer' ? (
        <motion.button
          type="button"
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!product.is_available}
          whileHover={
            product.is_available
              ? { scale: 1.02, y: -1, transition: { duration: 0.2 } }
              : {}
          }
          whileTap={product.is_available ? { scale: 0.97 } : {}}
        >
          <motion.span
            whileHover={{ rotate: -12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            style={{ display: 'inline-flex' }}
          >
            <ShoppingBasket size={16} />
          </motion.span>
          Add to Cart
        </motion.button>
      ) : !isAuthenticated ? (
        <motion.div
          whileHover={{ scale: 1.02, y: -1, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            to="/login"
            className="add-to-cart-btn"
            state={{ from: '/products' }}
          >
            <Lock size={15} />
            Login to Order
          </Link>
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default ProductCard;