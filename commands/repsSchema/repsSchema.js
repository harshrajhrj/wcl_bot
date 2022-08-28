const mongoose = require('mongoose');

const repSchema = new mongoose.Schema({
    div: {
        type: String,
        required: true
    },
    abb: {
        type: String,
        required: true,
        unique: true,
        maxlength: 4,
        uppercase: true,
    },
    clanTag: {
        type: String,
        required: true,
        maxlength: 15
    },
    secondaryClanTag: {
        type: String,
        required: true,
        default: '#N/A'
    },
    clanName: {
        type: String,
        required: true,
        maxlength: 15,
        default: 'team'
    },
    teamName: {
        type: String,
        required: true,
        default: "NONE"
    },
    rep1: {
        type: String,
        required: true,
        default: 'No entry'
    },
    rep1_dc: {
        type: String,
        required: true,
        default: 0
    },
    rep2: {
        type: String,
        required: true,
        default: 'No entry'
    },
    rep2_dc: {
        type: String,
        required: true,
        default: 0
    }
}, { collection: 'reps', versionKey: false });

module.exports = mongoose.model('REPS', repSchema);