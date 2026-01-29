// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Verifies Access Token (sent in Authorization: Bearer <token>)
export function requireAdmin(req, res, next) {
  // Allow env-based admin token for dev/demo (optional)
  const adminToken = req.headers['x-admin-token'] || req.query?.adminToken;
  if (adminToken && process.env.ADMIN_TOKEN && adminToken === process.env.ADMIN_TOKEN) {
    req.admin = { envToken: true };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing auth token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // optionally check payload.role === 'admin'
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Admin role required' });

    req.admin = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired auth token' });
  }
}
