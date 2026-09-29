import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ProductCard from "../../components/common/ProductCard";
import Pagination from "../../components/common/Pagination";

import { productApi, categoryApi, farmerApi, marketApi } from "../../api";
import { useDebounce } from "../../hooks/useDebounce";

import "../../styles/home.css";
import "../../styles/products.css";
import "../../styles/page-hero.css";

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const filterBarVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const gridItem = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] },
  }),
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.95,
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

const floatingDecoration = {
  animate: {
    y: [0, -14, 0],
    x: [0, 8, 0],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
  },
};

/* ============================================================
   PAGE
   ============================================================ */
const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [farmerLabel, setFarmerLabel] = useState("");
  const [marketLabel, setMarketLabel] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category_id: searchParams.get("category_id") || "",
    farmer_id: searchParams.get("farmer_id") || "",
    market_id: searchParams.get("market_id") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    is_available: searchParams.get("is_available") ?? "1",
    per_page: 12,
    page: parseInt(searchParams.get("page"), 10) || 1,
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  /* ---------- Load categories once ---------- */
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

  /* ---------- Resolve farmer_id / market_id → readable labels ---------- */
  useEffect(() => {
    const resolveLabels = async () => {
      if (filters.farmer_id) {
        try {
          const data = await farmerApi.getById(filters.farmer_id);
          const farmer = data?.data ?? data;
          setFarmerLabel(farmer?.stall_name || `Farmer #${filters.farmer_id}`);
        } catch {
          setFarmerLabel(`Farmer #${filters.farmer_id}`);
        }
      } else {
        setFarmerLabel("");
      }

      if (filters.market_id) {
        try {
          const data = await marketApi.getById(filters.market_id);
          const market = data?.data ?? data;
          setMarketLabel(market?.market_name || `Market #${filters.market_id}`);
        } catch {
          setMarketLabel(`Market #${filters.market_id}`);
        }
      } else {
        setMarketLabel("");
      }
    };
    resolveLabels();
  }, [filters.farmer_id, filters.market_id]);

  /* ---------- Fetch products when filters change ---------- */
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          per_page: filters.per_page,
          page: filters.page,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (filters.category_id) params.category_id = filters.category_id;
        if (filters.farmer_id) params.farmer_id = filters.farmer_id;
        if (filters.market_id) params.market_id = filters.market_id;
        if (filters.min_price) params.min_price = filters.min_price;
        if (filters.max_price) params.max_price = filters.max_price;
        if (filters.is_available !== "") params.is_available = filters.is_available;

        const response = await productApi.getAll(params);
        if (!isMounted) return;

        const data = response.data || response;
        setProducts(Array.isArray(data) ? data : []);

        // Handle Laravel paginator shape (current_page at top level)
        if (response.current_page !== undefined) {
          setPagination({
            current_page: response.current_page,
            last_page: response.last_page,
            total: response.total,
          });
        }
        // Fallback: meta object shape
        else if (response.meta) {
          setPagination({
            current_page: response.meta.current_page,
            last_page: response.meta.last_page,
            total: response.meta.total,
          });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [
    debouncedSearch,
    filters.category_id,
    filters.farmer_id,
    filters.market_id,
    filters.min_price,
    filters.max_price,
    filters.is_available,
    filters.page,
  ]);

  /* ---------- Sync URL with filters ---------- */
  useEffect(() => {
    const next = {};
    if (debouncedSearch) next.search = debouncedSearch;
    if (filters.category_id) next.category_id = filters.category_id;
    if (filters.farmer_id) next.farmer_id = filters.farmer_id;
    if (filters.market_id) next.market_id = filters.market_id;
    if (filters.min_price) next.min_price = filters.min_price;
    if (filters.max_price) next.max_price = filters.max_price;
    if (filters.is_available && filters.is_available !== "1") {
      next.is_available = filters.is_available;
    }
    if (filters.page && filters.page > 1) next.page = filters.page;

    const current = searchParams.toString();
    const desired = new URLSearchParams(next).toString();

    if (current !== desired) {
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearch,
    filters.category_id,
    filters.farmer_id,
    filters.market_id,
    filters.min_price,
    filters.max_price,
    filters.is_available,
    filters.page,
  ]);

  /* ---------- Handlers ---------- */
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category_id: "",
      farmer_id: "",
      market_id: "",
      min_price: "",
      max_price: "",
      is_available: "1",
      per_page: 12,
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category_id ||
    filters.farmer_id ||
    filters.market_id ||
    filters.min_price ||
    filters.max_price ||
    filters.is_available === "0";

  const showContextPills =
    filters.farmer_id || filters.market_id || filters.is_available === "0";

  return (
    <div className="products-page">
      <Navbar />

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="products-hero">
        <motion.div
          className="products-hero-decoration products-hero-decoration-one"
          variants={floatingDecoration}
          animate="animate"
        />
        <motion.div
          className="products-hero-decoration products-hero-decoration-two"
          variants={floatingDecoration}
          animate="animate"
          transition={{ duration: 8, delay: 1 }}
        />

        <div className="container">
          <motion.div
            className="products-hero-content"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="products-page-tag">
              <motion.i
                className="fas fa-leaf"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2 }}
              />
              Fresh from local farmers
            </motion.span>

            <motion.h1 variants={fadeUp} className="products-page-title">
              Browse Fresh
              <span> Foods</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="products-page-subtitle">
              Discover seasonal fruits, vegetables, dairy, baked goods, honey,
              and other products from farmers in your community.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          PRODUCTS CONTENT
      ========================================================= */}
      <section className="products-content-section">
        <div className="container">

          {/* Active context pills (farmer/market/sold-out) */}
          {showContextPills && (
            <div className="active-filters">
              {filters.farmer_id && (
                <span className="active-filter-pill">
                  <span>{farmerLabel || `Farmer #${filters.farmer_id}`}</span>
                  <button
                    type="button"
                    onClick={() => handleFilterChange("farmer_id", "")}
                    aria-label="Remove farmer filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {filters.market_id && (
                <span className="active-filter-pill">
                  <span>{marketLabel || `Market #${filters.market_id}`}</span>
                  <button
                    type="button"
                    onClick={() => handleFilterChange("market_id", "")}
                    aria-label="Remove market filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {filters.is_available === "0" && (
                <span className="active-filter-pill">
                  <span>Sold Out Only</span>
                  <button
                    type="button"
                    onClick={() => handleFilterChange("is_available", "1")}
                    aria-label="Remove sold out filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* =====================================================
              HORIZONTAL FILTER BAR
          ===================================================== */}
          <motion.div
            className="products-filter-bar"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={filterBarVariants}
            style={{ top: "var(--products-navbar-offset, 84px)" }}
          >
            <motion.div
              className="filter-bar-inner"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Search */}
              <motion.div
                variants={fadeUp}
                className="filter-field filter-field-search"
              >
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
                  <AnimatePresence>
                    {filters.search && (
                      <motion.button
                        type="button"
                        className="search-clear"
                        onClick={() => handleFilterChange("search", "")}
                        aria-label="Clear search"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fas fa-times"></i>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Category */}
              <motion.div variants={fadeUp} className="filter-field">
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
              </motion.div>

              {/* Price Range (Min + Max together) */}
              <motion.div
                variants={fadeUp}
                className="filter-field filter-field-price-range"
              >
                <label className="filter-inline-label">Price Range</label>
                <div className="price-range-row">
                  <input
                    type="number"
                    placeholder="Min"
                    className="products-form-control"
                    value={filters.min_price}
                    onChange={(e) =>
                      handleFilterChange("min_price", e.target.value)
                    }
                    aria-label="Minimum price"
                  />
                  <span className="price-range-dash">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="products-form-control"
                    value={filters.max_price}
                    onChange={(e) =>
                      handleFilterChange("max_price", e.target.value)
                    }
                    aria-label="Maximum price"
                  />
                </div>
              </motion.div>

              {/* Clear */}
              <motion.div
                variants={fadeUp}
                className="filter-field filter-field-action"
              >
                <motion.button
                  type="button"
                  className="clear-filters-btn"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  whileHover={hasActiveFilters ? { scale: 1.03, y: -1 } : {}}
                  whileTap={hasActiveFilters ? { scale: 0.97 } : {}}
                  transition={{ duration: 0.18 }}
                >
                  <motion.i
                    className="fas fa-rotate-left"
                    whileHover={{ rotate: -180 }}
                    transition={{ duration: 0.4 }}
                  />
                  Clear
                  <AnimatePresence>
                    {hasActiveFilters && (
                      <motion.span
                        className="clear-count-dot"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* =====================================================
              PRODUCTS MAIN
          ===================================================== */}
          <main className="products-main">
            <motion.div
              className="products-toolbar"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="products-results">
                <span className="products-results-label">Fresh selection</span>
              </div>

              <motion.div
                className="products-toolbar-status"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <span className="status-dot"></span>
                <span>Available now</span>
              </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  className="products-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Loader message="Loading products..." />
                </motion.div>
              ) : products.length === 0 ? (
                <motion.div
                  key="empty"
                  className="products-empty"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                >
                  <EmptyState
                    icon="box-open"
                    title="No Products Found"
                    message="Try adjusting your filters or search terms."
                    actionText="Clear Filters"
                    onAction={clearFilters}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`grid-${filters.page}-${filters.category_id}-${filters.farmer_id}-${filters.market_id}-${debouncedSearch}`}
                  initial="hidden"
                  animate="visible"
                  variants={stagger}
                >
                  <div className="products-grid">
                    {products.map((product, i) => (
                      <motion.div
                        key={product.product_id}
                        variants={gridItem}
                        custom={i}
                        layout
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>

                  {pagination.last_page > 1 && (
                    <motion.div
                      className="products-pagination"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.25 }}
                    >
                      <Pagination
                        currentPage={pagination.current_page}
                        totalPages={pagination.last_page}
                        onPageChange={handlePageChange}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductsPage;