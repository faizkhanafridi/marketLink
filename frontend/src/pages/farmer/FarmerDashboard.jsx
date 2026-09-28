import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { farmerApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';
import {
  ChartCard,
  RevenueTimelineChart,
  OrderStatusChart,
  RatingsRadarChart,
  TopFarmersChart,
} from '../../components/dashboard/DashboardCharts';
import '../../styles/dashboard.css';

const RANGES = [
  { key: '7', label: '7D' },
  { key: '30', label: '30D' },
  { key: '90', label: '90D' },
];

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const cardPop = {
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const rowIn = {
  hidden: { opacity: 0, x: -10 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ============================================================
   PAGE
   ============================================================ */
const FarmerDashboard = () => {
  const { user, isFarmer } = useAuth();
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [range, setRange] = useState('30');

  /* ---------- Fetch dashboard KPIs ---------- */
  useEffect(() => {
    if (!isFarmer) return;
    const fetchDashboard = async () => {
      try {
        const res = await farmerApi.getDashboard();
        setData(res);
      } catch (error) {
        console.error('Error fetching farmer dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [isFarmer]);

  /* ---------- Fetch analytics ---------- */
  useEffect(() => {
    if (!isFarmer) return;
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const res = await farmerApi.getAnalytics({ range });
        setAnalytics(res);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setAnalytics(null);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [isFarmer, range]);

  /* ---------- Access guard ---------- */
  if (!isFarmer) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="container" style={{ padding: '100px 20px' }}>
          <EmptyState
            icon="lock"
            title="Farmer Access Only"
            message="You need a farmer account to access this dashboard."
          />
        </div>
        <Footer />
      </div>
    );
  }

  /* ---------- Range toggle ---------- */
  const RangeToggle = (
    <div className="chart-range">
      {RANGES.map((r) => (
        <button
          key={r.key}
          type="button"
          className={`chart-range-btn ${range === r.key ? 'is-active' : ''}`}
          onClick={() => setRange(r.key)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="dashboard-layout">
          <FarmerSidebar />
          <main className="dashboard-main">
            <Loader fullScreen message="Loading dashboard..." />
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <FarmerSidebar />
        <main className="dashboard-main">

          {/* ==================== HEADER ==================== */}
          <motion.div
            className="dashboard-header"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h1 variants={fadeUp} className="dashboard-title">
              Welcome,{' '}
              {user?.farmer_profile?.stall_name || user?.username || 'Farmer'}
            </motion.h1>
            <motion.p variants={fadeUp} className="dashboard-subtitle">
              Your farm business overview
            </motion.p>
          </motion.div>

          {/* ==================== APPROVAL ALERT ==================== */}
          <AnimatePresence>
            {!user?.is_approved && (
              <motion.div
                className="alert-banner alert-warning"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <i className="fas fa-exclamation-triangle"></i>
                Your account is pending approval. You'll be able to list
                products once approved.
              </motion.div>
            )}
          </AnimatePresence>

          {data ? (
            <>
              {/* ==================== KPI STRIP ==================== */}
              <motion.div
                className="stats-grid"
                initial="hidden"
                animate="visible"
                variants={stagger}
              >
                {[
                  {
                    icon: 'fas fa-shopping-bag',
                    cls: 'blue',
                    value: data.total_orders,
                    label: 'Total Orders',
                  },
                  {
                    icon: 'fas fa-clock',
                    cls: 'orange',
                    value: data.pending_orders,
                    label: 'Pending',
                  },
                  {
                    icon: 'fas fa-check-circle',
                    cls: 'green',
                    value: data.completed_orders,
                    label: 'Completed',
                  },
                  {
                    icon: 'fas fa-dollar-sign',
                    cls: 'purple',
                    value: formatCurrency(data.revenue_summary),
                    label: 'Revenue',
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    className="stat-card"
                    variants={cardPop}
                    custom={idx}
                    whileHover={{
                      y: -6,
                      boxShadow: '0 18px 40px rgba(0,0,0,0.10)',
                      transition: { duration: 0.25 },
                    }}
                  >
                    <motion.div
                      className={`stat-icon ${stat.cls}`}
                      whileHover={{ rotate: 8, scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <i className={stat.icon}></i>
                    </motion.div>
                    <div className="stat-content">
                      <motion.span
                        className="stat-value"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.45,
                          delay: 0.2 + idx * 0.08,
                          type: 'spring',
                          stiffness: 260,
                        }}
                      >
                        {stat.value}
                      </motion.span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* ==================== ANALYTICS ==================== */}
              <div className="section-divider">
                <h2 className="section-title">Analytics</h2>
                <p className="section-subtitle">
                  Your sales and customer insights
                </p>
              </div>

              {analyticsLoading ? (
                <Loader message="Loading analytics..." />
              ) : analytics ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={stagger}
                >
                  {/* Row 1 — Revenue timeline */}
                  <motion.div
                    className="charts-grid"
                    variants={fadeUp}
                  >
                    <ChartCard
                      title="Revenue & Orders"
                      subtitle={`Last ${analytics.range} days`}
                      actions={RangeToggle}
                      span={2}
                    >
                      <RevenueTimelineChart
                        data={analytics.timeline}
                        height={320}
                      />
                    </ChartCard>
                  </motion.div>

                  {/* Row 2 — Order status + Ratings */}
                  <motion.div
                    className="charts-grid"
                    variants={fadeUp}
                  >
                    <ChartCard
                      title="Order Status"
                      subtitle="Breakdown of your orders"
                    >
                      <OrderStatusChart
                        data={analytics.order_status}
                        height={300}
                      />
                    </ChartCard>

                    <ChartCard
                      title="Customer Ratings"
                      subtitle="Review score distribution"
                    >
                      <RatingsRadarChart
                        data={analytics.ratings}
                        height={300}
                      />
                    </ChartCard>
                  </motion.div>

                  {/* Row 3 — Top products */}
                  <motion.div
                    className="charts-grid"
                    variants={fadeUp}
                  >
                    <ChartCard
                      title="Top Products"
                      subtitle="By number of reviews"
                      span={2}
                    >
                      <TopFarmersChart
                        data={(analytics.top_products || []).map((p) => ({
                          name: p.name,
                          revenue: p.reviews_count || 0,
                        }))}
                        height={280}
                      />
                    </ChartCard>
                  </motion.div>
                </motion.div>
              ) : null}

              {/* ==================== BEST SELLING TABLE ==================== */}
              <motion.div
                className="dashboard-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.4 }}
              >
                <div className="card-header-row">
                  <h2 className="card-title">Best Selling Products</h2>
                  <Link to="/farmer/products" className="card-link">
                    Manage Products
                  </Link>
                </div>

                {data.best_selling?.length === 0 ? (
                  <EmptyState
                    icon="box-open"
                    title="No Products Yet"
                    message="Add your first product to start selling."
                    actionText="Add Product"
                    onAction={() =>
                      (window.location.href = '/farmer/products')
                    }
                  />
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.best_selling?.map((product, i) => (
                          <motion.tr
                            key={product.product_id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.35,
                              delay: 0.5 + i * 0.04,
                            }}
                          >
                            <td>{product.name}</td>
                            <td>{formatCurrency(product.price)}</td>
                            <td>{product.stock_quantity}</td>
                            <td>
                              <span
                                className={`status-badge status-${
                                  product.is_available
                                    ? 'available'
                                    : 'unavailable'
                                }`}
                              >
                                {product.is_available
                                  ? 'Available'
                                  : 'Sold Out'}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </>
          ) : (
            <EmptyState
              icon="exclamation-circle"
              title="Unable to Load Dashboard"
              message="Please try again later."
            />
          )}

        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerDashboard;