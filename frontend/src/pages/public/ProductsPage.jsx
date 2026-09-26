import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ProductCard from "../../components/common/ProductCard";
import Pagination from "../../components/common/Pagination";

import { productApi, categoryApi } from "../../api";
import { useDebounce } from "../../hooks/useDebounce";

import "../../styles/home.css";
import "../../styles/products.css";
import "../../styles/page-hero.css";
const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category_id: searchParams.get("category_id") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    is_available: true,
    per_page: 12,
    page: parseInt(searchParams.get("page")) || 1,
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const params = {
          ...filters,
          search: debouncedSearch,
        };

        const response = await productApi.getAll(params);
        const data = response.data || response;

        setProducts(Array.isArray(data) ? data : []);

        if (response.meta) {
          setPagination({
            current_page: response.meta.current_page,
            last_page: response.meta.last_page,
            total: response.meta.total,
          });
        }

        const newParams = {};

        Object.entries({
          ...filters,
          search: debouncedSearch,
        }).forEach(([key, value]) => {
          if (
            value !== "" &&
            value !== null &&
            value !== undefined &&
            key !== "per_page"
          ) {
            newParams[key] = value;
          }
        });

        setSearchParams(newParams);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    debouncedSearch,
    filters.category_id,
    filters.min_price,
    filters.max_price,
    filters.page,
  ]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category_id: "",
      min_price: "",
      max_price: "",
      is_available: true,
      per_page: 12,
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category_id ||
    filters.min_price ||
    filters.max_price;

  return (
    <div className="products-page">
      <Navbar />
<center>

      <section className="products-hero">
        <div className="products-hero-decoration products-hero-decoration-one"></div>
        <div className="products-hero-decoration products-hero-decoration-two"></div>

        <div className="container">
          <div className="products-hero-content">
            <span className="products-page-tag">
              <i className="fas fa-leaf"></i>
              Fresh from local farmers
            </span>

            <h1 className="products-page-title">
              Browse Fresh
              <span> Foods</span>
            </h1>

            <p className="products-page-subtitle">
              Discover seasonal fruits, vegetables, dairy, baked goods, honey,
              and other products from farmers in your community.
            </p>
          </div>
        </div>
      </section>
</center>
      {/* =========================================================
    PRODUCTS CONTENT
========================================================= */}
      <section className="products-content-section">
        <div className="container">
          <div>
            <h2>Filters</h2>
          </div>
          {/* =====================================================
        HORIZONTAL FILTER BAR
    ===================================================== */}
          <div className="products-filter-bar">
            <div className="filter-bar-inner">
              {/* Search */}
              <div className="filter-field filter-field-search">
                <label className="filter-inline-label">Search</label>
                <div className="products-search-box">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search produce..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                  />
                  {filters.search && (
                    <button
                      type="button"
                      className="search-clear"
                      onClick={() => handleFilterChange("search", "")}
                      aria-label="Clear search"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="filter-field">
                <label className="filter-inline-label">Category</label>
                <div className="products-select-wrap">
                  <select
                    className="products-form-control"
                    value={filters.category_id}
                    onChange={(e) =>
                      handleFilterChange("category_id", e.target.value)
                    }
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>

              {/* Min Price */}
              <div className="filter-field filter-field-price">
                <label className="filter-inline-label">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  className="products-form-control"
                  value={filters.min_price}
                  onChange={(e) =>
                    handleFilterChange("min_price", e.target.value)
                  }
                />
              </div>

              {/* Max Price */}
              <div className="filter-field filter-field-price">
                <label className="filter-inline-label">Max Price</label>
                <input
                  type="number"
                  placeholder="∞"
                  className="products-form-control"
                  value={filters.max_price}
                  onChange={(e) =>
                    handleFilterChange("max_price", e.target.value)
                  }
                />
              </div>

              {/* Clear */}
              <div className="filter-field filter-field-action">
                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                >
                  <i className="fas fa-rotate-left"></i>
                  Clear
                  {hasActiveFilters && <span className="clear-count-dot" />}
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================
        PRODUCTS MAIN
    ===================================================== */}
          <main className="products-main">
            <div className="products-toolbar">
              <div className="products-results">
                <span className="products-results-label">Fresh selection</span>
                <h2>
                  {pagination.total > 0
                    ? `${pagination.total} Products`
                    : "Products"}
                </h2>
              </div>

              <div className="products-toolbar-status">
                <span className="status-dot"></span>
                <span>Available now</span>
              </div>
            </div>

            {loading ? (
              <div className="products-loading">
                <Loader message="Loading products..." />
              </div>
            ) : products.length === 0 ? (
              <div className="products-empty">
                <EmptyState
                  icon="box-open"
                  title="No Products Found"
                  message="Try adjusting your filters or search terms."
                  actionText="Clear Filters"
                  onAction={clearFilters}
                />
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product.product_id} product={product} />
                  ))}
                </div>

                {pagination.last_page > 1 && (
                  <div className="products-pagination">
                    <Pagination
                      currentPage={pagination.current_page}
                      totalPages={pagination.last_page}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductsPage;
