const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI missing');
}

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Mongoose 8 connected to Esports Tribunal DB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.listen(3001, () => {
    console.log('Tribunal API running on http://localhost:3001');
});