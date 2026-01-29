import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-2xl font-semibold">Ivy Joy</Link>
        <div className="flex gap-4 items-center">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-blue-600' : ''}>Home</NavLink>
          <NavLink to="/projects" className={({isActive}) => isActive ? 'text-blue-600' : ''}>Projects</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'text-blue-600' : ''}>About</NavLink>
          <NavLink to="/resume" className={({isActive}) => isActive ? 'text-blue-600' : ''}>Resume</NavLink>
          <NavLink to="https://github.com/Ivy-Joy" className={({isActive}) => isActive ? 'text-blue-600' : ''}>Github</NavLink>
          {/* <a href="/contact" target="_blank" rel="noreferrer" className="ml-4 px-4 py-2 bg-blue-600 text-white rounded">Contact</a> */}
          <NavLink to="/contact" className={({isActive}) => isActive ? 'text-blue-600 ml-4 px-4 py-2 bg-blue-600 text-white rounded' : 'ml-4 px-4 py-2 bg-blue-600 text-white rounded'}>
            Contact
          </NavLink>

        </div>
      </div>
    </nav>
  );
}
