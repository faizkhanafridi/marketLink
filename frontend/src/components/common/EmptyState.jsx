import React from 'react';

const EmptyState = ({ icon = 'inbox', title, message, actionText, onAction }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <i className={`fas fa-${icon}`}></i>
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionText && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;