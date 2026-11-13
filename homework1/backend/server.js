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

app.listen(3000, () => {
  console.log('🚀 Swipe Deck API running on http://localhost:3000');
});