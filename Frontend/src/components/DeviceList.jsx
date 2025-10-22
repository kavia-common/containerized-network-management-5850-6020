import React from 'react';

export default function DeviceList({ devices, onEdit, onDelete, onPing }) {
  return (
    <div className="table-wrapper">
      <table className="device-table" data-testid="device-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>IP</th>
            <th>Type</th>
            <th>Location</th>
            <th>Status</th>
            <th>Last Checked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.length === 0 && (
            <tr>
              <td colSpan="7" className="muted" data-testid="empty-state">No devices yet. Add one.</td>
            </tr>
          )}
          {devices.map(d => (
            <tr key={d.id} data-testid={`device-row-${d.id}`}>
              <td>{d.name}</td>
              <td>{d.ip_address}</td>
              <td>{d.type}</td>
              <td>{d.location}</td>
              <td>
                <span className={`status ${d.status || 'unknown'}`} data-testid={`status-${d.id}`}>
                  {d.status || 'unknown'}
                </span>
              </td>
              <td>{d.last_checked ? new Date(d.last_checked).toLocaleString() : '-'}</td>
              <td>
                <div className="row-actions">
                  <button className="btn btn-small" onClick={() => onPing(d)} data-testid={`ping-${d.id}`}>Check</button>
                  <button className="btn btn-small" onClick={() => onEdit(d)} data-testid={`edit-${d.id}`}>Edit</button>
                  <button className="btn btn-small btn-danger" onClick={() => onDelete(d)} data-testid={`delete-${d.id}`}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
