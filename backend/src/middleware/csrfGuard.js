// backend/src/middleware/csrfGuard.js
export default function csrfGuard(req, res, next) {
  // Safe methods don't need CSRF
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) return next();

  // double-submit cookie pattern
  const csrfCookie = req.cookies?.csrf;
  const csrfHeader = req.headers['x-csrf-token'];

  if (!csrfCookie || !csrfHeader) return res.status(403).json({ message: 'CSRF token missing' });
  if (csrfCookie !== csrfHeader) return res.status(403).json({ message: 'CSRF token mismatch' });

  return next();
}
