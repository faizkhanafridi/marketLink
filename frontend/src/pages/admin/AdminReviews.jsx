import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  Trash2,
  Tractor,
  Box,
  Star,
  MessageSquare,
  LayoutList,
  Rows3,
  ChevronLeft,
  ChevronRight,
  ArrowDownWideNarrow,
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import RatingStars from '../../components/common/RatingStars';
import { adminApi } from '../../api';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';
import '../../styles/admin-reviews.css';

const PER_PAGE = 10;

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest | oldest | highest | lowest
  const [density, setDensity] = useState('comfortable'); // comfortable | compact
  const [page, setPage] = useState(1);

  // URL is the source of truth for filter
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('type') || 'all';

  // Change filter → update URL
  const setFilter = (newFilter) => {
    const params = {};
    if (newFilter && newFilter !== 'all') params.type = newFilter;
    setSearchParams(params);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review? This action cannot be undone.')) return;
    try {
      await adminApi.deleteReview(id);
      toast.success('Review deleted');
      setReviews((prev) => prev.filter((r) => r.review_id !== id));
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = reviews.length;
    const farmerCount = reviews.filter((r) => r.farmer).length;
    const productCount = reviews.filter((r) => r.product).length;
    const avgRating =
      total > 0
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total).toFixed(1)
        : '0.0';

    return { total, farmerCount, productCount, avgRating };
  }, [reviews]);

  // Filter + search + sort
  const processedReviews = useMemo(() => {
    let result = [...reviews];

    // Type filter
    if (filter === 'farmer') result = result.filter((r) => r.farmer);
    if (filter === 'product') result = result.filter((r) => r.product);

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((r) => {
        const username = r.customer?.username?.toLowerCase() || '';
        const comment = r.comment?.toLowerCase() || '';
        const productName = r.product?.name?.toLowerCase() || '';
        const stallName = r.farmer?.stall_name?.toLowerCase() || '';
        return (
          username.includes(term) ||
          comment.includes(term) ||
          productName.includes(term) ||
          stallName.includes(term)
        );
      });
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      switch (sortBy) {
        case 'oldest':
          return dateA - dateB;
        case 'highest':
          return (b.rating || 0) - (a.rating || 0);
        case 'lowest':
          return (a.rating || 0) - (b.rating || 0);
        case 'newest':
        default:
          return dateB - dateA;
      }
    });

    return result;
  }, [reviews, filter, searchTerm, sortBy]);

  // Pagination
  const totalPages = Math.ceil(processedReviews.length / PER_PAGE);
  const paginatedReviews = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return processedReviews.slice(start, start + PER_PAGE);
  }, [processedReviews, page]);

  // Reset to page 1 whenever filter/search changes
  useEffect(() => {
    setPage(1);
  }, [filter, searchTerm, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSearchParams({}); // clears ?type=...
    setSortBy('newest');
    setPage(1);
  };

  const hasActiveFilters = searchTerm || filter !== 'all';

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">

          {/* Header */}
          <div className="dashboard-header">
                        <p className="dashboard-subtitle text-dark fw-bold ">Content Reviews</p>

            <p className="dashboard-subtitle">
              Review and moderate customer reviews across the platform
            </p>
          </div>

          {/* Stats */}
          <div className="ar-stats">
            <div className="ar-stat">
              <div className="ar-stat-icon ar-stat-icon-total">
                <MessageSquare size={18} />
              </div>
              <div className="ar-stat-body">
                <span className="ar-stat-value">{stats.total}</span>
                <span className="ar-stat-label">Total Reviews</span>
              </div>
            </div>

            <div className="ar-stat">
              <div className="ar-stat-icon ar-stat-icon-farmer">
                <Tractor size={18} />
              </div>
              <div className="ar-stat-body">
                <span className="ar-stat-value">{stats.farmerCount}</span>
                <span className="ar-stat-label">Farmer Reviews</span>
              </div>
            </div>

            <div className="ar-stat">
              <div className="ar-stat-icon ar-stat-icon-product">
                <Box size={18} />
              </div>
              <div className="ar-stat-body">
                <span className="ar-stat-value">{stats.productCount}</span>
                <span className="ar-stat-label">Product Reviews</span>
              </div>
            </div>

            <div className="ar-stat">
              <div className="ar-stat-icon ar-stat-icon-rating">
                <Star size={18} />
              </div>
              <div className="ar-stat-body">
                <span className="ar-stat-value">{stats.avgRating}</span>
                <span className="ar-stat-label">Average Rating</span>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="ar-toolbar">
            <div className="ar-toolbar-row">

              {/* Tabs */}
              <div className="ar-tabs">
                <button
                  type="button"
                  className={`ar-tab ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All <span className="ar-tab-count">{stats.total}</span>
                </button>
                <button
                  type="button"
                  className={`ar-tab ${filter === 'farmer' ? 'active' : ''}`}
                  onClick={() => setFilter('farmer')}
                >
                  Farmer <span className="ar-tab-count">{stats.farmerCount}</span>
                </button>
                <button
                  type="button"
                  className={`ar-tab ${filter === 'product' ? 'active' : ''}`}
                  onClick={() => setFilter('product')}
                >
                  Product <span className="ar-tab-count">{stats.productCount}</span>
                </button>
              </div>

              {/* Search */}
              <div className="ar-search">
                <Search size={14} className="ar-search-icon" />
                <input
                  type="text"
                  placeholder="Search by user, comment, or item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="ar-search-clear"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

            </div>

            <div className="ar-toolbar-row ar-toolbar-row-secondary">

              {/* Result count */}
              <span className="ar-result-count">
                Showing <strong>{paginatedReviews.length}</strong> of{' '}
                <strong>{processedReviews.length}</strong>
                {hasActiveFilters ? ' filtered' : ''} reviews
              </span>

              <div className="ar-toolbar-controls">

                {/* Sort */}
                <div className="ar-select-wrap">
                  <ArrowDownWideNarrow size={13} className="ar-select-icon" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="ar-select"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="highest">Highest rating</option>
                    <option value="lowest">Lowest rating</option>
                  </select>
                </div>

                {/* Density toggle */}
                <div className="ar-density">
                  <button
                    type="button"
                    className={`ar-density-btn ${density === 'comfortable' ? 'active' : ''}`}
                    onClick={() => setDensity('comfortable')}
                    title="Comfortable view"
                    aria-label="Comfortable view"
                  >
                    <Rows3 size={14} />
                  </button>
                  <button
                    type="button"
                    className={`ar-density-btn ${density === 'compact' ? 'active' : ''}`}
                    onClick={() => setDensity('compact')}
                    title="Compact view"
                    aria-label="Compact view"
                  >
                    <LayoutList size={14} />
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <Loader message="Loading reviews..." />
          ) : processedReviews.length === 0 ? (
            <EmptyState
              icon="shield-alt"
              title={hasActiveFilters ? 'No Reviews Found' : 'No Reviews Yet'}
              message={
                hasActiveFilters
                  ? 'Try adjusting your filter or search terms.'
                  : 'Customer reviews will appear here once they are submitted.'
              }
              actionText={hasActiveFilters ? 'Clear Filters' : undefined}
              onAction={hasActiveFilters ? clearFilters : undefined}
            />
          ) : (
            <>
              <div className={`ar-list ar-list-${density}`}>
                {paginatedReviews.map((review) => (
                  <article key={review.review_id} className="ar-row">

                    {/* Column 1: User */}
                    <div className="ar-cell ar-cell-user">
                      <span className="ar-avatar">
                        {review.customer?.username?.charAt(0).toUpperCase() || 'A'}
                      </span>
                      <div className="ar-user-info">
                        <span className="ar-username">
                          {review.customer?.username || 'Anonymous'}
                        </span>
                        <span className="ar-date">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Column 2: Target */}
                    <div className="ar-cell ar-cell-target">
                      {review.farmer && (
                        <span className="ar-badge ar-badge-farmer">
                          <Tractor size={11} />
                          {review.farmer.stall_name}
                        </span>
                      )}
                      {review.product && (
                        <span className="ar-badge ar-badge-product">
                          <Box size={11} />
                          {review.product.name}
                        </span>
                      )}
                    </div>

                    {/* Column 3: Rating */}
                    <div className="ar-cell ar-cell-rating">
                      <RatingStars rating={review.rating} size="small" />
                      <span className="ar-rating-value">{review.rating}/5</span>
                    </div>

                    {/* Column 4: Comment */}
                    <div className="ar-cell ar-cell-comment">
                      {review.comment ? (
                        <p className="ar-comment">{review.comment}</p>
                      ) : (
                        <p className="ar-comment ar-comment-empty">
                          <em>No comment provided</em>
                        </p>
                      )}

                      {review.farmer_reply && (
                        <div className="ar-reply">
                          <span className="ar-reply-label">Farmer reply</span>
                          <p>{review.farmer_reply}</p>
                        </div>
                      )}
                    </div>

                    {/* Column 5: Actions */}
                    <div className="ar-cell ar-cell-actions">
                      <button
                        type="button"
                        className="ar-delete-btn"
                        onClick={() => handleDelete(review.review_id)}
                        title="Delete review"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="ar-pagination">
                  <button
                    type="button"
                    className="ar-page-btn"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={14} />
                    Prev
                  </button>

                  <div className="ar-page-numbers">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const show =
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        Math.abs(pageNum - page) <= 1;

                      if (!show) {
                        const prevPage = idx;
                        const nextPage = idx + 2;
                        const gapBefore =
                          prevPage === 1 || Math.abs(prevPage - page) > 1;
                        const gapAfter =
                          nextPage === totalPages ||
                          Math.abs(nextPage - page) > 1;
                        if (gapBefore && gapAfter) {
                          return (
                            <span key={`gap-${idx}`} className="ar-page-gap">
                              …
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <button
                          key={pageNum}
                          type="button"
                          className={`ar-page-num ${page === pageNum ? 'active' : ''}`}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className="ar-page-btn"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminReviews;