import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProject } from '../services/api';

export default function Project() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProject(slug)
      .then(setProject)
      .catch(err => {
        console.error(err);
        setError(true);
      });
  }, [slug]);

  if (error) return <div className="py-12 text-center">Project not found. <Link to="/projects" className="underline">Go back</Link></div>;
  if (!project) return <div className="py-12 text-center text-gray-500 animate-pulse">Loading project details...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header Section */}
      <header className="mb-10">
        <Link to="/projects" className="text-blue-600 hover:underline text-sm mb-4 inline-block">← All Projects</Link>
        <h1 className="text-4xl font-bold text-slate-900">{project.title}</h1>
        <p className="text-xl text-slate-500 mt-3 max-w-3xl leading-relaxed">{project.summary}</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* 1. Description */}
          <section className="bg-white rounded-xl shadow-sm border p-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Overview</h2>
            <div 
              className="prose prose-slate max-w-none prose-img:rounded-lg" 
              dangerouslySetInnerHTML={{ __html: project.description || '<p>No description provided.</p>' }} 
            />
          </section>

          {/* 2. Screenshot Gallery (NEW) */}
          {project.screenshots?.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-slate-800">Project Screenshots</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {project.screenshots.map((src, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border shadow-sm bg-gray-50 hover:shadow-md transition-shadow">
                    <img 
                      src={src} 
                      alt={`${project.title} screenshot ${i + 1}`} 
                      className="w-full h-auto object-cover cursor-zoom-in" 
                      onClick={() => window.open(src, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
            <img 
              src={project.coverImage || '/images/default-cover.png'} 
              alt={project.title} 
              className="w-full aspect-video object-cover rounded-lg mb-6 border" 
            />

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Role</h3>
                <p className="text-slate-700 font-medium">{project.role || 'Lead Developer'}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Tech Stack</h3>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {project.stack?.map(s => (
                    <span key={s} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noreferrer" 
                     className="w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    View Live Demo
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" 
                     className="w-full text-center py-2 px-4 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                    Source Code
                  </a>
                )}
              </div>

              <div className="pt-4 border-t text-xs text-slate-400 flex justify-between">
                <span>Completed:</span>
                <span className="font-bold text-slate-500">{project.year}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}