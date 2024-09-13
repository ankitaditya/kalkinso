const mongoose = require('mongoose')

const HowToSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    steps: [{
        step_id: {
            type: mongoose.Schema.Types.ObjectId,
		    ref: 'HowTo',
        },
        step_value: {
            type: String,
            required: true,
        }
    }],
	date: {
		type: Date,
		default: Date.now,
	},
})

const HowTo = mongoose.model('HowTo', HowToSchema)

module.exports = HowTo
