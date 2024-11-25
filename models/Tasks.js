const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    // Task name or title
    type: String,
    required: true
  },
  thumbnail: {
    // Task thumbnail
    type: String
  },
  short_description: {
    // Detailed description
    type: String,
    required: true
  },
  base_path: {
    type: String,
  },
  description: {
    // Detailed description
    type: String,
  },
  isPublic: {
    // Task visibility
    type: Boolean,
    default: false,
    required: true
  },
  assigned: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      status: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      isVolunteer: {
        type: Boolean,
        required: true
      },
      rating: {
        type: String
      }
    }
  ],
  time: {
    estimated: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        value: {
          type: Number,
          required: true
        }
      }
  ],
    actual: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      value:{
        type: Number
      }
    }
  },
  cost: {
    estimated: {
      type: Number
    },
    actual: {
      type: Number
    }
  },
  estimated_earning: {
    type: String,
  },
  org: {
    type: String,
    required: true,
    default: "Self"
  },
  location: {
    type: String,
    required: true,
    default: "Remote"
  },
  status: {
    type: String,
    required: true,
    default: "To Do"
  },
  skills: {
    type: [String]
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
        date: {
          type: Date,
          default: Date.now
        },
        reaction: {
          // Task reaction
          type: Number
        },
        attachments: [
          {
            // Task attachments
            type: {
              type: String,
              required: true
            },
            url: {
              type: String,
              required: true
            }
          }
        ],
        reply_to: [
          {
            // Users who can comment on the task
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            },
          }
        ]
      }
    ],
    reactions: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      reaction: {
        // Task reaction
        type: Number
      }
    }
  },
  priority: {
    // Task priority
    type: String
  },
  subTasks: [
    {
      // Sub-tasks for hierarchical task management
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tasks"
    }
  ],
  parentTasks: [
    {
      // Parent task for hierarchical task management
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tasks"
    }
  ],
  attachments: [
    {
      // Task attachments
      type: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  ],
  terms_conditions: [
    {
      template_path: {
        type: String,
      },
      template_name: {
        type: String,
      },
      isCustom: {
        type: Boolean,
        default: false
      },
    }
  ],
  tags: [
    {
      // Task tags
      type: String
    }
  ],
  createdAt: {
    // Task creation date
    type: Date,
    default: Date.now
  },
  updatedAt: {
    // Task last updated date
    type: Date,
    default: Date.now
  }
}); // Automatically add createdAt and updatedAt timestamps

const Tasks = mongoose.model("Tasks", TaskSchema);

module.exports = Tasks;
