import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import Project from './pages/Project.jsx';
import About from './pages/About.jsx';
import Resume from './pages/Resume.jsx';
import Contact from './pages/Contact.jsx';

import AdminRouter from './admin/AdminRouter.jsx';
import { AdminAuthProvider } from './admin/AdminAuthProvider';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-aito px-4">
          <Routes>
            {/* Admin */}
            <Route path="/admin/*" element={<AdminAuthProvider><AdminRouter /></AdminAuthProvider>} />

            {/*Public */}
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<Project />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<div className="py-20 text-center">404 - Page not found</div>} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}
