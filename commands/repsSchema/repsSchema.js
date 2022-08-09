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
    },
    clanTag: {
        type: String,
        required: true,
        maxlength: 15
    },
    clanName: {
        type: String,
        required: true,
        maxlength: 15,
        default: 'team'
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