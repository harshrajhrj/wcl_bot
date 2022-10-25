const mongoose = require('mongoose');

const substitutionSchema = new mongoose.Schema({
    refer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: mongoose.model('REPS'),
        default: null
    },
    abb: {
        type: String,
        required: true,
        maxlength: 4,
        unique: true,
    },
    playersCount: {
        type: Object,
        required: true,
        default: {
            1: {
                tag: null,
                warID: null,
                date: null,
                userID: null,
                opponentID: null,
            }
        }
    }
}, { collection: 'bcl_substitutions', versionKey: false });

module.exports = mongoose.model('BCL SUBSTITUTION', substitutionSchema);

/*
 playersCount : {
    1 : {
        tag :
        warID : 
        date :
        userID : 
        opponentID : 
    }
 }
*/