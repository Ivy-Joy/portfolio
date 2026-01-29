import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
  timeout: 10000
});

/* REAL DATA ONLY */

export async function fetchProjects() {
  const res = await API.get('/projects');
  return res.data;
}

export async function fetchProject(slug) {
  const res = await API.get(`/projects/${slug}`);
  return res.data;
}

export async function postContact(payload) {
  const res = await API.post('/contact', payload);
  return res.data;
}
