require('dotenv').config();
const mongoose = require('mongoose');

const appealSchema = new mongoose.Schema({
    playerTag: String,
    matchId: String,
    category: String,
    evidenceNote: String,
    status: { type: String, default: 'PENDING' },
    createdAt: { type: Date, default: Date.now },
});

const Appeal = mongoose.model('Appeal', appealSchema);

const sampleAppeals = [
    {
        playerTag: 'Valkyrie_09',
        matchId: 'MATCH-8841',
        category: 'DESYNC_PING',
        evidenceNote: 'Packet loss spike to 240ms during final objective contest; replay shows hit-reg delay.',
        status: 'PENDING',
    },
    {
        playerTag: 'KuroganeX',
        matchId: 'MATCH-8845',
        category: 'BUG_ABUSE',
        evidenceNote: 'Accidental collision clip inside terrain wall near mid-lane; stepped out within 2 seconds.',
        status: 'PENDING',
    },
    {
        playerTag: 'NyxPhantom',
        matchId: 'MATCH-8850',
        category: 'SMURF_SUSPICION',
        evidenceNote: 'New alt account flagged for high accuracy; submitted main tournament VOD verification.',
        status: 'PENDING',
    },
];

async function seedAppeals() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Appeal.deleteMany({});
        await Appeal.insertMany(sampleAppeals);
        console.log('Seeded 3 esports appeal cases');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seedAppeals();