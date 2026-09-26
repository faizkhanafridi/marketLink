import React, { useState, useEffect } from 'react';
import { productApi } from '../../api';
import { toast } from 'react-toastify';
import '../../styles/forms.css';

const ProductForm = ({ product, categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    stock_quantity: '',
    category_id: '',
    image: '',
    is_available: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        unit: product.unit || 'kg',
        stock_quantity: product.stock_quantity || '',
        category_id: product.category?.category_id || product.category_id || '',
        image: product.image || '',
        is_available: product.is_available ?? true,
      });
      setImagePreview(product.image || '');
    }
  }, [product]);

  const handleChange = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (4MB) and type
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image must be under 4 MB');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP allowed');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const uploadImageIfNeeded = async () => {
    if (!imageFile) return formData.image; // keep existing URL

    setUploading(true);
    try {
      const res = await productApi.uploadImage(imageFile);
      return res.path; // e.g. /storage/products/uuid.jpg
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imagePath = await uploadImageIfNeeded();

      onSubmit({
        ...formData,
        image: imagePath,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity, 10),
        category_id: parseInt(formData.category_id, 10),
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Image upload failed. Please try again.'
      );
    }
  };

  const units = ['kg', 'g', 'lb', 'oz', 'piece', 'dozen', 'bunch', 'liter', 'ml'];

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Product Name *</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            name="category_id"
            className="form-control"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Price *</label>
          <input
            type="number"
            name="price"
            className="form-control"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Unit *</label>
          <select
            name="unit"
            className="form-control"
            value={formData.unit}
            onChange={handleChange}
            required
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Stock Quantity *</label>
          <input
            type="number"
            name="stock_quantity"
            className="form-control"
            min="0"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* ===== Image Upload ===== */}
      <div className="form-group">
        <label className="form-label">Product Image</label>

        <div className="image-upload-wrapper">
          {imagePreview ? (
            <div className="image-preview-box">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                className="image-remove-btn"
                onClick={handleRemoveImage}
                title="Remove image"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ) : (
            <label className="image-dropzone">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                hidden
              />
              <i className="fas fa-cloud-upload-alt"></i>
              <span>Click to upload image</span>
              <small>JPG, PNG, or WEBP — max 4 MB</small>
            </label>
          )}
        </div>
      </div>

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="is_available"
            checked={formData.is_available}
            onChange={handleChange}
          />
          <span>Product is available for ordering</span>
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading
            ? 'Uploading image...'
            : product
            ? 'Update Product'
            : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;