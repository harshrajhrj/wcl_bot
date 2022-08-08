const mongoose = require('mongoose');

const rosterSchema = new mongoose.Schema({
    abb: {
        type: String,
        uppercase: true,
        max: 4,
        required: true,
        unique: true,
    },
    div: {
        type: String,
        uppercase: true,
        required: true
    },
    clanTag: {
        uppercase: true,
        required: true,
        type: String,
        max: 15
    },
    rosterSize: {
        type: Number,
        required: true,
        max: 50
    },
    additionSpot: {
        type: String,
        required: true,
        default: 'Yes'
    },
    additionStatus: {
        type: String,
        required: true,
        default: 'Yes'
    },
    additionStatusLimit: {
        type: Number,
        required: true
    },
    rosterReps: {
        type: Array,
        required: true,
        default: [['N/A', 'N/A']]
    },
    players: {
        type: Array,
        required: true,
        default: [['N/A', 'N/A', 'N/A']]
    },
    additionRecord: {
        type: Array,
        required: true,
        default: [['N/A', 'N/A', 'N/A', 'N/A']]
    },
    removalRecord: {
        type: Array,
        required: true,
        default: [['N/A', 'N/A', 'N/A', 'N/A']]
    }
}, { collection: 'rosterL', versionKey: false });

module.exports = mongoose.model('LIGHT WEIGHT', rosterSchema);