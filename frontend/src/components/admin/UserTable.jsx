import React from 'react';
import { formatDate } from '../../utils/formatters';
import '../../styles/dashboard.css';

const UserTable = ({
  users,
  onApprove,
  onToggleStatus,
  showApprovalColumn = false,
}) => {
  if (!users || users.length === 0) {
    return <p className="no-data">No users found.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            {showApprovalColumn && <th>Approved</th>}
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
                <span
                  className={`status-badge status-${
                    u.is_active ? 'available' : 'unavailable'
                  }`}
                >
                  {u.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              {showApprovalColumn && (
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
                    '-'
                  )}
                </td>
              )}
              <td>{formatDate(u.created_at)}</td>
              <td>
                <div className="table-actions">
                  {u.role === 'farmer' && !u.is_approved && onApprove && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => onApprove(u.user_id)}
                    >
                      Approve
                    </button>
                  )}
                  {onToggleStatus && (
                    <button
                      className={`action-btn ${
                        u.is_active ? 'warning' : 'success'
                      }`}
                      onClick={() => onToggleStatus(u.user_id)}
                      title={u.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <i
                        className={`fas fa-${
                          u.is_active ? 'ban' : 'check'
                        }`}
                      ></i>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;