const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },
    issueDescription: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['In Repair', 'Completed'],
        default: 'In Repair'
    }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);