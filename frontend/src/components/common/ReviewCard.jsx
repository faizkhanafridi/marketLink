import React, { useState } from 'react';
import RatingStars from './RatingStars';
import { formatDate } from '../../utils/formatters';
import '../../styles/cards.css';

const ReviewCard = ({ review, canReply = false, onReply }) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply && onReply(review.review_id, replyText.trim());
    setReplyText('');
    setShowReplyForm(false);
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <div className="review-author-info">
          <span className="review-author-avatar">
            {review.customer?.username?.charAt(0).toUpperCase() || 'A'}
          </span>
          <div>
            <span className="review-author">
              {review.customer?.username || 'Anonymous'}
            </span>
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

      {review.comment && <p className="review-comment">{review.comment}</p>}

      {review.farmer_reply ? (
        <div className="review-reply">
          <strong>Farmer's Reply:</strong> {review.farmer_reply}
        </div>
      ) : (
        canReply &&
        onReply && (
          <div className="reply-form-wrapper">
            {!showReplyForm ? (
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setShowReplyForm(true)}
              >
                <i className="fas fa-reply"></i> Reply
              </button>
            ) : (
              <div className="reply-form">
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
                <div className="reply-form-actions">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyText('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleReplySubmit}
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default ReviewCard;