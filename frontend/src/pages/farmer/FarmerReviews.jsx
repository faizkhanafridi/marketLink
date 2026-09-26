import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import RatingStars from '../../components/common/RatingStars';
import { farmerApi, reviewApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';

const FarmerReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

  const farmerId = user?.farmer_profile?.farmer_id;

  const fetchReviews = async () => {
    try {
      const data = await farmerApi.getReviews(farmerId);
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [farmerId]);

  const handleReply = async (reviewId) => {
    const reply = replyText[reviewId];
    if (!reply || !reply.trim()) {
      toast.error('Please enter a reply');
      return;
    }
    try {
      await reviewApi.reply(reviewId, reply);
      toast.success('Reply posted');
      setReplyText({ ...replyText, [reviewId]: '' });
      fetchReviews();
    } catch (error) {
      toast.error('Failed to post reply');
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <FarmerSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Customer Reviews</h1>
            <p className="dashboard-subtitle">View and respond to customer feedback</p>
          </div>

          {loading ? (
            <Loader message="Loading reviews..." />
          ) : reviews.length === 0 ? (
            <EmptyState
              icon="star"
              title="No Reviews Yet"
              message="Reviews from your customers will appear here."
            />
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.review_id} className="dashboard-card review-card">
                  <div className="review-header">
                    <div className="review-author-info">
                      <span className="review-author-avatar">
                        {review.customer?.username?.charAt(0).toUpperCase() || 'A'}
                      </span>
                      <div>
                        <span className="review-author">{review.customer?.username || 'Anonymous'}</span>
                        <span className="review-date">{formatDate(review.created_at)}</span>
                      </div>
                    </div>
                    <RatingStars rating={review.rating} size="small" />
                  </div>

                  {review.product && (
                    <p className="review-product">
                      <i className="fas fa-box"></i> {review.product.name}
                    </p>
                  )}

                  <p className="review-comment">{review.comment}</p>

                  {review.farmer_reply ? (
                    <div className="review-reply posted">
                      <strong>Your Reply:</strong> {review.farmer_reply}
                    </div>
                  ) : (
                    <div className="reply-form">
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Write a reply..."
                        value={replyText[review.review_id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [review.review_id]: e.target.value })}
                      ></textarea>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleReply(review.review_id)}
                      >
                        Post Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerReviews;