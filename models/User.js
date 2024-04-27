const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    codeforcesId: { type: String, required: true, unique: true },
    solvedProblems: [{ type: String }]
});

module.exports = mongoose.model('User', userSchema);
