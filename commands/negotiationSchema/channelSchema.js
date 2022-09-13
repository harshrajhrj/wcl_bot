const mongoose = require('mongoose');

const negoSchema = new mongoose.Schema({
    div: {
        type: String,
        required: true,
        uppercase: true
    },
    week: {
        type: String,
        required: true,
        uppercase: true
    },
    categoryID1: {
        type: Object,
        required: true,
    },
    categoryID2: {
        type: Object,
        default: null
    },
}, { collection: 'nego_channels', versionKey: false });

module.exports = mongoose.model('NEGO CHANNELS', negoSchema);


/*
categoryID1: {
        id: {
            type: String,
            required: true,
            uppercase: true,
        },
        'channels': {
            type: [Object],
            default: {
                'name': null,
                'id': null
            }
        }
    },
*/