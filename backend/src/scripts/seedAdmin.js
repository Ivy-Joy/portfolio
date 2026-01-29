// backend/scripts/seedAdmin.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ivyjoyweda@gmail.com';
const ADMIN_PASS = process.env.ADMIN_PASS;
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 12);

if (!ADMIN_PASS) {
  throw new Error('❌ ADMIN_PASS is missing in .env');
}

async function run() {
  await mongoose.connect(MONGODB_URI);

  const existing = await Admin.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log('ℹ️ Admin already exists:', ADMIN_EMAIL);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASS, BCRYPT_ROUNDS);

  await Admin.create({
    email: ADMIN_EMAIL,
    passwordHash,
    name: 'Admin Ivy'
  });

  console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
  process.exit(0);
}


run().catch(err => {
  console.error('❌ Admin seed failed:', err);
  process.exit(1);
});
