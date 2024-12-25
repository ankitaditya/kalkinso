const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		unique: true,
	},
	gender: {
		type: String,
	},
	user_role: {
		type: String,
		required: true,
	},
	url: {
		type: String,
	},
	rating: {
		type: String,
		default: '0',
	},
	verification_status: {
		email: {
			value: { 
				type: String,
			},
			isVerified: {
				type: String,
			},
		},
		phone: {
			value: { 
				type: String,
			},
			isVerified: {
				type: String,
			},
		},
		pan: {
			value: { 
				type: String,
			},
			isVerified: {
				type: String,
			},
		},
		upi: {
			value: { 
				type: String,
			},
			isVerified: {
				type: String,
			},
		},
		adhar: {
			value: { 
				type: String,
			},
			isVerified: {
				type: String,
			},
		},
	},
	org: {
		type: String,
	},
	isActive: {
		type: String,
		required: true,
	},
	skills: {
		type: [String],
	},
	bio: {
		type: String,
	},
	kalkinso_information_tracker: [{
		type: {
			type: String,
		},
		username: {
			type: String,
		},
	}],
	experience: {
		type: String,
	},
	education: {
		type: String,
	},
	social: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
})

const Profile = mongoose.model('Profile', ProfileSchema)

module.exports = Profile
