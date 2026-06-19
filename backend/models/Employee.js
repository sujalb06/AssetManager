const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Staff'], // Ensures the role is exactly one of these two words
        default: 'Staff'
    }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);