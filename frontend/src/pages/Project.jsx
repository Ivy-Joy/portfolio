import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProject } from '../services/api';

export default function Project() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetchProject(slug).then(setProject).catch(err => console.error(err));
  }, [slug]);

  if (!project) return <div className="py-12">Loading project...</div>;

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="text-slate-600 mt-2">{project.summary}</p>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: project.description || '<p>No description provided.</p>' }} />
            <h3 className="mt-6 font-semibold">Role & contributions</h3>
            <p>{project.role}</p>
            <h3 className="mt-4 font-semibold">Stack</h3>
            <div className="flex gap-2 mt-2 flex-wrap">
              {project.stack?.map(s => <span key={s} className="text-xs px-2 py-1 border rounded">{s}</span>)}
            </div>
            <h3 className="mt-6 font-semibold">Repository / Demo</h3>
            <p>
              {project.repoUrl && <a className="text-blue-600" href={project.repoUrl} target="_blank" rel="noreferrer">Repo</a>}
              {project.demoUrl && <span className="ml-4"><a className="text-blue-600" href={project.demoUrl} target="_blank" rel="noreferrer">Live demo</a></span>}
            </p>
          </div>
        </div>
        <aside>
          <div className="bg-white rounded shadow p-4">
            <img src={project.coverImage || '/public/images/default-cover.png'} alt={project.title} className="w-full h-40 object-cover rounded" />
            <div className="mt-4 text-sm text-slate-600">
              Year: {project.year || '—'}
            </div>
            <div className="mt-4">
              <a href="/projects" className="text-blue-600">← Back to projects</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
