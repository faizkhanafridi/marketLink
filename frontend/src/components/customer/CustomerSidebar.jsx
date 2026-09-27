import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../../styles/dashboard.css';

const CustomerSidebar = () => {
  const location = useLocation();

  // Extract current path and search params once
  const currentPath = location.pathname;
  const currentSearch = new URLSearchParams(location.search);
  const currentStatus = currentSearch.get('status'); // for orders
  const currentTab = currentSearch.get('tab'); // for favorites

  // Which sections are expanded (based on current URL)
  const [expanded, setExpanded] = useState({
    orders: currentPath.startsWith('/customer/orders'),
    favorites: currentPath.startsWith('/customer/favorites'),
  });

  const toggleSection = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ---- Helper: is a link with `?status=X` the active one?
  const isOrderStatusActive = (status) => {
    return (
      currentPath === '/customer/orders' && currentStatus === status
    );
  };

  // ---- Helper: is the "All Orders" link active?
  const isAllOrdersActive = () => {
    // Active only if we're on /customer/orders with no status filter
    return currentPath === '/customer/orders' && !currentStatus;
  };

  // ---- Helper: is a favorites tab active?
  const isFavoritesTabActive = (tab) => {
    return (
      currentPath === '/customer/favorites' && currentTab === tab
    );
  };

  // ---- Helper: is the Favorites landing (no tab) active?
  const isFavoritesRootActive = () => {
    return currentPath === '/customer/favorites' && !currentTab;
  };

  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-nav">

        {/* Dashboard */}
        <div className="sidebar-section">
          <NavLink
            to="/customer"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </NavLink>
        </div>

        {/* My Orders — Dropdown */}
        <div className="sidebar-section">
          <button
            type="button"
            className={`sidebar-section-header ${
              currentPath.startsWith('/customer/orders') ? 'active' : ''
            }`}
            onClick={() => toggleSection('orders')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-shopping-bag"></i> My Orders
            </span>
            <i
              className={`fas fa-chevron-${
                expanded.orders ? 'down' : 'right'
              } sidebar-chevron`}
            ></i>
          </button>

          {expanded.orders && (
            <div className="sidebar-submenu">
              <NavLink
                to="/customer/orders"
                end
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isAllOrdersActive() ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-list"></i> All Orders
              </NavLink>

              <NavLink
                to="/customer/orders?status=placed"
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isOrderStatusActive('placed') ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-hourglass-half"></i> Placed
              </NavLink>

              <NavLink
                to="/customer/orders?status=accepted"
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isOrderStatusActive('accepted') ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-check"></i> Accepted
              </NavLink>

              <NavLink
                to="/customer/orders?status=ready_for_pickup"
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isOrderStatusActive('ready_for_pickup') ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-box-open"></i> Ready
              </NavLink>

              <NavLink
                to="/customer/orders?status=completed"
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isOrderStatusActive('completed') ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-check-double"></i> Completed
              </NavLink>

              <NavLink
                to="/customer/orders?status=cancelled"
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isOrderStatusActive('cancelled') ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-times-circle"></i> Cancelled
              </NavLink>
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="sidebar-section">
          <NavLink
            to="/customer/cart"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <i className="fas fa-shopping-basket"></i> Cart
          </NavLink>
        </div>

        {/* Favorites — Dropdown */}
        <div className="sidebar-section">
          <button
            type="button"
            className={`sidebar-section-header ${
              currentPath.startsWith('/customer/favorites') ? 'active' : ''
            }`}
            onClick={() => toggleSection('favorites')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-heart"></i> Favorites
            </span>
            <i
              className={`fas fa-chevron-${
                expanded.favorites ? 'down' : 'right'
              } sidebar-chevron`}
            ></i>
          </button>

          {expanded.favorites && (
            <div className="sidebar-submenu">
              <NavLink
                to="/customer/favorites"
                end
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isFavoritesRootActive() ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-list"></i> All Favorites
              </NavLink>

              <NavLink
                to="/customer/favorites?tab=products"
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isFavoritesTabActive('products') ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-box"></i> Products
              </NavLink>

              <NavLink
                to="/customer/favorites?tab=farmers"
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isFavoritesTabActive('farmers') ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-tractor"></i> Farmers
              </NavLink>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="sidebar-section">
          <NavLink
            to="/customer/profile"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <i className="fas fa-user"></i> Profile
          </NavLink>
        </div>

      </nav>
    </aside>
  );
};

export default CustomerSidebar;