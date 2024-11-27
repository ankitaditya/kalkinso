const mongoose = require('mongoose')

const KitsSchema = new mongoose.Schema({
	id: {
        type: String,
        required: true,
    },
    selectedTask: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        default: () => new Date(Date.now() + 4 * 60 * 60 * 1000),
    },
})

const Kits = mongoose.model('Kit', KitsSchema)

module.exports = Kits
