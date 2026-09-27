import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { productApi, adminApi } from '../../api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodData, catData] = await Promise.all([
          productApi.getAll(),
          adminApi.getCategories(),
        ]);
        setProducts(Array.isArray(prodData) ? prodData : prodData.data || []);
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.farmer_name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !categoryFilter || String(p.category_id) === String(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">All Products</h1>
              <p className="dashboard-subtitle">
                View products listed by farmers across the marketplace
              </p>
            </div>
            <span className="category-count-badge">
              <i className="fas fa-box"></i> {products.length} products
            </span>
          </div>

          <div className="dashboard-card">
            <div className="filters-row">
              <div className="input-with-icon" style={{ flex: 1 }}>
                <i className="fas fa-search input-icon"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by product or farmer name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="form-control"
                style={{ maxWidth: 220 }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <Loader message="Loading products..." />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="box"
              title="No Products Found"
              message="No products match your filters."
            />
          ) : (
            <div className="dashboard-card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Farmer</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Listed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.product_id}>
                        <td>
                          <div className="product-cell">
                            <div className="product-thumb">
                              {p.image_url ? (
                                <img src={p.image_url} alt={p.name} />
                              ) : (
                                <i className="fas fa-box"></i>
                              )}
                            </div>
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td>{p.farmer_name || '—'}</td>
                        <td>
                          {p.category_name ? (
                            <span className="chip chip-muted">
                              {p.category_name}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="text-bold">
                          {formatCurrency(p.price)}
                        </td>
                        <td>
                          <span
                            className={`status-badge status-${
                              p.stock > 0 ? 'available' : 'unavailable'
                            }`}
                          >
                            {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge status-${
                              p.is_active ? 'available' : 'pending'
                            }`}
                          >
                            {p.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{formatDate(p.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminProducts;