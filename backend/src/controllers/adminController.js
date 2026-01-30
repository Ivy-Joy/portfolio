// backend/src/controllers/adminController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Admin from '../models/Admin.js';
import Project from '../models/Project.js';
import cloudinary from '../services/cloudinary.js';
import parsePossibleArrays from '../utils/parsePossibleArrays.js';

dotenv.config();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 12);
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Helpers
function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

function hashTokenId(jti) {
  return crypto.createHash('sha256').update(jti).digest('hex');
}

const isProd = process.env.NODE_ENV === 'production';

const refreshCookieOptions = {
  httpOnly: true,
  secure: true, //force it to true
  sameSite: 'none', // REQUIRED for cross-site (Vercel ↔ Render)
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const csrfCookieOptions = {
  httpOnly: false, // must be readable by JS
  secure: true, //Must be true for "none" to work
  sameSite: 'none', //Must be "none" for Vercel -> Render requests"
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000
};


// --- LOGIN ---
// Validates credentials, issues access token (returned) and refresh token (httpOnly cookie).
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // --- refresh token (rotation) ---
    const jti = crypto.randomBytes(32).toString('hex');
    admin.refreshTokenHash = hashTokenId(jti);
    await admin.save();

    const refreshToken = signRefreshToken({
      id: admin._id.toString(),
      jti
    });

    // --- access token ---
    const accessToken = signAccessToken({
      id: admin._id.toString(),
      role: 'admin'
    });

    // --- csrf token (double-submit) ---
    const csrfToken = crypto.randomBytes(24).toString('hex');

    // --- set cookies ---
    res.cookie('rt', refreshToken, refreshCookieOptions);
    res.cookie('csrf', csrfToken, csrfCookieOptions);

    // --- respond ---
    return res.json({
      accessToken,
      csrfToken
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}


// --- REFRESH (rotation) ---
// Reads refresh token from httpOnly cookie 'rt', validates, rotates jti, issues new refresh cookie and access token.
// Path should be mounted at POST /api/admin/refresh
export async function refreshToken(req, res) {
  try {
    const token = req.cookies?.rt;
    if (!token) {
      return res.status(401).json({ message: 'No refresh token' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const admin = await Admin.findById(payload.id);
    if (!admin || !admin.refreshTokenHash) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    // --- rotation protection ---
    const expectedHash = hashTokenId(payload.jti);
    if (expectedHash !== admin.refreshTokenHash) {
      admin.refreshTokenHash = null;
      await admin.save();
      return res.status(401).json({ message: 'Refresh token revoked' });
    }

    // --- rotate tokens ---
    const newJti = crypto.randomBytes(32).toString('hex');
    admin.refreshTokenHash = hashTokenId(newJti);
    await admin.save();

    const newRefreshToken = signRefreshToken({
      id: admin._id.toString(),
      jti: newJti
    });

    const newAccessToken = signAccessToken({
      id: admin._id.toString(),
      role: 'admin'
    });

    const newCsrf = crypto.randomBytes(24).toString('hex');

    // --- set rotated cookies ---
    res.cookie('rt', newRefreshToken, refreshCookieOptions);
    res.cookie('csrf', newCsrf, csrfCookieOptions);

    return res.json({
      accessToken: newAccessToken,
      csrfToken: newCsrf
    });
  } catch (err) {
    console.error('Refresh error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// --- LOGOUT ---
// Clears refresh cookie and removes stored refresh token
export async function logout(req, res) {
  try {
    const token = req.cookies?.rt;
    if (!token) {
      // clear cookie anyway
      // res.clearCookie('rt', { path: '/api/admin/refresh' });
      // res.clearCookie('csrf');
      res.clearCookie('rt', { path: '/' });
      res.clearCookie('csrf', { path: '/' });

      return res.json({ success: true });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      // res.clearCookie('rt', { path: '/api/admin/refresh' });
      // res.clearCookie('csrf');
      res.clearCookie('rt', { path: '/' });
      res.clearCookie('csrf', { path: '/' });

      return res.json({ success: true });
    }

    const admin = await Admin.findById(payload.id);
    if (admin) {
      admin.refreshTokenHash = null;
      await admin.save();
    }

    // res.clearCookie('rt', { path: '/api/admin/refresh' });
    // res.clearCookie('csrf');
    res.clearCookie('rt', { path: '/' });
    res.clearCookie('csrf', { path: '/' });

    return res.json({ success: true });
  } catch (err) {
    console.error('Logout error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// --- ADMIN CRUD & UPLOAD ---
// Note: these functions are used behind requireAdmin + csrfGuard where required.

export async function listProjects(req, res) {
  const projects = await Project.find({}).sort({ year: -1 });
  res.json(projects);
}

export async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) {
    console.error('getProjectById error', err);
    res.status(500).json({ message: 'Server error' });
  }
}
export async function createProject(req, res) {
  try {
    const parsedBody = parsePossibleArrays(req.body);
    let coverImageUrl = parsedBody.coverImage || '';

    // If a file is sent directly to this route via Multipart
    if (req.file) {
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const upload = await cloudinary.uploader.upload(dataUri, { folder: 'portfolio_images' });
      coverImageUrl = upload.secure_url;
    }

    const project = new Project({
      ...parsedBody,
      coverImage: coverImageUrl
    });

    await project.save();
    return res.status(201).json(project);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Slug already exists' });
    console.error('Create project error:', err);
    return res.status(500).json({ message: 'Failed to create project' });
  }
}

export async function updateProject(req, res) {
  try {
    const { id } = req.params;

    // 1. Normalize incoming updates (handles stack, screenshots, metrics)
    const parsedUpdates = parsePossibleArrays(req.body);

    // 2. Handle optional new cover image (File Upload via Multipart)
    // If the frontend sends a new file, we use it. 
    // If not, we keep whatever is in parsedUpdates.coverImage (the URL string).
    if (req.file) {
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const upload = await cloudinary.uploader.upload(dataUri, {
        folder: 'portfolio_images',
      });
      parsedUpdates.coverImage = upload.secure_url;
    }

    // 3. Update project in MongoDB
    const project = await Project.findByIdAndUpdate(
      id,
      { $set: parsedUpdates },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json(project);

  } catch (err) {
    // Log the actual error so you can see it in Render Logs
    console.error('Update project error:', err);

    // Slug uniqueness protection
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A project with this slug already exists' });
    }

    res.status(500).json({ message: 'Failed to update project', error: err.message });
  }
}

export async function deleteProject(req, res) {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  res.json({ success: true });
}

// IMAGE UPLOAD (Multer memory buffer -> Cloudinary)
export async function uploadImage(req, res) {
  try{
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // 1. Create the Data URI from the buffer
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload the DATA URI to Cloudinary using the path provided by Multer
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'portfolio_projects',
      resource_type: 'auto' // Good practice for different file types
  });

  // 3. Respond with the URL
  /*try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'portfolio_images',
      resource_type: 'image',
      overwrite: false
    });*/
    // result.secure_url is the hosted URL
    //res.json({ url: result.secure_url, raw: result });
    return res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error', err);
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
}
/* Login sets an HTTP-only rt cookie and a readable csrf cookie (double-submit). It returns the accessToken (to be stored in React memory) and csrfToken for immediate use.
Refresh checks the stored hashed jti to prevent reuse (rotation). On reuse, it invalidates the session.
Logout clears cookies and clears server-side stored token.
Project create/update support file uploads (via multer on the route) and will upload to Cloudinary if req.file is present. */