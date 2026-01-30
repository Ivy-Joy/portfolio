// frontend/src/services/adminApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 15000
});

// module-level tokens in memory
let accessToken = null;
let csrfToken = null;

export function setTokens(access, csrf) {
  accessToken = access || null;
  csrfToken = csrf || null;
}

// INTERCEPTOR: Automatically attaches tokens to EVERY request
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  if (csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
  }

  // Debug log to catch "missing" errors in your browser console
  if (!csrfToken && !config.url.includes('/login') && !config.url.includes('/refresh')) {
     console.warn(`CSRF missing for request to ${config.url}. Did you refresh the page?`);
  }

  return config;
}, (err) => Promise.reject(err));

// RESPONSE INTERCEPTOR: Handles 401s and token refresh
let isRefreshing = false;
let subscribers = [];

function onAccessTokenUpdated(newToken, newCsrf) {
  subscribers.forEach(cb => cb(newToken, newCsrf));
  subscribers = [];
}

api.interceptors.response.use(
  res => res,
  async (err) => {
    const originalRequest = err.config;
    if (!originalRequest || originalRequest._retry) return Promise.reject(err);

    if (err.response?.status === 401) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribers.push((newAccess, newCsrf) => {
            originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
            originalRequest.headers['x-csrf-token'] = newCsrf;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const response = await axios.post(`${API_BASE}/admin/refresh`, {}, { withCredentials: true });
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
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

/* --- API CALLS --- */

export async function login(email, password) {
  const res = await api.post('/admin/login', { email, password });
  setTokens(res.data.accessToken, res.data.csrfToken);
  return res.data;
}

export async function refresh() {
  const res = await api.post('/admin/refresh');
  setTokens(res.data.accessToken, res.data.csrfToken);
  return res.data;
}

export async function logout() {
  await api.post('/admin/logout');
  setTokens(null, null);
}

// Notice: No manual header building needed anymore!
export const adminListProjects = () => api.get('/admin/projects').then(res => res.data);
export const adminCreateProject = (payload) => api.post('/admin/projects', payload).then(res => res.data);
export const adminUpdateProject = (id, payload) => api.put(`/admin/projects/${id}`, payload).then(res => res.data);
export const adminDeleteProject = (id) => api.delete(`/admin/projects/${id}`).then(res => res.data);

export async function adminUploadImage(file) {
  const form = new FormData(); // 'file' must match the key expected by Multer on backend 
  form.append('file', file);

  //Axios handle the Content-Type boundary for FormData
  const res = await api.post('/admin/upload', form);

  // Return the data object containing the { url }
  return res.data;
}