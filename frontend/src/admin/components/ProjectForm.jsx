import React, { useState } from 'react';

export default function ProjectForm({ initial = null, onSubmit, onUpload, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    slug: initial?.slug || '',
    summary: initial?.summary || '',
    description: initial?.description || '',
    role: initial?.role || '',
    stack: Array.isArray(initial?.stack) ? initial.stack.join(', ') : '',
    year: initial?.year || new Date().getFullYear(),
    coverImage: initial?.coverImage || '',
    repoUrl: initial?.repoUrl || '',
    screenshots: Array.isArray(initial?.screenshots) ? initial.screenshots : [],
    demoUrl: initial?.demoUrl || '',
    metrics: initial?.metrics ? JSON.stringify(initial.metrics, null, 2) : ''
  });

  const [uploading, setUploading] = useState(false);

  // Helper to update state
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Handle Cover Image Upload
  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await onUpload(file); // Returns the string URL from Cloudinary
      update('coverImage', url);
    } catch (err) {
      console.error(err);
      alert('Cover image upload failed');
    } finally {
      setUploading(false);
    }
  }

  // Handle Multi-Screenshot Upload
  async function handleScreenshots(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const url = await onUpload(file);
        uploaded.push(url);
      }
      // Calculate new array first to avoid functional state update bugs
      const nextScreenshots = [...form.screenshots, ...uploaded];
      update('screenshots', nextScreenshots);
    } catch (err) {
      console.error(err);
      alert('Screenshot upload failed');
    } finally {
      setUploading(false);
    }
  }

  function submit(e) {
    e.preventDefault();
    
    // Construct the payload carefully
    const payload = {
      ...form, // Spread current state for base fields
      stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
      year: Number(form.year),
      coverImage: form.coverImage, // This is already a string URL
      screenshots: form.screenshots, // This is already an array of string URLs
      metrics: form.metrics ? JSON.parse(form.metrics) : {},
      published: true 
    };

    onSubmit(payload);

    if (!initial) {
      setForm({
        title: '', slug: '', summary: '', description: '', role: '',
        stack: '', year: new Date().getFullYear(), coverImage: '', 
        screenshots: [], repoUrl: '', demoUrl: '', metrics: ''
      });
    }
  }

  return (
    <form onSubmit={submit} className="relative space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-100">
      
      {/* Loading Overlay */}
      {uploading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-lg">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-blue-700 font-semibold text-sm">Uploading Assets...</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <input required placeholder="Title" value={form.title} onChange={e=>update('title', e.target.value)} className="p-2 border rounded" />
        <input required placeholder="Slug" value={form.slug} onChange={e=>update('slug', e.target.value)} className="p-2 border rounded" />
      </div>

      <input placeholder="Short summary" value={form.summary} onChange={e=>update('summary', e.target.value)} className="p-2 border rounded w-full" />
      <textarea placeholder="Description (HTML allowed)" value={form.description} onChange={e=>update('description', e.target.value)} className="p-2 border rounded w-full" rows={4} />

      <div className="grid grid-cols-3 gap-3">
        <input placeholder="Role" value={form.role} onChange={e=>update('role', e.target.value)} className="p-2 border rounded" />
        <input placeholder="Stack (React, Node, etc)" value={form.stack} onChange={e=>update('stack', e.target.value)} className="p-2 border rounded" />
        <input type="number" placeholder="Year" value={form.year} onChange={e=>update('year', e.target.value)} className="p-2 border rounded" />
      </div>

      {/* Cover Image Section */}
      <div className="space-y-2 border-t pt-2">
        <label className="text-xs font-bold uppercase text-gray-500">Cover Image</label>
        <div className="flex items-center gap-4">
          <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />
          {form.coverImage && (
            <div className="relative">
              <img src={form.coverImage} alt="cover" className="h-16 w-16 object-cover rounded border" />
              <button type="button" onClick={() => update('coverImage', '')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
            </div>
          )}
        </div>
      </div>

      {/* Screenshots Section */}
      <div className="space-y-2 border-t pt-2">
        <label className="text-xs font-bold uppercase text-gray-500">Screenshots</label>
        <input type="file" accept="image/*" multiple onChange={handleScreenshots} className="text-sm block" />
        <div className="grid grid-cols-4 gap-2 mt-2">
          {form.screenshots.map((src, i) => (
            <div key={i} className="relative group">
              <img src={src} alt="screenshot" className="h-20 w-full object-cover rounded border" />
              <button 
                type="button" 
                onClick={() => update('screenshots', form.screenshots.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-[10px]">✕</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t pt-2">
        <input placeholder="Repo URL" value={form.repoUrl} onChange={e=>update('repoUrl', e.target.value)} className="p-2 border rounded" />
        <input placeholder="Demo URL" value={form.demoUrl} onChange={e=>update('demoUrl', e.target.value)} className="p-2 border rounded" />
      </div>

      <textarea
        placeholder='Metrics JSON: {"users": 1000}'
        value={form.metrics}
        onChange={e => update('metrics', e.target.value)}
        className="p-2 border rounded w-full font-mono text-xs"
        rows={3}
      />

      <div className="flex gap-3 pt-2">
        <button 
          disabled={uploading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 disabled:bg-blue-300"
        >
          {initial ? 'Update Project' : 'Create Project'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}