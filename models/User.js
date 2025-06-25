const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
	},
	mobile: {
		type: String,
	},
	upi: {
		type: String,
	},
	adhar: {
		type: String,
	},
	terms_conditions: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
		default: 'https://www.gravatar.com/avatar/anything?s=200&d=mm',
	},
	sessions: [
		{
			token: {
				type: String,
				required: true
			},
			created_at: {
				type: Date,
				default: Date.now,
			},
			ended_at:{
				type: Date,
			},
			}
	],
	access: {
		type: [String],
		required: true,
		enum: ['DASH', 'HOME', 'ORDERS', 'AI', 'TOOLS', 'WALLET'],
	},
	date: {
		type: Date,
		default: Date.now,
	},
})

const User = mongoose.model('User', UserSchema)

module.exports = User
