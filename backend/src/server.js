if (process.env.NODE_ENV !== 'production') {
  await import('dotenv').then(d => d.config());
}

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

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);
app.use('/images', express.static(path.join(__dirname, 'public/images')));

//commenting this piece out because the frontend is NOT inside the backend repo
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
//   app.use((req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
//   });
// }

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Portfolio backend is running'
  });
});


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log('NODE_ENV', process.env.NODE_ENV);
console.log('MONGO_URI preview:', process.env.MONGO_URI ? process.env.MONGO_URI.slice(0, 60) + '...' : 'undefined');

if (!MONGO_URI) {
  console.error('MONGO_URI is not set. Set it in your .env (local) or Render env vars (production).');
  process.exit(1);
}


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () =>
      console.log(`Server listening on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
