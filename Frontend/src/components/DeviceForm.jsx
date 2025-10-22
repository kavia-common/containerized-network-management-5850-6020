import React, { useEffect, useState } from 'react';

const initial = { name: '', ip_address: '', type: 'router', location: '' };

export default function DeviceForm({ onSubmit, onCancel, initialValues, submitting }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) setValues({ ...initialValues });
  }, [initialValues]);

  const validate = () => {
    const e = {};
    if (!values.name) e.name = 'Name is required';
    if (!values.ip_address) e.ip_address = 'IP is required';
    else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(values.ip_address)) e.ip_address = 'Invalid IPv4';
    if (!values.type) e.type = 'Type is required';
    if (!values.location) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (ev) => setValues(v => ({ ...v, [field]: ev.target.value }));

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit(values).catch((err) => {
      // backend error display
      const det = err?.details?.details || err?.details;
      setErrors({
        form: err.message,
        ...(det && typeof det === 'object' ? Object.fromEntries(Object.entries(det).map(([k, v]) => [k, String(v)])) : {})
      });
    });
  };

  return (
    <form onSubmit={submit} data-testid="device-form">
      {errors.form && <div className="error" data-testid="form-error">{errors.form}</div>}
      <div className="row">
        <label>Name</label>
        <input data-testid="name-input" value={values.name} onChange={handleChange('name')} placeholder="Device name" />
        {errors.name && <span className="error" data-testid="name-error">{errors.name}</span>}
      </div>
      <div className="row">
        <label>IP Address</label>
        <input data-testid="ip-input" value={values.ip_address} onChange={handleChange('ip_address')} placeholder="192.168.1.10" />
        {errors.ip_address && <span className="error" data-testid="ip-error">{errors.ip_address}</span>}
      </div>
      <div className="row">
        <label>Type</label>
        <select data-testid="type-select" value={values.type} onChange={handleChange('type')}>
          <option value="router">Router</option>
          <option value="switch">Switch</option>
          <option value="server">Server</option>
          <option value="other">Other</option>
        </select>
        {errors.type && <span className="error" data-testid="type-error">{errors.type}</span>}
      </div>
      <div className="row">
        <label>Location</label>
        <input data-testid="location-input" value={values.location} onChange={handleChange('location')} placeholder="Data Center A" />
        {errors.location && <span className="error" data-testid="location-error">{errors.location}</span>}
      </div>
      <div className="actions">
        <button data-testid="submit-btn" className="btn" type="submit" disabled={!!submitting}>{submitting ? 'Saving...' : 'Save'}</button>
        <button data-testid="cancel-btn" className="btn btn-secondary" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
