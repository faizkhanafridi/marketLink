import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/dashboard.css';

const AdminSidebar = () => {
  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/admin" end className="sidebar-link">
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </NavLink>
        <NavLink to="/admin/users" className="sidebar-link">
          <i className="fas fa-users"></i> Users
        </NavLink>
        <NavLink to="/admin/markets" className="sidebar-link">
          <i className="fas fa-store"></i> Markets
        </NavLink>
        <NavLink to="/admin/categories" className="sidebar-link">
          <i className="fas fa-tags"></i> Categories
        </NavLink>
        <NavLink to="/admin/reviews" className="sidebar-link">
          <i className="fas fa-star"></i> Reviews
        </NavLink>
        <NavLink to="/admin/reports" className="sidebar-link">
          <i className="fas fa-chart-bar"></i> Reports
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;