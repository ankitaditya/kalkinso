const getConnection = require("../config/bucaudio");

const BuCAudioSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    book_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    audio: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Free", "Paid"], // Adjust based on valid types
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    commission: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);

const BuCAudio = getConnection().model("Audio", BuCAudioSchema);

module.exports = BuCAudio;
