import React from "react";
import "../../styles/skeleton.css";

export const SkeletonProductCard = () => (
  <div className="sk-card" aria-hidden="true">
    <div className="sk-image" />
    <div className="sk-body">
      <div className="sk-row">
        <div className="sk-line sk-cat" />
        <div className="sk-line sk-rating" />
      </div>
      <div className="sk-line sk-title" />
      <div className="sk-line sk-title sk-title-short" />
      <div className="sk-line sk-farmer" />
      <div className="sk-row sk-row-bottom">
        <div className="sk-line sk-price" />
        <div className="sk-line sk-stock" />
      </div>
      <div className="sk-btn" />
    </div>
  </div>
);

export const SkeletonFarmerCard = () => (
  <div className="sk-farmer" aria-hidden="true">
    <div className="sk-farmer-head">
      <div className="sk-avatar" />
      <div className="sk-farmer-head-text">
        <div className="sk-line sk-farmer-name" />
        <div className="sk-line sk-farmer-contact" />
      </div>
    </div>
    <div className="sk-line sk-farmer-desc" />
    <div className="sk-line sk-farmer-desc sk-farmer-desc-short" />
    <div className="sk-line sk-farmer-meta" />
    <div className="sk-line sk-farmer-meta" />
    <div className="sk-btn sk-btn-farmer" />
  </div>
);

export const SkeletonProductGrid = ({ count = 8 }) => (
  <div className="products-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonProductCard key={i} />
    ))}
  </div>
);

export const SkeletonFarmerGrid = ({ count = 4 }) => (
  <div className="farmers-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonFarmerCard key={i} />
    ))}
  </div>
);