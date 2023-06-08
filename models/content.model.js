const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
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
  videoUrl: {
    type: String,
    optional: true,
  },
  access: {
    type: String,
    required: true,
  },
  isDeleted:{
    type: Boolean,
    required: true, 
    default: false,
  }
});

const Content = mongoose.model("Content", contentSchema);
module.exports = Content;
