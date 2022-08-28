const mongoose = require('mongoose');

const abbsSchema = new mongoose.Schema({
    div: {
        type: String,
        required: true,
        uppercase: true
    },
    abb: {
        type: String,
        required: true,
        maxlength: 4,
        unique: true,
        uppercase: true
    },
    clanTag: {
        type: String,
        required: true,
        maxlength: 15,
        uppercase: true
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
        default: "team"
    },
    teamName: {
        type: String,
        required: true,
        default: "NONE"
    },
}, { collection: 'registered_abbs' });

module.exports = mongoose.model('REGISTERED ABBS', abbsSchema);