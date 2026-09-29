import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import FarmerSidebar from "../../components/farmer/FarmerSidebar";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { farmerApi } from "../../api";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  RevenueTimelineChart,
  TopFarmersChart,
  TopCategoriesChart,
} from "../../components/dashboard/DashboardCharts";
import "../../styles/dashboard.css";

const RANGES = [
  { key: "7", label: "7D" },
  { key: "30", label: "30D" },
  { key: "90", label: "90D" },
  { key: "365", label: "1Y" },
];

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
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const FarmerSales = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30");
const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchSales = async () => {
      setLoading(true);
      try {
        const res = await farmerApi.getSales({ range });
        if (mounted) setData(res);
      } catch (error) {
        console.error("Error fetching sales:", error);
        if (mounted) setData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchSales();
    return () => {
      mounted = false;
    };
  }, [range]);

  const formatPercent = (value) => {
    if (value === null || value === undefined) return null;
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const RangeToggle = (
    <div className="chart-range">
      {RANGES.map((r) => (
        <button
          key={r.key}
          type="button"
          className={`chart-range-btn ${range === r.key ? "is-active" : ""}`}
          onClick={() => setRange(r.key)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <FarmerSidebar />
        <main className="dashboard-main">
          {/* Header */}
          <div className="dashboard-header">
            <p className="dashboard-subtitle text-dark fw-bold">Sales</p>
            <p className="dashboard-subtitle">
              Track your revenue, orders, and best-selling products
            </p>
          </div>

          {loading ? (
            <Loader message="Loading sales..." />
          ) : !data ? (
            <EmptyState
              icon="chart-bar"
              title="No Sales Data"
              message="Sales insights will appear once you have completed orders."
            />
          ) : (
            <>
              {/* Range toggle */}
              <div className="sales-toolbar">
                <span className="sales-toolbar-label">Time range:</span>
                {RangeToggle}
              </div>

              {/* KPI strip */}
              <motion.div
                className="stats-grid"
                initial="hidden"
                animate="visible"
                variants={stagger}
              >
                <motion.div
                  className="stat-card"
                  variants={cardPop}
                  custom={0}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <div className="stat-icon green">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">
                      {formatCurrency(data.summary.total_revenue)}
                    </span>
                    <span className="stat-label">Revenue</span>
                    {data.summary.revenue_change !== null && (
                      <span
                        className={`stat-delta ${
                          data.summary.revenue_change >= 0 ? "up" : "down"
                        }`}
                      >
                        {formatPercent(data.summary.revenue_change)} vs prev
                      </span>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="stat-card"
                  variants={cardPop}
                  custom={1}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <div className="stat-icon blue">
                    <i className="fas fa-shopping-bag"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">
                      {data.summary.total_orders}
                    </span>
                    <span className="stat-label">Total Orders</span>
                    {data.summary.orders_change !== null && (
                      <span
                        className={`stat-delta ${
                          data.summary.orders_change >= 0 ? "up" : "down"
                        }`}
                      >
                        {formatPercent(data.summary.orders_change)} vs prev
                      </span>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="stat-card"
                  variants={cardPop}
                  custom={2}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <div className="stat-icon orange">
                    <i className="fas fa-hourglass-half"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">
                      {data.summary.pending_orders}
                    </span>
                    <span className="stat-label">Pending</span>
                  </div>
                </motion.div>

                <motion.div
                  className="stat-card"
                  variants={cardPop}
                  custom={3}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <div className="stat-icon purple">
                    <i className="fas fa-receipt"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">
                      {formatCurrency(data.summary.avg_order_value)}
                    </span>
                    <span className="stat-label">Avg. Order Value</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* ==================== TOP 5 BEST SELLERS ==================== */}
              <motion.div
                className="dashboard-card best-sellers-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <div className="card-header-row">
                  <div>
                    <h2 className="card-title">Top 5 Best Sellers</h2>
                    <p className="card-subtitle">
                      Your highest-performing products by revenue in this range
                    </p>
                  </div>
                  <Link to="/farmer/products" className="card-link">
                    Manage Products
                  </Link>
                </div>

                {!data.top_products || data.top_products.length === 0 ? (
                  <EmptyState
                    icon="box-open"
                    title="No Sales Yet"
                    message="Your best sellers will appear here once you've completed orders."
                  />
                ) : (
                  <div className="best-sellers-list">
                    {data.top_products.map((product, index) => {
                      const rank = index + 1;
                      const rankClass =
                        rank === 1
                          ? "rank-gold"
                          : rank === 2
                            ? "rank-silver"
                            : rank === 3
                              ? "rank-bronze"
                              : "rank-default";

                      return (
                      <motion.div
  key={product.product_id}
  className="best-seller-row"
  onClick={() => navigate(`/products/${product.product_id}`)}
  whileHover={{ x: 4, transition: { duration: 0.2 } }}
  role="link"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/products/${product.product_id}`);
    }
  }}
>
                          {/* Rank badge */}
                          <div className={`best-seller-rank ${rankClass}`}>
                            {rank === 1 ? (
                              <i className="fas fa-crown"></i>
                            ) : (
                              rank
                            )}
                          </div>

                          {/* Product name + meta */}
                          <div className="best-seller-info">
                            <Link
                              to={`/farmer/products`}
                              className="best-seller-name"
                            >
                              {product.name}
                            </Link>
                            <div className="best-seller-meta">
                              <span>
                                <i className="fas fa-cube"></i>
                                {product.total_quantity} {product.unit} sold
                              </span>
                              <span className="best-seller-meta-divider">
                                ·
                              </span>
                              <span>
                                <i className="fas fa-shopping-bag"></i>
                                {product.order_count}{" "}
                                {product.order_count === 1 ? "order" : "orders"}
                              </span>
                            </div>
                          </div>

                          {/* Revenue */}
                          <div className="best-seller-revenue">
                            <span className="best-seller-revenue-value">
                              {formatCurrency(product.total_revenue)}
                            </span>
                            <span className="best-seller-revenue-label">
                              Revenue
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
              {/* Revenue timeline */}
              <motion.div
                className="dashboard-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="card-header-row">
                  <div>
                    <h2 className="card-title">Revenue & Orders</h2>
                    <p className="card-subtitle">
                      Daily performance for the last {data.range} days
                    </p>
                  </div>
                </div>
                <RevenueTimelineChart data={data.timeline} height={320} />
              </motion.div>

              {/* Two charts side by side */}
              <div className="detail-grid-two">
                <motion.div
                  className="dashboard-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="card-header-row">
                    <div>
                      <h2 className="card-title">Top Products</h2>
                      <p className="card-subtitle">
                        By revenue generated in this range
                      </p>
                    </div>
                  </div>

                  {data.top_products?.length === 0 ? (
                    <p className="no-data">No sales in this range.</p>
                  ) : (
                    <>
                      <TopFarmersChart
                        data={data.top_products.map((p) => ({
                          name: p.name,
                          revenue: p.total_revenue,
                        }))}
                        height={280}
                      />

                      <div
                        className="table-responsive"
                        style={{ marginTop: 20 }}
                      >
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Qty Sold</th>
                              <th>Orders</th>
                              <th>Revenue</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.top_products.map((p) => (
                              <tr key={p.product_id}>
                                <td>{p.name}</td>
                                <td>
                                  {p.total_quantity} {p.unit}
                                </td>
                                <td>{p.order_count}</td>
                                <td>{formatCurrency(p.total_revenue)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </motion.div>

                <motion.div
                  className="dashboard-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="card-header-row">
                    <div>
                      <h2 className="card-title">Sales by Category</h2>
                      <p className="card-subtitle">
                        Which categories customers buy most
                      </p>
                    </div>
                  </div>

                  {data.by_category?.length === 0 ? (
                    <p className="no-data">No category data yet.</p>
                  ) : (
                    <>
                      <TopCategoriesChart
                        data={data.by_category.map((c) => ({
                          name: c.name,
                          count: c.quantity,
                        }))}
                        height={280}
                      />

                      <div
                        className="table-responsive"
                        style={{ marginTop: 20 }}
                      >
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Category</th>
                              <th>Qty Sold</th>
                              <th>Revenue</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.by_category.map((c, i) => (
                              <tr key={i}>
                                <td>{c.name}</td>
                                <td>{c.quantity}</td>
                                <td>{formatCurrency(c.revenue)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Recent completed orders */}
              <motion.div
                className="dashboard-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="card-header-row">
                  <div>
                    <h2 className="card-title">Recent Completed Orders</h2>
                    <p className="card-subtitle">
                      Latest orders your farm has fulfilled
                    </p>
                  </div>
                  <Link to="/farmer/orders" className="card-link">
                    View All Orders
                  </Link>
                </div>

                {data.recent_orders?.length === 0 ? (
                  <p className="no-data">No completed orders yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Pickup</th>
                          <th>Completed</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recent_orders.map((o) => (
                          <tr key={o.order_id}>
                            <td>ORD-{String(o.order_id).padStart(4, "0")}</td>
                            <td>{o.customer_name}</td>
                            <td>{o.items_count}</td>
                            <td>{o.pickup_date}</td>
                            <td>
                              {o.completed_at
                                ? formatDate(o.completed_at)
                                : "—"}
                            </td>
                            <td className="text-bold">
                              {formatCurrency(o.total_amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

              {/* Payment methods */}
              {data.payment_methods?.length > 0 && (
                <motion.div
                  className="dashboard-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="card-header-row">
                    <div>
                      <h2 className="card-title">Payment Methods</h2>
                      <p className="card-subtitle">
                        How customers pay for your products
                      </p>
                    </div>
                  </div>

                  <div className="payment-methods-grid">
                    {data.payment_methods.map((pm, i) => (
                      <div key={i} className="payment-method-card">
                        <div className="payment-method-icon">
                          <i className="fas fa-money-bill-wave"></i>
                        </div>
                        <div className="payment-method-body">
                          <span className="payment-method-label">
                            {pm.method}
                          </span>
                          <span className="payment-method-value">
                            {formatCurrency(pm.total)}
                          </span>
                          <span className="payment-method-count">
                            {pm.count} order{pm.count === 1 ? "" : "s"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>
     
    </div>
  );
};

export default FarmerSales;
