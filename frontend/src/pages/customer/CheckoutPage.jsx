import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CustomerSidebar from '../../components/customer/CustomerSidebar';
import { useCart } from '../../hooks/useCart';
import { orderApi } from '../../api';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';
import '../../styles/forms.css';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../../components/common/EmptyState';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, farmerId, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickup_date: '',
    pickup_slot: '',
    notes: '',
  });

  const pickupSlots = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00',
    '16:00 - 18:00',
  ];

  const minDate = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (cartItems.length === 0) {
    toast.error('Your cart is empty');
    return;
  }

  // Resolve farmer_id from state OR from the first cart item
  const resolvedFarmerId =
    farmerId ?? cartItems[0]?.farmer_id ?? cartItems[0]?.farmer?.farmer_id;

  if (!resolvedFarmerId) {
    toast.error('Cart is missing farmer information. Please remove items and re-add them.');
    return;
  }

  setLoading(true);
  try {
    const orderData = {
      farmer_id: resolvedFarmerId,
      pickup_date: formData.pickup_date,
      pickup_slot: formData.pickup_slot,
      notes: formData.notes,
      items: cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    const res = await orderApi.create(orderData);
    toast.success('Order placed successfully');
    clearCart();
    navigate(`/customer/orders/${res.order.order_id}`);
  } catch (error) {
    const errors = error.response?.data?.errors;
    if (errors) {
      Object.values(errors).flat().forEach((msg) => toast.error(msg));
    } else {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  } finally {
    setLoading(false);
  }
};


  if (cartItems.length === 0) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="dashboard-layout">
          <CustomerSidebar />
          <main className="dashboard-main">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <EmptyState
                icon="shopping-basket"
                title="Your Cart is Empty"
                message="Browse products and add items to your cart."
                actionText="Add Product To Cart"
                onAction={() => navigate('/customer/cart')}
              />
            </motion.div>
          </main>
        </div>
        
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
                          <p className="dashboard-subtitle text-dark fw-bold ">Checkout</p>

            <p className="dashboard-subtitle">Select your pickup details</p>
          </div>

          <div className="checkout-layout">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="dashboard-card">
                <h3 className="card-title">Pickup Details</h3>

                <div className="form-group">
                  <label className="form-label">Pickup Date *</label>
                  <input
                    type="date"
                    name="pickup_date"
                    className="form-control"
                    min={minDate}
                    value={formData.pickup_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pickup Time Slot *</label>
                  <div className="slot-grid">
                    {pickupSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={`slot-btn ${formData.pickup_slot === slot ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, pickup_slot: slot })}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes (Optional)</label>
                  <textarea
                    name="notes"
                    className="form-control"
                    rows="3"
                    placeholder="Any special instructions..."
                    value={formData.notes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>

            <div className="checkout-summary">
              <div className="dashboard-card">
                <h3 className="card-title">Order Summary</h3>
                {cartItems.map((item) => (
                  <div key={item.product_id} className="summary-item">
                    <span>{item.quantity} x {item.name}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatCurrency(getCartTotal())}</span>
                </div>
                <p className="payment-note">
                  <i className="fas fa-info-circle"></i> Payment is made in person at pickup.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
     
    </div>
  );
};

export default CheckoutPage;