import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container py-8 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} Ivy Joy • Full-Stack Software Engineer • Nairobi, Kenya
      </div>
    </footer>
  );
}
