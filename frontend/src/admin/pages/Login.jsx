import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../useAdminAuth.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAdminAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErrors({});
    try {
      await login(email, password);
      nav('/admin/projects');
    } catch (err) {
      setErrors({
        form: err?.response?.data?.message || err.message
      });
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-semibold mb-4">Admin login</h2>

      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {errors.form && (
          <div className="text-red-600 text-sm">{errors.form}</div>
        )}

        <button className="px-4 py-2 bg-blue-600 text-white rounded w-full">
          Sign in
        </button>
      </form>
    </div>
  );
}
