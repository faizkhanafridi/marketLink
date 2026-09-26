import React from 'react';
import '../../styles/animations.css';

const Loader = ({ fullScreen = false, message = 'Loading...', size = 'medium' }) => {
  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className={`loader-spinner loader-${size}`}></div>
        <p className="loader-message">{message}</p>
      </div>
    );
  }

  return (
    <div className="loader-inline">
      <div className={`loader-spinner loader-${size}`}></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;