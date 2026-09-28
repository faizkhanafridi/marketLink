import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import RatingStars from '../../components/common/RatingStars';

import { productApi, favoriteApi, reviewApi } from '../../api';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useFlyToCart } from '../../context/FlyToCartContext';  // ✅ ADD
import { formatCurrency, formatDate } from '../../utils/formatters';

import { toast } from 'react-toastify';

import '../../styles/home.css';
import '../../styles/forms.css';
import '../../styles/product-detail.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isAuthenticated, isCustomer } = useAuth();
  const { flyToCart } = useFlyToCart();                          // ✅ ADD

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, reviewsData] = await Promise.all([
          productApi.getById(id),
          productApi.getReviews(id).catch(() => []),
        ]);

        setProduct(productData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ==================== UPDATED: Fly Animation Added ====================
  const handleAddToCart = () => {
    if (!product.is_available) return;

    // ✅ Fly animation trigger
    const img = document.querySelector('.product-gallery-image img');
    if (img) {
      flyToCart(
        img.getBoundingClientRect(),
        product.image || '/assets/images/default-product.jpg',
      );
    }

    addToCart(product, quantity);

    toast.success(`${quantity} x ${product.name} added to cart`);
  };
  // =====================================================================

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !isCustomer) {
      toast.info('Please login as a customer to save favorites');
      return;
    }

    try {
      const res = await favoriteApi.toggle({
        product_id: product.product_id,
      });

      setIsFavorite(res.message === 'Added to favorites');

      toast.success(res.message);
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !isCustomer) {
      toast.info('Please login as a customer to leave a review');
      return;
    }

    setSubmittingReview(true);

    try {
      const res = await reviewApi.create({
        product_id: product.product_id,
        ...newReview,
      });

      setReviews([res.review, ...reviews]);

      setNewReview({
        rating: 5,
        comment: '',
      });

      toast.success('Review submitted');
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // ==================== ANIMATION VARIANTS ====================
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.08,
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

  const reviewItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Navbar />

        <div className="product-detail-loading">
          <Loader fullScreen message="Loading product..." />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Navbar />

        <section className="product-not-found">
          <div className="container">
            <EmptyState
              icon="exclamation-circle"
              title="Product Not Found"
              message="The product you're looking for doesn't exist."
              actionText="Back to Products"
              onAction={() => navigate('/products')}
            />
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Navbar />

      {/* =========================================================
          DETAIL HERO / BREADCRUMB
      ========================================================= */}
      <section className="product-detail-hero">
        <div className="container">
          <motion.div
            className="product-breadcrumb"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.span variants={fadeUp}>
              <Link to="/">Home</Link>
            </motion.span>
            <motion.i
              className="fas fa-chevron-right"
              variants={fadeUp}
            ></motion.i>
            <motion.span variants={fadeUp}>
              <Link to="/products">Products</Link>
            </motion.span>
            <motion.i
              className="fas fa-chevron-right"
              variants={fadeUp}
            ></motion.i>
            <motion.span variants={fadeUp}>{product.name}</motion.span>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          PRODUCT
      ========================================================= */}
      <section className="product-detail-content">
        <div className="container">
          <div className="product-detail-main">
            {/* =====================================================
                IMAGE
            ===================================================== */}
            <motion.div
              className="product-gallery"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="product-gallery-image">
                <motion.img
                  src={
                    product.image || '/assets/images/default-product.jpg'
                  }
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/assets/images/default-product.jpg';
                  }}
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.05 }}
                />

                <motion.div
                  className={`detail-availability ${
                    product.is_available ? 'available' : 'unavailable'
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {product.is_available && (
                    <motion.span
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [1, 0.6, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                  {!product.is_available && <span />}

                  {product.is_available ? 'Available' : 'Out of stock'}
                </motion.div>
              </div>

              <motion.div
                className="gallery-caption"
                initial="hidden"
                animate="visible"
                variants={stagger}
              >
                <motion.span variants={fadeUp}>
                  <i className="fas fa-leaf"></i>
                  Local farm produce
                </motion.span>

                <motion.span variants={fadeUp}>
                  <i className="fas fa-shield-alt"></i>
                  Verified listing
                </motion.span>
              </motion.div>
            </motion.div>

            {/* =====================================================
                INFORMATION
            ===================================================== */}
            <motion.div
              className="product-detail-info"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {product.category && (
                <motion.span
                  className="product-detail-category"
                  variants={fadeUp}
                >
                  {product.category.name}
                </motion.span>
              )}

              <motion.h1
                className="product-detail-name"
                variants={fadeUp}
              >
                {product.name}
              </motion.h1>

              {product.farmer && (
                <motion.div variants={fadeUp}>
                  <Link
                    to={`/farmers/${product.farmer.farmer_id}`}
                    className="product-detail-farmer"
                  >
                    <motion.span
                      className="farmer-icon"
                      whileHover={{ rotate: -10, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <i className="fas fa-tractor"></i>
                    </motion.span>

                    <span>
                      <small>Sold by</small>
                      {product.farmer.stall_name}
                    </span>

                    <motion.i
                      className="fas fa-arrow-right"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    ></motion.i>
                  </Link>
                </motion.div>
              )}

              <motion.div
                className="product-rating-row"
                variants={fadeUp}
              >
                <div className="product-rating">
                  <RatingStars rating={4} />
                </div>

                <span className="rating-score">4.0</span>

                <span className="rating-divider"></span>

                <span className="review-count">
                  {reviews.length} reviews
                </span>
              </motion.div>

              <motion.div
                className="product-price-block"
                variants={fadeUp}
              >
                <span className="price-amount-lg">
                  {formatCurrency(product.price)}
                </span>

                <span className="price-unit">/ {product.unit}</span>
              </motion.div>

              <motion.div
                className={`stock-status ${
                  product.is_available ? 'in-stock' : 'out-of-stock'
                }`}
                variants={fadeUp}
              >
                <motion.i
                  className={`fas fa-${
                    product.is_available ? 'check-circle' : 'times-circle'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.5,
                    type: 'spring',
                    stiffness: 300,
                  }}
                ></motion.i>

                <div>
                  <strong>
                    {product.is_available ? 'In stock' : 'Out of stock'}
                  </strong>

                  {product.is_available && (
                    <span>{product.stock_quantity} available</span>
                  )}
                </div>
              </motion.div>

              {product.description && (
                <motion.div
                  className="product-description-block"
                  variants={fadeUp}
                >
                  <span className="detail-section-label">
                    About this product
                  </span>

                  <p className="product-detail-description">
                    {product.description}
                  </p>
                </motion.div>
              )}

              {/* =================================================
                  PURCHASE AREA
              ================================================= */}
              <motion.div
                className="product-purchase-box"
                variants={fadeUp}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3 }}
              >
                <div className="purchase-top">
                  <span className="purchase-label">Quantity</span>

                  <span className="purchase-stock">
                    {product.is_available
                      ? 'Ready for pickup'
                      : 'Currently unavailable'}
                  </span>
                </div>

                <div className="product-detail-actions">
                  <div className="quantity-selector">
                    <motion.button
                      type="button"
                      onClick={() =>
                        setQuantity(Math.max(1, quantity - 1))
                      }
                      disabled={!product.is_available}
                      aria-label="Decrease quantity"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className="fas fa-minus"></i>
                    </motion.button>

                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={quantity}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {quantity}
                      </motion.span>
                    </AnimatePresence>

                    <motion.button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={!product.is_available}
                      aria-label="Increase quantity"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className="fas fa-plus"></i>
                    </motion.button>
                  </div>

                  <motion.button
                    className="product-add-cart"
                    onClick={handleAddToCart}
                    disabled={!product.is_available}
                    whileHover={
                      product.is_available
                        ? { scale: 1.03, y: -3 }
                        : {}
                    }
                    whileTap={
                      product.is_available ? { scale: 0.97 } : {}
                    }
                    transition={{ duration: 0.2 }}
                  >
                    <motion.i
                      className="fas fa-shopping-basket"
                      whileHover={{ rotate: -12, scale: 1.15 }}
                      transition={{ duration: 0.2 }}
                    ></motion.i>
                    <span>
                      {product.is_available
                        ? 'Add to Cart'
                        : 'Out of Stock'}
                    </span>
                  </motion.button>

                  <motion.button
                    className={`product-save-button ${
                      isFavorite ? 'active' : ''
                    }`}
                    onClick={handleToggleFavorite}
                    aria-label="Save product"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={
                      isFavorite
                        ? {
                            scale: [1, 1.3, 1],
                            transition: { duration: 0.5 },
                          }
                        : {}
                    }
                  >
                    <motion.i
                      className={`${isFavorite ? 'fas' : 'far'} fa-heart`}
                      animate={
                        isFavorite
                          ? {
                              scale: [1, 1.4, 1],
                              transition: {
                                duration: 0.6,
                                ease: 'easeOut',
                              },
                            }
                          : {}
                      }
                    ></motion.i>
                  </motion.button>
                </div>

                <div className="purchase-note">
                  <i className="fas fa-info-circle"></i>
                  Reserve your produce and pay at pickup.
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* =======================================================
              REVIEWS
          ======================================================= */}
          <motion.section
            className="reviews-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            <motion.div
              className="reviews-heading-row"
              variants={fadeUp}
            >
              <div>
                <span className="reviews-eyebrow">
                  Community feedback
                </span>

                <h2 className="detail-heading">Customer Reviews</h2>
              </div>

              <div className="reviews-summary">
                <strong>4.0</strong>

                <div>
                  <RatingStars rating={4} />

                  <span>{reviews.length} reviews</span>
                </div>
              </div>
            </motion.div>

            {isAuthenticated && isCustomer && (
              <motion.div
                className="review-form-card"
                variants={fadeUp}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
              >
                <div className="review-form-header">
                  <div>
                    <span className="review-form-eyebrow">
                      Your experience
                    </span>

                    <h3 className="review-form-title">
                      Write a Review
                    </h3>
                  </div>

                  <motion.span
                    className="review-form-icon"
                    whileHover={{ rotate: -10, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <i className="fas fa-pen"></i>
                  </motion.span>
                </div>

                <form onSubmit={handleSubmitReview}>
                  <div className="form-group">
                    <label className="form-label">Rating</label>

                    <RatingStars
                      rating={newReview.rating}
                      interactive
                      onRate={(r) =>
                        setNewReview({
                          ...newReview,
                          rating: r,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Comment</label>

                    <motion.textarea
                      className="form-control"
                      rows="4"
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          comment: e.target.value,
                        })
                      }
                      placeholder="Tell other customers about the quality, freshness, and overall experience..."
                      whileFocus={{
                        scale: 1.005,
                        transition: { duration: 0.2 },
                      }}
                    ></motion.textarea>
                  </div>

                  <motion.button
                    type="submit"
                    className="review-submit-button"
                    disabled={submittingReview}
                    whileHover={
                      !submittingReview ? { scale: 1.03, y: -3 } : {}
                    }
                    whileTap={!submittingReview ? { scale: 0.97 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    {submittingReview ? (
                      <>
                        <motion.i
                          className="fas fa-spinner"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        ></motion.i>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <motion.i
                          className="fas fa-paper-plane"
                          whileHover={{ x: 3, y: -3 }}
                          transition={{ duration: 0.2 }}
                        ></motion.i>
                        Submit Review
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {reviews.length === 0 ? (
              <motion.div className="no-reviews" variants={fadeUp}>
                <motion.div
                  className="no-reviews-icon"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <i className="far fa-comment-alt"></i>
                </motion.div>

                <h3>No reviews yet</h3>

                <p>
                  Be the first customer to share your experience
                  with this product.
                </p>
              </motion.div>
            ) : (
              <motion.div className="reviews-list" variants={stagger}>
                {reviews.map((review, i) => (
                  <motion.article
                    key={review.review_id}
                    className="review-item"
                    variants={reviewItemVariants}
                    custom={i}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="review-header">
                      <div className="review-author-info">
                        <motion.span
                          className="review-author-avatar"
                          whileHover={{ rotate: -10, scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {review.customer?.username
                            ?.charAt(0)
                            .toUpperCase() || 'A'}
                        </motion.span>

                        <div>
                          <span className="review-author">
                            {review.customer?.username || 'Anonymous'}
                          </span>

                          <span className="review-date">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>

                      <RatingStars rating={review.rating} size="small" />
                    </div>

                    <p className="review-comment">{review.comment}</p>

                    {review.farmer_reply && (
                      <motion.div
                        className="review-reply"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <motion.div
                          className="reply-icon"
                          whileHover={{ rotate: -10, scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <i className="fas fa-reply"></i>
                        </motion.div>

                        <div>
                          <strong>Farmer's Reply</strong>

                          <p>{review.farmer_reply}</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.article>
                ))}
              </motion.div>
            )}
          </motion.section>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;