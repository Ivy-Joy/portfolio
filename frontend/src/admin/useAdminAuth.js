//Only hook - no components, no jsx
// frontend/src/admin/useAdminAuth.js
import { useContext } from 'react';
import { AdminAuthContext } from './AdminAuthContext';

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
}
