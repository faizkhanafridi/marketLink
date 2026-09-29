import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ProductForm from '../../components/farmer/ProductForm';
import { productApi, categoryApi, farmerApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, getImageUrl } from '../../utils/formatters';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';

const FarmerProducts = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingLoading, setEditingLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Read view state from URL
  const view = searchParams.get('view'); // 'add' | 'edit' | null
  const editId = searchParams.get('id');
  const showForm = view === 'add' || view === 'edit';

  const farmerId = user?.farmer_profile?.farmer_id;

  /* ---------- Fetch products ---------- */
  const fetchProducts = async () => {
    try {
      const res = await farmerApi.getMyProducts();
      const data = res.data || res;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catsData = await categoryApi.getAll();
        setCategories(Array.isArray(catsData) ? catsData : []);
        await fetchProducts();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmerId]);

  /* ---------- Sync `editingProduct` with URL ---------- */
  useEffect(() => {
    // Reset when leaving the edit view
    if (view !== 'edit') {
      setEditingProduct(null);
      return;
    }

    if (!editId) {
      navigate('/farmer/products', { replace: true });
      return;
    }

    // Try to find it in already-loaded products
    const existing = products.find(
      (p) => String(p.product_id) === String(editId)
    );

    if (existing) {
      setEditingProduct(existing);
      return;
    }

    // Fall back to fetching from the API
    const fetchOne = async () => {
      setEditingLoading(true);
      try {
        const data = await productApi.getById(editId);
        setEditingProduct(data);
      } catch (err) {
        console.error('Failed to load product for edit:', err);
        toast.error('Failed to load product');
        navigate('/farmer/products', { replace: true });
      } finally {
        setEditingLoading(false);
      }
    };
    fetchOne();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, editId, products]);

  /* ---------- Open add form ---------- */
  const handleOpenAdd = () => {
    navigate('/farmer/products?view=add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------- Open edit form ---------- */
  const handleOpenEdit = (product) => {
    navigate(`/farmer/products?view=edit&id=${product.product_id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------- Close form ---------- */
  const handleCloseForm = () => {
    navigate('/farmer/products');
  };

  /* ---------- Delete ---------- */
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    try {
      await productApi.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  /* ---------- Mark sold out ---------- */
  const handleMarkSoldOut = async (id) => {
    try {
      await productApi.markSoldOut(id);
      toast.success('Marked as sold out');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  /* ---------- Form submit ---------- */
  const handleFormSubmit = async (payload) => {
    try {
      if (editingProduct) {
        await productApi.update(editingProduct.product_id, payload);
        toast.success('Product updated');
      } else {
        await productApi.create(payload);
        toast.success('Product created');
      }
      navigate('/farmer/products');
      fetchProducts();
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      } else {
        toast.error(error.response?.data?.message || 'Failed to save product');
      }
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <FarmerSidebar />
        <main className="dashboard-main">

          {/* ---------- Header ---------- */}
          <div className="fp-header">
            <div className="fp-header-text">
              <p className="dashboard-subtitle text-dark fw-bold">
                {view === 'add'
                  ? 'Add Product'
                  : view === 'edit'
                  ? 'Edit Product'
                  : 'My Products'}
              </p>
              <p className="dashboard-subtitle">
                {view === 'add'
                  ? 'Create a new product listing'
                  : view === 'edit'
                  ? 'Update this product\'s details'
                  : 'Manage your weekly stock and pricing'}
              </p>
            </div>

            <div className="fp-header-actions">
              <span className="fp-count-badge">
                <i className="fas fa-box"></i>
                {products.length}{' '}
                {products.length === 1 ? 'product' : 'products'}
              </span>

              {!showForm && (
                <button
                  type="button"
                  className="fp-add-btn"
                  onClick={handleOpenAdd}
                  disabled={!user?.is_approved}
                >
                  <i className="fas fa-plus"></i>
                  Add Product
                </button>
              )}

              {showForm && (
                <button
                  type="button"
                  className="fp-close-btn"
                  onClick={handleCloseForm}
                  title="Back to products"
                  aria-label="Back to products"
                >
                  <i className="fas fa-arrow-left"></i> Back
                </button>
              )}
            </div>
          </div>

          {/* ---------- Approval warning ---------- */}
          {!user?.is_approved && (
            <div className="alert-banner alert-warning">
              <i className="fas fa-exclamation-triangle"></i>
              <div>
                <strong>Account Pending Approval</strong>
                <p>
                  You cannot add products until an admin approves your account.
                </p>
              </div>
            </div>
          )}

          {/* ---------- Inline form ---------- */}
          {showForm && (
            <div className="dashboard-card fp-form-card">
              <div className="fp-form-head">
                <div>
                  <h3 className="card-title">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <p className="fp-form-subtitle">
                    {editingProduct
                      ? 'Update the details below and save your changes.'
                      : 'Fill in the details to publish a new product.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="fp-close-btn"
                  onClick={handleCloseForm}
                  title="Close"
                  aria-label="Close form"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {editingLoading ? (
                <Loader message="Loading product..." />
              ) : (
                <ProductForm
                  product={editingProduct}
                  categories={categories}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCloseForm}
                />
              )}
            </div>
          )}

          {/* ---------- Products list (hidden when editing) ---------- */}
          {!showForm && (
            <>
              {loading ? (
                <Loader message="Loading products..." />
              ) : products.length === 0 ? (
                <EmptyState
                  icon="box-open"
                  title="No Products Yet"
                  message="Add your first product to start selling."
                  actionText="Add Product"
                  onAction={handleOpenAdd}
                />
              ) : (
                <div className="dashboard-card fp-table-card">
                  <div className="table-responsive">
                    <table className="data-table fp-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th className="fp-actions-col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.product_id}>
                            <td>
                              <div className="table-product">
                                <img
                                  src={getImageUrl(product.image)}
                                  alt={product.name}
                                  className="table-product-img"
                                  onError={(e) => {
                                    e.target.src =
                                      '/assets/images/default-product.jpg';
                                  }}
                                />
                                <div className="table-product-info">
                                  <span className="table-product-name">
                                    {product.name}
                                  </span>
                                  {product.description && (
                                    <span className="table-product-desc">
                                      {product.description.length > 60
                                        ? product.description.slice(0, 60) + '…'
                                        : product.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td>
                              {product.category?.name ? (
                                <span className="chip chip-muted">
                                  {product.category.name}
                                </span>
                              ) : (
                                <span className="fp-dash">—</span>
                              )}
                            </td>

                            <td className="fp-price-cell">
                              {formatCurrency(product.price)}
                              {product.unit && (
                                <span className="fp-unit"> / {product.unit}</span>
                              )}
                            </td>

                            <td>
                              <span
                                className={`status-badge ${
                                  product.stock_quantity > 0
                                    ? 'status-available'
                                    : 'status-unavailable'
                                }`}
                              >
                                {product.stock_quantity}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`status-badge ${
                                  product.is_available
                                    ? 'status-available'
                                    : 'status-unavailable'
                                }`}
                              >
                                {product.is_available ? 'Available' : 'Sold Out'}
                              </span>
                            </td>

                            <td>
                              <div className="fp-actions">
                                <button
                                  type="button"
                                  className="fp-icon-btn fp-icon-edit"
                                  onClick={() => handleOpenEdit(product)}
                                  title="Edit product"
                                  aria-label="Edit product"
                                >
                                  <i className="fas fa-pen"></i>
                                </button>

                                {product.is_available && (
                                  <button
                                    type="button"
                                    className="fp-icon-btn fp-icon-warn"
                                    onClick={() =>
                                      handleMarkSoldOut(product.product_id)
                                    }
                                    title="Mark as sold out"
                                    aria-label="Mark as sold out"
                                  >
                                    <i className="fas fa-ban"></i>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="fp-icon-btn fp-icon-danger"
                                  onClick={() => handleDelete(product.product_id)}
                                  title="Delete product"
                                  aria-label="Delete product"
                                  disabled={deletingId === product.product_id}
                                >
                                  {deletingId === product.product_id ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                  ) : (
                                    <i className="fas fa-trash-alt"></i>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>
      
    </div>
  );
};

export default FarmerProducts;