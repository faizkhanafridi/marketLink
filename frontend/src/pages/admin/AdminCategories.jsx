import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { adminApi } from '../../api';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const data = await adminApi.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) {
      toast.error('Category name is required');
      return;
    }
    setSubmitting(true);
    try {
      await adminApi.createCategory({ name: trimmed });
      toast.success('Category created');
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      } else {
        toast.error('Failed to create category');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    setDeletingId(id);
    try {
      await adminApi.deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
              <p className="dashboard-subtitle text-dark fw-bold">
              Manager Categories
            </p>
            <p className="dashboard-subtitle">
              Organize your products with categories
            </p>
          </div>

          {/* Add Category Card */}
          <div className="dashboard-card category-add-card">
         
            <form onSubmit={handleCreate} className="category-form">
              <div className="input-with-icon">
                <i className="fas fa-tag input-icon"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Vegetables, Fruits, Grains"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  maxLength={50}
                  disabled={submitting}
                />
              </div>
              <button
                type="submit"
                className="btn-add"
                disabled={submitting || !newCategory.trim()}
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus"></i> Add Category
                  </>
                )}
              </button>
            
            </form>
          </div>

          {/* Categories List */}
          {loading ? (
            <Loader message="Loading categories..." />
          ) : categories.length === 0 ? (
            <EmptyState
              icon="tags"
              title="No Categories Yet"
              message="Add your first category above to get started."
            />
          ) : (
            <div className="dashboard-card">
              <div className="card-header-row">
                <h3 className="card-title">All Categories</h3>
                      <span className="category-count-badge">
                <i className="fas fa-tags"></i>
                {categories.length}{' '}
                {categories.length === 1 ? 'category' : 'categories'}
              </span>
              </div>

              <div className="category-grid">
                {categories.map((cat) => (
                  <div key={cat.category_id} className="category-card">
                    <div className="category-icon">
                      <i className="fas fa-tag"></i>
                    </div>
                    <div className="category-info">
                      <span className="category-name">{cat.name}</span>
                      <span className="category-meta">Category</span>
                    </div>
                    <button
                      className="category-delete-btn"
                      onClick={() => handleDelete(cat.category_id)}
                      title="Delete category"
                      disabled={deletingId === cat.category_id}
                    >
                      {deletingId === cat.category_id ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-trash-alt"></i>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminCategories;