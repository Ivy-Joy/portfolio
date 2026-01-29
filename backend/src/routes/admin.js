// backend/src/routes/admin.js
import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import {
  login,
  refreshToken,
  logout,
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadImage,
  getProjectById
} from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/auth.js';
import csrfGuard from '../middleware/csrfGuard.js';

const router = express.Router();

// configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// rate limit login to reduce brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 8, // limit to 8 attempts per window per IP
  message: { message: 'Too many login attempts, please try again later.' }
});

// Public: login & refresh endpoints
router.post('/login', loginLimiter, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Protect everything below with access token middleware
router.use(requireAdmin);

// GET (safe)
router.get('/projects', listProjects);
router.get('/projects/:id', getProjectById);

// Mutations: require CSRF header + protection
router.post('/projects', csrfGuard, upload.single('file'), createProject);
router.put('/projects/:id', csrfGuard, upload.single('file'), updateProject);
router.delete('/projects/:id', csrfGuard, deleteProject);

// Image upload (for admin UI). Must include CSRF header
router.post('/upload', csrfGuard, upload.single('file'), uploadImage);

export default router;

/* router.post('/refresh') path — cookie rt created with path /api/admin/refresh so posting to that route with credentials: 'include' will work.*/