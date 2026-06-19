const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset', // Links to the Asset model
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Links to the Employee model
        required: true
    },
    assignedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    returnedDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Active', 'Returned'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);