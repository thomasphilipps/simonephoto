const mongoose = require('mongoose');

// Define the schema for a "Gallery"
const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    pictures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Picture',
    }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }]
}, {timestamps: true});

// Export the compiled Mongoose model
module.exports = mongoose.model('Gallery', gallerySchema);
