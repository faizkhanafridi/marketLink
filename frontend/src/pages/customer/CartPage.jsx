import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CustomerSidebar from '../../components/customer/CustomerSidebar';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/dashboard.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="dashboard-layout">
          <CustomerSidebar />
          <main className="dashboard-main">
            <EmptyState
              icon="shopping-basket"
              title="Your Cart is Empty"
              message="Browse products and add items to your cart."
              actionText="Browse Products"
              onAction={() => navigate('/products')}
            />
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <CustomerSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Shopping Cart</h1>
            <p className="dashboard-subtitle">{cartItems.length} items in your cart</p>
          </div>

          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.product_id} className="cart-item">
                  <img
                    src={item.image || '/assets/images/default-product.jpg'}
                    alt={item.name}
                    className="cart-item-image"
                    onError={(e) => { e.target.src = '/assets/images/default-product.jpg'; }}
                  />
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">
                      {formatCurrency(item.price)} / {item.unit}
                    </p>
                  </div>
                  <div className="cart-item-quantity">
                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="cart-item-subtotal">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.product_id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(getCartTotal())}</span>
              </div>
              <div className="summary-row">
                <span>Payment</span>
                <span>At Pickup</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatCurrency(getCartTotal())}</span>
              </div>
              <button
                className="btn btn-primary btn-block btn-lg"
                onClick={() => navigate('/customer/checkout')}
              >
                Proceed to Checkout
              </button>
              <button className="btn btn-outline btn-block" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>
        </main>
      </div>
  
    </div>
  );
};

export default CartPage;