const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Environment Variable Security Guard
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing');

// 2. Modern Connection Syntax (Zero Deprecated Flags in Mongoose 8)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Mongoose 8 connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- SCHEMA DEFINITION ---
const profileSchema = new mongoose.Schema({
  name: String,
  age: Number,
  bio: String,
  imageUrl: String
});
const Profile = mongoose.model('Profile', profileSchema);

const swipeSchema = new mongoose.Schema({
  targetId: String,
  action: String, // 'LIKE' hoặc 'PASS'
  timestamp: { type: Date, default: Date.now }
});
const Swipe = mongoose.model('Swipe', swipeSchema);

// --- T12: API GET /api/profiles ---
app.get('/api/profiles', async (req, res) => {
  const profiles = await Profile.find().lean();
  res.json(profiles);
});

// --- T13: API POST /api/swipe ---
app.post('/api/swipe', async (req, res) => {
  try {
    const record = await Swipe.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('🚀 Swipe Deck API running on http://localhost:3000');
});