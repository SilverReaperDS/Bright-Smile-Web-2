// src/services/api.js

const DATA_BASE = '/data';
const API_BASE = process.env.REACT_APP_API_URL ?? '';

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

export async function postRegister({ username, email, password }) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Registration error:', res.status, errorText);
    throw new Error(`Registration failed: ${res.status}`);
  }

  return res.json();
}

export async function postLogin({ username, password }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Login error:', res.status, errorText);
    throw new Error('Invalid credentials');
  }

  const data = await res.json();
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('username', username);
  return data;
}

export async function getMe() {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_BASE}/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Not authenticated');
  }

  return res.json();
}
