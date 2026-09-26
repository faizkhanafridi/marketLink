import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ChevronDown,
  Package,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import '../../styles/navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close menus when route changes
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [navigate]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside user menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-wrapper')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'farmer') return '/farmer';
    if (user?.role === 'admin') return '/admin';
    return '/customer';
  };

  const cartCount = getCartCount ? getCartCount() : 0;

  return (
    <nav className={`marketlink-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* ===== BRAND ===== */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
         <div className="brand-logo">
  <svg
    viewBox="0 0 180 180"
    className="brand-svg"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Basket body */}
    <path
      d="M30 78 L150 78 L138 138 C136.5 143 131.5 146 126.5 146 L53.5 146 C48.5 146 43.5 143 42 138 Z"
      fill="#F5F5F0"
    />

    {/* Basket rim */}
    <rect
      x="22"
      y="66"
      width="136"
      height="14"
      rx="7"
      fill="#F5F5F0"
    />

    {/* Handle */}
    <path
      d="M60 66 C60 36, 120 36, 120 66"
      stroke="#F5F5F0"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />

    {/* Weave lines */}
    <line x1="58" y1="88" x2="55" y2="134" stroke="#194D26" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="83" y1="88" x2="82" y2="134" stroke="#194D26" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="108" y1="88" x2="110" y2="134" stroke="#194D26" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="130" y1="88" x2="133" y2="134" stroke="#194D26" strokeWidth="2.4" strokeLinecap="round" />

    {/* Leaf 1 (mint) */}
    <path
      d="M75 66 C75 44, 92 34, 104 42 C114 50, 100 66, 84 66 Z"
      fill="#6EE7B7"
    />

    {/* Leaf 2 (gold) */}
    <path
      d="M104 66 C108 42, 132 36, 140 48 C146 58, 128 68, 112 66 Z"
      fill="#A6895C"
    />
  </svg>
</div>
          <div className="brand-text">
            <span className="brand-name">
              <span className="brand-name-primary">Market</span>
              <span className="brand-name-accent">Link</span>
            </span>
            <span className="brand-tagline">eGreen Basket</span>
          </div>
        </Link>

        {/* ===== DESKTOP NAV ===== */}
        <div className="navbar-menu">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/products" className="nav-link">
            Products
          </NavLink>
          <NavLink to="/markets" className="nav-link">
            Markets
          </NavLink>
          <NavLink to="/farmers" className="nav-link">
            Farmers
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {user?.role === 'customer' && (
                <Link to="/customer/cart" className="cart-button" aria-label="Basket">
                  <ShoppingBag size={19} strokeWidth={2} />
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>
              )}

              <div className="user-menu-wrapper">
                <button
                  type="button"
                  className="user-menu-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <span className="user-avatar">
                    {user?.username?.charAt(0).toUpperCase() || '?'}
                  </span>
                  <span className="user-name">{user?.username}</span>
                  <ChevronDown
                    size={13}
                    className={`user-chevron ${userMenuOpen ? 'open' : ''}`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <span className="user-dropdown-name">{user?.username}</span>
                      <span className="user-dropdown-email">{user?.email}</span>
                      <span className="user-dropdown-role">
                        {user?.role}
                      </span>
                    </div>

                    <Link to={getDashboardLink()} className="dropdown-item">
                      <LayoutDashboard size={15} />
                      <span>Dashboard</span>
                    </Link>

                    {user?.role === 'customer' && (
                      <>
                        <Link to="/customer/orders" className="dropdown-item">
                          <Package size={15} />
                          <span>My Pre-Orders</span>
                        </Link>
                        <Link to="/customer/favorites" className="dropdown-item">
                          <Heart size={15} />
                          <span>Saved Favorites</span>
                        </Link>
                      </>
                    )}

                    {user?.role !== 'admin' && (
                      <Link
                        to={`${getDashboardLink()}/profile`}
                        className="dropdown-item"
                      >
                          <User size={15} />

                        <span>Profile</span>
                      </Link>
                    )}

                    <div className="dropdown-divider" />

                    <button onClick={handleLogout} className="dropdown-item logout">
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-actions">
              <Link to="/login" className="btn-nav btn-outline">
                Sign In
              </Link>
              <Link to="/register" className="btn-nav btn-primary">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <NavLink to="/" end className="mobile-link" onClick={() => setMobileOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" className="mobile-link" onClick={() => setMobileOpen(false)}>
            Products
          </NavLink>
          <NavLink to="/markets" className="mobile-link" onClick={() => setMobileOpen(false)}>
            Markets
          </NavLink>
          <NavLink to="/farmers" className="mobile-link" onClick={() => setMobileOpen(false)}>
            Farmers
          </NavLink>
          <NavLink to="/about" className="mobile-link" onClick={() => setMobileOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" className="mobile-link" onClick={() => setMobileOpen(false)}>
            Contact
          </NavLink>

          {!isAuthenticated && (
            <div className="mobile-auth">
              <Link to="/login" className="btn-nav btn-outline" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn-nav btn-primary" onClick={() => setMobileOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;