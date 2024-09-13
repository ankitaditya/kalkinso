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
				required: true,
			},
			isVerified: {
				type: String,
				required: true,
			},
		},
		phone: {
			value: { 
				type: String,
				required: true,
			},
			isVerified: {
				type: String,
				required: true,
			},
		},
		pan: {
			value: { 
				type: String,
				required: true,
			},
			isVerified: {
				type: String,
				required: true,
			},
		},
		upi: {
			value: { 
				type: String,
				required: true,
			},
			isVerified: {
				type: String,
				required: true,
			},
		},
		adhar: {
			value: { 
				type: String,
				required: true,
			},
			isVerified: {
				type: String,
				required: true,
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
