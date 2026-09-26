import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { adminApi } from '../../api';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';

const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(searchParams.get('role') || '');

  const fetchUsers = async (selectedRole) => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers(selectedRole || undefined);
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(role);
    if (role) setSearchParams({ role });
    else setSearchParams({});
  }, [role]);

  const handleApprove = async (id) => {
    try {
      await adminApi.approveFarmer(id);
      toast.success('Farmer approved');
      fetchUsers(role);
    } catch (error) {
      toast.error('Failed to approve farmer');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminApi.toggleUserStatus(id);
      toast.success('User status updated');
      fetchUsers(role);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const roleTabs = [
    { key: '', label: 'All Users' },
    { key: 'farmer', label: 'Farmers' },
    { key: 'customer', label: 'Customers' },
  ];

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Manage Users</h1>
            <p className="dashboard-subtitle">View, approve, and manage user accounts</p>
          </div>

          <div className="filter-tabs">
            {roleTabs.map((tab) => (
              <button
                key={tab.key}
                className={`filter-tab ${role === tab.key ? 'active' : ''}`}
                onClick={() => setRole(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <Loader message="Loading users..." />
          ) : users.length === 0 ? (
            <EmptyState
              icon="users"
              title="No Users Found"
              message="No users match the selected filter."
            />
          ) : (
            <div className="dashboard-card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Approved</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.user_id}>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge role-${u.role}`}>{u.role}</span>
                        </td>
                        <td>
                          <span className={`status-badge status-${u.is_active ? 'available' : 'unavailable'}`}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          {u.role === 'farmer' ? (
                            <span className={`status-badge status-${u.is_approved ? 'available' : 'pending'}`}>
                              {u.is_approved ? 'Approved' : 'Pending'}
                            </span>
                          ) : '-'}
                        </td>
                        <td>{formatDate(u.created_at)}</td>
                        <td>
                          <div className="table-actions">
                            {u.role === 'farmer' && !u.is_approved && (
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleApprove(u.user_id)}
                              >
                                Approve
                              </button>
                            )}
                            <button
                              className={`action-btn ${u.is_active ? 'warning' : 'success'}`}
                              onClick={() => handleToggleStatus(u.user_id)}
                              title={u.is_active ? 'Deactivate' : 'Activate'}
                            >
                              <i className={`fas fa-${u.is_active ? 'ban' : 'check'}`}></i>
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
        </main>
      </div>
     
    </div>
  );
};

export default AdminUsers;