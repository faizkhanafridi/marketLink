import React from 'react';

const RatingStars = ({ rating, max = 5, size = 'medium', interactive = false, onRate }) => {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    stars.push(
      <span
        key={i}
        className={`star ${i <= rating ? 'filled' : 'empty'} star-${size} ${
          interactive ? 'interactive' : ''
        }`}
        onClick={() => interactive && onRate && onRate(i)}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
      >
        <i className={`${i <= rating ? 'fas' : 'far'} fa-star`}></i>
      </span>
    );
  }

  return <div className="rating-stars">{stars}</div>;
};

export default RatingStars;