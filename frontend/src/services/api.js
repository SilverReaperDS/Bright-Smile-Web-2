// src/services/api.js
import { io } from "socket.io-client";

const DATA_BASE = "/data";

/**
 * Backend base URL.
 * - Explicit: REACT_APP_API_URL when set (trimmed, no trailing slash).
 * - Development: '' so requests stay on the CRA dev server origin; setupProxy.js forwards
 *   /api, /login, /register, and /me to Express (avoids cross-port "Load failed" in Safari
 *   and works when only :3000 is used in the browser).
 * - Production: '' for same-origin deploy (nginx, etc.); set REACT_APP_API_URL if API is elsewhere.
 * - Optional: REACT_APP_DEV_API_DIRECT=true to call hostname:REACT_APP_BACKEND_PORT from the browser
 *   (only if you intentionally bypass the proxy).
 */
export function getApiBase() {
  const explicit = process.env.REACT_APP_API_URL;
  if (explicit != null && String(explicit).trim() !== "") {
    return String(explicit).replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    if (process.env.REACT_APP_DEV_API_DIRECT === "true") {
      const { protocol, hostname } = window.location;
      const port = process.env.REACT_APP_BACKEND_PORT || "5001";
      return `${protocol}//${hostname}:${port}`;
    }
    return "";
  }
  return "";
}

async function parseErrorResponse(res) {
  const text = await res.text().catch(() => "");
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
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch ${path}: ${res.status} ${text}`);
  }
  return res.json();
}

export const getServices = () => fetchJson("services.json");
export const getTeam = () => fetchJson("team.json");

function resolvePublicAssetUrl(u) {
  if (u == null) return "";
  const s = String(u);
  if (
    s.startsWith("http://") ||
    s.startsWith("https://") ||
    s.startsWith("data:")
  )
    return s;
  if (s.startsWith("/")) return s;
  return `/${s}`;
}

/** Approved testimonials from `/api/testimonials`, falling back to static JSON. */
export async function getTestimonials(opts = {}) {
  const { signal } = opts;
  try {
    const res = await fetch(`${getApiBase()}/api/testimonials`, { signal });
    if (!res.ok) throw new Error("testimonials api");
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("invalid testimonials payload");
    return data;
  } catch (e) {
    if (e?.name === "AbortError") throw e;
    const res = await fetch(`${DATA_BASE}/testimonials.json`, { signal });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Failed to fetch testimonials.json: ${res.status} ${text}`,
      );
    }
    return res.json();
  }
}

/** Normalize API row to a before/after case for `GalleryViewer`. */
function normalizeGalleryCase(row) {
  const before = resolvePublicAssetUrl(row.beforeImageUrl);
  const after = row.afterImageUrl
    ? resolvePublicAssetUrl(row.afterImageUrl)
    : null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    beforeImage: before,
    afterImage: after,
  };
}

/** Legacy static JSON: pairs of { image, caption } → cases. */
function legacyGalleryJsonToCases(items) {
  const out = [];
  const list = Array.isArray(items) ? items : [];
  for (let i = 0; i < list.length; i += 2) {
    const a = list[i];
    const b = list[i + 1];
    if (!a?.image) continue;
    out.push({
      id: `static-${i}`,
      title: a.caption || undefined,
      description:
        b?.caption && b.caption !== a.caption
          ? `After: ${b.caption}`
          : undefined,
      category: undefined,
      beforeImage: resolvePublicAssetUrl(a.image),
      afterImage: b?.image ? resolvePublicAssetUrl(b.image) : null,
    });
  }
  return out.filter((c) => c.beforeImage);
}

