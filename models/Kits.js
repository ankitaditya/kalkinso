const mongoose = require('mongoose')

const KitsSchema = new mongoose.Schema({
	id: {
        type: String,
        required: true,
        unique: true,
    },
    selectedTask: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        default: () => new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
})

const Kits = mongoose.model('Kit', KitsSchema)

module.exports = Kits
