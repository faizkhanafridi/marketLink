import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import RatingStars from '../../components/common/RatingStars';

import { productApi, favoriteApi, reviewApi } from '../../api';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
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

  const handleAddToCart = () => {
    if (!product.is_available) return;

    addToCart(product, quantity);

    toast.success(
      `${quantity} x ${product.name} added to cart`
    );
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !isCustomer) {
      toast.info(
        'Please login as a customer to save favorites'
      );
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
      toast.info(
        'Please login as a customer to leave a review'
      );
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

          <div className="product-breadcrumb">
            <Link to="/">Home</Link>

            <i className="fas fa-chevron-right"></i>

            <Link to="/products">Products</Link>

            <i className="fas fa-chevron-right"></i>

            <span>{product.name}</span>
          </div>

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
            <div className="product-gallery">

              <div className="product-gallery-image">

                <img
                  src={
                    product.image ||
                    '/assets/images/default-product.jpg'
                  }
                  alt={product.name}
                  onError={(e) => {
                    e.target.src =
                      '/assets/images/default-product.jpg';
                  }}
                />

                <div
                  className={`detail-availability ${
                    product.is_available
                      ? 'available'
                      : 'unavailable'
                  }`}
                >
                  <span></span>

                  {product.is_available
                    ? 'Available'
                    : 'Out of stock'}
                </div>

              </div>

              <div className="gallery-caption">
                <span>
                  <i className="fas fa-leaf"></i>
                  Local farm produce
                </span>

                <span>
                  <i className="fas fa-shield-alt"></i>
                  Verified listing
                </span>
              </div>

            </div>

            {/* =====================================================
                INFORMATION
            ===================================================== */}
            <div className="product-detail-info">

              {product.category && (
                <span className="product-detail-category">
                  {product.category.name}
                </span>
              )}

              <h1 className="product-detail-name">
                {product.name}
              </h1>

              {product.farmer && (
                <Link
                  to={`/farmers/${product.farmer.farmer_id}`}
                  className="product-detail-farmer"
                >
                  <span className="farmer-icon">
                    <i className="fas fa-tractor"></i>
                  </span>

                  <span>
                    <small>Sold by</small>
                    {product.farmer.stall_name}
                  </span>

                  <i className="fas fa-arrow-right"></i>
                </Link>
              )}

              <div className="product-rating-row">
                <div className="product-rating">
                  <RatingStars rating={4} />
                </div>

                <span className="rating-score">
                  4.0
                </span>

                <span className="rating-divider"></span>

                <span className="review-count">
                  {reviews.length} reviews
                </span>
              </div>

              <div className="product-price-block">
                <span className="price-amount-lg">
                  {formatCurrency(product.price)}
                </span>

                <span className="price-unit">
                  / {product.unit}
                </span>
              </div>

              <div
                className={`stock-status ${
                  product.is_available
                    ? 'in-stock'
                    : 'out-of-stock'
                }`}
              >
                <i
                  className={`fas fa-${
                    product.is_available
                      ? 'check-circle'
                      : 'times-circle'
                  }`}
                ></i>

                <div>
                  <strong>
                    {product.is_available
                      ? 'In stock'
                      : 'Out of stock'}
                  </strong>

                  {product.is_available && (
                    <span>
                      {product.stock_quantity} available
                    </span>
                  )}
                </div>
              </div>

              {product.description && (
                <div className="product-description-block">
                  <span className="detail-section-label">
                    About this product
                  </span>

                  <p className="product-detail-description">
                    {product.description}
                  </p>
                </div>
              )}

              {/* =================================================
                  PURCHASE AREA
              ================================================= */}
              <div className="product-purchase-box">

                <div className="purchase-top">
                  <span className="purchase-label">
                    Quantity
                  </span>

                  <span className="purchase-stock">
                    {product.is_available
                      ? 'Ready for pickup'
                      : 'Currently unavailable'}
                  </span>
                </div>

                <div className="product-detail-actions">

                  <div className="quantity-selector">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          Math.max(1, quantity - 1)
                        )
                      }
                      disabled={!product.is_available}
                      aria-label="Decrease quantity"
                    >
                      <i className="fas fa-minus"></i>
                    </button>

                    <span>{quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(quantity + 1)
                      }
                      disabled={!product.is_available}
                      aria-label="Increase quantity"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>

                  <button
                    className="product-add-cart"
                    onClick={handleAddToCart}
                    disabled={!product.is_available}
                  >
                    <i className="fas fa-shopping-basket"></i>
                    <span>
                      {product.is_available
                        ? 'Add to Cart'
                        : 'Out of Stock'}
                    </span>
                  </button>

                  <button
                    className={`product-save-button ${
                      isFavorite ? 'active' : ''
                    }`}
                    onClick={handleToggleFavorite}
                    aria-label="Save product"
                  >
                    <i
                      className={`${
                        isFavorite ? 'fas' : 'far'
                      } fa-heart`}
                    ></i>
                  </button>

                </div>

                <div className="purchase-note">
                  <i className="fas fa-info-circle"></i>
                  Reserve your produce and pay at pickup.
                </div>

              </div>

            </div>

          </div>

          {/* =======================================================
              REVIEWS
          ======================================================= */}
          <section className="reviews-section">

            <div className="reviews-heading-row">
              <div>
                <span className="reviews-eyebrow">
                  Community feedback
                </span>

                <h2 className="detail-heading">
                  Customer Reviews
                </h2>
              </div>

              <div className="reviews-summary">
                <strong>4.0</strong>

                <div>
                  <RatingStars rating={4} />

                  <span>
                    {reviews.length} reviews
                  </span>
                </div>
              </div>
            </div>

            {isAuthenticated && isCustomer && (
              <div className="review-form-card">

                <div className="review-form-header">
                  <div>
                    <span className="review-form-eyebrow">
                      Your experience
                    </span>

                    <h3 className="review-form-title">
                      Write a Review
                    </h3>
                  </div>

                  <span className="review-form-icon">
                    <i className="fas fa-pen"></i>
                  </span>
                </div>

                <form onSubmit={handleSubmitReview}>

                  <div className="form-group">
                    <label className="form-label">
                      Rating
                    </label>

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
                    <label className="form-label">
                      Comment
                    </label>

                    <textarea
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
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="review-submit-button"
                    disabled={submittingReview}
                  >
                    {submittingReview ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Submit Review
                      </>
                    )}
                  </button>

                </form>
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="no-reviews">
                <div className="no-reviews-icon">
                  <i className="far fa-comment-alt"></i>
                </div>

                <h3>No reviews yet</h3>

                <p>
                  Be the first customer to share your experience
                  with this product.
                </p>
              </div>
            ) : (
              <div className="reviews-list">

                {reviews.map((review) => (
                  <article
                    key={review.review_id}
                    className="review-item"
                  >

                    <div className="review-header">

                      <div className="review-author-info">

                        <span className="review-author-avatar">
                          {review.customer?.username
                            ?.charAt(0)
                            .toUpperCase() || 'A'}
                        </span>

                        <div>
                          <span className="review-author">
                            {review.customer?.username ||
                              'Anonymous'}
                          </span>

                          <span className="review-date">
                            {formatDate(review.created_at)}
                          </span>
                        </div>

                      </div>

                      <RatingStars
                        rating={review.rating}
                        size="small"
                      />

                    </div>

                    <p className="review-comment">
                      {review.comment}
                    </p>

                    {review.farmer_reply && (
                      <div className="review-reply">

                        <div className="reply-icon">
                          <i className="fas fa-reply"></i>
                        </div>

                        <div>
                          <strong>
                            Farmer's Reply
                          </strong>

                          <p>
                            {review.farmer_reply}
                          </p>
                        </div>

                      </div>
                    )}

                  </article>
                ))}

              </div>
            )}

          </section>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;