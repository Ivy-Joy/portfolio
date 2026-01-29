import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded shadow-sm overflow-hidden">
      <div className="h-44 bg-slate-100 flex items-center justify-center">
        {project.coverImage ? (
          <img src={project.coverImage} alt={project.title} className="object-cover h-full w-full" />
        ) : (
          <div className="text-slate-400">{project.title}</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{project.title}</h3>
        <p className="text-sm text-slate-600 mt-2">{project.short}</p>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-xs text-slate-500">{project.role}</div>
          <Link to={`/projects/${project.slug}`} className="text-blue-600 text-sm">Read case study →</Link>
        </div>
      </div>
    </div>
  );
}
