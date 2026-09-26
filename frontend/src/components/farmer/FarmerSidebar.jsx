import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/dashboard.css';

const FarmerSidebar = () => {
  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/farmer" end className="sidebar-link">
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </NavLink>
        <NavLink to="/farmer/products" className="sidebar-link">
          <i className="fas fa-box"></i> My Products
        </NavLink>
        <NavLink to="/farmer/orders" className="sidebar-link">
          <i className="fas fa-shopping-bag"></i> Orders
        </NavLink>
        <NavLink to="/farmer/reviews" className="sidebar-link">
          <i className="fas fa-star"></i> Reviews
        </NavLink>
        <NavLink to="/farmer/profile" className="sidebar-link">
          <i className="fas fa-user"></i> Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default FarmerSidebar;