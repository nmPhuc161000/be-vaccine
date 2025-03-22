const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    playerName: {
        type: String,
        required: true,
    },
    YoB: {
        type: Number,
        required: true,
    },
    MinutesPlayed: {
        type: Number,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    isCaptain: {
        type: Boolean,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    team: {
        type: String,
        required: true,
    },
    PassingAccuracy: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Player', playerSchema);