import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../../styles/dashboard.css';

const FarmerSidebar = () => {
  const location = useLocation();

  const currentPath = location.pathname;
  const currentSearch = new URLSearchParams(location.search);
  const currentStatus = currentSearch.get('status');

  // All sections expanded by default
  const [expanded, setExpanded] = useState({
    products: true,
    orders: true,
  });

  const toggleSection = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* ---------- Active helpers ---------- */
  const isAllOrdersActive = () =>
    currentPath === '/farmer/orders' && !currentStatus;

  const isOrderStatusActive = (status) =>
    currentPath === '/farmer/orders' && currentStatus === status;

  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-nav">

        {/* Dashboard */}
        <div className="sidebar-section">
          <NavLink
            to="/farmer"
            end
            className={({ isActive }) =>
              `sidebar-section-header ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-section-label">
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </span>
          </NavLink>
        </div>

        {/* Sales */}
        <div className="sidebar-section">
          <NavLink
            to="/farmer/sales"
            className={({ isActive }) =>
              `sidebar-section-header ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-section-label">
              <i className="fas fa-chart-line"></i> Sales
            </span>
          </NavLink>
        </div>

        {/* Products */}
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
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    currentPath === '/farmer/products' &&
                    !currentSearch.get('view')
                      ? 'active'
                      : ''
                  }`
                }
              >
                All Products
              </NavLink>

              <NavLink
                to="/farmer/products?view=add"
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    currentPath === '/farmer/products' &&
                    currentSearch.get('view') === 'add'
                      ? 'active'
                      : ''
                  }`
                }
              >
                Add Product
              </NavLink>
            </div>
          )}
        </div>

        {/* Orders */}
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
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isAllOrdersActive() ? 'active' : ''
                  }`
                }
              >
                All Orders
              </NavLink>
              <NavLink
                to="/farmer/orders?status=placed"
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isOrderStatusActive('placed') ? 'active' : ''
                  }`
                }
              >
                Pending
              </NavLink>
              <NavLink
                to="/farmer/orders?status=accepted"
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isOrderStatusActive('accepted') ? 'active' : ''
                  }`
                }
              >
                Accepted
              </NavLink>
              <NavLink
                to="/farmer/orders?status=ready_for_pickup"
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isOrderStatusActive('ready_for_pickup') ? 'active' : ''
                  }`
                }
              >
                Ready
              </NavLink>
              <NavLink
                to="/farmer/orders?status=completed"
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isOrderStatusActive('completed') ? 'active' : ''
                  }`
                }
              >
                Completed
              </NavLink>
              <NavLink
                to="/farmer/orders?status=cancelled"
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isOrderStatusActive('cancelled') ? 'active' : ''
                  }`
                }
              >
                Cancelled
              </NavLink>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="sidebar-section">
          <NavLink
            to="/farmer/reviews"
            className={({ isActive }) =>
              `sidebar-section-header ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-section-label">
              <i className="fas fa-star"></i> Reviews
            </span>
          </NavLink>
        </div>

        {/* Profile */}
        <div className="sidebar-section">
          <NavLink
            to="/farmer/profile"
            className={({ isActive }) =>
              `sidebar-section-header ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-section-label">
              <i className="fas fa-user"></i> Profile
            </span>
          </NavLink>
        </div>

      </nav>
    </aside>
  );
};

export default FarmerSidebar;