const mongoose = require('mongoose')

const ChatSessionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	chat_history: [
		{
			role: {
				type: String,
			},
			content: {
				type: String,
			},
		},
	],
	date: {
		type: Date,
		default: Date.now,
	},
})

const ChatSession = mongoose.model('ChatSession', ChatSessionSchema)

module.exports = ChatSession
