import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
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
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ URL is the single source of truth
  const role = searchParams.get('role') || '';
  const status = searchParams.get('status') || '';

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await adminApi.getUsers(
          role || undefined,
          status || undefined
        );
        setUsers(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role, status, refreshKey]);

  // Change URL params — sidebar + page stay in sync
  const handleRoleChange = (newRole) => {
    const params = {};
    if (newRole) params.role = newRole;
    setSearchParams(params);
  };

  const handleApprove = async (id) => {
    try {
      await adminApi.approveFarmer(id);
      toast.success('Farmer approved');
      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error('Failed to approve farmer');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminApi.toggleUserStatus(id);
      toast.success('User status updated');
      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const roleTabs = [
    { key: '', label: 'All Users', icon: 'fa-users' },
    { key: 'farmer', label: 'Farmers', icon: 'fa-tractor' },
    { key: 'customer', label: 'Customers', icon: 'fa-user' },
  ];

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <p className="dashboard-subtitle text-dark">
              Manager Users 
               </p>
            <p className="dashboard-subtitle">
               
              View, approve, and manage user accounts
            </p>
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
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.user_id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {u.username?.charAt(0).toUpperCase()}
                            </div>
                            <span>{u.username}</span>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge role-${u.role}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge status-${
                              u.is_active ? 'available' : 'unavailable'
                            }`}
                          >
                            <i
                              className={`fas fa-circle`}
                              style={{ fontSize: '6px', marginRight: '6px' }}
                            ></i>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          {u.role === 'farmer' ? (
                            <span
                              className={`status-badge status-${
                                u.is_approved ? 'available' : 'pending'
                              }`}
                            >
                              {u.is_approved ? 'Approved' : 'Pending'}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>{formatDate(u.created_at)}</td>
                        <td>
                          <div className="table-actions">
                            {u.role === 'farmer' && !u.is_approved && (
                              <button
                                className="action-btn action-btn-approve"
                                onClick={() => handleApprove(u.user_id)}
                                title="Approve Farmer"
                              >
                                <i className="fas fa-check"></i>
                                <span>Approve</span>
                              </button>
                            )}
                            <button
                              className={`action-btn ${
                                u.is_active
                                  ? 'action-btn-deactivate'
                                  : 'action-btn-activate'
                              }`}
                              onClick={() => handleToggleStatus(u.user_id)}
                              title={u.is_active ? 'Deactivate' : 'Activate'}
                            >
                              <i
                                className={`fas fa-${
                                  u.is_active ? 'ban' : 'check-circle'
                                }`}
                              ></i>
                              <span>{u.is_active ? 'Deactivate' : 'Activate'}</span>
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