const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  months: {
    type: Number,
    required: true,
  },
  modules: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "module",
      },
    ],
    optional: true,
  },
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
