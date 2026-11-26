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

const appealSchema = new mongoose.Schema({
    playerTag: { type: String, required: true },
    matchId: { type: String, required: true },
    category: {
        type: String,
        enum: ['DESYNC_PING', 'SMURF_SUSPICION', 'BUG_ABUSE', 'TOXIC_COMMS'],
        required: true,
    },
    evidenceNote: { type: String, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'UPHELD', 'OVERTURNED'],
        default: 'PENDING',
    },
    createdAt: { type: Date, default: Date.now },
});

const Appeal = mongoose.model('Appeal', appealSchema);

app.get('/api/appeals', async (req, res) => {
    try {
        const appeals = await Appeal.find().sort({ createdAt: -1 }).lean();
        res.json(appeals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/appeals', async (req, res) => {
    try {
        const created = await Appeal.create(req.body);
        res.status(201).json(created);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.patch('/api/appeals/:id/verdict', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['UPHELD', 'OVERTURNED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid verdict status' });
        }
        const updated = await Appeal.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).lean();
        if (!updated) {
            return res.status(404).json({ error: 'Appeal not found' });
        }
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(3001, () => {
    console.log('Tribunal API running on http://localhost:3001');
});