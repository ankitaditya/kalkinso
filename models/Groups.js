const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema({
	name: {
        type: String,
    },
    users: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            role: {
                type: String,
                required: true,
            },
        },
    ],
    avatar: {
        type: String,
        default: 'https://www.gravatar.com/avatar/anything?s=200&d=mm',
    },
    messages: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
            reply_to: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Group.messages',
            },
            reactions: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                    },
                    reaction: {
                        type: Number,
                    },
                },
            ],
            attachments: [
                {
                    type: String,
                    required: true,
                },
            ],
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
	date: {
		type: Date,
		default: Date.now,
	},
})

const Group = mongoose.model('Group', GroupSchema)

module.exports = Group
