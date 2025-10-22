/**
 * Simple API client for the Device Management backend.
 * Uses REACT_APP_API_BASE (default: /api).
 */
const API_BASE = process.env.REACT_APP_API_BASE || '/api';

async function handleResponse(res) {
  if (!res.ok) {
    let details = {};
    try {
      details = await res.json();
    } catch (e) {
      // ignore
    }
    const err = new Error(details.message || `Request failed with status ${res.status}`);
    err.status = res.status;
    err.details = details;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

// PUBLIC_INTERFACE
export async function listDevices(params = {}) {
  /** List devices with optional params: type, status, sort */
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE}/devices${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function createDevice(payload) {
  /** Create a new device */
  const res = await fetch(`${API_BASE}/devices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getDevice(id) {
  /** Get device by ID */
  const res = await fetch(`${API_BASE}/devices/${id}`);
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function updateDevice(id, payload) {
  /** Update device by ID */
  const res = await fetch(`${API_BASE}/devices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function deleteDevice(id) {
  /** Delete device by ID */
  const res = await fetch(`${API_BASE}/devices/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getAllStatuses() {
  /** Get statuses for all devices */
  const res = await fetch(`${API_BASE}/devices/status`);
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function triggerStatus(id) {
  /** Manually trigger status check for a device */
  const res = await fetch(`${API_BASE}/devices/${id}/status`, { method: 'POST' });
  return handleResponse(res);
}
