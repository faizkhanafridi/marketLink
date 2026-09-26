import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/dashboard.css';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const subtotal = parseFloat(item.price) * item.quantity;

  return (
    <div className="cart-item">
      <img
        src={item.image || '/assets/images/default-product.jpg'}
        alt={item.name}
        className="cart-item-image"
        onError={(e) => {
          e.target.src = '/assets/images/default-product.jpg';
        }}
      />

      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-price">
          {formatCurrency(item.price)} / {item.unit}
        </p>
      </div>

      <div className="cart-item-quantity">
        <button
          type="button"
          onClick={() => onQuantityChange(item.product_id, item.quantity - 1)}
          aria-label="Decrease quantity"
        >
          <i className="fas fa-minus"></i>
        </button>
        <span>{item.quantity}</span>
        <button
          type="button"
          onClick={() => onQuantityChange(item.product_id, item.quantity + 1)}
          aria-label="Increase quantity"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <div className="cart-item-subtotal">{formatCurrency(subtotal)}</div>

      <button
        type="button"
        className="cart-item-remove"
        onClick={() => onRemove(item.product_id)}
        aria-label="Remove item"
      >
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
};

export default CartItem;