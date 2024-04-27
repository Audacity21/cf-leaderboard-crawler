const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    contestId: { type: Number, required: true },
    index: { type: String, required: true },
    name: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    codeforcesId: { type: String, required: true, unique: true },
    solvedProblems: [problemSchema],
    lastUpdated: { type: Date, default: Date.now } // Field for last updated time
}, { collection: 'dataset' });

module.exports = mongoose.model('User', userSchema);
