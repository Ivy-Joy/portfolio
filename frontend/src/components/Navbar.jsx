import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `block w-full md:w-auto py-2 md:py-0 transition ${
      isActive
        ? 'text-blue-600 font-semibold'
        : 'text-gray-700 hover:text-blue-600'
    }`;

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-2xl font-semibold text-gray-900">
            Ivy Joy
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6 ml-8">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/projects" className={linkClass}>
              Projects
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/resume" className={linkClass}>
              Resume
            </NavLink>
            <a
              href="https://github.com/Ivy-Joy"
              target="_blank"
              rel="noreferrer"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Github
            </a>
            <NavLink
              to="/contact"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Contact
            </NavLink>
          </div>

          {/* Mobile button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded p-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t">
            <div className="flex flex-col items-start gap-1 pt-4">
              <NavLink to="/" className={linkClass} onClick={() => setIsOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/projects" className={linkClass} onClick={() => setIsOpen(false)}>
                Projects
              </NavLink>
              <NavLink to="/about" className={linkClass} onClick={() => setIsOpen(false)}>
                About
              </NavLink>
              <NavLink to="/resume" className={linkClass} onClick={() => setIsOpen(false)}>
                Resume
              </NavLink>
              <a
                href="https://github.com/Ivy-Joy"
                target="_blank"
                rel="noreferrer"
                className="block w-full py-2 text-gray-700 hover:text-blue-600 transition text-left"
                onClick={() => setIsOpen(false)}
              >
                Github
              </a>
              <NavLink
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Contact
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}