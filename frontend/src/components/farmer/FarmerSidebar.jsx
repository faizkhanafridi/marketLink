import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../../styles/dashboard.css';

const FarmerSidebar = () => {
  const location = useLocation();

  // Current path and query params
  const currentPath = location.pathname;
  const currentSearch = new URLSearchParams(location.search);
  const currentStatus = currentSearch.get('status'); // for orders

  const [expanded, setExpanded] = useState({
    products: currentPath.startsWith('/farmer/products'),
    orders: currentPath.startsWith('/farmer/orders'),
  });

  const toggleSection = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // --- Active-state helpers ---
  // "All Orders" is active only when we're on /farmer/orders with NO status filter
  const isAllOrdersActive = () => {
    return currentPath === '/farmer/orders' && !currentStatus;
  };

  // Each specific status link is active only when path AND status match
  const isOrderStatusActive = (status) => {
    return currentPath === '/farmer/orders' && currentStatus === status;
  };

  // Products sub-links
  const isAllProductsActive = () => {
    return currentPath === '/farmer/products';
  };

  const isAddProductActive = () => {
    return currentPath === '/farmer/products/add';
  };

  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-nav">

        {/* Dashboard — single link */}
        <div className="sidebar-section">
          <NavLink
            to="/farmer"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </NavLink>
        </div>

        {/* Sales — single link */}
        <div className="sidebar-section">
          <NavLink
            to="/farmer/sales"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <i className="fas fa-chart-line"></i> Sales
          </NavLink>
        </div>

        {/* Products — Dropdown */}
        <div className="sidebar-section">
          <button
            type="button"
            className={`sidebar-section-header ${
              currentPath.startsWith('/farmer/products') ? 'active' : ''
            }`}
            onClick={() => toggleSection('products')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-box"></i> Products
            </span>
            <i
              className={`fas fa-chevron-${
                expanded.products ? 'down' : 'right'
              } sidebar-chevron`}
            ></i>
          </button>

          {expanded.products && (
            <div className="sidebar-submenu">
              <NavLink
                to="/farmer/products"
                end
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isAllProductsActive() ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-list"></i> All Products
              </NavLink>

              <NavLink
                to="/farmer/products/add"
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isAddProductActive() ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-plus-circle"></i> Add Product
              </NavLink>
            </div>
          )}
        </div>

        {/* Orders — Dropdown */}
        <div className="sidebar-section">
          <button
            type="button"
            className={`sidebar-section-header ${
              currentPath.startsWith('/farmer/orders') ? 'active' : ''
            }`}
            onClick={() => toggleSection('orders')}
          >
            <span className="sidebar-section-label">
              <i className="fas fa-shopping-bag"></i> Orders
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
                to="/farmer/orders"
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
                to="/farmer/orders?status=placed"
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isOrderStatusActive('placed') ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-hourglass-half"></i> Pending
              </NavLink>

              <NavLink
                to="/farmer/orders?status=accepted"
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isOrderStatusActive('accepted') ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-check"></i> Accepted
              </NavLink>

              <NavLink
                to="/farmer/orders?status=ready_for_pickup"
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isOrderStatusActive('ready_for_pickup') ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-box-open"></i> Ready
              </NavLink>

              <NavLink
                to="/farmer/orders?status=completed"
                className={() =>
                  `sidebar-link sidebar-sublink ${
                    isOrderStatusActive('completed') ? 'active' : ''
                  }`
                }
              >
                <i className="fas fa-check-double"></i> Completed
              </NavLink>

              <NavLink
                to="/farmer/orders?status=cancelled"
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

        {/* Reviews — single link */}
        <div className="sidebar-section">
          <NavLink
            to="/farmer/reviews"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <i className="fas fa-star"></i> Reviews
          </NavLink>
        </div>

        {/* Profile — single link */}
        <div className="sidebar-section">
          <NavLink
            to="/farmer/profile"
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

export default FarmerSidebar;