/** Gallery cases from `/api/gallery` (before/after pairs), with static JSON fallback. */
export async function getGallery(opts = {}) {
  const { signal } = opts;

  try {
    const res = await fetch(`${getApiBase()}/api/gallery`, { signal });
    if (!res.ok) throw new Error("gallery api");
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("invalid gallery payload");
    if (data.length === 0) throw new Error("empty gallery from api");
    if (data[0].beforeImageUrl !== undefined) {
      return data.map(normalizeGalleryCase).filter((c) => c.beforeImage);
    }
    throw new Error("unexpected gallery shape");
  } catch (e) {
    if (e?.name === "AbortError") throw e;
    const res = await fetch(`${DATA_BASE}/gallery.json`, { signal });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Failed to fetch gallery.json: ${res.status} ${text}`);
    }
    const j = await res.json();
    return legacyGalleryJsonToCases(j);
  }
}

function authHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

let realtimeSocket = null;

export function initializeRealtimeSocket() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;
  if (realtimeSocket && realtimeSocket.connected) return realtimeSocket;

  const socket = io(getApiBase() || window.location.origin, {
    transports: ["websocket", "polling"],
    auth: {
      token: `Bearer ${token}`,
    },
  });
  realtimeSocket = socket;
  return realtimeSocket;
}

export function getRealtimeSocket() {
  return realtimeSocket;
}

export function disconnectRealtimeSocket() {
  if (!realtimeSocket) return;
  realtimeSocket.disconnect();
  realtimeSocket = null;
}

export function realtimeJoinThread(threadId) {
  if (!realtimeSocket || !threadId) return;
  realtimeSocket.emit("thread:join", threadId);
}

export function realtimeLeaveThread(threadId) {
  if (!realtimeSocket || !threadId) return;
  realtimeSocket.emit("thread:leave", threadId);
}

export async function postRegister({ username, email, password, phone }) {
  const res = await fetch(`${getApiBase()}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, phone }),
  });

  if (!res.ok) {
    const msg = await parseErrorResponse(res);
    console.error("Registration error:", res.status, msg);
    throw new Error(msg || `Registration failed: ${res.status}`);
  }

  return res.json();
}

/** Contact form: requires a logged-in session (see PrivateRoute on /contact). */
export async function postContactMessage({ message }) {
  const res = await fetch(`${getApiBase()}/api/messages`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }
  return res.json();
}

function networkErrorMessage(err) {
  const msg = err?.message || "";
  if (
    msg === "Failed to fetch" ||
    msg === "Load failed" ||
    msg === "NetworkError when attempting to fetch resource."
  ) {
    return "Cannot reach the server. Start the backend (npm run start:backend) and use the app from the dev server (npm start in frontend), usually http://localhost:3000.";
  }
  return msg || "Request failed";
}

export async function postLogin({ username, password }) {
  let res;
  try {
    res = await fetch(`${getApiBase()}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch (err) {
    throw new Error(networkErrorMessage(err));
  }

  if (!res.ok) {
    const msg = await parseErrorResponse(res);
    console.error("Login error:", res.status, msg);
    throw new Error("Invalid credentials");
  }

  const data = await res.json();
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("username", username);
  return data;
}

export async function getMe() {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${getApiBase()}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
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
  const res = await fetch(`${getApiBase()}/api/appointments`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAppointmentStaff() {
  const res = await fetch(`${getApiBase()}/api/appointments/staff`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function patchAppointment(id, body) {
  const res = await fetch(`${getApiBase()}/api/appointments/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }
  return res.json();
}

export async function deleteAppointment(id) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(
    `${getApiBase()}/api/appointments/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );
  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }
  return res.json();
}

export async function bookAppointment({ appointmentDate, notes }) {
  const res = await fetch(`${getApiBase()}/api/appointments/book`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ appointmentDate, notes }),
  });
  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }
  return res.json();
}

export async function fetchAdminMessages() {
  const res = await fetch(`${getApiBase()}/api/messages`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAdminThreadSummaries() {
  const res = await fetch(`${getApiBase()}/api/messages/threads/summary`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAdminThreadMessages(threadId) {
  const res = await fetch(
    `${getApiBase()}/api/messages/threads/${encodeURIComponent(threadId)}`,
    {
      headers: authHeaders(),
    },
  );
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function postAdminThreadReply(threadId, message) {
  const res = await fetch(
    `${getApiBase()}/api/messages/threads/${encodeURIComponent(threadId)}/reply`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ message }),
    },
  );
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchMyThreads() {
  const res = await fetch(`${getApiBase()}/api/my/threads`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchMyThreadMessages(threadId) {
  const res = await fetch(
    `${getApiBase()}/api/my/threads/${encodeURIComponent(threadId)}/messages`,
    {
      headers: authHeaders(),
    },
  );
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function postMyThreadReply(threadId, message) {
  const res = await fetch(
    `${getApiBase()}/api/my/threads/${encodeURIComponent(threadId)}/messages`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ message }),
    },
  );
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchMyAppointments() {
  const res = await fetch(`${getApiBase()}/api/my/appointments`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function deleteMyAccount() {
  const res = await fetch(`${getApiBase()}/api/my/account`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function patchAdminMessage(id, body) {
  const res = await fetch(`${getApiBase()}/api/messages/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function deleteAdminMessage(id) {
  const res = await fetch(`${getApiBase()}/api/messages/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAdminGallery() {
  const res = await fetch(`${getApiBase()}/api/gallery`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

/** Multipart: fields title, description, category + files beforeImage, afterImage (both required). */
export async function postAdminGalleryCase(formData) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${getApiBase()}/api/gallery`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

/** JSON: beforeImageUrl + afterImageUrl (optional helper for scripts). */
export async function postAdminGalleryCaseFromUrls(body) {
  const res = await fetch(`${getApiBase()}/api/gallery`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function deleteAdminGalleryItem(id) {
  const res = await fetch(
    `${getApiBase()}/api/gallery/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

/** JSON body or FormData (metadata + optional beforeImage/afterImage files). */
export async function patchAdminGalleryCase(id, bodyOrForm) {
  const token = localStorage.getItem("authToken");
  const isForm =
    typeof FormData !== "undefined" && bodyOrForm instanceof FormData;
  const res = await fetch(
    `${getApiBase()}/api/gallery/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: isForm
        ? token
          ? { Authorization: `Bearer ${token}` }
          : {}
        : authHeaders(),
      body: isForm ? bodyOrForm : JSON.stringify(bodyOrForm),
    },
  );
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function patchAdminGalleryReorder(orderedIds) {
  const res = await fetch(`${getApiBase()}/api/gallery/reorder`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ orderedIds }),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAdminTestimonials(filters = {}) {
  const q = new URLSearchParams();
  if (filters.status) q.set("status", filters.status);
  if (
    filters.rating != null &&
    filters.rating !== "" &&
    filters.rating !== "all"
  ) {
    q.set("rating", String(filters.rating));
  }
  const qs = q.toString();
  const res = await fetch(
    `${getApiBase()}/api/admin/testimonials${qs ? `?${qs}` : ""}`,
    {
      headers: authHeaders(),
    },
  );
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function patchAdminTestimonial(id, body) {
  const res = await fetch(
    `${getApiBase()}/api/admin/testimonials/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function deleteAdminTestimonial(id) {
  const res = await fetch(
    `${getApiBase()}/api/admin/testimonials/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAdminUsers() {
  const res = await fetch(`${getApiBase()}/api/admin/users`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAdminStaff() {
  const res = await fetch(`${getApiBase()}/api/admin/users/staff`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function createAdminStaff(body) {
  const res = await fetch(`${getApiBase()}/api/admin/users/staff`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function patchAdminStaff(id, body) {
  const res = await fetch(`${getApiBase()}/api/admin/users/staff/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function deleteAdminStaff(id) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(
    `${getApiBase()}/api/admin/users/staff/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}
export async function patchAdminUserRole(id, body) {
  const res = await fetch(
    `${getApiBase()}/api/admin/users/${encodeURIComponent(id)}/role`,

    {
      method: "PATCH",

      headers: authHeaders(),

      body: JSON.stringify(body),
    },
  );

  if (!res.ok) throw new Error(await parseErrorResponse(res));

  return res.json();
}

export async function patchAdminUserActive(id, isActive) {
  const res = await fetch(
    `${getApiBase()}/api/admin/users/${encodeURIComponent(id)}/active`,
    {
      method: "PATCH",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    },
  );

  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function patchAdminUserActive(id, isActive) {
  const res = await fetch(
    `${getApiBase()}/api/admin/users/${encodeURIComponent(id)}/active`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ isActive }),
    },
  );
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function fetchAdminUserActivityLogs() {
  const res = await fetch(`${getApiBase()}/api/admin/users/logs`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function downloadAppointmentsCsv() {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${getApiBase()}/api/appointments/export/csv`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) throw new Error(await parseErrorResponse(res));

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "appointments.csv";
  document.body.appendChild(a); // مهم لبعض المتصفحات
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

export async function fetchMyTestimonials() {
  const res = await fetch(`${getApiBase()}/api/my/testimonials`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function createMyTestimonial({ text, rating, authorName }) {
  const res = await fetch(`${getApiBase()}/api/my/testimonials`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ text, rating, authorName }),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}

export async function deleteMyTestimonial(id) {
  const res = await fetch(`${getApiBase()}/api/my/testimonials/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res));
  return res.json();
}
