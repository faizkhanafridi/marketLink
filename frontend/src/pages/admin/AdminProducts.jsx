import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { productApi, adminApi } from "../../api";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { toast } from "react-toastify";
import "../../styles/dashboard.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // -------------------------------------------------
  // FETCH DATA
  // -------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catData] = await Promise.all([
          productApi.getAll({ per_page: 100 }),
          adminApi.getCategories(),
        ]);

        // Products can come back in 3 shapes:
        // 1. { data: [...], meta: {...} }  (paginated resource)
        // 2. { current_page, data: [...] } (raw paginator)
        // 3. [...]                          (plain array)
        let list = [];
        if (Array.isArray(prodRes)) {
          list = prodRes;
        } else if (Array.isArray(prodRes?.data)) {
          list = prodRes.data;
        } else if (Array.isArray(prodRes?.data?.data)) {
          list = prodRes.data.data;
        }

        console.log("Admin products raw response:", prodRes);
        console.log("Parsed product list:", list);
        if (list[0]) {
          console.log("First product keys:", Object.keys(list[0]));
          console.log("First product farmer:", list[0].farmer);
          console.log("First product category:", list[0].category);
        }

        setProducts(list);
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // -------------------------------------------------
  // FILTERS
  // -------------------------------------------------
  const filtered = products.filter((p) => {
    const farmerName =
      p.farmer?.stall_name || p.farmer?.contact_person || p.farmer_name || "";

    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      farmerName.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      !categoryFilter || String(p.category_id) === String(categoryFilter);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <p className="dashboard-subtitle text-dark fw-bold ">
                All Products
              </p>

              <p className="dashboard-subtitle">
                View products listed by farmers across the marketplace
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="dashboard-card">
            <div className="filters-row">
              <div className="input-with-icon" style={{ flex: 1 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by product or farmer name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="form-control"
                style={{ maxWidth: 220 }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <span className="category-count-badge">
                <i className="fas fa-box"></i> {filtered.length} products
              </span>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <Loader message="Loading products..." />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="box"
              title="No Products Found"
              message="No products match your filters."
            />
          ) : (
            <div className="dashboard-card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Farmer</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Listed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => {
                      // Resolve farmer + category + stock across possible shapes
                      const farmerName =
                        p.farmer?.stall_name || p.farmer?.contact_person || "—";

                      const categoryName = p.category?.name || "—";

                      const stockQty =
                        typeof p.stock_quantity === "number"
                          ? p.stock_quantity
                          : typeof p.stock === "number"
                            ? p.stock
                            : 0;

                      const isAvailable =
                        typeof p.is_available === "boolean"
                          ? p.is_available
                          : stockQty > 0;

                      const imageUrl = p.image || p.image_url || null;

                      return (
                        <tr key={p.product_id}>
                          <td>
                            <div className="product-cell">
                              <span>{p.name}</span>
                            </div>
                          </td>
                          <td>{farmerName}</td>
                          <td>
                            {categoryName !== "—" ? (
                              <span className="chip chip-muted">
                                {categoryName}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="text-bold">
                            {formatCurrency(p.price)}
                          </td>
                          <td>
                            <span
                              className={`status-badge status-${
                                stockQty > 0 ? "available" : "unavailable"
                              }`}
                            >
                              {stockQty > 0
                                ? `${stockQty} in stock`
                                : "Out of stock"}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-badge status-${
                                isAvailable ? "available" : "pending"
                              }`}
                            >
                              {isAvailable ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>{formatDate(p.created_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminProducts;
