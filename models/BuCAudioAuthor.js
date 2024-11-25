const mongoose = require("mongoose");
const getConnection = require("../config/bucaudio");

const BuCAudioAuthorSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
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

const BuCAudioAuthor = getConnection().model("Author", BuCAudioAuthorSchema);

module.exports = BuCAudioAuthor;
