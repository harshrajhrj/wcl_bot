const mongoose = require("mongoose");

const indWarSchema = new mongoose.Schema({
    abb: {
        type: String,
        required: true,
        unique: true,
    },
    div: {
        type: String,
        required: true,
    },
    clanTag: {
        type: String,
        required: true,
        maxlength: 12,
    },
    no_of_matches: {
        type: Number,
        required: true,
    },
    opponent: {
        type: Object,
        required: true,
        default: {
            wk1: 'NONE'
        }
    },
    status: {
        type: String,
        required: true,
        default: 'FREE'
    },
    conference: {
        type: String,
        required: true,
        default: 'NONE'
    }
}, { collection: 'bcl_individualWar', timestamps: true });

module.exports = mongoose.model('BCL INDIVIDUAL_WAR', indWarSchema);


/* opponent object example
opponent: {
    wk1: {
        abb:
        clanTag:
        status: W/L/T/UNDECLARED
        starFor:
        starAgainst:
        perDest:
        warID:
    }
}*/