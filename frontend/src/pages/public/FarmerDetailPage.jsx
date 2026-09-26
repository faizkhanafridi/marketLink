import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/common/ProductCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import MapView from '../../components/common/MapView';
import RatingStars from '../../components/common/RatingStars';
import { farmerApi, reviewApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import '../../styles/farmer-detail.css';

const FarmerDetailPage = () => {
  const { id } = useParams();

  const [farmer, setFarmer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
const { isAuthenticated, isCustomer, user } = useAuth();

const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
const [submittingReview, setSubmittingReview] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmerData, reviewsData] = await Promise.all([
          farmerApi.getById(id),
          farmerApi.getReviews(id).catch(() => []),
        ]);

        setFarmer(farmerData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (error) {
        console.error('Error fetching farmer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
const handleSubmitReview = async (e) => {
  e.preventDefault();

  if (!isAuthenticated || !isCustomer) {
    toast.info('Please login as a customer to leave a review');
    return;
  }

  if (!newReview.comment.trim()) {
    toast.error('Please write a comment');
    return;
  }

  setSubmittingReview(true);
  try {
    const res = await reviewApi.create({
      farmer_id: parseInt(id, 10),
      rating: newReview.rating,
      comment: newReview.comment.trim(),
    });

    setReviews([res.review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    toast.success('Review submitted');
  } catch (error) {
    const errors = error.response?.data?.errors;
    if (errors) {
      Object.values(errors).flat().forEach((msg) => toast.error(msg));
    } else {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  } finally {
    setSubmittingReview(false);
  }
};
  if (loading) {
    return (
      <div className="farmer-detail-page">
        <Navbar />

        <div className="farmer-detail-loading">
          <Loader fullScreen message="Loading farmer..." />
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="farmer-detail-page">
        <Navbar />

        <section className="farmer-not-found">
          <div className="container">
            <EmptyState
              icon="exclamation-circle"
              title="Farmer Not Found"
              message="The farmer you're looking for doesn't exist."
            />

            <div className="not-found-action">
              <Link to="/farmers" className="farmer-back-button">
                <i className="fas fa-arrow-left"></i>
                Back to Farmers
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="farmer-detail-page">
      <Navbar />

      {/* Hero */}
  {/* Hero */}
<section className="farmer-detail-hero">
  <div className="container">

    {/* Breadcrumb */}
    <nav className="farmer-breadcrumb" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      <i className="fas fa-chevron-right"></i>
      <Link to="/farmers">Farmers</Link>
      <i className="fas fa-chevron-right"></i>
      <span>{farmer.stall_name}</span>
    </nav>

    {/* Farmer Header */}
    <div className="farmer-profile-header">

      <div className="farmer-profile-avatar">
        <span>
          {farmer.stall_name?.charAt(0).toUpperCase()}
        </span>

        <div className="farmer-avatar-leaf">
          <i className="fas fa-leaf"></i>
        </div>
      </div>

      <div className="farmer-profile-content">

        <span className="farmer-profile-label">
          <i className="fas fa-seedling"></i>
          Local Producer
        </span>

        <h1>{farmer.stall_name}</h1>

        {farmer.contact_person && (
          <p className="farmer-profile-owner">
            <i className="fas fa-user"></i>
            {farmer.contact_person}
          </p>
        )}

        <div className="farmer-profile-meta">
          {farmer.market && (
            <span>
              <i className="fas fa-store"></i>
              {farmer.market.market_name}
            </span>
          )}

          {farmer.operating_days && (
            <span>
              <i className="fas fa-calendar-alt"></i>
              {farmer.operating_days}
            </span>
          )}

          {farmer.pickup_window && (
            <span>
              <i className="fas fa-clock"></i>
              {farmer.pickup_window}
            </span>
          )}
        </div>

      </div>

    </div>

  </div>
</section>

      {/* Content */}
      <section className="farmer-detail-content">
        <div className="container">
          <div className="farmer-detail-layout">

            {/* Main */}
            <main className="farmer-detail-main">

              {/* About */}
              {farmer.description && (
                <section className="farmer-detail-card">
                  <div className="farmer-section-header">
                    <div className="farmer-section-icon">
                      <i className="fas fa-leaf"></i>
                    </div>

                    <div>
                      <span className="farmer-section-eyebrow">
                        Get to know them
                      </span>
                      <h2>About the Farmer</h2>
                    </div>
                  </div>

                  <p className="farmer-about-text">
                    {farmer.description}
                  </p>
                </section>
              )}

              {/* Products */}
              {farmer.products && farmer.products.length > 0 && (
                <section className="farmer-detail-card farmer-products-card">
                  <div className="farmer-section-header">
                    <div className="farmer-section-icon">
                      <i className="fas fa-shopping-basket"></i>
                    </div>

                    <div>
                      <span className="farmer-section-eyebrow">
                        Fresh from the farm
                      </span>

                      <h2>Available Products</h2>
                    </div>

                    <span className="farmer-product-count">
                      {farmer.products.length}{' '}
                      {farmer.products.length === 1
                        ? 'product'
                        : 'products'}
                    </span>
                  </div>

                  <div className="farmer-products-grid">
                    {farmer.products.map((product) => (
                      <ProductCard
                        key={product.product_id}
                        product={product}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Reviews */}
             <section className="farmer-detail-card farmer-reviews-card">
  <div className="farmer-section-header">
    <div className="farmer-section-icon">
      <i className="fas fa-star"></i>
    </div>

    <div>
      <span className="farmer-section-eyebrow">
        Community feedback
      </span>

      <h2>Reviews</h2>
    </div>

    {reviews.length > 0 && (
      <span className="farmer-review-count">
        {reviews.length}{' '}
        {reviews.length === 1 ? 'review' : 'reviews'}
      </span>
    )}
  </div>

  {/* Write a Review Form */}
  {isAuthenticated && isCustomer && (
    <div className="farmer-review-form">
      <h3 className="farmer-review-form-title">
        <i className="fas fa-pen"></i> Write a Review
      </h3>

      <form onSubmit={handleSubmitReview}>
        <div className="farmer-review-form-rating">
          <label>Your Rating</label>
          <RatingStars
            rating={newReview.rating}
            interactive
            size="large"
            onRate={(r) => setNewReview({ ...newReview, rating: r })}
          />
        </div>

        <div className="farmer-review-form-comment">
          <label htmlFor="farmer-review-comment">
            Your Review
          </label>
          <textarea
            id="farmer-review-comment"
            className="form-control"
            rows="4"
            placeholder="Share your experience with this farmer..."
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            maxLength={1000}
          />
          <span className="farmer-review-char-count">
            {newReview.comment.length} / 1000
          </span>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submittingReview}
        >
          {submittingReview ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Submitting...
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane"></i> Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  )}

  {/* Not logged in hint */}
  {!isAuthenticated && (
    <div className="farmer-review-login-hint">
      <i className="fas fa-info-circle"></i>
      <span>
        Please <Link to="/login">login</Link> as a customer to leave a review.
      </span>
    </div>
  )}

  {/* Reviews list */}
  {reviews.length === 0 ? (
    <div className="farmer-no-reviews">
      <div className="farmer-no-reviews-icon">
        <i className="far fa-comment"></i>
      </div>

      <h3>No reviews yet</h3>

      <p>Be the first to review this farmer.</p>
    </div>
  ) : (
    <div className="farmer-reviews-list">
      {reviews.map((review) => (
        <article
          key={review.review_id}
          className="farmer-review-item"
        >
          <div className="farmer-review-header">
            <div className="farmer-review-author">
              <span className="farmer-review-avatar">
                {review.customer?.username?.charAt(0).toUpperCase() || 'A'}
              </span>

              <div>
                <strong>
                  {review.customer?.username || 'Anonymous'}
                </strong>
                <span>Customer</span>
              </div>
            </div>

            <RatingStars rating={review.rating} size="small" />
          </div>

          {review.comment && (
            <p className="farmer-review-comment">{review.comment}</p>
          )}

          {review.farmer_reply && (
            <div className="farmer-review-reply">
              <div className="reply-label">
                <i className="fas fa-reply"></i> Farmer's Reply
              </div>
              <p>{review.farmer_reply}</p>
            </div>
          )}
        </article>
      ))}
    </div>
  )}
</section>
            </main>

            {/* Sidebar */}
            <aside className="farmer-detail-sidebar">

              {/* Location */}
              {farmer.latitude && farmer.longitude && (
                <div className="farmer-sidebar-card">
                  <div className="farmer-sidebar-heading">
                    <div className="farmer-sidebar-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>

                    <div>
                      <span>Find them</span>
                      <h3>Location</h3>
                    </div>
                  </div>

                  <div className="farmer-map">
                    <MapView
                      latitude={parseFloat(farmer.latitude)}
                      longitude={parseFloat(farmer.longitude)}
                      height="280px"
                      zoom={15}
                    />
                  </div>

                  {farmer.address && (
                    <div className="farmer-address">
                      <i className="fas fa-location-arrow"></i>

                      <span>{farmer.address}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Farmer Info */}
              <div className="farmer-sidebar-card farmer-info-card">
                <div className="farmer-sidebar-heading">
                  <div className="farmer-sidebar-icon">
                    <i className="fas fa-info"></i>
                  </div>

                  <div>
                    <span>Details</span>
                    <h3>Farmer Information</h3>
                  </div>
                </div>

                <div className="farmer-info-list">
                  {farmer.contact_person && (
                    <div className="farmer-info-row">
                      <span className="farmer-info-label">
                        <i className="fas fa-user"></i>
                        Contact
                      </span>

                      <strong>{farmer.contact_person}</strong>
                    </div>
                  )}

                  {farmer.market && (
                    <div className="farmer-info-row">
                      <span className="farmer-info-label">
                        <i className="fas fa-store"></i>
                        Market
                      </span>

                      <strong>
                        {farmer.market.market_name}
                      </strong>
                    </div>
                  )}

                  {farmer.operating_days && (
                    <div className="farmer-info-row">
                      <span className="farmer-info-label">
                        <i className="fas fa-calendar"></i>
                        Operating Days
                      </span>

                      <strong>{farmer.operating_days}</strong>
                    </div>
                  )}

                  {farmer.pickup_window && (
                    <div className="farmer-info-row">
                      <span className="farmer-info-label">
                        <i className="fas fa-clock"></i>
                        Pickup
                      </span>

                      <strong>{farmer.pickup_window}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Back */}
              <Link
                to="/farmers"
                className="farmer-sidebar-back"
              >
                <i className="fas fa-arrow-left"></i>
                Browse All Farmers
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FarmerDetailPage;