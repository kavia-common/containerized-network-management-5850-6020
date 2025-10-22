import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { listDevices, createDevice, updateDevice, deleteDevice, triggerStatus, getAllStatuses } from './api';
import { useFilter, useSort } from './hooks';
import DeviceForm from './components/DeviceForm';
import DeviceList from './components/DeviceList';

// PUBLIC_INTERFACE
export default function App() {
  /** Device management UI implementing CRUD and status checks */
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await listDevices();
      setDevices(data);
      setError('');
    } catch (e) {
      setError(e.message || 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  // Poll statuses every 15 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const statuses = await getAllStatuses();
        setDevices(prev => prev.map(d => {
          const s = statuses.find(x => x.id === d.id);
          return s ? { ...d, status: s.status, last_checked: s.last_checked } : d;
        }));
      } catch (e) {
        // ignore silent
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const { type, status, setType, setStatus, filtered } = useFilter(devices);
  const { sorted, sortKey, setSortKey } = useSort(filtered, 'name');

  const startAdd = () => { setEditing(null); setShowForm(true); };
  const startEdit = (d) => { setEditing(d); setShowForm(true); };

  const onSubmit = async (vals) => {
    setSubmitting(true);
    try {
      if (editing) {
        const updated = await updateDevice(editing.id, vals);
        setDevices(prev => prev.map(d => (d.id === editing.id ? updated : d)));
      } else {
        const created = await createDevice(vals);
        setDevices(prev => [...prev, created]);
      }
      setShowForm(false);
      setEditing(null);
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (d) => {
    if (!window.confirm(`Delete device "${d.name}"?`)) return;
    try {
      await deleteDevice(d.id);
      setDevices(prev => prev.filter(x => x.id !== d.id));
    } catch (e) {
      setError(e.message || 'Failed to delete device');
    }
  };

  const onPing = async (d) => {
    try {
      const res = await triggerStatus(d.id);
      setDevices(prev => prev.map(x => (x.id === d.id ? { ...x, status: res.status, last_checked: res.last_checked } : x)));
    } catch (e) {
      setError(e.message || 'Status check failed');
    }
  };

  const headerText = useMemo(() => (editing ? 'Edit Device' : 'Add Device'), [editing]);

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h2>Device Management</h2>
          <div className="controls">
            <button className="btn" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} data-testid="theme-toggle">
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            <select aria-label="Filter by type" value={type} onChange={(e) => setType(e.target.value)} data-testid="filter-type">
              <option value="">All types</option>
              <option value="router">Router</option>
              <option value="switch">Switch</option>
              <option value="server">Server</option>
              <option value="other">Other</option>
            </select>
            <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} data-testid="filter-status">
              <option value="">All status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="unknown">Unknown</option>
            </select>
            <select aria-label="Sort" value={sortKey} onChange={(e) => setSortKey(e.target.value)} data-testid="sort-select">
              <option value="name">Sort: Name</option>
              <option value="type">Sort: Type</option>
              <option value="status">Sort: Status</option>
              <option value="location">Sort: Location</option>
            </select>
            <button className="btn" onClick={startAdd} data-testid="add-device">Add Device</button>
            <button className="btn btn-secondary" onClick={refresh} data-testid="refresh">Refresh</button>
          </div>
        </div>

        {error && <div className="error" role="alert" data-testid="global-error">{error}</div>}
        {loading ? (
          <div className="muted" data-testid="loading">Loading...</div>
        ) : (
          <DeviceList devices={sorted} onEdit={startEdit} onDelete={onDelete} onPing={onPing} />
        )}

        {showForm && (
          <div className="form-panel" data-testid="form-panel">
            <h3>{headerText}</h3>
            <DeviceForm
              initialValues={editing ? { name: editing.name, ip_address: editing.ip_address, type: editing.type, location: editing.location } : undefined}
              onSubmit={onSubmit}
              onCancel={() => { setShowForm(false); setEditing(null); }}
              submitting={submitting}
            />
          </div>
        )}
      </div>
    </div>
  );
}
