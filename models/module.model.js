const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  contents: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "content",
      },
    ],
  },
  access: {
    type: String,
    required: true,
  },
});

const Module = mongoose.model("Module", moduleSchema);
module.exports = Module;
