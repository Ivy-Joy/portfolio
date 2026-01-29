import React, { useState } from 'react';
import { postContact } from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await postContact(form);
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });

      // Clear success message after 5 seconds
      setTimeout(() => setStatus(null), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold">Contact Me</h1>
      <p className="mt-2 text-slate-600">Get in touch for full-time, contract, or freelance opportunities.</p>

      <form onSubmit={submit} className="mt-6 bg-white p-6 rounded shadow space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your Name"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Email *</span>
          <input
            type="email"
            className="w-full mt-1 p-2 border rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@gmail.com"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Message *</span>
          <textarea
            className="w-full mt-1 p-2 border rounded"
            rows={6}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Write your message here..."
            required
          />
        </label>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition`}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending…' : 'Send Message'}
          </button>

          {status === 'sent' && <span className="text-green-600 font-medium">Message sent successfully!</span>}
          {status === 'error' && <span className="text-red-600 font-medium">Failed to send message.</span>}
        </div>
      </form>
    </div>
  );
}
