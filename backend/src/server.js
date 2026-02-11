// 1. Environment Variables
if (process.env.NODE_ENV !== 'production') {
  await import('dotenv').then(d => d.config());
}

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

// 2. Route Imports
import projectsRouter from './routes/projects.js';
import contactRouter from './routes/contact.js';
import adminRouter from './routes/admin.js';

const app = express();

/* =========================
   CORS CONFIGURATION
   ========================= */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl)
    if (!origin) return callback(null, true);

    // Normalize: Remove trailing slashes and convert to lowercase for comparison
    const normalizedOrigin = origin.replace(/\/+$/, '').toLowerCase();
    const allowedProd = (process.env.FRONTEND_URL || '').replace(/\/+$/, '').toLowerCase();
    
    // Check for Localhost variants
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin);
    const isProd = normalizedOrigin === allowedProd;

    // DEBUG LOG: This will show up in Render Logs
    console.log(`CORS Check -> Incoming: [${normalizedOrigin}] | Allowed: [${allowedProd}] | Match: ${isLocal || isProd}`);

    if (isLocal || isProd) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'x-admin-token', 'Accept']
};

app.use(cors(corsOptions));

/* =========================
   MIDDLEWARE
   ========================= */
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   ROUTES
   ========================= */
app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);

// Static files for project images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Health Check / Root
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio backend is live' });
});

/* =========================
   SERVER & DATABASE
   ========================= */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Verify ENV variables on startup
console.log('--- Startup Config ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('PORT:', PORT);
console.log('----------------------');

if (!MONGO_URI) {
  console.error('MONGO_URI is missing!');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });