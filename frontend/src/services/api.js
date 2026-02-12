//src/services/api.js
import axios from 'axios';
import localProjects from '../data/projects';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'https://portfolio-backend-fgex.onrender.com/api',
  withCredentials: true,
  timeout: 5000
});

/**
 * Strategy: Return local data immediately. 
 * Optionally, you could fetch from API in the background to "sync", 
 * but for a portfolio, local-first is most reliable.
 */
export async function fetchProjects() {
  try {
    // We return local projects immediately so the UI is never empty
    return localProjects;
  } catch (err) {
    console.error("Error loading local projects:", err);
    return [];
  }
}

export async function fetchProject(slug) {
  // 1. Check local data first
  const project = localProjects.find(p => p.slug === slug);
  
  if (project) {
    return project;
  }

  // 2. Fallback to API only if not found locally
  try {
    const res = await API.get(`/projects/${slug}`);
    return res.data;
  } catch (err) {
    console.error("Project not found locally or on server:", err);
    throw err;
  }
}

export async function postContact(payload) {
  //Contact must still go to the backend
  const res = await API.post('/contact', payload);
  return res.data;
}
