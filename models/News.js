const mongoose = require('mongoose')

const NewsSchema = new mongoose.Schema({
	pincode: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    news: {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: [
            {
                type: String,
                required: true,
            },
        ],
        link: {
            type: String,
            required: true,
        },
    },
    analytics: {
        views: [
          {
            date: {
              type: Date,
              default: Date.now
            },
            user: {
              type: mongoose.Schema.Types.ObjectId
            }
          }
        ],
        commenters: [
          {
            // Users who can comment on the task
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            },
            text: {
              type: String,
              required: true
            },
            timestamp: {
              type: Date,
              default: Date.now
            },
            reaction: [
              {
                // Task reactions
                user: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User"
                },
                reaction: {
                  type: Number
                }
              }
            ],
            attachment: {
              // Task attachments
              type: {
                type: String,
              },
              name: {
                type: String,
              },
              url: {
                type: String,
              }
            },
            reply_to: [
              {
                // Users who can comment on the task
                user: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User"
                },
                comment: {
                  type: mongoose.Schema.Types.ObjectId,
                },
                reactions: [
                  {
                    user: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "User"
                    },
                    reaction: {
                      // Task reaction
                      type: Number
                    }
                  }
                ]
              }
            ]
          }
        ],
        reactions: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            },
            reaction: {
              // Task reaction
              type: Number
            }
          }
        ]
      },
      priority: {
        // Task priority
        type: String
      },
    createdAt: {
        type: Date,
        default: () => new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
})

const News = mongoose.model('News', NewsSchema)

module.exports = News
