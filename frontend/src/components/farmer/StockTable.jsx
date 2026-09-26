import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/dashboard.css';

const StockTable = ({ products, onEdit, onDelete, onMarkSoldOut }) => {
  if (!products || products.length === 0) {
    return (
      <p className="no-data">No products in stock.</p>
    );
  }

  return (
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
                    onError={(e) => {
                      e.target.src = '/assets/images/default-product.jpg';
                    }}
                  />
                  <span>{product.name}</span>
                </div>
              </td>
              <td>{product.category?.name || '-'}</td>
              <td>
                {formatCurrency(product.price)} / {product.unit}
              </td>
              <td>{product.stock_quantity}</td>
              <td>
                <span
                  className={`status-badge status-${
                    product.is_available ? 'available' : 'unavailable'
                  }`}
                >
                  {product.is_available ? 'Available' : 'Sold Out'}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  {onEdit && (
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit(product)}
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  )}
                  {onMarkSoldOut && product.is_available && (
                    <button
                      className="action-btn warning"
                      onClick={() => onMarkSoldOut(product.product_id)}
                      title="Mark Sold Out"
                    >
                      <i className="fas fa-ban"></i>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="action-btn delete"
                      onClick={() => onDelete(product.product_id)}
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;