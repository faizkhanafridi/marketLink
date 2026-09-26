import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { adminApi } from '../../api';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');

  const fetchCategories = async () => {
    try {
      const data = await adminApi.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await adminApi.createCategory({ name: newCategory.trim() });
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
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await adminApi.deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Manage Categories</h1>
            <p className="dashboard-subtitle">Add or remove product categories</p>
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Add New Category</h3>
            <form onSubmit={handleCreate} className="inline-form">
              <input
                type="text"
                className="form-control"
                placeholder="Category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                maxLength={50}
              />
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-plus"></i> Add
              </button>
            </form>
          </div>

          {loading ? (
            <Loader message="Loading categories..." />
          ) : categories.length === 0 ? (
            <EmptyState
              icon="tags"
              title="No Categories"
              message="Add your first category above."
            />
          ) : (
            <div className="dashboard-card">
              <div className="category-grid">
                {categories.map((cat) => (
                  <div key={cat.category_id} className="category-chip">
                    <span>{cat.name}</span>
                    <button
                      className="chip-delete"
                      onClick={() => handleDelete(cat.category_id)}
                      title="Delete"
                    >
                      <i className="fas fa-times"></i>
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