//frontend/src/pages/Projects.jsx
import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../services/api';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().then(data => {
      setProjects(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold mb-4">Projects</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Use Array.isArray and optional chaining for safety */}
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map(p => <ProjectCard key={p._id} project={p} />)
          ) : (
            <div className="col-span-full text-gray-500">No projects found.</div>
          )}
        </div>
      )}
    </div>
  );
}
