import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ProductForm from '../../components/farmer/ProductForm';
import { productApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';
import { categoryApi } from '../../api';
const FarmerProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const farmerId = user?.farmer_profile?.farmer_id;

  const fetchProducts = async () => {
    try {
      const res = await productApi.getAll({ farmer_id: farmerId, per_page: 100 });
      const data = res.data || res;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
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
  }, [farmerId]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productApi.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleMarkSoldOut = async (id) => {
    try {
      await productApi.markSoldOut(id);
      toast.success('Marked as sold out');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await productApi.update(editingProduct.product_id, formData);
        toast.success('Product updated');
      } else {
        await productApi.create(formData);
        toast.success('Product created');
      }
      setShowForm(false);
      setEditingProduct(null);
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
          <div className="dashboard-header-row">
            <div>
              <h1 className="dashboard-title">My Products</h1>
              <p className="dashboard-subtitle">Manage your weekly stock and pricing</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => { setEditingProduct(null); setShowForm(true); }}
              disabled={!user?.is_approved}
            >
              <i className="fas fa-plus"></i> Add Product
            </button>
          </div>

          {!user?.is_approved && (
            <div className="alert-banner alert-warning">
              <i className="fas fa-exclamation-triangle"></i>
              Your account is pending approval. You cannot add products yet.
            </div>
          )}

          {showForm && (
            <div className="dashboard-card">
              <div className="card-header-row">
                <h3 className="card-title">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  className="btn-close-sm"
                  onClick={() => { setShowForm(false); setEditingProduct(null); }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <ProductForm
                product={editingProduct}
                categories={categories}
                onSubmit={handleFormSubmit}
                onCancel={() => { setShowForm(false); setEditingProduct(null); }}
              />
            </div>
          )}

          {loading ? (
            <Loader message="Loading products..." />
          ) : products.length === 0 ? (
            <EmptyState
              icon="box-open"
              title="No Products Yet"
              message="Add your first product to start selling."
              actionText="Add Product"
              onAction={() => setShowForm(true)}
            />
          ) : (
            <div className="dashboard-card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.product_id}>
                        <td>
                          <div className="table-product">
                            <img
                              src={product.image || '/assets/images/default-product.jpg'}
                              alt={product.name}
                              className="table-product-img"
                              onError={(e) => { e.target.src = '/assets/images/default-product.jpg'; }}
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.category?.name || '-'}</td>
                        <td>{formatCurrency(product.price)} / {product.unit}</td>
                        <td>{product.stock_quantity}</td>
                        <td>
                          <span className={`status-badge status-${product.is_available ? 'available' : 'unavailable'}`}>
                            {product.is_available ? 'Available' : 'Sold Out'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="action-btn edit" onClick={() => handleEdit(product)} title="Edit">
                              <i className="fas fa-edit"></i>
                            </button>
                            {product.is_available && (
                              <button className="action-btn warning" onClick={() => handleMarkSoldOut(product.product_id)} title="Mark Sold Out">
                                <i className="fas fa-ban"></i>
                              </button>
                            )}
                            <button className="action-btn delete" onClick={() => handleDelete(product.product_id)} title="Delete">
                              <i className="fas fa-trash"></i>
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
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerProducts;