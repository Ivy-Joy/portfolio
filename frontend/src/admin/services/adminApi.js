// frontend/src/services/adminApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Axios instance with credentials for refresh cookie
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 15000
});

// helper to read cookie (if you prefer cookie-based source)
// function getCookie(name) {
//   return document.cookie.split('; ').find(c => c.startsWith(name + '='))?.split('=')[1] || null;
// }
function getCookie(name) {
  const m = document.cookie.split('; ').find(c => c.startsWith(name + '='));
  if (!m) return null;
  return decodeURIComponent(m.split('=')[1] || '');
}


// module-level tokens in memory
let accessToken = null;
let csrfToken = null;

// set tokens (called from Auth context)
export function setTokens(access, csrf) {
  accessToken = access || null;
  csrfToken = csrf || null;
}

// helper to build headers for requests
function buildHeaders(extra = {}) {
  const headers = { ...extra };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  if (csrfToken) headers['x-csrf-token'] = csrfToken;
  // env-based token (dev/backdoor) — only if set on build
  const envToken = import.meta.env.VITE_ADMIN_TOKEN;
  if (envToken) headers['x-admin-token'] = envToken;
  return headers;
}

// Interceptor: on 401 try refresh once, then retry request
let isRefreshing = false;
let subscribers = [];

function onAccessTokenUpdated(newToken, newCsrf) {
  subscribers.forEach(cb => cb(newToken, newCsrf));
  subscribers = [];
}

// async function refreshAndRetry(originalRequest) {
//   try {
//     const resp = await api.post('/admin/refresh', {}, { withCredentials: true });
//     const { accessToken: newAccess, csrfToken: newCsrf } = resp.data;
//     setTokens(newAccess, newCsrf);
//     onAccessTokenUpdated(newAccess, newCsrf);
//     // update original request headers
//     originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
//     originalRequest.headers['x-csrf-token'] = newCsrf;
//     return api(originalRequest);
//   } catch (err) {
//     // refresh failed — ensure tokens cleared
//     setTokens(null, null);
//     onAccessTokenUpdated(null, null);
//     throw err;
//   }
// }
// ensure headers include csrf + authorization for every request
api.interceptors.request.use((config) => {
  // attach Authorization if set
  if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;

  // prefer in-memory csrfToken, fallback to cookie
  const token = csrfToken || getCookie('csrf');
  if (token) config.headers['x-csrf-token'] = token;

  // do not set Content-Type for FormData; axios will handle it automatically
  return config;
}, (err) => Promise.reject(err));

api.interceptors.response.use(
  res => res,
  async (err) => {
    const originalRequest = err.config;
    if (!originalRequest) return Promise.reject(err);

    // only handle 401 for protected API calls (not login/refresh)
    const status = err.response?.status;
    if (status === 401 && !originalRequest._retry) {
      // avoid infinite loops
      originalRequest._retry = true;

      if (isRefreshing) {
        // queue retry until refresh done
        return new Promise((resolve, reject) => {
          subscribers.push((newAccess, newCsrf) => {
            if (!newAccess) return reject(err);
            originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
            originalRequest.headers['x-csrf-token'] = newCsrf;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const response = await api.post('/admin/refresh', {}, { withCredentials: true });
        const { accessToken: newAccess, csrfToken: newCsrf } = response.data;
        setTokens(newAccess, newCsrf);
        isRefreshing = false;
        onAccessTokenUpdated(newAccess, newCsrf);
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        originalRequest.headers['x-csrf-token'] = newCsrf;
        return api(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        setTokens(null, null);
        onAccessTokenUpdated(null, null);
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

// Public endpoints

export async function login(email, password) {
  const res = await api.post('/admin/login', { email, password });
  // backend returns { accessToken, csrfToken }
  const { accessToken: at, csrfToken: ct } = res.data;
  setTokens(at, ct); // store tokens in memory for buildHeaders() & interceptor
  return res.data;
}

export async function refresh() {
  const res = await api.post('/admin/refresh', {}, { withCredentials: true });
  return res.data;
}

export async function logout() {
  const res = await api.post('/admin/logout', {}, { withCredentials: true });
  // clear tokens (caller should also clear context)
  setTokens(null, null);
  return res.data;
}

// Admin CRUD functions: will use current module-level tokens
export async function adminListProjects() {
  const res = await api.get('/admin/projects', { headers: buildHeaders() });
  return res.data;
}

export async function adminCreateProject(payload) {
  // payload can be JSON or FormData (for file upload). If using file, set appropriate headers.
  const headers = buildHeaders();
  const res = await api.post('/admin/projects', payload, { headers });
  return res.data;
}

export async function adminUpdateProject(id, payload) {
  const headers = buildHeaders();
  const res = await api.put(`/admin/projects/${id}`, payload, { headers });
  return res.data;
}

export async function adminDeleteProject(id) {
  const headers = buildHeaders();
  const res = await api.delete(`/admin/projects/${id}`, { headers });
  return res.data;
}

export async function adminUploadImage(file) {
  const form = new FormData();
  form.append('file', file);
  //const headers = buildHeaders(); // axios will set Content-Type automatically for FormData
  const res = await api.post('/admin/upload', form);
  return res.data; // { url }
}
