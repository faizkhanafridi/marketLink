import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/dashboard.css';

const CustomerSidebar = () => {
  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/customer" end className="sidebar-link">
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </NavLink>
        <NavLink to="/customer/orders" className="sidebar-link">
          <i className="fas fa-shopping-bag"></i> My Orders
        </NavLink>
        <NavLink to="/customer/cart" className="sidebar-link">
          <i className="fas fa-shopping-basket"></i> Cart
        </NavLink>
        <NavLink to="/customer/favorites" className="sidebar-link">
          <i className="fas fa-heart"></i> Favorites
        </NavLink>
        <NavLink to="/customer/profile" className="sidebar-link">
          <i className="fas fa-user"></i> Profile
        </NavLink>
        <NavLink to="/products" className="sidebar-link">
          <i className="fas fa-store"></i> Browse Products
        </NavLink>
      </nav>
    </aside>
  );
};

export default CustomerSidebar;