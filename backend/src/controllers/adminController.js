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

// --- LOGIN ---
// Validates credentials, issues access token (returned) and refresh token (httpOnly cookie).
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    // create jti for refresh token (rotation)
    const jti = crypto.randomBytes(32).toString('hex');
    const refreshPayload = { id: admin._id.toString(), jti };
    const refreshToken = signRefreshToken(refreshPayload);

    // store hashed jti in DB for rotation and revocation
    admin.refreshTokenHash = hashTokenId(jti);
    await admin.save();

    // access token (short-lived) returned in body
    const accessToken = signAccessToken({ id: admin._id.toString(), role: 'admin' });

    // create csrf token for double-submit: random string (can reuse jti or create new)
    const csrfToken = crypto.randomBytes(24).toString('hex');

    // set cookies
    res.cookie('rt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/admin/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // csrf cookie must be readable by JS (not httpOnly)
    res.cookie('csrf', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ accessToken, csrfToken });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// --- REFRESH (rotation) ---
// Reads refresh token from httpOnly cookie 'rt', validates, rotates jti, issues new refresh cookie and access token.
// Path should be mounted at POST /api/admin/refresh
export async function refreshToken(req, res) {
  try {
    const token = req.cookies?.rt;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const adminId = payload.id;
    const tokenJti = payload.jti;
    const admin = await Admin.findById(adminId);
    if (!admin || !admin.refreshTokenHash) return res.status(401).json({ message: 'Invalid session' });

    // check stored hashed jti
    const tokenHash = hashTokenId(tokenJti);
    if (tokenHash !== admin.refreshTokenHash) {
      // token reuse / theft detected -> revoke all sessions
      admin.refreshTokenHash = null;
      await admin.save();
      return res.status(401).json({ message: 'Refresh token revoked' });
    }

    // rotation: generate new jti & tokens
    const newJti = crypto.randomBytes(32).toString('hex');
    const newRefreshPayload = { id: adminId, jti: newJti };
    const newRefreshToken = signRefreshToken(newRefreshPayload);
    const newAccessToken = signAccessToken({ id: adminId, role: 'admin' });

    // persist new jti hash
    admin.refreshTokenHash = hashTokenId(newJti);
    await admin.save();

    // set new refresh cookie
    res.cookie('rt', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/admin/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // rotate csrf token (optional)
    const newCsrf = crypto.randomBytes(24).toString('hex');
    res.cookie('csrf', newCsrf, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ accessToken: newAccessToken, csrfToken: newCsrf });
  } catch (err) {
    console.error('Refresh error', err);
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
      res.clearCookie('rt', { path: '/api/admin/refresh' });
      res.clearCookie('csrf');
      return res.json({ success: true });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      res.clearCookie('rt', { path: '/api/admin/refresh' });
      res.clearCookie('csrf');
      return res.json({ success: true });
    }

    const admin = await Admin.findById(payload.id);
    if (admin) {
      admin.refreshTokenHash = null;
      await admin.save();
    }

    res.clearCookie('rt', { path: '/api/admin/refresh' });
    res.clearCookie('csrf');
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

// export async function createProject(req, res) {
//   // If a file was uploaded, upload it to cloudinary and set coverImage
//   let coverImageUrl = req.body.coverImage;
//   if (req.file) {
//     const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
//     const result = await cloudinary.uploader.upload(dataUri, {
//       folder: 'portfolio_images',
//       resource_type: 'image',
//       overwrite: false
//     });
//     coverImageUrl = result.secure_url;
//   }

//   const body = { ...req.body, coverImage: coverImageUrl };
//   const project = new Project(body);
//   await project.save();
//   res.status(201).json(project);
// }

export async function createProject(req, res) {
  try {
    // 1. Normalize body fields
    const parsedBody = parsePossibleArrays(req.body);

    // 2. Handle cover image upload (optional)
    let coverImageUrl = parsedBody.coverImage || '';

    if (req.file) {
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      const upload = await cloudinary.uploader.upload(dataUri, {
        folder: 'portfolio_images',
        resource_type: 'image',
        overwrite: false
      });

      coverImageUrl = upload.secure_url;
    }

    // 3. Build project payload
    const projectData = {
      ...parsedBody,
      coverImage: coverImageUrl
    };

    // 4. Save project
    const project = new Project(projectData);

    try {
      await project.save();
    } catch (err) {
      // Slug uniqueness protection
      if (err.code === 11000 && err.keyPattern?.slug) {
        return res.status(409).json({ message: 'Slug already exists' });
      }
      throw err;
    }

    // 5. Respond
    return res.status(201).json(project);

  } catch (err) {
    console.error('Create project error:', err);
    return res.status(500).json({ message: 'Failed to create project' });
  }
}


// export async function updateProject(req, res) {
//   const { id } = req.params;
//   const updates = { ...req.body };

//   if (req.file) {
//     const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
//     const result = await cloudinary.uploader.upload(dataUri, {
//       folder: 'portfolio_images',
//       resource_type: 'image',
//       overwrite: false
//     });
//     updates.coverImage = result.secure_url;
//   }

//   const project = await Project.findByIdAndUpdate(id, updates, { new: true });
//   if (!project) return res.status(404).json({ message: 'Not found' });
//   res.json(project);
// }

export async function updateProject(req, res) {
  try {
    const { id } = req.params;

    // 1. Normalize incoming updates
    const parsedUpdates = parsePossibleArrays(req.body);

    // 🚨 IMPORTANT: never overwrite image unless new one is uploaded
    delete parsedUpdates.coverImage;

    // 2. Handle optional new cover image
    if (req.file) {
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      const upload = await cloudinary.uploader.upload(dataUri, {
        folder: 'portfolio_images',
        resource_type: 'image',
        overwrite: false
      });

      parsedUpdates.coverImage = upload.secure_url;
    }

    // 3. Update project
    let project;
    try {
      project = await Project.findByIdAndUpdate(
        id,
        { $set: parsedUpdates },
        { new: true, runValidators: true }
      );
    } catch (err) {
      // Slug uniqueness protection
      if (err.code === 11000 && err.keyPattern?.slug) {
        return res.status(409).json({ message: 'Slug already exists' });
      }
      throw err;
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 4. Respond
    return res.json(project);

  } catch (err) {
    console.error('Update project error:', err);
    return res.status(500).json({ message: 'Failed to update project' });
  }
}

export async function deleteProject(req, res) {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  res.json({ success: true });
}

// IMAGE UPLOAD (Multer memory buffer -> Cloudinary)
export async function uploadImage(req, res) {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'portfolio_images',
      resource_type: 'image',
      overwrite: false
    });
    // result.secure_url is the hosted URL
    res.json({ url: result.secure_url, raw: result });
  } catch (err) {
    console.error('Cloudinary upload error', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
}
/* Login sets an HTTP-only rt cookie and a readable csrf cookie (double-submit). It returns the accessToken (to be stored in React memory) and csrfToken for immediate use.
Refresh checks the stored hashed jti to prevent reuse (rotation). On reuse, it invalidates the session.
Logout clears cookies and clears server-side stored token.
Project create/update support file uploads (via multer on the route) and will upload to Cloudinary if req.file is present. */