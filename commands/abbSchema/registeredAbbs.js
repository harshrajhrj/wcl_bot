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
    clanName: {
        type: String,
        required: true,
        maxlength: 15,
        default: "team"
    }
}, { collection: 'registered_abbs' });

module.exports = mongoose.model('REGISTERED ABBS', abbsSchema);