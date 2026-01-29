import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProjectsAdmin from './pages/ProjectsAdmin';
import { useAdminAuth } from './useAdminAuth';

function RequireAdmin({ children }) {
  const { loading, isAuthenticated } = useAdminAuth();

  if (loading) return <div className="py-20 text-center">Checking session…</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return children;
}

export default function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="projects" replace />} />
      <Route path="login" element={<Login />} />
      <Route
        path="projects/*"
        element={
          <RequireAdmin>
            <ProjectsAdmin />
          </RequireAdmin>
        }
      />
    </Routes>
  );
}
