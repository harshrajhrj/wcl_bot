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
}, { collection: 'bcl_backupIndividualWar', timestamps: true });

module.exports = mongoose.model('BCL BACKUP_INDIVIDUAL_WAR', backupindWarSchema);


/*
type
roster
indwar
*/