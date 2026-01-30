// frontend/src/admin/components/ProjectForm.jsx
import React, { useState } from 'react';

export default function ProjectForm({ initial = null, onSubmit, onUpload, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    slug: initial?.slug || '',
    summary: initial?.summary || '',
    description: initial?.description || '',
    role: initial?.role || '',
    //stack: (initial?.stack || []).join(', '),
    stack: Array.isArray(initial?.stack) ? initial.stack.join(', ') : '',
    year: initial?.year || new Date().getFullYear(),
    coverImage: initial?.coverImage || '',
    repoUrl: initial?.repoUrl || '',
    //screenshots: (initial?.screenshots || []).join(', '),
    screenshots: Array.isArray(initial?.screenshots) ? initial.screenshots : [],
    demoUrl: initial?.demoUrl || '',
    metrics: initial?.metrics ? JSON.stringify(initial.metrics, null, 2) : ''

  });

  const [uploading, setUploading] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await onUpload(file);
      update('coverImage', url);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function submit(e) {
    e.preventDefault();
    const payload = {
      ...form, // Spread the current form state
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      description: form.description,
      role: form.role,
      stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
      year: Number(form.year),
      coverImage: form.coverImage,
      repoUrl: form.repoUrl,
      demoUrl: form.demoUrl,
      // screenshots: form.screenshots
      //   ? form.screenshots.split(',').map(s => s.trim())
      //   : [],
      screenshots: form.screenshots,

      metrics: form.metrics ? JSON.parse(form.metrics) : {},
      published: true //Ensure this is true so the Public list () shows it
    };
    onSubmit(payload);
    // clear if creating
    if (!initial) setForm({
      title: '', slug: '', summary: '', description: '', role: '',
      stack: '', year: new Date().getFullYear(), coverImage: '', screenshots: [], repoUrl: ''
    });
  }
  async function handleScreenshots(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const url = await onUpload(file); // This calls handleUpload in ProjectsAdmin
        uploaded.push(url);
      }
      //update('screenshots', [...form.screenshots, ...uploaded]);
      //update('screenshots', prev => [...prev, ...uploaded]);

      // FIX: Calculate the new array and pass it directly to update
      const nextScreenshots = [...form.screenshots, ...uploaded];
      update('screenshots', nextScreenshots);
    } catch (err) {
      console.error(err);
      alert('Screenshot upload failed');
    } finally {
      setUploading(false);
    }
  }


  return (
    <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded shadow">
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="Title" value={form.title} onChange={e=>update('title', e.target.value)} className="p-2 border rounded" />
        <input required placeholder="Slug" value={form.slug} onChange={e=>update('slug', e.target.value)} className="p-2 border rounded" />
      </div>

      <input placeholder="Short summary" value={form.summary} onChange={e=>update('summary', e.target.value)} className="p-2 border rounded w-full" />
      <textarea placeholder="Description (HTML allowed)" value={form.description} onChange={e=>update('description', e.target.value)} className="p-2 border rounded w-full" rows={6} />

      <div className="grid grid-cols-3 gap-3">
        <input placeholder="Role" value={form.role} onChange={e=>update('role', e.target.value)} className="p-2 border rounded" />
        <input placeholder="Stack (comma separated)" value={form.stack} onChange={e=>update('stack', e.target.value)} className="p-2 border rounded" />
        <input placeholder="Year" value={form.year} onChange={e=>update('year', e.target.value)} className="p-2 border rounded" />
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Cover Image</label>
        <input type="file" accept="image/*" onChange={handleFile} />
        {uploading ? <div className="text-sm">Uploading…</div> : form.coverImage ? <img src={form.coverImage} alt="cover" className="h-12 rounded" /> : null}
      </div>

      {/* Screenshots */}
      <div className="flex items-center gap-3 space-y-2">
        <label className="text-sm font-medium">Screenshots</label>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleScreenshots}
        />

        {uploading && (
          <div className="text-sm text-gray-500">Uploading screenshots…</div>
        )}

        {form.screenshots?.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {form.screenshots.map((src, i) => (
              <div key={i} className="relative">
                <img
                  src={src}
                  alt={`screenshot-${i}`}
                  className="h-20 w-full object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() =>
                    update(
                      'screenshots',
                      form.screenshots.filter((_, idx) => idx !== i)
                    )
                  }
                  className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <input placeholder="Repo URL" value={form.repoUrl} onChange={e=>update('repoUrl', e.target.value)} className="p-2 border rounded w-full" />
      <input
        placeholder="Demo URL"
        value={form.demoUrl}
        onChange={e => update('demoUrl', e.target.value)}
        className="p-2 border rounded w-full"
      />

      <textarea
        placeholder='Metrics (JSON, e.g. {"users":1000,"txPerMonth":200})'
        value={form.metrics}
        onChange={e => update('metrics', e.target.value)}
        className="p-2 border rounded w-full"
        rows={3}
      />

      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">{initial ? 'Save changes' : 'Create project'}</button>
        {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>}
      </div>
    </form>
  );
}
