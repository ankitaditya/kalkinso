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
		required: true,
		unique: true,
	},
	mobile: {
		type: String,
		required: true,
		unique: true,
	},
	upi: {
		type: String,
		unique: true,
	},
	adhar: {
		type: String,
		unique: true,
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
	date: {
		type: Date,
		default: Date.now,
	},
})

const User = mongoose.model('User', UserSchema)

module.exports = User
