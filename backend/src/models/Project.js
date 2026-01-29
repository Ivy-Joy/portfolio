import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String },           // short summary line
  description: { type: String },     // detailed case study
  role: { type: String },
  stack: [String],
  year: Number,
  coverImage: String,                // URL or path
  screenshots: [String],
  repoUrl: String,
  demoUrl: String,
  metrics: mongoose.Schema.Types.Mixed, // freeform object: { users: 1000, txPerMonth: 200 }
  featured: { type: Boolean, default: false },   // new
  published: { type: Boolean, default: true },   // new - default true for now
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', ProjectSchema);
