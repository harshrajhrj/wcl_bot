const mongoose = require("mongoose");

const backupindWarSchema = new mongoose.Schema({
    history: {
        type: Object,
        default: null
    },
    abb: {
        type: String,
        uppercase: true,
        default: null
    },
    type: {
        type: String,
        uppercase: true,
        default: null
    }
}, { collection: 'backupIndividualWar', timestamps: true });

module.exports = mongoose.model('BACKUP_INDIVIDUAL_WAR', backupindWarSchema);


/*
type
roster
indwar
*/