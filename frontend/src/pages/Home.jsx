import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../services/api';

// At the top of the file, before Home()
const EmailButton = () => {
  const email = "ivyjoyweda@gmail.com";

  // This function will try to open Gmail web first
  const handleClick = (e) => {
    e.preventDefault();

    //Gmail web compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;

    // Try opening Gmail in a new tab
    const newWindow = window.open(gmailUrl, "_blank", "noopener,noreferrer");

    //If popup blocked or failed, fallback to mailto
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Fallback: open default mail client
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-5 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
    >
      Email Me
    </button>
  );
};


export default function Home() {
  const [projects, setProjects] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  const autoplayRef = useRef(null);
  const touchStartX = useRef(null);

  /* Fetch real projects */
  useEffect(() => {
    fetchProjects()
      .then(data => {
        setProjects(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  /* Autoplay */
  useEffect(() => {
    if (paused || projects.length === 0) return;

    autoplayRef.current = setInterval(() => {
      setIndex(i => (i + 1) % projects.length);
    }, 4000);

    return () => clearInterval(autoplayRef.current);
  }, [paused, projects.length]);

  // Helpers
  const next = React.useCallback(() => { setIndex((i) => (i + 1) % projects.length); }, [projects.length]);
  const prev = React.useCallback(() => { setIndex((i) => (i - 1 + projects.length) % projects.length); }, [projects.length]);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) prev(); else next();
  };

  const featured = projects.slice(0, 3);
  
  // const activeProject = FEATURED[index];

  return (
    <div className="py-12">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Headline + CTAs */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            I build <span className="text-blue-600">SECURE</span> systems that power real payments, ship features, and reduce operational overhead.
          </h1>

          <p className="mt-4 text-slate-600">
            Full-Stack Software Engineer - MERN • PERN • Payments (Stripe, M-PESA) • API Design • Platform Architecture
          </p>

          <div className="mt-6 flex gap-4">
            <Link to="/projects" className="px-5 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">View case studies</Link>
            <a href="/images/IJA RESUME.pdf" target="_blank" rel="noreferrer" className="px-5 py-3 border rounded hover:bg-slate-50">Download resume (PDF)</a>
          </div>
        </div>

        {/* Right: Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/*An aria-live announcement for screen readers */}
          <div className="sr-only" aria-live="polite">
            {featured[index]?.title ?? ''}
          </div>

          {loading && <div className="h-64 bg-slate-100 rounded animate-pulse" />}

          {!loading && projects.length > 0 && (
            <div
              className="bg-white rounded shadow overflow-hidden"
              role="region"
              aria-label="Featured projects carousel"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >

            {/* Slide images */}
            <div className="relative h-64 md:h-80 lg:h-96">
              {featured.map((item, i) => (
                <figure
                  key={item.slug}
                  className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  aria-hidden={i === index ? 'false' : 'true'}
                >
                  <Link to={`/projects/${item.slug}`} aria-label={`Open ${item.title}`}>
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="object-cover w-full h-full"
                      loading={i === index ? 'eager' : 'lazy'}
                    />
                    {/* Overlay card */}
                    <figcaption className="absolute left-4 bottom-4 bg-slate-900/70 text-white p-3 rounded backdrop-blur-sm max-w-[85%]">
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-xs opacity-80">{item.summary}</div>
                    </figcaption>
                  </Link>
                </figure>
              ))}
            </div>

            {/* Controls */}
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white"
            >
              ›
            </button>
          </div>
          )}
        </div>
      </section>

      {/* Featured projects grid (below carousel) */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Featured projects</h2>

        {featured.length === 0 && (
          <div className="text-slate-500">Projects coming soon…</div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <Link key={p.slug} to={`/projects/${p.slug}`} className="block bg-white rounded shadow overflow-hidden hover:shadow-lg transition">
              <div className="h-44 bg-slate-100 overflow-hidden">
                <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition" loading="lazy" />
              </div>

              <div className="p-4">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.summary}</p>
                <div className="mt-3 text-xs text-slate-500">
                  {p.role} • {p.year}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6">
          <Link to="/projects" className="px-4 py-2 bg-slate-800 text-white rounded">View all projects</Link>
        </div>
      </section>

      <section className="mt-20 bg-slate-900 text-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold">Open to Opportunities</h2>

        <p className="mt-3 text-slate-300 max-w-xl">
          I’m currently open to full-time, contract, and freelance roles where I can
          lead or build scalable, secure systems.
        </p>

        <ul className="mt-4 text-sm text-slate-300 space-y-1">
          <li>• Full-time engineering roles</li>
          <li>• Contract / consulting</li>
          <li>• Architecture & backend leadership</li>
        </ul>

        <div className="mt-6 flex gap-4">
          {/* <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=ivyjoyweda@gmail.com"
            className="px-5 py-3 bg-blue-600 rounded hover:bg-blue-700"
          >
            Email me
          </a> */}
          <EmailButton />

          <a
            href="https://calendly.com/ivyjoyweda/intro-call"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 border border-white/30 rounded"
          >
            Schedule a call
          </a>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold mb-6">Core Stack</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Languages */}
          <div>
            <h3 className="font-medium mb-3">Languages & Frameworks</h3>
            <div className="flex flex-wrap gap-3">
              {['React', 'Next.js', 'Node.js', 'NestJS', 'Laravel', 'Python'].map(s => (
                <span key={s} className="px-3 py-1 bg-slate-100 rounded text-sm">{s}</span>
              ))}
            </div>
          </div>

          {/* Databases */}
          <div>
            <h3 className="font-medium mb-3">Databases</h3>
            <div className="flex gap-3">
              <span className="px-3 py-1 bg-slate-100 rounded text-sm">MongoDB</span>
              <span className="px-3 py-1 bg-slate-100 rounded text-sm">PostgreSQL</span>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-medium mb-3">Tools & Platforms</h3>
            <div className="flex flex-wrap gap-3">
              {['GitHub', 'Postman', 'Render', 'Ubuntu', 'PowerBI'].map(t => (
                <span key={t} className="px-3 py-1 bg-slate-100 rounded text-sm">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}


/* Helper: safe goTo so buttons inside map don't recreate functions each render */
//function goToSafe(i) {
  // This helper will be replaced by inline setIndex in the component's scope.
  // It's left here as a placeholder for the inline buttons in the dots area.
//}
