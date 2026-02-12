//frontend/src/pages/Projects.jsx
import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import localProjects from '../data/projects'; // 1. Import local data

export default function Projects() {
  const [projects, setProjects] = useState(localProjects || []);
  const [loading, setLoading] = useState(localProjects.length === 0);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 3. GUARD: If we already have local projects, don't fetch (Prevents cascading renders)
    if (projects.length > 0) return;

    let isMounted = true;
    

    fetchProjects().then(data => {
      if (isMounted) setLoading(true); {
        setProjects(Array.isArray(data) ? data : []);
        setError(false);
      }
    }).catch(err => {
      if (isMounted) {
        console.error("Fetch error:", err);
        setError(true);
      }
    })
    .finally(() => {
        if (isMounted) setLoading(false);
      });
    
      return () => { isMounted = false; };
  }, [projects.length]);

  /*return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold mb-4">Projects</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Use Array.isArray and optional chaining for safety *
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map(p => <ProjectCard key={p._id} project={p} />)
          ) : (
            <div className="col-span-full text-gray-500">No projects found.</div>
          )}
        </div>
      )}
    </div>
  );*/

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold mb-4">Projects</h1>
      
      {loading && <div className="py-12 text-center text-gray-500 animate-pulse">Loading gallery...</div>}
      
      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map(p => <ProjectCard key={p._id || p.slug} project={p} />)
          ) : (
            <div className="col-span-full text-gray-500 text-center py-12">
              {error ? "Failed to load projects. Please try again later." : "No projects found."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
