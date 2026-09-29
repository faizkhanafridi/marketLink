import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingBasket,
  Heart,
  User,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import "../../styles/dashboard.css";

const CustomerSidebar = () => {
  const location = useLocation();

  const currentPath = location.pathname;
  const currentSearch = new URLSearchParams(location.search);
  const currentStatus = currentSearch.get("status");
  const currentTab = currentSearch.get("tab");

  // ALL sections expanded by default
  const [expanded, setExpanded] = useState({
    orders: true,
    favorites: true,
  });

  const toggleSection = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* ---------- Active helpers ---------- */
  const isOrderStatusActive = (status) =>
    currentPath === "/customer/orders" && currentStatus === status;

  const isAllOrdersActive = () =>
    currentPath === "/customer/orders" && !currentStatus;

  const isFavoritesTabActive = (tab) =>
    currentPath === "/customer/favorites" && currentTab === tab;

  const isFavoritesRootActive = () =>
    currentPath === "/customer/favorites" && !currentTab;

  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-nav">

        {/* Dashboard */}
        <div className="sidebar-section">
          <NavLink
            to="/customer"
            end
            className={({ isActive }) =>
              `sidebar-section-header ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-section-label">
              <LayoutDashboard size={16} /> Dashboard
            </span>
          </NavLink>
        </div>

        {/* My Orders */}
        <div className="sidebar-section">
          <button
            type="button"
            className={`sidebar-section-header ${
              currentPath.startsWith("/customer/orders") ? "active" : ""
            }`}
            onClick={() => toggleSection("orders")}
          >
            <span className="sidebar-section-label">
              <ShoppingBag size={16} /> My Orders
            </span>
            {expanded.orders ? (
              <ChevronDown size={14} className="sidebar-chevron" />
            ) : (
              <ChevronRight size={14} className="sidebar-chevron" />
            )}
          </button>

          {expanded.orders && (
            <div className="sidebar-submenu">
              <NavLink
                to="/customer/orders"
                end
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isAllOrdersActive() ? "active" : ""
                  }`
                }
              >
                All Orders
              </NavLink>
              <NavLink
                to="/customer/orders?status=placed"
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isOrderStatusActive("placed") ? "active" : ""
                  }`
                }
              >
                Placed
              </NavLink>
              <NavLink
                to="/customer/orders?status=accepted"
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isOrderStatusActive("accepted") ? "active" : ""
                  }`
                }
              >
                Accepted
              </NavLink>
              <NavLink
                to="/customer/orders?status=ready_for_pickup"
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isOrderStatusActive("ready_for_pickup") ? "active" : ""
                  }`
                }
              >
                Ready
              </NavLink>
              <NavLink
                to="/customer/orders?status=completed"
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isOrderStatusActive("completed") ? "active" : ""
                  }`
                }
              >
                Completed
              </NavLink>
              <NavLink
                to="/customer/orders?status=cancelled"
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isOrderStatusActive("cancelled") ? "active" : ""
                  }`
                }
              >
                Cancelled
              </NavLink>
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="sidebar-section">
          <NavLink
            to="/customer/cart"
            className={({ isActive }) =>
              `sidebar-section-header ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-section-label">
              <ShoppingBasket size={16} /> Cart
            </span>
          </NavLink>
        </div>

        {/* Checkout */}
        <div className="sidebar-section">
          <NavLink
            to="/customer/checkout"
            className={({ isActive }) =>
              `sidebar-section-header ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-section-label">
              <ShoppingCart size={16} /> Checkout
            </span>
          </NavLink>
        </div>

        {/* Favorites */}
        <div className="sidebar-section">
          <button
            type="button"
            className={`sidebar-section-header ${
              currentPath.startsWith("/customer/favorites") ? "active" : ""
            }`}
            onClick={() => toggleSection("favorites")}
          >
            <span className="sidebar-section-label">
              <Heart size={16} /> Favorites
            </span>
            {expanded.favorites ? (
              <ChevronDown size={14} className="sidebar-chevron" />
            ) : (
              <ChevronRight size={14} className="sidebar-chevron" />
            )}
          </button>

          {expanded.favorites && (
            <div className="sidebar-submenu">
              <NavLink
                to="/customer/favorites"
                end
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isFavoritesRootActive() ? "active" : ""
                  }`
                }
              >
                All Favorites
              </NavLink>
              <NavLink
                to="/customer/favorites?tab=products"
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isFavoritesTabActive("products") ? "active" : ""
                  }`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/customer/favorites?tab=farmers"
                className={() =>
                  `sidebar-link sidebar-sublink sidebar-sublink-plain ${
                    isFavoritesTabActive("farmers") ? "active" : ""
                  }`
                }
              >
                Farmers
              </NavLink>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="sidebar-section">
          <NavLink
            to="/customer/profile"
            className={({ isActive }) =>
              `sidebar-section-header ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-section-label">
              <User size={16} /> Profile
            </span>
          </NavLink>
        </div>

      </nav>
    </aside>
  );
};

export default CustomerSidebar;