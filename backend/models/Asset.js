const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    assetTag: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'In Use', 'Maintenance'],
        default: 'Available'
    }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);