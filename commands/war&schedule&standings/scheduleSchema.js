const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    warID: {
        type: Number,
        unique: true,
        required: true,
    },
    dow: {
        type: Date,
        required: true,
    },
    tow: {
        type: String,
        required: true,
    },
    week: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    div: {
        type: String,
        required: true,
    },
    clan: {
        abb: {
            type: String,
            required: true,
        },
        tag: {
            type: String,
            required: true,
        },
        star: {
            type: Number,
            required: true,
            default: 0
        },
        dest: {
            type: Number,
            required: true,
            default: 0
        },
        warLog: {
            type: Boolean,
            required: true,
            default: true,
        }
    },
    opponent: {
        abb: {
            type: String,
            required: true,
        },
        tag: {
            type: String,
            required: true,
        },
        star: {
            type: Number,
            required: true,
            default: 0
        },
        dest: {
            type: Number,
            required: true,
            default: 0
        },
        warLog: {
            type: Boolean,
            required: true,
            default: true,
        }
    },
    status: {
        type: String,
        required: true,
        default: 'INACTIVE',
    },
    scheduledBy: {
        type: String,
        required: true,
    },
    approvedBy: {
        type: String,
        required: true,
    }
}, { collection: 'schedules', timestamps: true, versionKey: false })

module.exports = mongoose.model('SCHEDULE', scheduleSchema);