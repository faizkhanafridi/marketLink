import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../../styles/dashboard.css';

const AdminSidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState({
    overview: true,
    users: location.pathname.includes('/admin/users'),
    markets: location.pathname.includes('/admin/markets'),
    catalog: location.pathname.includes('/admin/categories') || location.pathname.includes('/admin/products'),
    reviews: location.pathname.includes('/admin/reviews'),
    reports: location.pathname.includes('/admin/reports'),
  });

  const toggleSection = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-nav">
        {/* Overview Section */}
        <div className="sidebar-section">
          <button
            className={`sidebar-section-header ${isActive('/admin', true) ? 'active' : ''}`}
            onClick={() => toggleSection('overview')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-tachometer-alt"></i> Overview
            </span>
            <i className={`fas fa-chevron-${expanded.overview ? 'down' : 'right'} sidebar-chevron`}></i>
          </button>
          {expanded.overview && (
            <div className="sidebar-submenu">
              <NavLink to="/admin" end className="sidebar-link sidebar-sublink">
                <i className="fas fa-chart-pie"></i> Dashboard
              </NavLink>
              <NavLink to="/admin/reports" className="sidebar-link sidebar-sublink">
                <i className="fas fa-stream"></i> Sales
              </NavLink>
 
            </div>
          )}
        </div>

        {/* Users Section */}
        <div className="sidebar-section">
          <button
            className={`sidebar-section-header ${isActive('/admin/users') ? 'active' : ''}`}
            onClick={() => toggleSection('users')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-users"></i> Users
            </span>
            <i className={`fas fa-chevron-${expanded.users ? 'down' : 'right'} sidebar-chevron`}></i>
          </button>
          {expanded.users && (
            <div className="sidebar-submenu">
              <NavLink to="/admin/users" end className="sidebar-link sidebar-sublink">
                <i className="fas fa-user-friends"></i> All Users
              </NavLink>
              <NavLink to="/admin/users?role=farmer" className="sidebar-link sidebar-sublink">
                <i className="fas fa-tractor"></i> Farmers
              </NavLink>
              <NavLink to="/admin/users?role=customer" className="sidebar-link sidebar-sublink">
                <i className="fas fa-user"></i> Customers
              </NavLink>
              <NavLink to="/admin/users?status=pending" className="sidebar-link sidebar-sublink">
                <i className="fas fa-user-clock"></i> Pending Approvals
              </NavLink>
              <NavLink to="/admin/roles" className="sidebar-link sidebar-sublink">
                <i className="fas fa-user-shield"></i> Roles & Permissions
              </NavLink>
            </div>
          )}
        </div>

        {/* Markets Section */}

            <div className="sidebar-section">
              <NavLink to="/admin/markets" end className="sidebar-link sidebar-sublink">
                <i className="fas fa-store"></i> All Markets
              </NavLink>
            </div>
 

        {/* Catalog Section */}
        <div className="sidebar-section">
          <button
            className={`sidebar-section-header ${isActive('/admin/categories') || isActive('/admin/products') ? 'active' : ''}`}
            onClick={() => toggleSection('catalog')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-tags"></i> Catalog
            </span>
            <i className={`fas fa-chevron-${expanded.catalog ? 'down' : 'right'} sidebar-chevron`}></i>
          </button>
          {expanded.catalog && (
            <div className="sidebar-submenu">
              <NavLink to="/admin/categories" className="sidebar-link sidebar-sublink">
                <i className="fas fa-tags"></i> Categories
              </NavLink>
              <NavLink to="/admin/products" className="sidebar-link sidebar-sublink">
                <i className="fas fa-box"></i> Products
              </NavLink>
              <NavLink to="/admin/units" className="sidebar-link sidebar-sublink">
                <i className="fas fa-balance-scale"></i> Units of Measure
              </NavLink>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="sidebar-section">
          <button
            className={`sidebar-section-header ${isActive('/admin/orders') ? 'active' : ''}`}
            onClick={() => toggleSection('orders')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-shopping-bag"></i> Orders
            </span>
            <i className={`fas fa-chevron-${expanded.orders ? 'down' : 'right'} sidebar-chevron`}></i>
          </button>
          {expanded.orders && (
            <div className="sidebar-submenu">
              <NavLink to="/admin/orders" end className="sidebar-link sidebar-sublink">
                <i className="fas fa-list"></i> All Orders
              </NavLink>
              <NavLink to="/admin/orders?status=pending" className="sidebar-link sidebar-sublink">
                <i className="fas fa-hourglass-half"></i> Pending
              </NavLink>
              <NavLink to="/admin/orders?status=shipped" className="sidebar-link sidebar-sublink">
                <i className="fas fa-truck"></i> Shipped
              </NavLink>
              <NavLink to="/admin/orders?status=delivered" className="sidebar-link sidebar-sublink">
                <i className="fas fa-check-double"></i> Delivered
              </NavLink>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="sidebar-section">
          <button
            className={`sidebar-section-header ${isActive('/admin/reviews') ? 'active' : ''}`}
            onClick={() => toggleSection('reviews')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-star"></i> Reviews
            </span>
            <i className={`fas fa-chevron-${expanded.reviews ? 'down' : 'right'} sidebar-chevron`}></i>
          </button>
          {expanded.reviews && (
            <div className="sidebar-submenu">
              <NavLink to="/admin/reviews" end className="sidebar-link sidebar-sublink">
                <i className="fas fa-list"></i> All Reviews
              </NavLink>
              <NavLink to="/admin/reviews?status=pending" className="sidebar-link sidebar-sublink">
                <i className="fas fa-clock"></i> Pending Moderation
              </NavLink>
              <NavLink to="/admin/reviews?status=flagged" className="sidebar-link sidebar-sublink">
                <i className="fas fa-flag"></i> Flagged Reviews
              </NavLink>
            </div>
          )}
        </div>

        {/* Reports Section */}
        <div className="sidebar-section">
          <button
            className={`sidebar-section-header ${isActive('/admin/reports') ? 'active' : ''}`}
            onClick={() => toggleSection('reports')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-chart-bar"></i> Reports
            </span>
            <i className={`fas fa-chevron-${expanded.reports ? 'down' : 'right'} sidebar-chevron`}></i>
          </button>
          {expanded.reports && (
            <div className="sidebar-submenu">
              <NavLink to="/admin/reports" end className="sidebar-link sidebar-sublink">
                <i className="fas fa-chart-line"></i> Overview
              </NavLink>
              <NavLink to="/admin/reports/sales" className="sidebar-link sidebar-sublink">
                <i className="fas fa-dollar-sign"></i> Sales Reports
              </NavLink>
              <NavLink to="/admin/reports/users" className="sidebar-link sidebar-sublink">
                <i className="fas fa-user-chart"></i> User Reports
              </NavLink>
              <NavLink to="/admin/reports/markets" className="sidebar-link sidebar-sublink">
                <i className="fas fa-store-alt"></i> Market Reports
              </NavLink>
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div className="sidebar-section">
          <button
            className={`sidebar-section-header ${isActive('/admin/settings') ? 'active' : ''}`}
            onClick={() => toggleSection('settings')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-cog"></i> Settings
            </span>
            <i className={`fas fa-chevron-${expanded.settings ? 'down' : 'right'} sidebar-chevron`}></i>
          </button>
          {expanded.settings && (
            <div className="sidebar-submenu">
              <NavLink to="/admin/settings/general" className="sidebar-link sidebar-sublink">
                <i className="fas fa-sliders-h"></i> General
              </NavLink>
              <NavLink to="/admin/settings/payments" className="sidebar-link sidebar-sublink">
                <i className="fas fa-credit-card"></i> Payments
              </NavLink>
              <NavLink to="/admin/settings/notifications" className="sidebar-link sidebar-sublink">
                <i className="fas fa-bell"></i> Notifications
              </NavLink>
              <NavLink to="/admin/settings/security" className="sidebar-link sidebar-sublink">
                <i className="fas fa-shield-alt"></i> Security
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;