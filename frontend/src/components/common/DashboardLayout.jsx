import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const DashboardLayout = ({ sidebar, children, title, subtitle, actions }) => {
  return (
    <div className="ds-page">
      <Navbar />

      <div className="ds-shell">
        <aside className="ds-sidebar-wrap">{sidebar}</aside>

        <main className="ds-main">
          {(title || subtitle || actions) && (
            <header className="ds-header">
              <div className="ds-header-text">
                {title && <h1 className="ds-title">{title}</h1>}
                {subtitle && <p className="ds-subtitle">{subtitle}</p>}
              </div>
              {actions && <div className="ds-header-actions">{actions}</div>}
            </header>
          )}

          <div className="ds-content">{children}</div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;