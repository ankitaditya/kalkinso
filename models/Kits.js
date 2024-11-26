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
        default: new Date(Date.now() + 3600 * 1000 * 4),
    },
})

const Kits = mongoose.model('Kit', KitsSchema)

module.exports = Kits
