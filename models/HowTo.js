const mongoose = require('mongoose')

const HowToSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: String,
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    author: {
        name: String,
        profileUrl: String
    },
    steps: [{
        stepNumber: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        images: [{
            url: String,
            caption: String
        }],
        videos: [{
            url: String,
            caption: String
        }],
        tips: [String]
    }],
    materials: [{
        name: {
            type: String,
            required: true
        },
        quantity: String,
        description: String
    }],
    estimatedTime: String,
    difficulty: String,
    ratings: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

const HowTo = mongoose.model('HowTo', HowToSchema)

module.exports = HowTo
