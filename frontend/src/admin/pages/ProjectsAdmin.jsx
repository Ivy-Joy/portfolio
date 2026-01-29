// frontend/src/admin/pages/ProjectsAdmin.jsx
import React, { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import {
  adminListProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminUploadImage
} from '../services/adminApi';
import ProjectForm from '../components/ProjectForm';
import { useAdminAuth } from '../useAdminAuth';

export default function ProjectsAdmin() {
  const { logout } = useAdminAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await adminListProjects();
      setProjects(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // CREATE -> save and then navigate to public projects page
  async function handleCreate(payload) {
    try {
      const created = await adminCreateProject(payload);
      // Option A: navigate to public projects page so you see the live result
      //nav('/projects');
      // Option B: stay in admin and immediately add it to admin list (uncomment if you prefer)
      setProjects(p => [created, ...p]);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function handleUpdate(id, payload) {
    try {
      const updated = await adminUpdateProject(id, payload);
      setProjects(p => p.map(x => x._id === id ? updated : x));
      setEditing(null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete project?')) return;
    try {
      await adminDeleteProject(id);
      setProjects(p => p.filter(x => x._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function handleUpload(file) {
    const { url } = await adminUploadImage(file);
    return url;
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold mb-4">Admin - Projects</h1>
        <div>
          <button onClick={() => logout()} className="px-3 py-2 border rounded">Logout</button>
        </div>
      </div>
      
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="mb-6">
        <ProjectForm onSubmit={handleCreate} onUpload={handleUpload} />
      </div>

      {loading ? <div>Loading…</div> : (
        <div className="space-y-4">
          {projects.map(p => (
            <div key={p._id} className="bg-white p-4 rounded shadow flex items-start justify-between">
              <div>
                <div className="font-semibold">{p.title} <span className="text-xs text-slate-500">({p.year})</span></div>
                <div className="text-sm text-slate-600">{p.summary}</div>
                <div className="mt-2 text-xs text-slate-500">{p.role}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(p)} className="px-3 py-1 border rounded">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="mt-6 bg-slate-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Edit: {editing.title}</h3>
          <ProjectForm initial={editing} onSubmit={(payload) => handleUpdate(editing._id, payload)} onUpload={handleUpload} onCancel={() => setEditing(null)} />
        </div>
      )}
    </div>
  );
}
