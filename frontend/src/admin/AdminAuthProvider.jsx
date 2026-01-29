//Only component
// frontend/src/admin/AdminAuthProvider.jsx
import React, { useEffect, useState } from 'react';
import { AdminAuthContext } from './AdminAuthContext';
import * as adminApi from './services/adminApi.js';

export function AdminAuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function setTokens({ access, csrf }) {
    setAccessToken(access || null);
    setCsrfToken(csrf || null);
    adminApi.setTokens(access || null, csrf || null);
  }

  useEffect(() => {
    let mounted = true;

    async function tryRefresh() {
      try {
        const res = await adminApi.refresh();
        if (!mounted) return;
        setTokens({ access: res.accessToken, csrf: res.csrfToken });
      } catch {
        setTokens({ access: null, csrf: null });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    tryRefresh();
    return () => { mounted = false; };
  }, []);

  async function login(email, password) {
    setLoading(true);
    try {
      const res = await adminApi.login(email, password);
      setTokens({ access: res.accessToken, csrf: res.csrfToken });
      setError(null);
      return res;
    } catch (err) {
      setTokens({ access: null, csrf: null });
      setError(err?.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await adminApi.logout();
    } finally {
      setTokens({ access: null, csrf: null });
    }
  }

  const value = {
    accessToken,
    csrfToken,
    loading,
    error,
    login,
    logout,
    isAuthenticated: Boolean(accessToken),
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
