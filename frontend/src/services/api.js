// src/services/api.js

const DATA_BASE = '/data';

/**
 * Backend base URL.
 * - Production: use REACT_APP_API_URL if set, otherwise '' (same origin, e.g. nginx /api).
 * - Development: same hostname as the tab + backend port (LAN-friendly), so DELETE/PATCH
 *   always hit Express. setupProxy.js also forwards /api on :3000 if you use relative URLs.
 */
export function getApiBase() {
  const explicit = process.env.REACT_APP_API_URL;
  if (explicit != null && String(explicit).trim() !== '') {
    return String(explicit).replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const { protocol, hostname } = window.location;
    const port = process.env.REACT_APP_BACKEND_PORT || '5001';
    return `${protocol}//${hostname}:${port}`;
  }
  return '';
}

async function parseErrorResponse(res) {
  const text = await res.text().catch(() => '');
  try {
    const j = JSON.parse(text);
    return j.error || j.message || text || res.statusText;
  } catch {
    return text || res.statusText || `HTTP ${res.status}`;
  }
}

async function fetchJson(path) {
  const res = await fetch(`${DATA_BASE}/${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch ${path}: ${res.status} ${text}`);
  }
  return res.json();
}

export const getTestimonials = () => fetchJson('testimonials.json');
export const getServices = () => fetchJson('services.json');
export const getTeam = () => fetchJson('team.json');
export const getGallery = () => fetchJson('gallery.json');

function authHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function postRegister({ username, email, password, phone }) {
  const res = await fetch(`${getApiBase()}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, phone }),
  });

  if (!res.ok) {
    const msg = await parseErrorResponse(res);
    console.error('Registration error:', res.status, msg);
    throw new Error(msg || `Registration failed: ${res.status}`);
  }

  return res.json();
}

/** Contact form: requires a logged-in session (see PrivateRoute on /contact). */
export async function postContactMessage({ message }) {
  const res = await fetch(`${getApiBase()}/api/messages`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }
  return res.json();
}

export async function postLogin({ username, password }) {
  const res = await fetch(`${getApiBase()}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const msg = await parseErrorResponse(res);
    console.error('Login error:', res.status, msg);
    throw new Error('Invalid credentials');
  }

  const data = await res.json();
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('username', username);
  return data;
}

export async function getMe() {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${getApiBase()}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Not authenticated');
  }

  return res.json();
}

export async function fetchDashboardOverview() {
  const res = await fetch(`${getApiBase()}/api/dashboard/overview`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }
  return res.json();
}

export async function fetchAppointments() {
  const res = await fetch(`${getApiBase()}/api/appointments`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAppointmentStaff() {
  const res = await fetch(`${getApiBase()}/api/appointments/staff`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function patchAppointment(id, body) {
  const res = await fetch(`${getApiBase()}/api/appointments/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }
  return res.json();
}

export async function deleteAppointment(id) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${getApiBase()}/api/appointments/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }
  return res.json();
}

export async function bookAppointment({ appointmentDate, notes }) {
  const res = await fetch(`${getApiBase()}/api/appointments/book`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ appointmentDate, notes }),
  });
  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }
  return res.json();
}

export async function fetchAdminMessages() {
  const res = await fetch(`${getApiBase()}/api/messages`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAdminThreadSummaries() {
  const res = await fetch(`${getApiBase()}/api/messages/threads/summary`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAdminThreadMessages(threadId) {
  const res = await fetch(`${getApiBase()}/api/messages/threads/${encodeURIComponent(threadId)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function postAdminThreadReply(threadId, message) {
  const res = await fetch(`${getApiBase()}/api/messages/threads/${encodeURIComponent(threadId)}/reply`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchMyThreads() {
  const res = await fetch(`${getApiBase()}/api/my/threads`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchMyThreadMessages(threadId) {
  const res = await fetch(`${getApiBase()}/api/my/threads/${encodeURIComponent(threadId)}/messages`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function postMyThreadReply(threadId, message) {
  const res = await fetch(`${getApiBase()}/api/my/threads/${encodeURIComponent(threadId)}/messages`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchMyAppointments() {
  const res = await fetch(`${getApiBase()}/api/my/appointments`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function deleteMyAccount() {
  const res = await fetch(`${getApiBase()}/api/my/account`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function patchAdminMessage(id, body) {
  const res = await fetch(`${getApiBase()}/api/messages/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function deleteAdminMessage(id) {
  const res = await fetch(`${getApiBase()}/api/messages/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAdminGallery() {
  const res = await fetch(`${getApiBase()}/api/gallery`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function postAdminGalleryItem(body) {
  const res = await fetch(`${getApiBase()}/api/gallery`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function deleteAdminGalleryItem(id) {
  const res = await fetch(`${getApiBase()}/api/gallery/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAdminTestimonials() {
  const res = await fetch(`${getApiBase()}/api/admin/testimonials`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function patchAdminTestimonial(id, body) {
  const res = await fetch(`${getApiBase()}/api/admin/testimonials/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAdminUsers() {
  const res = await fetch(`${getApiBase()}/api/admin/users`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAdminStaff() {
  const res = await fetch(`${getApiBase()}/api/admin/users/staff`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function createAdminStaff(body) {
  const res = await fetch(`${getApiBase()}/api/admin/users/staff`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function patchAdminStaff(id, body) {
  const res = await fetch(`${getApiBase()}/api/admin/users/staff/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function deleteAdminStaff(id) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${getApiBase()}/api/admin/users/staff/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function downloadAppointmentsCsv() {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${getApiBase()}/api/appointments/export/csv`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'appointments.csv';
  a.click();
  URL.revokeObjectURL(url);
}
