// src/services/api.js
// Centralized API layer for fetching local JSON and posting form data.

const DATA_BASE = '/data';
const API_BASE = 'https://6947d3061ee66d04a44e061b.mockapi.io/brightsmile'; // MockAPI base


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


export async function postRegister({ username, password }) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Registration error:', res.status, errorText);
    throw new Error(`Registration failed: ${res.status}`);
  }

  return res.json();
}


export async function postLogin({ username, password }) {
  const res = await fetch(`${API_BASE}/users`);
  const users = await res.json();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) throw new Error('Invalid credentials');

  const token = btoa(`${username}:${password}`); // Simulated token
  localStorage.setItem('authToken', token);
  localStorage.setItem('username', username);
  return { message: 'Login successful', token };
}
