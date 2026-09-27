import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/dashboard.css';

const AdminSidebar = () => {
  const location = useLocation();

  const isLinkActive = (path, search = '') => {
    return location.pathname === path && location.search === search;
  };

  const isPathActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const [expanded, setExpanded] = useState({
    users: location.pathname.includes('/admin/users'),
    catalog:
      location.pathname.includes('/admin/categories') ||
      location.pathname.includes('/admin/products') ||
      location.pathname.includes('/admin/units'),
    orders: location.pathname.includes('/admin/orders'),
    reviews: location.pathname.includes('/admin/reviews'),
    reports: location.pathname.includes('/admin/reports'),
    settings: location.pathname.includes('/admin/settings'),
  });

  const toggleSection = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-nav">

        {/* Dashboard (direct) */}
        <div className="sidebar-section">
          <Link
            to="/admin"
            className={`sidebar-link sidebar-sublink ${isPathActive('/admin', true) ? 'active' : ''}`}
          >
            <i className="fas fa-chart-pie"></i> Dashboard
          </Link>
        </div>

        {/* Users */}
        <div className="sidebar-section">
          <button
            className={`sidebar-section-header ${isPathActive('/admin/users') || isPathActive('/admin/roles') ? 'active' : ''}`}
            onClick={() => toggleSection('users')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-users"></i> Users
            </span>
            <i className={`fas fa-chevron-${expanded.users ? 'down' : 'right'} sidebar-chevron`}></i>
          </button>
          {expanded.users && (
            <div className="sidebar-submenu">
              <Link
                to="/admin/users"
                className={`sidebar-link sidebar-sublink ${isLinkActive('/admin/users') ? 'active' : ''}`}
              >
                <i className="fas fa-user-friends"></i> All Users
              </Link>
              <Link
                to="/admin/users?role=farmer"
                className={`sidebar-link sidebar-sublink ${isLinkActive('/admin/users', '?role=farmer') ? 'active' : ''}`}
              >
                <i className="fas fa-tractor"></i> Farmers
              </Link>
              <Link
                to="/admin/users?role=customer"
                className={`sidebar-link sidebar-sublink ${isLinkActive('/admin/users', '?role=customer') ? 'active' : ''}`}
              >
                <i className="fas fa-user"></i> Customers
              </Link>
              <Link
                to="/admin/users?status=pending"
                className={`sidebar-link sidebar-sublink ${isLinkActive('/admin/users', '?status=pending') ? 'active' : ''}`}
              >
                <i className="fas fa-user-clock"></i> Pending Approvals
              </Link>
              <Link
                to="/admin/roles"
                className={`sidebar-link sidebar-sublink ${isPathActive('/admin/roles', true) ? 'active' : ''}`}
              >
                <i className="fas fa-user-shield"></i> Roles & Permissions
              </Link>
            </div>
          )}
        </div>

        {/* Markets (direct) */}
        <div className="sidebar-section">
          <Link
            to="/admin/markets"
            className={`sidebar-link sidebar-section-label ${isPathActive('/admin/markets', true) ? 'active' : ''}`}
          >
            <i className="fas fa-store"></i> All Markets
          </Link>
        </div>

        {/* Catalog */}
        <div className="sidebar-section">
          <button
            className={`sidebar-section-header ${
              isPathActive('/admin/categories') ||
              isPathActive('/admin/products') ||
              isPathActive('/admin/units')
                ? 'active'
                : ''
            }`}
            onClick={() => toggleSection('catalog')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-tags"></i> Catalog
            </span>
            <i className={`fas fa-chevron-${expanded.catalog ? 'down' : 'right'} sidebar-chevron`}></i>
          </button>
          {expanded.catalog && (
            <div className="sidebar-submenu">
              <Link
                to="/admin/categories"
                className={`sidebar-link sidebar-sublink ${isPathActive('/admin/categories', true) ? 'active' : ''}`}
              >
                <i className="fas fa-tags"></i> Categories
              </Link>
              <Link
                to="/admin/products"
                className={`sidebar-link sidebar-sublink ${isPathActive('/admin/products', true) ? 'active' : ''}`}
              >
                <i className="fas fa-box"></i> Products
              </Link>
              <Link
                to="/admin/units"
                className={`sidebar-link sidebar-sublink ${isPathActive('/admin/units', true) ? 'active' : ''}`}
              >
                <i className="fas fa-balance-scale"></i> Units of Measure
              </Link>
            </div>
          )}
        </div>

  
  {/* Reviews */}
<div className="sidebar-section">
  <button
    className={`sidebar-section-header ${isPathActive('/admin/reviews') ? 'active' : ''}`}
    onClick={() => toggleSection('reviews')}
  >
    <span className="sidebar-section-label">
      <i className="fas fa-star"></i> Reviews
    </span>
    <i className={`fas fa-chevron-${expanded.reviews ? 'down' : 'right'} sidebar-chevron`}></i>
  </button>
  {expanded.reviews && (
    <div className="sidebar-submenu">
      <Link
        to="/admin/reviews"
        className={`sidebar-link sidebar-sublink ${isLinkActive('/admin/reviews') ? 'active' : ''}`}
      >
        <i className="fas fa-list"></i> All Reviews
      </Link>
      <Link
        to="/admin/reviews?type=farmer"
        className={`sidebar-link sidebar-sublink ${isLinkActive('/admin/reviews', '?type=farmer') ? 'active' : ''}`}
      >
        <i className="fas fa-tractor"></i> Farmer Reviews
      </Link>
      <Link
        to="/admin/reviews?type=product"
        className={`sidebar-link sidebar-sublink ${isLinkActive('/admin/reviews', '?type=product') ? 'active' : ''}`}
      >
        <i className="fas fa-box"></i> Product Reviews
      </Link>
    </div>
  )}
</div>
  
        {/* Settings */}
        <div className="sidebar-section">
          <button
            className={`sidebar-section-header ${isPathActive('/admin/settings') ? 'active' : ''}`}
            onClick={() => toggleSection('settings')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-cog"></i> Settings
            </span>
            <i className={`fas fa-chevron-${expanded.settings ? 'down' : 'right'} sidebar-chevron`}></i>
          </button>
          {expanded.settings && (
            <div className="sidebar-submenu">
              <Link
                to="/admin/settings/general"
                className={`sidebar-link sidebar-sublink ${isPathActive('/admin/settings/general', true) ? 'active' : ''}`}
              >
                <i className="fas fa-sliders-h"></i> General
              </Link>
              <Link
                to="/admin/settings/payments"
                className={`sidebar-link sidebar-sublink ${isPathActive('/admin/settings/payments', true) ? 'active' : ''}`}
              >
                <i className="fas fa-credit-card"></i> Payments
              </Link>
              <Link
                to="/admin/settings/notifications"
                className={`sidebar-link sidebar-sublink ${isPathActive('/admin/settings/notifications', true) ? 'active' : ''}`}
              >
                <i className="fas fa-bell"></i> Notifications
              </Link>
              <Link
                to="/admin/settings/security"
                className={`sidebar-link sidebar-sublink ${isPathActive('/admin/settings/security', true) ? 'active' : ''}`}
              >
                <i className="fas fa-shield-alt"></i> Security
              </Link>
            </div>
          )}
        </div>

      </nav>
    </aside>
  );
};

export default AdminSidebar;