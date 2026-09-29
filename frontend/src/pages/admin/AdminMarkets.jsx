import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import LocationPicker from "../../components/common/LocationPicker";
import { marketApi } from "../../api";
import { toast } from "react-toastify";
import "../../styles/dashboard.css";
import "../../styles/forms.css";

const AdminMarkets = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    market_name: "",
    address: "",
    latitude: "",
    longitude: "",
    operating_days: "",
    timings: "",
    map_provider: "openstreetmap",
  });

  const formRef = useRef(null);

  // URL-driven view state
  const view = searchParams.get("view"); // 'add' | 'edit' | null
  const editId = searchParams.get("id");
  const showForm = view === "add" || view === "edit";
  const editingMarket = editingMarketFromList(markets, editId, view);

  function editingMarketFromList(list, id, view) {
    if (view !== "edit" || !id) return null;
    return list.find((m) => String(m.market_id) === String(id)) || null;
  }

  /* ---------- Fetch ---------- */
  const fetchMarkets = async () => {
    try {
      const data = await marketApi.getAll();
      setMarkets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching markets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  /* ---------- Sync formData with URL ---------- */
  useEffect(() => {
    if (view === "add") {
      setFormData({
        market_name: "",
        address: "",
        latitude: "",
        longitude: "",
        operating_days: "",
        timings: "",
        map_provider: "openstreetmap",
      });
      // Scroll the form into view
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }

    if (view === "edit" && editId) {
      const found = markets.find((m) => String(m.market_id) === String(editId));
      if (found) {
        setFormData({
          market_name: found.market_name || "",
          address: found.address || "",
          latitude: found.latitude || "",
          longitude: found.longitude || "",
          operating_days: found.operating_days || "",
          timings: found.timings || "",
          map_provider: found.map_provider || "openstreetmap",
        });
        setTimeout(() => {
          formRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
      return;
    }
    // No form open
  }, [view, editId, markets]);

  /* ---------- Handlers ---------- */
  const handleOpenAdd = () => {
    navigate("/admin/markets?view=add");
  };

  const handleOpenEdit = (market) => {
    navigate(`/admin/markets?view=edit&id=${market.market_id}`);
  };

  const handleCloseForm = () => {
    navigate("/admin/markets");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      if (editingMarket) {
        await marketApi.update(editingMarket.market_id, payload);
        toast.success("Market updated");
      } else {
        await marketApi.create(payload);
        toast.success("Market created");
      }

      navigate("/admin/markets");
      fetchMarkets();
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error("Failed to save market");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this market?")) return;
    setDeletingId(id);
    try {
      await marketApi.delete(id);
      toast.success("Market deleted");
      fetchMarkets();
    } catch (error) {
      toast.error("Failed to delete market");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          {/* ---------- Header ---------- */}
          <div className="dashboard-header-row">
            <div>
              <p className="dashboard-subtitle text-dark fw-bold">
                {view === "add"
                  ? "Add Market"
                  : view === "edit"
                    ? "Edit Market"
                    : "Manage Markets"}
              </p>
              <p className="dashboard-subtitle">
                {view === "add"
                  ? "Create a new farmers market"
                  : view === "edit"
                    ? "Update this market's details"
                    : "Add, edit, or remove farmers markets"}
              </p>
            </div>

            <div className="header-actions">
              {!showForm && (
                <button className="btn btn-primary" onClick={handleOpenAdd}>
                  <i className="fas fa-plus"></i> Add Market
                </button>
              )}
              {showForm && (
                <button className="btn btn-outline" onClick={handleCloseForm}>
                  <i className="fas fa-arrow-left"></i> Back
                </button>
              )}
            </div>
          </div>

          {/* ---------- Inline form ---------- */}
          {showForm && (
            <div className="dashboard-card" ref={formRef}>
              <div className="card-header-row">
                <h3 className="card-title">
                  {editingMarket ? "Edit Market" : "Add New Market"}
                </h3>
                <button className="btn-close-sm" onClick={handleCloseForm}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Market Name *</label>
                    <input
                      type="text"
                      name="market_name"
                      className="form-control"
                      value={formData.market_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Map Provider</label>
                    <select
                      name="map_provider"
                      className="form-control"
                      value={formData.map_provider}
                      onChange={handleChange}
                    >
                      <option value="openstreetmap">OpenStreetMap</option>
                      <option value="google">Google Maps</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address *</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Street, area, city"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location on Map</label>
                  <LocationPicker
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    address={formData.address}
                    onChange={(updates) =>
                      setFormData((prev) => ({ ...prev, ...updates }))
                    }
                    height={340}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Operating Days</label>
                    <input
                      type="text"
                      name="operating_days"
                      className="form-control"
                      placeholder="e.g., Saturday, Sunday"
                      value={formData.operating_days}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Timings</label>
                    <input
                      type="text"
                      name="timings"
                      className="form-control"
                      placeholder="e.g., 7:00 AM - 1:00 PM"
                      value={formData.timings}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleCloseForm}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-check"></i>{" "}
                    {editingMarket ? "Update Market" : "Create Market"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ---------- Table ---------- */}
          {!showForm && (
            <>
              {loading ? (
                <Loader message="Loading markets..." />
              ) : markets.length === 0 ? (
                <EmptyState
                  icon="store"
                  title="No Markets Yet"
                  message="Add your first market to get started."
                  actionText="Add Market"
                  onAction={handleOpenAdd}
                />
              ) : (
                <div className="dashboard-card">
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Market Name</th>
                          <th>Address</th>
                          <th>Operating Days</th>
                          <th>Timings</th>
                          <th className="actions-col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {markets.map((m) => (
                          <tr key={m.market_id}>
                            <td>
                              <div className="market-name-cell">
                                <div className="market-icon">
                                  <i className="fas fa-store"></i>
                                </div>
                                <span>{m.market_name}</span>
                              </div>
                            </td>
                            <td>
                              {m.address ? (
                                <span className="address-cell">
                                  <i className="fas fa-map-marker-alt"></i>
                                  {m.address.length > 45
                                    ? m.address.slice(0, 45) + "…"
                                    : m.address}
                                </span>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                            <td>
                              {m.operating_days ? (
                                <span className="chip chip-muted">
                                  {m.operating_days}
                                </span>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                            <td>
                              {m.timings ? (
                                <span className="timing-cell">
                                  <i className="fas fa-clock"></i>
                                  {m.timings}
                                </span>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                            <td>
                              <div className="table-actions-modern">
                                <button
                                  type="button"
                                  className="action-pill action-pill-edit"
                                  onClick={() => handleOpenEdit(m)}
                                  title="Edit market"
                                  aria-label="Edit market"
                                >
                                  <i className="fas fa-pen"></i>
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  className="action-pill action-pill-delete"
                                  onClick={() => handleDelete(m.market_id)}
                                  title="Delete market"
                                  aria-label="Delete market"
                                  disabled={deletingId === m.market_id}
                                >
                                  {deletingId === m.market_id ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                  ) : (
                                    <i className="fas fa-trash-alt"></i>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminMarkets;
