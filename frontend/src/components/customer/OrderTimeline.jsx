import React from 'react';
import '../../styles/dashboard.css';

const TIMELINE_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: 'clipboard-check' },
  { key: 'accepted', label: 'Accepted', icon: 'check-circle' },
  { key: 'ready_for_pickup', label: 'Ready for Pickup', icon: 'box-open' },
  { key: 'completed', label: 'Completed', icon: 'check-double' },
];

const OrderTimeline = ({ currentStatus }) => {
  const getStepStatus = (stepKey) => {
    if (currentStatus === 'cancelled' || currentStatus === 'declined') {
      return 'cancelled';
    }
    const currentIndex = TIMELINE_STEPS.findIndex((s) => s.key === currentStatus);
    const stepIndex = TIMELINE_STEPS.findIndex((s) => s.key === stepKey);

    if (currentIndex === -1) return 'pending';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="order-timeline">
      {TIMELINE_STEPS.map((step) => {
        const status = getStepStatus(step.key);
        return (
          <div key={step.key} className={`timeline-step ${status}`}>
            <div className="step-icon">
              <i className={`fas fa-${step.icon}`}></i>
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;