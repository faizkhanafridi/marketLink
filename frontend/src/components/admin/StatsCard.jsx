import React from 'react';
import '../../styles/dashboard.css';

const StatsCard = ({
  icon = 'chart-line',
  color = 'blue',
  value,
  label,
  subtitle,
}) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <i className={`fas fa-${icon}`}></i>
      </div>
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
};

export default StatsCard;