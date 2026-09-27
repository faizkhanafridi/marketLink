import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  X,
  Image as ImageIcon,
  Package,
  Tag,
  Ruler,
  Layers,
  FileText,
  Check,
  AlertCircle,
} from 'lucide-react';

const ProductForm = ({ product, categories = [], onSubmit, onCancel }) => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: '',
    stock_quantity: '',
    category_id: '',
    is_available: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        unit: product.unit || '',
        stock_quantity: product.stock_quantity || '',
        category_id: product.category_id || product.category?.category_id || '',
        is_available: product.is_available !== false,
      });
      setImagePreview(product.image || null);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        unit: '',
        stock_quantity: '',
        category_id: '',
        is_available: true,
      });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5 MB');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('description', formData.description || '');
    payload.append('price', formData.price);
    payload.append('unit', formData.unit || '');
    payload.append('stock_quantity', formData.stock_quantity || 0);
    if (formData.category_id) payload.append('category_id', formData.category_id);
    payload.append('is_available', formData.is_available ? 1 : 0);
    if (imageFile) payload.append('image', imageFile);

    try {
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pf-form">
      <div className="pf-layout">

        {/* ==================== LEFT: FIELDS ==================== */}
        <div className="pf-fields">

          {/* Basic info */}
          <section className="pf-section">
            <div className="pf-section-head">
              <span className="pf-section-icon">
                <Package size={14} />
              </span>
              <div>
                <h4 className="pf-section-title">Basic Information</h4>
                <p className="pf-section-sub">
                  Name and short description of your product
                </p>
              </div>
            </div>

            <div className="pf-group">
              <label className="pf-label" htmlFor="pf-name">
                Product Name <span className="pf-req">*</span>
              </label>
              <input
                id="pf-name"
                type="text"
                name="name"
                className="pf-input"
                placeholder="e.g. Heirloom Tomatoes"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={120}
              />
            </div>

            <div className="pf-group">
              <label className="pf-label" htmlFor="pf-description">
                <FileText size={12} />
                Description
              </label>
              <textarea
                id="pf-description"
                name="description"
                className="pf-input pf-textarea"
                placeholder="Describe your product — freshness, size, how it was grown…"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={500}
              />
              <span className="pf-char-count">
                {formData.description.length} / 500
              </span>
            </div>
          </section>

          {/* Pricing & stock */}
          <section className="pf-section">
            <div className="pf-section-head">
              <span className="pf-section-icon">
                <Tag size={14} />
              </span>
              <div>
                <h4 className="pf-section-title">Pricing & Stock</h4>
                <p className="pf-section-sub">
                  Set your price and how many units you have
                </p>
              </div>
            </div>

            <div className="pf-row">
              <div className="pf-group">
                <label className="pf-label" htmlFor="pf-price">
                  Price <span className="pf-req">*</span>
                </label>
                <div className="pf-input-wrap">
                  <span className="pf-input-prefix">$</span>
                  <input
                    id="pf-price"
                    type="number"
                    name="price"
                    className="pf-input pf-input-prefixed"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="pf-group">
                <label className="pf-label" htmlFor="pf-unit">
                  <Ruler size={12} />
                  Unit
                </label>
                <input
                  id="pf-unit"
                  type="text"
                  name="unit"
                  className="pf-input"
                  placeholder="kg, lb, dozen, jar…"
                  value={formData.unit}
                  onChange={handleChange}
                  maxLength={20}
                />
              </div>
            </div>

            <div className="pf-row">
              <div className="pf-group">
                <label className="pf-label" htmlFor="pf-stock">
                  <Layers size={12} />
                  Stock Quantity
                </label>
                <input
                  id="pf-stock"
                  type="number"
                  name="stock_quantity"
                  className="pf-input"
                  placeholder="0"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                />
              </div>

              <div className="pf-group">
                <label className="pf-label" htmlFor="pf-category">
                  Category
                </label>
                <select
                  id="pf-category"
                  name="category_id"
                  className="pf-input pf-select"
                  value={formData.category_id}
                  onChange={handleChange}
                >
                  <option value="">Select category…</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Availability */}
          <section className="pf-section">
            <label className="pf-toggle">
              <input
                type="checkbox"
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
              />
              <span className="pf-toggle-track">
                <span className="pf-toggle-thumb" />
              </span>
              <span className="pf-toggle-text">
                <strong>Available for purchase</strong>
                <span>Uncheck to hide this product from customers</span>
              </span>
            </label>
          </section>

        </div>

        {/* ==================== RIGHT: IMAGE ==================== */}
        <aside className="pf-image-col">
          <div className="pf-image-head">
            <span className="pf-section-icon">
              <ImageIcon size={14} />
            </span>
            <div>
              <h4 className="pf-section-title">Product Image</h4>
              <p className="pf-section-sub">Recommended 800×600 px, max 5 MB</p>
            </div>
          </div>

          <div
            className={`pf-drop ${dragging ? 'is-dragging' : ''} ${
              imagePreview ? 'has-image' : ''
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="pf-drop-img"
                  onError={(e) => {
                    e.target.src = '/assets/images/default-product.jpg';
                  }}
                />
                <button
                  type="button"
                  className="pf-drop-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  title="Remove image"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
                <div className="pf-drop-overlay">
                  <Upload size={16} />
                  <span>Click to replace</span>
                </div>
              </>
            ) : (
              <div className="pf-drop-empty">
                <span className="pf-drop-icon">
                  <Upload size={20} />
                </span>
                <strong>Drop an image here</strong>
                <span>or click to browse</span>
                <span className="pf-drop-hint">PNG, JPG up to 5 MB</span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="pf-hidden-input"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {imagePreview && (
            <div className="pf-image-meta">
              <Check size={13} />
              <span>Preview ready</span>
            </div>
          )}
        </aside>

      </div>

      {/* ==================== ACTIONS ==================== */}
      <div className="pf-actions">
        <div className="pf-actions-note">
          <AlertCircle size={13} />
          <span>Fields marked with <strong>*</strong> are required</span>
        </div>

        <div className="pf-actions-buttons">
          <button
            type="button"
            className="pf-btn pf-btn-ghost"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="pf-btn pf-btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving…
              </>
            ) : (
              <>
                <Check size={15} />
                {product ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;