// backend/src/models/Admin.js
import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  // store hashed jti (token id) for refresh token rotation / revocation
  refreshTokenHash: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Admin', AdminSchema);
