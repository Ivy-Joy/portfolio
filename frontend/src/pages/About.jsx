import React from 'react';

export default function About() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900">About Me</h1>

      <div className="mt-8 flex flex-col md:flex-row items-center gap-8">
        {/* Profile image */}
        <div className="flex-shrink-0 w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-lg">
          <img
            src="/images/Ivy Closeup Photo.jpeg"
            alt="Profile Image"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bio */}
        <div className="flex-1 text-slate-700 space-y-4">
          <p>
            I’m <strong>Ivy Joy</strong>, a Full-Stack Software Engineer passionate about building scalable, secure, and user-friendly systems. I design and implement end-to-end solutions, from intuitive frontend interfaces and complex business logic to backend architecture, API design, and product workflows, ensuring seamless user experiences across web and mobile platforms.
          </p>

          <p>
            With experience leading full projects from ideation to deployment, I deliver systems that reduce operational overhead, enhance usability, and support business goals. I thrive at the intersection of product, design, and engineering, shaping both how a system works and how users interact with it.
          </p>

          <p>
            Beyond coding, I mentor upcoming developers, contribute to open-source projects, and stay current with modern technologies in the MERN and PERN stacks, always aiming to combine clean code with meaningful impact.
          </p>
        </div>
      </div>

      {/* Skills & Tools */}
      <section className="mt-10 bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-xl text-slate-900">Core Skills & Tools</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            'React', 'Next.js', 'Node.js', 'Express', 'NestJS',
            'MongoDB', 'PostgreSQL', 'Stripe', 'M-PESA',
            'Docker', 'GitHub Actions', 'Postman', 'Tailwind CSS'
          ].map(skill => (
            <span
              key={skill}
              className="text-xs md:text-sm px-3 py-1 border rounded-full bg-slate-100 text-slate-800"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
