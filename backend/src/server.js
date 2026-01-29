import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

import projectsRouter from './routes/projects.js';
import contactRouter from './routes/contact.js';
import adminRouter from './routes/admin.js';

const app = express();
// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API routes
app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);

// Serve static files
app.use('/images', express.static(path.join(__dirname,'public/images')));


// Production frontend serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () =>
      console.log(`Server listening on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
